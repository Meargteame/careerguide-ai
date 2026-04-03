import { supabase } from './supabaseClient';
import { generateCourseDetails } from './geminiService';
import { Course } from '../types';

export const createCourseFromRoadmap = async (role: string, userId: string): Promise<Course | null> => {
  try {
    // 1. Generate Course Content via AI
    const apiCourse = await generateCourseDetails(role);
    if (!apiCourse) return null;

    // 2. Add metadata
    const newCourse: Course = {
      ...apiCourse,
      id: crypto.randomUUID(), // This will be overwritten by Supabase if auto-gen, but useful for optimistic UI
      author: 'AI Architect',
      enrolled: 0,
      rating: 4.8
    };

    // Enforce Level Enum
    const validLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const safeLevel = validLevels.includes(newCourse.level) ? newCourse.level : 'Beginner';

    // 3. Save to Supabase (if table exists)
    const { data, error } = await supabase
      .from('courses')
      .insert([
        {
          title: newCourse.title || "Untitled Course",
          description: newCourse.description || "Auto-generated course",
          category: role || "General",
          level: safeLevel,
          modules: newCourse.modules || [], // Storing JSONB
          duration: newCourse.duration || "4 Weeks",
          author: 'AI Architect',
          created_by: userId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase save error:', error);
      alert('Database Error saving course: ' + error.message);
      return null;
    }
    
    // 4. Enroll the creator automatically
    if (data) {
      await enrollInCourse(data.id, userId).catch(err => {
        console.error('Auto-enroll failed but course created', err);
      });
      return data as Course;
    }

    return null;

  } catch (err) {
    console.error('Course creation failed:', err);
    return null;
  }
};

export const enrollInCourse = async (courseId: string, userId: string) => {
  const { error } = await supabase
    .from('course_enrollments')
    .insert([{ course_id: courseId, user_id: userId }]);
    
  if (error) throw error;
};

export const completeLesson = async (courseId: string, userId: string, lessonId: string) => {
  try {
    const { data: enrollment, error: fetchError } = await supabase
      .from('course_enrollments')
      .select('completed_lessons, progress')
      .eq('course_id', courseId)
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;

    const completed = enrollment.completed_lessons || [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      
      const newProgress = Math.min(100, completed.length * 10); // Mock 10% per lesson for now

      await supabase
        .from('course_enrollments')
        .update({ completed_lessons: completed, progress: newProgress })
        .eq('course_id', courseId)
        .eq('user_id', userId);

      // Also update user XP in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();
        
      if (profile) {
        await supabase
          .from('profiles')
          .update({ xp: (profile.xp || 0) + 100 })
          .eq('id', userId);
      }
    }
  } catch (err) {
    console.error("Failed to complete lesson", err);
  }
};

export const getUserCourses = async (userId: string) => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select(`
      progress,
      course_id,
      courses (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data.map((d: any) => ({
    ...d.courses,
    progress: d.progress || 0
  }));
};

export const getStudentStats = async (userId: string) => {
  try {
     const { data: enrollments, count } = await supabase
       .from('course_enrollments')
       .select('*', { count: 'exact' })
       .eq('user_id', userId);

     const { data: profile } = await supabase
       .from('profiles')
       .select('xp')
       .eq('id', userId)
       .single();

     let totalCompleted = 0;
     if (enrollments) {
        enrollments.forEach(e => {
            totalCompleted += (e.completed_lessons?.length || 0);
        });
     }

     return {
        coursesEnrolled: count || 0,
        completedLessons: totalCompleted,
        totalXP: profile?.xp || 0
     };
  } catch (err) {
     console.error("Error fetching stats:", err);
     return { coursesEnrolled: 0, completedLessons: 0, totalXP: 0 };
  }
};

export const getRecentActivity = async (userId: string) => {
   try {
      // Fetch recent enrollments
      const { data } = await supabase
        .from('course_enrollments')
        .select(`
           enrolled_at,
           courses (title, category)
        `)
        .eq('user_id', userId)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      return data?.map(d => ({
         type: 'enrollment',
         title: d.courses.title,
         category: d.courses.category,
         date: d.enrolled_at
      })) || [];
   } catch (err) {
      console.error("Error fetching activity:", err);
      return [];
   }
};