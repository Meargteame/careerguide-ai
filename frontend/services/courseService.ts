import { supabase } from './supabaseClient';
import { generateCourseDetails } from './geminiService';
import { Course } from '../types';

export const checkAndAwardAchievements = async (userId: string) => {
  try {
    const stats = await getStudentStats(userId);
    const { data: profile, error } = await supabase.from('profiles').select('achievements, xp, meridian_coins').eq('id', userId).single();
    if (error || !profile) return;
    
    let currentBadges = profile.achievements || [];
    let badgeIds = currentBadges.map((b: any) => b.id);
    let newBadges: any[] = [];
    let bonusXp = 0;
    let bonusCoins = 0;

    const award = (id: string, title: string, org: string) => {
      if (!badgeIds.includes(id)) {
        newBadges.push({ id, title, org, date: new Date().toISOString() });
        bonusXp += 50;
        bonusCoins += 5;
      }
    };

    if (stats.completedLessons >= 1) award('first_lesson', 'First Steps', 'Learning');
    if (stats.completedLessons >= 10) award('10_lessons', 'Knowledge Seeker', 'Learning');
    if (stats.coursesEnrolled >= 1) award('course_1', 'Scholar', 'Academy');
    if (stats.coursesEnrolled >= 5) award('course_5', 'Polymath', 'Academy');
    if (stats.streak >= 3) award('streak_3', '3 Day Streak', 'Meridian');
    if (stats.streak >= 7) award('streak_7', '7 Day Streak', 'Meridian');

    if (newBadges.length > 0) {
      await supabase.from('profiles').update({
        achievements: [...currentBadges, ...newBadges],
        xp: profile.xp + bonusXp,
        meridian_coins: profile.meridian_coins + bonusCoins
      }).eq('id', userId);
    }
  } catch (err) {
    console.error("Error checking achievements:", err);
  }
};

export const trackDailyActivity = async (userId: string) => {
  try {
    const { data: profile } = await supabase.from('profiles').select('last_active_date, streak').eq('id', userId).single();
    if (!profile) return 0;

    const todayObj = new Date();
    const today = todayObj.toISOString().split('T')[0];
    const lastActive = profile.last_active_date;
    let newStreak = profile.streak || 0;
    
    if (lastActive === today) return newStreak; // Already tracked today
    
    if (lastActive) {
      const yesterday = new Date(todayObj);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else if (lastActive < yesterdayStr) {
        newStreak = 1; // Broken streak
      }
    } else {
      newStreak = 1;
    }

    await supabase.from('profiles').update({
      streak: newStreak,
      last_active_date: today
    }).eq('id', userId);

    return newStreak;
  } catch (err) {
    console.error("Error tracking activity:", err);
    return 0;
  }
};

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
    .upsert([{ 
      course_id: courseId, 
      user_id: userId,
      progress: 0,
      completed_lessons: []
    }], { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    
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

      // Also update user XP and coins in profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp, meridian_coins')
        .eq('id', userId)
        .single();
        
      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            xp: (profile.xp || 0) + 100,
            meridian_coins: (profile.meridian_coins || 0) + 10 
          })
          .eq('id', userId);
          
        window.dispatchEvent(new CustomEvent('xp-updated', { detail: profile.xp + 100 }));
      }
      
      return newProgress;
    }
    return enrollment.progress;
  } catch (err) {
    console.error("Failed to complete lesson", err);
    return undefined;
  }
};

export const getUserCourses = async (userId: string) => {
  const { data, error } = await supabase
    .from('course_enrollments')
    .select(`
      progress,
      completed_lessons,
      course_id,
      courses (*)
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data.map((d: any) => ({
    ...d.courses,
    progress: d.progress || 0,
    completed_lessons: d.completed_lessons || []
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
       .select('xp, streak, meridian_coins, achievements, daily_bounties_state, last_active_date')
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
        totalXP: profile?.xp || 0,
        streak: profile?.streak || 0,
        coins: profile?.meridian_coins || 0,
        achievements: profile?.achievements || [],
        bountiesState: profile?.daily_bounties_state || {},
        lastActiveDate: profile?.last_active_date || null
     };
  } catch (err) {
     console.error("Error fetching stats:", err);
     return { coursesEnrolled: 0, completedLessons: 0, totalXP: 0, streak: 0, coins: 0, achievements: [], bountiesState: {}, lastActiveDate: null };
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