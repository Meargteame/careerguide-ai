
import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowRight, Play, Lock, CheckCircle, Clock, Star, Loader2, AlertCircle } from 'lucide-react';
import { getUserCourses } from '../../services/courseService';
import { saveQuizResult, getQuizHistory } from '../../services/quizService';
import QuizRunner from './QuizRunner';

interface AssessmentViewProps {
  userId: string;
}

const AssessmentView: React.FC<AssessmentViewProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');
  const [courses, setCourses] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>(null);

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

  const completedConfig = []; // Placeholder for now

  return (
    <div className="animate-reveal space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-display font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">Quizzes</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Test what you know</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-12">
          {/* Header Controls */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 gap-10">
            <button 
              onClick={() => setActiveTab('available')}
              className={`pb-4 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'available' ? 'text-secondary border-b-2 border-secondary' : 'text-slate-300 hover:text-primary'}`}
            >
              Available ({assessments.length})
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`pb-4 font-bold text-sm uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'text-secondary border-b-2 border-secondary' : 'text-slate-300 hover:text-primary'}`}
            >
              Past ({history.length})
            </button>
          </div>

          <div className="grid gap-6">
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : activeTab === 'available' ? (
              assessments.length > 0 ? (
                assessments.map((q, i) => (
                  <div key={i} className={`p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all hover:border-secondary hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-slate-900`}>
                    <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-secondary`}>
                        <ClipboardCheck size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-primary dark:text-white mb-2 group-hover:text-secondary transition-colors line-clamp-1">{q.title}</h3>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock size={14} /> {q.time}</span>
                          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <span>{q.questions} Questions</span>
                          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          <span className="text-secondary">{q.level}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveQuizTopic(q.title)}
                      className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl bg-primary dark:bg-secondary text-white hover:bg-secondary shadow-primary/10 hover:shadow-secondary/20 active:scale-95`}
                    >
                      Start Quiz
                    </button>
                  </div>
                ))
            ) : (
                <div className="text-center p-12 border border-dashed border-slate-200 rounded-[2rem]">
                    <AlertCircle className="mx-auto text-slate-300 mb-4" size={32} />
                    <h3 className="text-lg font-bold text-slate-500">No Quizzes Yet</h3>
                    <p className="text-slate-400 text-sm">Start a course to get quizzes.</p>
                </div>
            )) : (
              history.length > 0 ? (
                history.map((h, i) => (
                  <div key={i} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{h.topic}</h3>
                      <p className="text-slate-500 text-sm">Score: {h.score} / {h.total_questions}</p>
                    </div>
                    <div className="font-bold text-secondary">{h.feedback}</div>
                  </div>
                ))
              ) : (
                <div className="text-center p-12"><p className="text-slate-400">No quiz history.</p></div>
              )
            )}
          </div>
        </div>

        {activeQuizTopic && (
          <QuizRunner 
            topic={activeQuizTopic} 
            onClose={() => setActiveQuizTopic(null)}
            onComplete={(score) => {
              // Save result to Supabase
              saveQuizResult(userId, activeQuizTopic, score, 5); // Assuming 5 questions
            }}
          />
        )}

        <div className="space-y-12">
          {/* Global Stats */}
          <div className="bg-primary dark:bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-transparent dark:border-slate-800">
             <div className="relative z-10">
                <Star className="text-secondary mb-6" size={48} fill="currentColor" />
                <h4 className="text-3xl font-black mb-4">Status</h4>
                <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                  Complete tests to improve your rank.
                </p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span>Average Score</span>
                    <span className="text-secondary">{avgScore}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full transition-all duration-1000" style={{ width: `${avgScore}%` }} />
                  </div>
                </div>
             </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h4 className="text-lg font-black text-primary dark:text-white mb-6 uppercase tracking-tight">Rules</h4>
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
