const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Bot, Play, CheckCircle, XCircle, Award, ChevronRight, Zap, Target, Cpu, MessageSquare, Star, Loader2, Clock } from 'lucide-react';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../../services/geminiService';
import { trackDailyActivity } from '../../services/courseService';
import confetti from 'canvas-confetti';

interface MockInterviewViewProps {
  userId: string;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ userId }) => {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [results, setResults] = useState<{
    score: number;
    feedback: string;
    modelAnswer: string;
  }[]>([]);

  const startInterview = async () => {
    if (!role.trim()) return;
    setIsGenerating(true);
    try {
      const q = await generateInterviewQuestions(role, difficulty);
      setQuestions(q);
      setCurrentQuestionIndex(0);
      setResults([]);
      setCurrentAnswer('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    setIsEvaluating(true);
    
    try {
      const result = await evaluateInterviewAnswer(
        role,
        questions[currentQuestionIndex],
        currentAnswer
      );
      
      const newResults = [...results, result];
      setResults(newResults);
      
      // If we finished the last question, grant XP/Coins based on average score
      if (currentQuestionIndex === questions.length - 1) {
        const avgScore = newResults.reduce((acc, r) => acc + r.score, 0) / newResults.length;
        if (avgScore >= 7) {
          confetti({
             particleCount: 150,
             spread: 80,
             origin: { y: 0.6 },
             colors: ['#10b981', '#3b82f6', '#f59e0b']
          });
          await trackDailyActivity(userId); // XP / Coins already integrated in courseService schema
        } else {
          await trackDailyActivity(userId); 
        }
      }
      
    } catch(err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentAnswer('');
    setCurrentQuestionIndex(prev => prev + 1);
  };

  // Check if we finished
  if (currentQuestionIndex === questions.length && results.length === questions.length && questions.length > 0) {
    const avgScore = results.reduce((acc, r) => acc + r.score, 0) / results.length;
    return (
      <div className="animate-reveal space-y-12 pb-20">
        <header className="border-b-4 border-slate-100 dark:border-slate-800 pb-10 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 flex items-center justify-center border-4 border-yellow-200 dark:border-yellow-700 shadow-[0_0_40px_rgba(234,179,8,0.3)] mb-6 animate-bounce">
             <Award size={64} className="drop-shadow-lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest drop-shadow-sm text-center">Evaluation Complete</h1>
          <div className="mt-6 inline-flex rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 font-black text-xl gap-3 shadow-lg items-center">
             Average Rating: <span className={avgScore >= 7 ? 'text-emerald-400 dark:text-emerald-500' : 'text-rose-400 dark:text-rose-500'}>{avgScore.toFixed(1)} / 10</span>
          </div>
        </header>

        <div className="grid gap-8 max-w-5xl mx-auto">
          {results.map((r, idx) => (
             <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-8 hover:-translate-y-2 transition-transform group">
                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] flex items-center justify-center font-black text-slate-500 text-xl border-2 border-slate-200 dark:border-slate-700">Q{idx + 1}</div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white line-clamp-2 pr-4 leading-snug">{questions[idx]}</h3>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[1.5rem] border-2 border-slate-100 dark:border-slate-800">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] flex items-center gap-2 mb-2"><Target size={14}/> Feedback Analysis</span>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{r.feedback}</p>
                   </div>
                </div>
                <div className={\`w-full md:w-32 shrink-0 flex flex-col items-center justify-center md:border-l-4 border-t-4 md:border-t-0 border-slate-100 dark:border-slate-800 border-dashed md:pl-8 pt-8 md:pt-0 \${r.score >= 7 ? 'text-emerald-500' : 'text-rose-500'}\`}>
                   <div className="text-6xl font-black drop-shadow-sm">{r.score}</div>
                   <div className="text-[12px] font-black uppercase tracking-widest opacity-70 mt-2">Score</div>
                </div>
             </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
           <button 
              onClick={() => {
                setQuestions([]);
                setRole('');
              }}
              className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-[0_8px_0_rgba(29,78,216,1)] hover:translate-y-[2px] active:translate-y-[8px] active:shadow-none transition-all flex items-center gap-3"
            >
              <Play className="fill-white" size={24} /> New Simulation
           </button>
        </div>
      </div>
    );
  }

  // 1. Initial State: Setup Interview
  if (questions.length === 0) {
    return (
      <div className="animate-reveal space-y-12 pb-20">
        <header className="border-b-4 border-slate-100 dark:border-slate-800 pb-10">
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 flex items-center gap-2"><Cpu size={16}/> Simulation Engine</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm flex items-center gap-4">
            <Bot size={48} className="text-blue-500" /> AI Interrogator
          </h1>
        </header>

        <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 group-hover:scale-125 transition-transform duration-1000" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700" />
           
           <div className="space-y-10 relative z-10">
              <div>
                 <h2 className="text-3xl font-display font-black text-slate-800 dark:text-white uppercase tracking-wider mb-3">Configure Parameters</h2>
                 <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-lg">Define your target role and severity level to generate a specialized technical assessment.</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[14px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Target Role Objective
                  </label>
                  <div className="relative">
                    <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={28} />
                    <input
                      type="text"
                      placeholder="e.g., Senior React Engineer"
                      className="w-full pl-20 pr-8 py-6 rounded-[2rem] border-4 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all dark:text-white font-bold text-xl placeholder:text-slate-300 dark:placeholder:text-slate-700 hover:shadow-[0_4px_0_rgba(241,245,249,1)] dark:hover:shadow-[0_4px_0_rgba(15,23,42,1)] focus:shadow-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[14px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    Difficulty Protocol
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={\`py-5 px-4 text-center rounded-[1.5rem] font-black uppercase tracking-widest text-[14px] border-b-[6px] border-x-2 border-t-2 transition-all \${
                          difficulty === level 
                            ? 'border-blue-600 bg-blue-500 text-white shadow-[0_4px_0_rgba(37,99,235,1)] translate-y-[2px]'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-slate-700 shadow-[0_6px_0_rgba(226,232,240,1)] dark:shadow-[0_6px_0_rgba(15,23,42,1)]'
                        }\`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={startInterview}
                disabled={!role.trim() || isGenerating}
                className="w-full mt-10 py-7 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_0_rgba(29,78,216,1)] text-white rounded-[2rem] font-black uppercase tracking-widest text-xl shadow-[0_8px_0_rgba(29,78,216,1)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgba(29,78,216,1)] active:translate-y-[8px] active:shadow-none transition-all flex justify-center items-center gap-4"
              >
                {isGenerating ? (
                  <><Loader2 size={28} className="animate-spin" /> Initializing Arena...</>
                ) : (
                  <><Zap size={28} className="fill-white" /> Initiate Sequence</>
                )}
              </button>
           </div>
        </div>
      </div>
    );
  }

  // Active Question State
  const resultForCurrent = results[currentQuestionIndex];

  return (
    <div className="animate-reveal space-y-8 pb-20">
      {/* Header bar with progress */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-6 md:px-10 md:py-6 rounded-[2.5rem] shadow-sm">
         <div className="flex items-center gap-5 w-full md:w-auto">
           <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-[1.25rem] flex items-center justify-center font-black text-2xl shadow-[0_4px_0_rgba(191,219,254,1)] dark:shadow-[0_4px_0_rgba(30,58,138,1)] border-2 border-blue-200 dark:border-blue-800 rotate-3">
             {currentQuestionIndex + 1}
           </div>
           <div>
             <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{role} Target</p>
             <p className="font-bold text-slate-800 dark:text-white text-lg">{currentQuestionIndex + 1} of {questions.length} Active</p>
           </div>
         </div>
         <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
           {questions.map((_, i) => (
              <div key={i} className={\`h-4 rounded-full transition-all \${i === currentQuestionIndex ? 'bg-blue-500 w-16 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : i < currentQuestionIndex ? 'bg-emerald-400 w-8 opacity-50' : 'bg-slate-200 dark:bg-slate-800 w-8'}\`} />
           ))}
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border-x-4 border-t-2 border-b-[12px] border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-3 h-full bg-blue-500 rounded-r-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
        
        <div className="flex flex-col md:flex-row items-start gap-8 max-w-5xl">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 rounded-[1.5rem] flex items-center justify-center shrink-0 border-2 border-slate-200 dark:border-slate-800 -rotate-3 shadow-inner">
            <MessageSquare size={40} />
          </div>
          <div className="pt-2">
            <p className="text-[12px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Bot size={16}/> Evaluator Prompt</p>
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800 dark:text-white leading-tight drop-shadow-sm">
              {questions[currentQuestionIndex]}
            </h2>
          </div>
        </div>

        {resultForCurrent ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 mt-16 pt-12 border-t-4 border-slate-100 dark:border-slate-800 border-dashed">
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 shadow-inner">
              <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 block"><Clock size={16} className="inline mr-2" />Your Logged Response</span>
              <p className="text-slate-800 dark:text-slate-200 font-medium text-lg leading-relaxed bg-white dark:bg-slate-900 p-6 rounded-[1.5rem] border-l-4 border-l-slate-300 dark:border-l-slate-700">{currentAnswer}</p>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Score Card */}
              <div className={\`p-8 rounded-[2.5rem] border-b-[8px] border-x-2 border-t-2 shrink-0 flex flex-col items-center justify-center w-full lg:w-72 \${
                resultForCurrent.score >= 7 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400'
              }\`}>
                  <div className="text-7xl font-display font-black mb-3 drop-shadow-md">{resultForCurrent.score}<span className="text-3xl opacity-50">/10</span></div>
                  <p className="font-black text-[14px] uppercase tracking-widest opacity-80 flex items-center gap-2">
                     {resultForCurrent.score >= 7 ? <CheckCircle size={20} /> : <XCircle size={20} />} 
                     Score Achieved
                  </p>
              </div>

              {/* Feedback Text */}
              <div className="flex-1 space-y-6 w-full">
                  <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={18} /> Diagnostics</p>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{resultForCurrent.feedback}</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800/50 shadow-sm transition-all hover:shadow-md">
                    <p className="text-[12px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Star size={18} className="fill-blue-500" /> Ideal Protocol</p>
                    <p className="text-lg font-medium text-blue-900 dark:text-blue-100 leading-relaxed">{resultForCurrent.modelAnswer}</p>
                  </div>
              </div>
            </div>

            <div className="flex justify-end pt-8">
                <button
                  onClick={nextQuestion}
                  className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-lg shadow-[0_8px_0_rgba(29,78,216,1)] hover:translate-y-[2px] hover:shadow-[0_6px_0_rgba(29,78,216,1)] active:translate-y-[8px] active:shadow-none transition-all flex items-center gap-4"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Analyze Final Results' : 'Proceed to Next Phase'}
                  <ChevronRight size={28} className="scale-125" />
                </button>
            </div>
          </div>
        ) : (
          <div className="mt-14 space-y-8">
            <div className="relative group/textarea">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-[2.5rem] blur opacity-20 group-focus-within/textarea:opacity-50 transition duration-500"></div>
              <textarea
                className="relative w-full h-72 p-8 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-blue-500 focus:bg-slate-50 dark:focus:bg-slate-900 outline-none resize-none dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all font-medium text-xl leading-relaxed shadow-sm z-10"
                placeholder="Structure your response clearly. Consider key concepts, trade-offs, and algorithms..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isEvaluating}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim() || isEvaluating}
                className="px-12 py-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_8px_0_rgba(15,23,42,1)] text-white rounded-[2rem] font-black uppercase tracking-widest text-[16px] shadow-[0_8px_0_rgba(15,23,42,1)] dark:shadow-[0_8px_0_rgba(203,213,225,1)] hover:translate-y-[2px] active:translate-y-[8px] active:shadow-none transition-all flex items-center gap-4 group/btn"
              >
                {isEvaluating ? (
                  <><Loader2 size={24} className="animate-spin" /> Processing Data...</>
                ) : (
                  <><Cpu size={24} className="group-hover/btn:scale-110 transition-transform" /> Submit Transmission</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewView;
`;

fs.writeFileSync('frontend/components/Dashboard/MockInterviewView.tsx', code);
console.log('File successfully replaced!');
