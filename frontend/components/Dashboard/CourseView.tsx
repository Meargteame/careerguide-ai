import React, { useState, useEffect } from 'react';
import { Course, CourseModule, Lesson } from '../../types';
import { 
  PlayCircle, CheckCircle, Lock, BookOpen, Clock, 
  BarChart, ArrowLeft, ArrowRight, Loader2, Star, Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateCourseDetails, generateLessonContent } from '../../services/geminiService';
import { enrollInCourse, completeLesson } from '../../services/courseService';

interface CourseViewProps {
  courseId?: string; // If loading existing
  initialCourseData?: Course; // If just generated
  onBack: () => void;
  isEnrolled?: boolean; 
  userId?: string;
}

const CourseView: React.FC<CourseViewProps> = ({ initialCourseData, onBack, isEnrolled: initialEnrolled, userId = 'mock-user-id' }) => {
  const [course, setCourse] = useState<Course | null>(initialCourseData || null);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled || !!initialCourseData);
  const [progress, setProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  // Effect to load content lazily if pending
  const activeModule = course?.modules[activeModuleIndex];
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  React.useEffect(() => {
    if (!course || !activeLesson) return;

    const loadContent = async () => {
       if (activeLesson.content === '[CONTENT_PENDING]' || !activeLesson.content) {
          setLoadingContent(true);
          try {
             const newContent = await generateLessonContent(
                activeLesson.title, 
                activeModule?.title || '', 
                course.title
             );
             
             // Update course state immutably
             setCourse(prev => {
                if (!prev) return null;
                const newModules = [...prev.modules];
                newModules[activeModuleIndex].lessons[activeLessonIndex] = {
                   ...activeLesson,
                   content: newContent
                };
                return { ...prev, modules: newModules };
             });
          } catch (err) {
             console.error("Failed to load lesson content", err);
          } finally {
             setLoadingContent(false);
          }
       }
    };
    
    loadContent();
  }, [activeModuleIndex, activeLessonIndex, course?.title]); // Depend on indices to trigger on switch

  if (!course) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;


  const handleEnroll = async () => {
    if (!course?.id) return;
    setIsEnrolling(true);
    try {
        await enrollInCourse(course.id, userId);
        setIsEnrolled(true);
    } catch (err) {
        console.error("Failed to enroll", err);
    } finally {
        setIsEnrolling(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (course?.id) {
       const lessonId = `module-${activeModuleIndex}-lesson-${activeLessonIndex}`;
       await completeLesson(course.id, userId, lessonId);
       setProgress(prev => Math.min(prev + 10, 100)); // Mock progress locally for quick UI feedback
    }

    // Go to next lesson
    if (activeModule) {
      if (activeLessonIndex < activeModule.lessons.length - 1) {
        setActiveLessonIndex(activeLessonIndex + 1);
      } else if (activeModuleIndex < course.modules.length - 1) {
        setActiveModuleIndex(activeModuleIndex + 1);
        setActiveLessonIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row animate-in fade-in duration-500">
      {/* Sidebar: Modules & Lessons */}
      <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen overflow-y-auto flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
           <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mb-4 text-xs uppercase font-bold tracking-widest transition-colors">
              <ArrowLeft size={14} /> Back to My Courses
           </button>
           <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white leading-tight mb-2">
             {course.title}
           </h2>
           <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{course.level}</div>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold"><Star size={12} fill="currentColor" /> {course.rating}</div>
           </div>
           
           {isEnrolled ? (
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold text-slate-500">
                 <span>Progress</span>
                 <span>{progress}%</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
               </div>
             </div>
           ) : (
             <button 
               disabled={isEnrolling} 
               onClick={handleEnroll} 
               className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {isEnrolling ? <> <Loader2 className="animate-spin" size={16} /> Joining... </> : 'Start Course'}
             </button>
           )}
        </div>

        <div className="flex-1 overflow-y-auto">
           {course.modules.map((module, mIdx) => (
             <div key={mIdx} className="border-b border-slate-50 dark:border-slate-800/50">
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 font-bold text-sm text-slate-700 dark:text-slate-300 flex justify-between items-center sticky top-0 backdrop-blur-sm z-10">
                   {module.title}
                </div>
                <div className="space-y-0.5">
                   {module.lessons.map((lesson, lIdx) => {
                      const isActive = activeModuleIndex === mIdx && activeLessonIndex === lIdx;
                      const isLocked = !isEnrolled && mIdx > 0; // Lock modules if not enrolled (demo logic)

                      return (
                        <button 
                          key={lIdx}
                          onClick={() => {
                             if (!isLocked) {
                               setActiveModuleIndex(mIdx);
                               setActiveLessonIndex(lIdx);
                             }
                          }}
                          disabled={isLocked}
                          className={`w-full text-left px-6 py-3 flex items-start gap-3 transition-colors ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 border-r-2 border-indigo-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           {isActive ? (
                             <PlayCircle size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                           ) : isLocked ? (
                             <Lock size={16} className="text-slate-300 mt-0.5 shrink-0" />
                           ) : (
                             <div className="w-4 h-4 rounded-full border-2 border-slate-300 mt-0.5 shrink-0"></div>
                           )}
                           <div>
                              <p className={`text-xs font-medium ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                <Clock size={10} /> {lesson.duration}
                              </p>
                           </div>
                        </button>
                      );
                   })}
                </div>
             </div>
           ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Top Bar */}
         <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-8 shrink-0">
             <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <BookOpen size={16} />
                <span>{activeModule.title}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-800 dark:text-white font-bold">{activeLesson.title}</span>
             </div>
             <div>
                {!isEnrolled && (
                   <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Lock size={12} /> Preview Only
                   </span>
                )}
             </div>
         </header>

         {/* Content Scroll */}
         <div className="flex-1 overflow-y-auto p-8 md:p-12 max-w-4xl mx-auto w-full">
            <div className="prose prose-slate dark:prose-invert max-w-none">
               <h1 className="font-display text-4xl font-bold mb-6">{activeLesson.title}</h1>
               
               <div className="markdown-content min-h-[400px]">
                  {loadingContent ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 animate-pulse">
                       <Loader2 size={40} className="animate-spin text-indigo-500" />
                       <p className="text-sm font-medium uppercase tracking-widest">Writing lesson for you...</p>
                    </div>
                  ) : (
                    <ReactMarkdown>{activeLesson?.content || ''}</ReactMarkdown>
                  )}
               </div>
               
               {/* Video Placeholder (Optional, maybe specific lessons have it) */}
               {activeLesson.duration.includes('video') && (
                 <div className="my-12 p-8 bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
                    <PlayCircle size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-medium">Video Lesson</p>
                 </div>
               )}

               <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold mb-4">More Help</h3>
                  <ul className="not-prose space-y-2">
                      {['Official Guide', 'Helpful Tips', 'More Examples'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          <span className="underline decoration-slate-300">{item}</span>
                        </li>
                      ))}
                  </ul>
               </div>
            </div>

            <div className="mt-20 flex justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
               <button 
                 disabled={activeLessonIndex === 0 && activeModuleIndex === 0}
                 onClick={() => {
                    if (activeLessonIndex > 0) setActiveLessonIndex(i => i - 1);
                    else if (activeModuleIndex > 0) {
                       setActiveModuleIndex(i => i - 1);
                       setActiveLessonIndex(course.modules[activeModuleIndex - 1].lessons.length - 1);
                    }
                 }}
                 className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-sm text-slate-600 disabled:opacity-50"
               >
                  <ArrowLeft size={16} /> Back
               </button>

               <button 
                 onClick={handleCompleteLesson}
                 className="flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all"
               >
                  Finish & Next <ArrowRight size={16} />
               </button>
            </div>
         </div>
      </main>
    </div>
  );
};

export default CourseView;