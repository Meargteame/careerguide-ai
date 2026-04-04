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
import confetti from 'canvas-confetti';
import { User, Course } from '../../types';
import { supabase } from '../../services/supabaseClient';
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
  const [claimedReward, setClaimedReward] = useState(false);

  const handleClaimReward = async (e: React.MouseEvent) => {
     e.stopPropagation();
     if (claimedReward) return;
     
     confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
     });
     
     setClaimedReward(true);
     const newXP = stats.totalXP + 50;
     setStats(prev => ({...prev, totalXP: newXP}));
     
     // Update Supabase to persist!
     if (user?.id) {
        const { error } = await supabase
           .from('profiles')
           .update({ xp: newXP })
           .eq('id', user.id);
           
        if (error) {
           console.error("Supabase XP Update failed:", error);
           // Fallback to Upsert if profile was missing when the page loaded
           await supabase.from('profiles').upsert({ id: user.id, xp: newXP });
        }
        
        sessionStorage.setItem(`claimed_xp_${user.id}`, 'true');
     }

     // Dispatch event so top-nav knows instantly
     window.dispatchEvent(new CustomEvent('xp-updated', { detail: newXP }));
  };

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
         
         // Mock checking a 'last_claim_date' or block endless farming 
         // For a hackathon, we'll store in sessionStorage so it persists across reloads locally today
         const hasClaimedToday = sessionStorage.getItem(`claimed_xp_${user.id}`);
         if (hasClaimedToday) setClaimedReward(true);

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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-white tracking-tighter">
            Overall Status: <span className="text-blue-500">Ready.</span>
          </h1>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Welcome back, {user.name} • Student
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="glass dark:bg-slate-900/50 px-6 py-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
                 <CheckCircle size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                 <p className="text-sm font-bold text-slate-800 dark:text-white">Active</p>
              </div>
           </div>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Resume Card: Most Recent Course or Placeholder */}
        <div className="col-span-1 lg:col-span-8 bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-[0_8px_0_rgba(29,78,216,1)] border-4 border-blue-700 flex flex-col justify-between min-h-[350px] group transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(29,78,216,1)]">
           {/* Decorative Gamified Blobs */}
           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
           <div className="absolute bottom-[-10%] left-[20%] w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
           
           <div className="absolute top-4 right-4 p-8 opacity-20 pointer-events-none group-hover:rotate-12 transition-transform duration-500">
              <TrendingUp size={200} strokeWidth={2} />
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
                  <button onClick={() => onOpenCourse(activeCourse)} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-[0_6px_0_rgba(226,232,240,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(226,232,240,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-2 group/btn">
                     Continue <PlayCircle size={20} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button className="bg-blue-500 border-2 border-blue-400 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all">
                     View Details
                  </button>
               </div>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center relative z-10">
                <div className="w-20 h-20 bg-blue-500 rounded-[1.5rem] flex items-center justify-center rotate-6 shadow-[0_6px_0_rgba(30,58,138,1)] mb-6">
                   <BookOpen size={40} className="text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-display font-black mb-3">Start Your First Course</h2>
                <p className="font-bold text-blue-100 mb-8 text-lg max-w-md">You haven't played this level yet. Create a roadmap to begin your adventure.</p>
                <button onClick={onNavigateToRoadmaps} className="bg-white text-blue-600 px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(226,232,240,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(226,232,240,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-3 group/btn">
                   Create an AI Plan <Target size={20} className="group-hover/btn:rotate-12 transition-transform" />
                </button>
             </div>
           )}
        </div>

        {/* Level Stats: XP Based */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-none group hover:-translate-y-2 transition-all min-h-[350px]">
           <div className="relative mb-8">
              <div className="w-28 h-28 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-500 shadow-[0_8px_0_rgba(251,191,36,0.3)] rotate-3 group-hover:rotate-6 transition-transform z-10 relative">
                 <Award size={48} className="animate-pulse" />
              </div>
              <div className="absolute top-[-10px] right-[-10px] w-10 h-10 bg-rose-500 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-sm shadow-md animate-bounce z-20">
                 {Math.floor(stats.totalXP / 1000) + 1}
              </div>
           </div>
           
           <h3 className="text-[14px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Current Hero Level</h3>
           <p className="text-4xl font-display font-black text-slate-800 dark:text-white mb-6 tracking-tight">Level {Math.floor(stats.totalXP / 1000) + 1}</p>
           
           {/* Gamified progress bar */}
           <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-full border-[3px] border-slate-200 dark:border-slate-700 overflow-hidden relative shadow-inner">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-1000 relative" style={{ width: `${(stats.totalXP % 1000) / 10}%` }}>
                 <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
              </div>
           </div>
           <p className="mt-4 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              {1000 - (stats.totalXP % 1000)} XP to Next Level
           </p>
        </div>

        {/* Small Metrics: Computed */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 min-h-[240px]">
           <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shadow-[0_6px_0_rgba(253,230,138,0.5)] group-hover:rotate-6 transition-transform mb-6">
              <Zap size={32} />
           </div>
           <div>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Quests</p>
              <h4 className="text-5xl font-black text-slate-800 dark:text-white drop-shadow-md">{stats.coursesEnrolled}</h4>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 delay-75 min-h-[240px] relative overflow-hidden">
           {!claimedReward && (
             <div className="absolute inset-0 bg-amber-400/10 z-0 animate-pulse pointer-events-none" />
           )}
           <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_6px_0_rgba(209,250,229,0.5)] group-hover:rotate-6 transition-transform mb-6 relative z-10">
              <Target size={32} />
           </div>
           <div className="relative z-10 flex flex-col items-start gap-3">
              <div>
                 <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
                 <h4 className="text-5xl font-black text-slate-800 dark:text-white drop-shadow-md transition-all duration-500">{stats.totalXP}</h4>
              </div>
              
              <button 
                onClick={handleClaimReward}
                disabled={claimedReward}
                className={`mt-2 w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${claimedReward ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 shadow-none' : 'bg-amber-400 border-2 border-amber-500 text-amber-900 shadow-[0_4px_0_rgba(245,158,11,1)] hover:bg-amber-300 active:translate-y-[4px] active:shadow-none'}`}
              >
                 {claimedReward ? (
                    <>Claimed <CheckCircle size={14} /></>
                 ) : (
                    <>+50 Daily Drop <Zap size={14} className="fill-amber-900 animate-pulse" /></>
                 )}
              </button>
           </div>
        </div>

        <div className="flex-col justify-center lg:col-span-6 bg-slate-50 dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 flex shadow-none group cursor-pointer hover:border-violet-300 hover:bg-white hover:-translate-y-2 transition-all min-h-[240px]" onClick={onNavigateToAssessments}>
           <div className="flex items-center gap-6 w-full">
              <div className="w-20 h-20 bg-violet-100 rounded-[1.5rem] flex shrink-0 items-center justify-center text-violet-500 shadow-[0_6px_0_rgba(221,214,254,0.5)] group-hover:bg-violet-500 group-hover:text-white group-hover:-rotate-6 transition-all duration-300">
                 <ClipboardCheck size={36} />
              </div>
              <div className="flex-1">
                 <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-violet-600 transition-colors">Enter the Arena</h4>
                 <p className="text-slate-500 text-base font-bold">Face the boss battles and prove your skills in multiple-choice combat.</p>
              </div>
              <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-full flex shrink-0 items-center justify-center shadow-sm group-hover:bg-violet-600 border-none group-hover:shadow-[0_4px_0_rgba(139,92,246,1)] transition-all">
                 <ChevronRight className="text-slate-400 group-hover:text-white transition-all font-black" size={24} strokeWidth={3} />
              </div>
           </div>
        </div>

      </div>

      {/* Progress Timeline Feed */}
      <section className="space-y-8">
         <div className="flex justify-between items-end">
            <div>
               <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-white tracking-tight">Recent Activity</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs from your learning network</p>
            </div>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 hover:underline">
               View All History <ArrowRight size={14} />
            </button>
         </div>

         <div className="grid gap-4">
            {activityFeed.length > 0 ? (
               activityFeed.map((item, i) => (
                 <div key={i} className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center gap-6 shadow-sm border-l-[6px] hover:border-l-indigo-400 hover:-translate-y-1 hover:shadow-md transition-all animate-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-[1rem] flex items-center justify-center shrink-0 shadow-[0_4px_0_rgba(224,231,255,1)] dark:shadow-[0_4px_0_rgba(49,46,129,0.5)]">
                       <BookOpen size={24} />
                    </div>
                    <div className="flex-1">
                       <p className="font-black text-slate-800 dark:text-slate-200 text-lg">Enrolled in {item.title}</p>
                       <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wide">{item.category} • {formatDistanceToNow(new Date(item.date), { addSuffix: true })}</p>
                    </div>
                    <button className="hidden md:flex w-10 h-10 bg-slate-50 rounded-full items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-colors">
                       <ChevronRight size={20} strokeWidth={3} />
                    </button>
                 </div>
               ))
            ) : (
                <div className="text-center p-12 border-4 border-dashed border-slate-200 rounded-[3rem] text-slate-400 text-lg font-bold">
                   No recent network logs. Time to explore!
                </div>
            )}
         </div>
      </section>
    </div>
  );
};

export default DashboardHome;
