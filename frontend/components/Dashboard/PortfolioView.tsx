
import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Share2, 
  Globe, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Github, 
  Linkedin, 
  ExternalLink,
  Edit2,
  Trophy,
  Clock,
  Zap,
  Flame,
  LineChart
} from 'lucide-react';
import { User } from '../../types';
import { getStudentStats } from '../../services/courseService';

interface PortfolioViewProps {
    user?: User;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ user }) => {
  const [stats, setStats] = useState({ coursesEnrolled: 0, completedLessons: 0, totalXP: 0 });
  
  useEffect(() => {
    if (user?.id) {
        getStudentStats(user.id).then(setStats);
    }
  }, [user]);

  // Fallback defaults
  const userName = user?.name || "Student";
  const userRole = user?.role === "student" ? "Student" : "Admin";

  return (
    <div className="animate-reveal space-y-10">
      <header>
        <h1 className="text-3xl font-display font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">My Profile</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">See your stats and badges</p>
      </header>
      
      {/* Profile Header/Banner */}
      <div className="relative rounded-[3rem] overflow-hidden dashboard-card shadow-sm">
        <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex justify-around p-10 pointer-events-none">
             <Flame size={120} className="text-secondary rotate-12" />
             <Trophy size={160} className="text-secondary -rotate-12" />
          </div>
        </div>
        <div className="px-12 pb-12">
          <div className="flex flex-col md:flex-row items-end gap-10 -mt-20 relative z-10">
            <div className="relative group">
               <div className="w-48 h-48 rounded-[2.5rem] bg-[#FDE68A] border-[8px] border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shadow-xl">
                 <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <button className="absolute -right-2 bottom-4 w-10 h-10 bg-secondary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Edit2 size={16} />
               </button>
            </div>
            
            <div className="flex-1 mb-4">
              <div className="inline-flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest mb-3">
                @{user?.email ? user.email.split('@')[0].toUpperCase() : 'USER'}-ID
              </div>
              <h2 className="text-6xl font-display font-bold text-primary dark:text-white mb-4">{userName}</h2>
              <div className="flex flex-wrap items-center gap-6">
                <span className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <Zap size={18} className="text-accent fill-accent" /> {stats.totalXP} Total XP
                </span>
                <span className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <Flame size={18} className="text-secondary fill-secondary" /> {stats.coursesEnrolled} Courses
                </span>
              </div>
            </div>
            
            <div className="flex gap-4 mb-4">
               <button className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-secondary transition-all">
                 <Share2 size={16} /> Share
               </button>
               <button className="flex items-center gap-3 bg-secondary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-secondary/20">
                 <Edit2 size={16} /> Edit Profile
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-10">
          <div className="dashboard-card p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
            <h3 className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px] mb-8">Profile Bio</h3>
            <p className="text-primary dark:text-slate-300 text-lg font-medium leading-relaxed italic border-l-4 border-secondary/20 pl-6 mb-10">
              "This user is still crafting their story. Stay tuned for more updates about their journey on CareerGuide."
            </p>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
               <Clock size={14} /> Member since February 2026
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
           <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-secondary mb-4">
                 <Award size={24} />
                 <span className="text-xs font-black uppercase tracking-widest">League</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-primary dark:text-white uppercase tracking-widest">Bronze</h3>
           </div>
           <div className="dashboard-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-accent mb-4">
                 <Flame size={24} />
                 <span className="text-xs font-black uppercase tracking-widest">Streak</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-primary dark:text-white">1</h3>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
