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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Library</p>
           <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-white uppercase tracking-widest leading-none">My Courses</h1>
        </div>
        
        <div className="flex gap-3">
            <div className="relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search courses..." 
                  className="pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
                />
            </div>
            <button 
              onClick={handleCreateNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Course
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
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
           <button 
             onClick={handleCreateNew} 
             className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm hover:scale-110 transition-transform text-indigo-500"
            >
              <Plus size={24} />
           </button>
           <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">No Courses Found</h3>
           <p className="text-slate-400 max-w-sm mx-auto mb-8">You haven't generated any courses yet. Start your learning journey by creating your first AI-generated curriculum!</p>
           <button 
             onClick={handleCreateNew} 
             className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
            >
              Generate First Course
           </button>
        </div>
      ) : (
        // Course Grid
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {userCourses.map(course => (
             <div 
               key={course.id} 
               onClick={() => handleOpenCourse(course)}
               className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all group cursor-pointer relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative flex justify-between items-start mb-6">
                   <div className="flex gap-2">
                     <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                       course.level === 'Advanced' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300' :
                       course.level === 'Intermediate' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300' :
                       'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300'
                     }`}>
                       {course.level}
                     </span>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ExternalLink size={16} />
                   </div>
                </div>
                
                <div className="relative mb-8 h-32">
                  <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 h-14 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                   <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-300" /> {course.duration}
                   </div>
                   <div className="flex items-center gap-1.5">
                      <Monitor size={14} className="text-slate-300" /> {course.modules.length} Modules
                   </div>
                   <div className="ml-auto flex items-center gap-1 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                      Start <ArrowLeft size={12} className="rotate-180" />
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