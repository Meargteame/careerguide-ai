
import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Play, CheckCircle, Clock, Star, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserCourses } from '../../services/courseService';
import { getQuizHistory } from '../../services/quizService';

interface AssessmentViewProps {
  userId: string;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [courses, setCourses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, h] = await Promise.all([
           getUserCourses(userId),
           getQuizHistory(userId)
        ]);
        setCourses(c || []);
        setHistory(h || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetch();
  }, [userId]);

  const assessments = courses.map(c => ({
    id: c.id,
    title: c.title,
    questions: 5, // Mock number
    time: `10m`,
    level: c.level,
    status: 'Open'
  }));

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0) / history.length * 100) 
    : 0;

  return (
    <div className="animate-reveal space-y-12 pb-20">
      <header className="border-b-4 border-slate-100 dark:border-slate-800 pb-10">
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Arena</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">Boss Battles</h1>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {/* Header Controls */}
          <div className="flex bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-1.5 shadow-inner w-full md:w-auto overflow-x-auto gap-2">
            <button 
              onClick={() => setActiveTab('available')}
              className={`px-8 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all flex-1 md:flex-none whitespace-nowrap ${activeTab === 'available' ? 'bg-violet-500 text-white shadow-[0_4px_0_rgba(139,92,246,1)] -translate-y-1' : 'text-slate-500 hover:text-violet-500 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent'}`}
            >
              Available Challenges ({assessments.length})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-8 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all flex-1 md:flex-none whitespace-nowrap ${activeTab === 'completed' ? 'bg-violet-500 text-white shadow-[0_4px_0_rgba(139,92,246,1)] -translate-y-1' : 'text-slate-500 hover:text-violet-500 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent'}`}
            >
              Past Victories ({history.length})
            </button>
          </div>

          <div className="grid gap-6">
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-violet-500" size={48} strokeWidth={3} /></div>
            ) : activeTab === 'available' ? (
              assessments.length > 0 ? (
                assessments.map((q, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between group transition-all hover:border-violet-400 hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] gap-6`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full md:w-auto">
                      <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center bg-violet-100 dark:bg-violet-900/20 text-violet-500 shadow-[0_4px_0_rgba(221,214,254,1)] group-hover:bg-violet-500 group-hover:text-white group-hover:rotate-6 transition-all shrink-0`}>
                        <ClipboardCheck size={36} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-violet-600 transition-colors line-clamp-1">{q.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-sm"><Clock size={14} /> {q.time}</span>
                          <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 shadow-sm">{q.questions} Questions</span>
                          <span className="flex items-center gap-1.5 bg-violet-50 text-violet-600 px-3 py-1.5 rounded-lg border-2 border-violet-200 shadow-sm">{q.level}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/quiz/${encodeURIComponent(q.title)}`)}
                      className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all bg-violet-600 text-white shadow-[0_6px_0_rgba(109,40,217,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(109,40,217,1)] active:translate-y-[6px] active:shadow-none group/btn flex items-center justify-center gap-2`}
                    >
                      <Play size={18} className="fill-white group-hover/btn:scale-110 transition-transform" /> Fight
                    </button>
                  </div>
                ))
            ) : (
                <div className="text-center p-16 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 group">
                    <AlertCircle className="mx-auto text-slate-300 mb-6 group-hover:scale-110 transition-transform group-hover:text-violet-400" size={56} strokeWidth={2} />
                    <h3 className="text-2xl font-display font-black text-slate-700 dark:text-slate-300 mb-2">No Enemies Spawned</h3>
                    <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto">Start a course to unlock boss battles and earn loot!</p>
                </div>
            )) : (
              history.length > 0 ? (
                history.map((h, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between hover:-translate-y-2 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all gap-4">
                    <div className="flex items-center gap-6 w-full">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_4px_0_rgba(167,243,208,1)] rotate-3 shrink-0">
                         <CheckCircle size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-800">{h.topic}</h3>
                        <p className="text-slate-500 font-bold mt-1">Score: {h.score} / {h.total_questions} Hits</p>
                      </div>
                    </div>
                    <div className="font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl border-2 border-emerald-200 text-sm uppercase tracking-wider text-center w-full md:w-auto mt-4 md:mt-0">{h.feedback || "Victory!"}</div>
                  </div>
                ))
              ) : (
                <div className="text-center p-16 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-slate-400 font-bold text-xl">No past victories found.</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-12">
          {/* Global Stats */}
          <div className="bg-violet-600 border-4 border-violet-700 text-white p-10 rounded-[2.5rem] shadow-[0_8px_0_rgba(109,40,217,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
             <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
             <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 text-violet-600 shadow-[0_6px_0_rgba(255,255,255,0.3)] rotate-6 group-hover:rotate-12 transition-transform">
                   <Star size={40} className="fill-violet-400" />
                </div>
                <h4 className="text-3xl font-display font-black mb-4 drop-shadow-sm">Combat Rating</h4>
                <p className="text-violet-100 text-base font-bold leading-relaxed mb-8">
                  Defeat quizzes to improve your combat multiplier and earn rare rewards.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span>Average Score</span>
                    <span className="text-amber-300">{avgScore}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-300 h-full transition-all duration-1000" style={{ width: `${avgScore}%` }} />
                  </div>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h4 className="text-lg font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tight">Rules</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li className="flex gap-3">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                Full screen mode required.
              </li>
              <li className="flex gap-3">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                Don't switch tabs.
              </li>
              <li className="flex gap-3">
                <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-1" />
                Results are saved automatically.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentView;
