import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  PlayCircle,
  Briefcase,
  LineChart,
  ClipboardCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  Zap,
  Target,
  ChevronRight,
  Activity,
  Award,
  ShieldCheck,
  Map as MapIcon,
  BookOpen
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { User, Course } from '../../types';
import { getStudentStats, getRecentActivity, getUserCourses } from '../../services/courseService';

interface DashboardHomeProps {
  user: User;
  onNavigateToRoadmaps: () => void;
  onNavigateToAssessments: () => void;
  onOpenCourse: (course: Course) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ user, onNavigateToRoadmaps, onNavigateToAssessments, onOpenCourse }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ coursesEnrolled: 0, totalXP: 0, completedLessons: 0 });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
       if (!user?.id) return;
       try {
         const [s, c, a] = await Promise.all([
            getStudentStats(user.id),
            getUserCourses(user.id),
            getRecentActivity(user.id)
         ]);

         setStats(s);
         setRecentCourses(c || []);
         setActivityFeed(a || []);
       } catch (err) {
         console.error("Dashboard load error", err);
       } finally {
         setLoading(false);
       }
    };
    loadDashboard();
  }, [user?.id]);
  
  const activeCourse = recentCourses[0]; // Most recent course

  return (
    <div className="animate-reveal space-y-12 pb-20">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary dark:text-white tracking-tighter">
            Overall Status: <span className="text-secondary">Ready.</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Welcome back, {user.name} • Student
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass dark:bg-slate-900/50 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                 <CheckCircle size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                 <p className="text-sm font-bold text-primary dark:text-white">Active</p>
              </div>
           </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Resume Card: Most Recent Course or Placeholder */}
        <div className="col-span-1 lg:col-span-8 bg-gradient-to-br from-secondary to-indigo-800 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-secondary/20 flex flex-col justify-between min-h-[350px] group">
           <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <TrendingUp size={300} strokeWidth={1} />
           </div>
           
           {activeCourse ? (
             <>
               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10 backdrop-blur-md">
                    Current Course: {activeCourse.category}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight line-clamp-2 md:line-clamp-1">{activeCourse.title}</h2>
                  <p className="text-white/70 text-lg font-medium max-w-md leading-relaxed line-clamp-3">
                     {activeCourse.description}
                  </p>
               </div>
               <div className="relative z-10 flex gap-4 mt-6 md:mt-0">
                  <button onClick={() => onOpenCourse(activeCourse)} className="bg-white text-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                     Continue <PlayCircle size={16} />
                  </button>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all">
                     View Details
                  </button>
               </div>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <h2 className="text-3xl font-display font-bold mb-2">Start Your First Course</h2>
                <p className="text-white/70 mb-8 max-w-sm">You haven't started any courses yet. Create a roadmap to begin.</p>
                <button onClick={onNavigateToRoadmaps} className="bg-white text-secondary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl">
                   Make a Plan
                </button>
             </div>
           )}
        </div>

        {/* Level Stats: XP Based */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-sm group hover:border-secondary transition-colors min-h-[350px]">
           <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform ring-4 ring-secondary/5">
              <Award size={40} strokeWidth={1.5} />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">My Level</p>
           <h3 className="text-4xl font-display font-bold text-primary dark:text-white">Level {Math.floor(stats.totalXP / 1000) + 1}</h3>
           <div className="mt-6 w-full max-w-[160px] h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
              {/* Calculate progress to next level (mod 1000) */}
              <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${(stats.totalXP % 1000) / 10}%` }} />
           </div>
           <p className="mt-3 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
              {1000 - (stats.totalXP % 1000)} XP needed for next level
           </p>
        </div>

        {/* Small Metrics: Computed */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform duration-300 min-h-[240px]">
           <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-4">
              <Zap size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Courses</p>
              <h4 className="text-3xl font-black text-primary dark:text-white">{stats.coursesEnrolled}</h4>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform duration-300 delay-75 min-h-[240px]">
           <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
              <Target size={24} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Earned</p>
              <h4 className="text-3xl font-black text-primary dark:text-white">{stats.totalXP}</h4>
           </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-8 flex items-center justify-between shadow-sm group cursor-pointer hover:border-brand transition-all min-h-[240px]" onClick={onNavigateToAssessments}>
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand/5 rounded-3xl flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-all">
                 <ClipboardCheck size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-primary dark:text-white mb-1">Skill Tests</h4>
                 <p className="text-slate-500 text-sm font-medium">Take tests to check what you learned.</p>
              </div>
           </div>
           <ChevronRight className="text-slate-300 group-hover:text-brand transition-all" size={24} />
        </div>

      </div>

      {/* Progress Timeline Feed */}
      <section className="space-y-8">
         <div className="flex justify-between items-end">
            <div>
               <h3 className="text-2xl font-display font-bold text-primary dark:text-white tracking-tight">Recent Activity</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs from your learning network</p>
            </div>
            <button className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2 hover:underline">
               View All History <ArrowRight size={14} />
            </button>
         </div>

         <div className="grid gap-4">
            {activityFeed.length > 0 ? (
               activityFeed.map((item, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 p-6 rounded-3xl flex items-center gap-6 shadow-sm border-l-4 border-l-slate-100 dark:border-l-slate-800 hover:border-l-secondary transition-all animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                       <BookOpen size={18} />
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Enrolled in {item.title}</p>
                       <p className="text-xs text-slate-500 mt-1">{item.category} • {formatDistanceToNow(new Date(item.date), { addSuffix: true })}</p>
                    </div>
                 </div>
               ))
            ) : (
                <div className="text-center p-8 border border-dashed border-slate-200 rounded-3xl text-slate-400 text-sm">
                   No recent activity recorded.
                </div>
            )}
         </div>
      </section>
    </div>
  );
};

export default DashboardHome;
