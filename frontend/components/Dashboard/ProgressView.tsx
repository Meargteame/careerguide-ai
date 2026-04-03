
import React, { useEffect, useState } from 'react';
import { Activity, Target, Award, Shield, CheckCircle2, Star, BookOpen } from 'lucide-react';
import { getStudentStats, getUserCourses } from '../../services/courseService';
import { Course } from '../../types';

interface ProgressViewProps {
  userId: string;
}

const ProgressView: React.FC<ProgressViewProps> = ({ userId }) => {
  const [stats, setStats] = useState({ coursesEnrolled: 0, totalXP: 0, completedLessons: 0 });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, c] = await Promise.all([
           getStudentStats(userId),
           getUserCourses(userId)
        ]);
        setStats(s);
        setCourses(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  // Derived level from XP (1000 XP per level)
  const level = Math.floor(stats.totalXP / 1000) + 1;
  const xpForNextLevel = 1000 - (stats.totalXP % 1000);
  const progressPercent = ((stats.totalXP % 1000) / 1000) * 100;

  return (
    <div className="animate-reveal max-w-7xl mx-auto pb-20">
      <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800 mb-12">
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Player Card</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm mb-4">My Stats</h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl">
          Track your skill tree progression across {courses.length} active quests.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Skill Distribution (Mapped from Courses) */}
          <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-10 flex items-center gap-4 uppercase tracking-wider">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-500 flex items-center justify-center border-2 border-indigo-200 shadow-sm rotate-3">
                <Activity size={24} strokeWidth={3} />
              </div>
              Active Quests
            </h3>
            <div className="space-y-8">
              {courses.length > 0 ? courses.map((course, i) => (
                <div key={course.id} className="group">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">{course.title}</span>
                    <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg border-2 border-indigo-100 uppercase tracking-[0.2em] shadow-sm">{course.level}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-5 border-2 border-slate-200 dark:border-slate-700 shadow-inner p-0.5">
                    <div className="h-full rounded-full bg-indigo-500 transition-all duration-1000 relative overflow-hidden" style={{ width: `${(course as any).progress || 0}%` }}>
                       <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-12 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-slate-400 font-black uppercase tracking-widest">No active quests found. Visit the Library!</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-10 flex items-center gap-4 uppercase tracking-wider">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center border-2 border-amber-200 shadow-sm -rotate-3">
                <Award size={24} strokeWidth={3} />
              </div>
              Earned Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Verified User', org: 'Admin', date: 'Active', status: 'Verified' },
                { title: 'First User', org: 'Meridian', date: '2024', status: 'Badge' },
              ].map((c, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-amber-400 hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(217,119,6,1)] transition-all border-2 border-transparent hover:border-amber-500 active:translate-y-[2px] active:shadow-none cursor-pointer">
                  <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-amber-500 border-2 border-slate-200 dark:border-slate-700 shadow-sm shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform group-hover:border-amber-300">
                    <Award size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-slate-800 dark:text-white group-hover:text-slate-900 line-clamp-1">{c.title}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-amber-900/60">{c.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Points/Level System */}
          <div className="bg-indigo-600 border-4 border-indigo-700 text-white p-10 rounded-[3rem] shadow-[0_8px_0_rgba(79,70,229,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform text-center flex flex-col items-center">
            <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            
            <div className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center mb-8 border-4 border-indigo-300 shadow-[0_8px_0_rgba(255,255,255,0.3)] group-hover:rotate-6 transition-transform relative z-10 rotate-3">
              <Star className="text-amber-400 fill-amber-400 w-16 h-16" strokeWidth={2} />
            </div>
            
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-2 relative z-10 w-full bg-indigo-800/50 py-1.5 rounded-lg border border-indigo-500/50">Current Rank</p>
            <h2 className="text-6xl font-display font-black mb-6 tracking-tight drop-shadow-md relative z-10">Level {level}</h2>
            <p className="text-lg font-black text-indigo-100 mb-8 relative z-10 bg-indigo-500/50 px-4 py-2 rounded-xl border-2 border-indigo-400 shadow-inner inline-block">Total XP: {stats.totalXP}</p>
            
            <div className="w-full bg-indigo-900/50 rounded-full h-4 mb-4 border-2 border-indigo-800 shadow-inner p-0.5 relative z-10">
              <div className="bg-emerald-400 h-full rounded-full relative overflow-hidden" style={{ width: `${progressPercent}%` }}>
                 <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30"></div>
                 {/* Shine effect */}
                 <div className="absolute top-0 bottom-0 left-[-20px] w-10 bg-white/40 blur-md skew-x-[-20deg] animate-[shine_2s_infinite]"></div>
              </div>
            </div>
            
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] relative z-10 bg-indigo-800 px-3 py-1.5 rounded-lg">{xpForNextLevel} XP remaining to Level {level + 1}</p>
          </div>

          {/* Goals Checklist */}
          <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3 uppercase tracking-wider">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-500 flex items-center justify-center border-2 border-emerald-200 shadow-sm rotate-6">
                <Target size={20} strokeWidth={3} />
              </div>
              Daily Bounties
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Complete 3 Lessons', done: stats.completedLessons > 0 },
                { label: 'Start First Course', done: courses.length > 0 },
                { label: 'Login to Arena', done: true },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-600 cursor-pointer group">
                  <div className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 shadow-sm ${g.done ? 'bg-emerald-500 border-emerald-600 text-white shadow-[0_4px_0_rgba(16,185,129,1)] -translate-y-0.5' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 shadow-[0_4px_0_rgba(203,213,225,1)] group-hover:-translate-y-0.5'}`}>
                    {g.done && <CheckCircle2 size={18} strokeWidth={4} />}
                  </div>
                  <span className={`text-[13px] font-black transition-all ${g.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{g.label}</span>
                  {g.done && <span className="ml-auto text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded bg-opacity-80">+50 XP</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
