import React, { useState, useEffect } from 'react';
import { 
  Play, FileText, ExternalLink, Bookmark, Filter, Search, Plus, 
  ChevronDown, ArrowLeft, GitFork, Share2, Clock, Monitor, Loader2, BookOpen
} from 'lucide-react';
import RoadmapGenerator from './RoadmapGenerator';
import { getUserCourses } from '../../services/courseService';
import { Course } from '../../types';
import CourseView from './CourseView';

interface LibraryViewProps {
  userId: string;
}

const LibraryView: React.FC<LibraryViewProps> = ({ userId }) => {
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create' | 'study'>('list');
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchCourses();
  }, [userId]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const courses = await getUserCourses(userId);
      setUserCourses(courses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setViewMode('study');
  };

  const handleCreateNew = () => {
    setViewMode('create');
  };

  const handleBackToLib = () => {
    setViewMode('list');
    fetchCourses(); // Refresh list in case a new course was made
  };

  // --- Render Views ---

  if (viewMode === 'create') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={handleBackToLib} 
          className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Courses
        </button>
        <RoadmapGenerator userId={userId} onCourseCreated={(c) => { fetchCourses(); handleOpenCourse(c); }} />
      </div>
    );
  }

  if (viewMode === 'study' && selectedCourse) {
    return (
      <CourseView 
        userId={userId}
        initialCourseData={selectedCourse} 
        onBack={() => setViewMode('list')} 
      />
    );
  }

  // List View (Default)
  return (
    <div className="animate-reveal space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-slate-100 dark:border-slate-800 pb-10">
        <div>
           <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Library</p>
           <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">My Quests</h1>
        </div>
        
        <div className="flex gap-3">
            <div className="relative group hidden md:block">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search quests..." 
                  className="pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-base font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-sm w-72"
                />
            </div>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-2 group/btn"
            >
              <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" /> New Quest
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 opacity-50">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Library...</p>
        </div>
      ) : userCourses.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-inner group">
           <button 
             onClick={handleCreateNew} 
             className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_6px_0_rgba(226,232,240,1)] hover:-translate-y-2 hover:shadow-[0_10px_0_rgba(226,232,240,1)] active:translate-y-[6px] active:shadow-none transition-all text-blue-500 rotate-3 group-hover:rotate-6"
            >
              <Plus size={40} className="animate-pulse" />
           </button>
           <h3 className="text-3xl font-display font-black text-slate-800 dark:text-slate-300 mb-4">The map is empty!</h3>
           <p className="text-slate-500 max-w-md mx-auto mb-10 font-bold text-lg">You haven't generated any quests yet. Start your learning journey by creating your first AI-generated level!</p>
           <button 
             onClick={handleCreateNew} 
             className="bg-blue-600 text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <BookOpen size={20} /> Generate First Level
           </button>
        </div>
      ) : (
        // Course Grid
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {userCourses.map(course => (
             <div 
               key={course.id} 
               onClick={() => handleOpenCourse(course)}
               className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:-translate-y-2 shadow-sm hover:shadow-[0_12px_0_rgba(226,232,240,1)] hover:border-blue-400 transition-all group cursor-pointer relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 group-hover:bg-blue-200 transition-colors duration-700" />
                
                <div className="relative flex justify-between items-start mb-8">
                   <div className="flex gap-2 bg-white rounded-[1rem] p-1 shadow-sm border-2 border-slate-100">
                     <span className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest border-2 ${
                       course.level === 'Advanced' ? 'bg-purple-100 text-purple-700 border-purple-200 text-shadow-sm' :
                       course.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                       'bg-emerald-100 text-emerald-700 border-emerald-200'
                     }`}>
                       Lvl: {course.level}
                     </span>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 p-3 rounded-[1rem] shadow-[0_4px_0_rgba(226,232,240,1)] group-hover:bg-blue-500 group-hover:border-blue-600 group-hover:text-white transition-all group-hover:translate-y-[2px] group-hover:shadow-[0_2px_0_rgba(30,58,138,0.5)]">
                      <Play size={20} className="ml-1" />
                   </div>
                </div>
                
                <div className="relative mb-8 h-32">
                  <h3 className="text-2xl font-display font-black text-slate-800 dark:text-white mb-3 line-clamp-2 h-16 group-hover:text-blue-600 transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 font-bold text-base line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-t-4 border-slate-100 dark:border-slate-800/50 pt-6 mt-6">
                   <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl">
                      <Clock size={16} className="text-slate-400" /> {course.duration}
                   </div>
                   <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl flex-1">
                      <Monitor size={16} className="text-slate-400" /> {course.modules.length} Modules
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;