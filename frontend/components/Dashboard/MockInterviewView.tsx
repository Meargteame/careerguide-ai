import React, { useState, useEffect } from 'react';
import { Bot, Play, CheckCircle, XCircle, Terminal, Mic, Cpu, Award, ChevronRight, CheckCircle2, Clock, CodeSquare, Activity, Shield } from 'lucide-react';
import { generateInterviewQuestions, evaluateInterviewAnswer, EvaluationMatrix } from '../../services/geminiService';
import { trackDailyActivity } from '../../services/courseService';

interface MockInterviewViewProps {
  userId: string;
}

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ userId }) => {
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [focusArea, setFocusArea] = useState<'Technical' | 'System Design' | 'Behavioral'>('Technical');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const [results, setResults] = useState<EvaluationMatrix[]>([]);

  // Simple Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (questions.length > 0 && currentQuestionIndex < questions.length && !results[currentQuestionIndex]) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [questions, currentQuestionIndex, results]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    if (!role.trim()) return;
    setIsGenerating(true);
    try {
      const promptRole = `${role} (${focusArea} Focus)`;
      const q = await generateInterviewQuestions(promptRole, difficulty);
      setQuestions(q);
      setCurrentQuestionIndex(0);
      setResults([]);
      setCurrentAnswer('');
      setTimer(0);
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
      
      if (currentQuestionIndex === questions.length - 1) {
        const avgScore = newResults.reduce((acc, r) => acc + r.score, 0) / newResults.length;
        if (avgScore >= 7) {
          await trackDailyActivity(userId); 
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
    setTimer(0);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  // 1. Initial State: Setup Interview
  if (questions.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-blue-600 p-8 md:p-12 border-4 border-blue-700 shadow-[0_8px_0_rgba(29,78,216,1)] text-white">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20">
             <Cpu className="w-96 h-96 text-blue-300" />
          </div>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 text-white text-[10px] uppercase font-black tracking-widest border border-white/10">
              <Bot className="w-4 h-4" /> AI MOCK INTERVIEW ENGINE
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
              Master Your Next <br />
              <span className="text-blue-100">Technical Interview.</span>
            </h1>
            <p className="text-blue-50 text-lg font-bold leading-relaxed max-w-xl">
              Sit in the hot seat. Answer randomly generated, role-specific questions and get instant, detailed feedback on your clarity, accuracy, and completeness using our advanced Meridian AI.
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800 shadow-[0_8px_0_rgba(226,232,240,1)] dark:shadow-[0_8px_0_rgba(15,23,42,1)] relative overflow-hidden rounded-[2.5rem] p-8">
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-[12px] font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest">
                  Select Target Role
                </label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g., Senior Full-Stack Engineer, Product Manager..."
                    className="w-full pl-14 pr-4 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-blue-500 focus:bg-blue-50 focus:ring-0 outline-none transition-all dark:text-white placeholder:text-slate-400 text-lg font-bold shadow-inner"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                    Difficulty Level
                  </label>
                  <div className="flex flex-col gap-3">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-4 px-5 rounded-2xl border-2 transition-all font-black text-[14px] uppercase tracking-wide text-left flex items-center justify-between ${
                          difficulty === level 
                            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-[0_4px_0_rgba(59,130,246,1)] dark:bg-blue-600 dark:text-white'
                            : 'border-slate-200 bg-white text-slate-500 shadow-[0_4px_0_rgba(226,232,240,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(226,232,240,1)] active:translate-y-[4px] active:shadow-none dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_4px_0_rgba(51,65,85,1)] dark:text-slate-400'
                        }`}
                      >
                        {level}
                        {difficulty === level && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-black text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                    Focus Area
                  </label>
                  <div className="flex flex-col gap-3">
                    {(['Technical', 'System Design', 'Behavioral'] as const).map(focus => (
                      <button
                        key={focus}
                        onClick={() => setFocusArea(focus)}
                        className={`py-4 px-5 rounded-2xl border-2 transition-all font-black text-[14px] uppercase tracking-wide text-left flex items-center justify-between ${
                          focusArea === focus 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-[0_4px_0_rgba(99,102,241,1)] dark:bg-indigo-600 dark:text-white'
                            : 'border-slate-200 bg-white text-slate-500 shadow-[0_4px_0_rgba(226,232,240,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(226,232,240,1)] active:translate-y-[4px] active:shadow-none dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_4px_0_rgba(51,65,85,1)] dark:text-slate-400'
                        }`}
                      >
                        {focus}
                        {focusArea === focus && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={startInterview}
                  disabled={!role.trim() || isGenerating}
                  className="w-full py-5 bg-blue-500 border-2 border-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                >
                  {isGenerating ? (
                    <><Activity className="w-6 h-6 animate-pulse" /> Evaluating Matrix...</>
                  ) : (
                    <><Play className="w-6 h-6 group-hover/btn:scale-110 transition-transform" /> Initialize Virtual Interview</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 border-4 border-slate-800 shadow-[0_8px_0_rgba(15,23,42,1)] flex flex-col justify-between">
             <div className="space-y-4">
               <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                 <Shield className="w-6 h-6 text-blue-400" />
               </div>
               <h3 className="text-xl font-bold text-white">How it works</h3>
               <ul className="space-y-3 text-slate-400 text-sm">
                 <li className="flex gap-3"><span className="text-blue-500 font-bold">1.</span> Generates dynamic scenarios.</li>
                 <li className="flex gap-3"><span className="text-blue-500 font-bold">2.</span> Simulates pressure with live timing.</li>
                 <li className="flex gap-3"><span className="text-blue-500 font-bold">3.</span> Evaluates across Clarity, Accuracy, and Completeness.</li>
                 <li className="flex gap-3"><span className="text-blue-500 font-bold">4.</span> Grades to earn Meridian XP and Coins.</li>
               </ul>
             </div>
             <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 font-mono">
               {"> SYSTEM_STATUS: READY"}
               <br/>
               {"> AI_MODEL: ACTIVE"}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // Final Results view
  if (currentQuestionIndex === questions.length && results.length === questions.length) {
    const avgScore = results.reduce((acc, r) => acc + r.score, 0) / results.length;
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center text-center space-y-6 bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border-4 border-slate-200 dark:border-slate-800 shadow-[0_8px_0_rgba(226,232,240,1)] dark:shadow-[0_8px_0_rgba(15,23,42,1)] relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-5 dark:opacity-10 mix-blend-overlay"></div>
          
          <div className={`inline-flex items-center justify-center p-6 rounded-full ${avgScore >= 7 ? 'bg-green-100 text-green-600 dark:bg-green-600 dark:text-white' : 'bg-orange-100 text-orange-600 dark:bg-orange-600 dark:text-white'} animate-bounce-slow ring-8 ring-slate-50 dark:ring-slate-800`}>
            <Award className="w-16 h-16" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white mb-2">Performance Report</h2>
            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">
              Final Composite Score: <span className={`font-black text-3xl ml-2 ${avgScore >= 7 ? 'text-green-500' : 'text-orange-500'}`}>{avgScore.toFixed(1)} / 10</span>
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent my-4"></div>

          <button 
            onClick={() => {
              setQuestions([]);
              setRole('');
            }}
            className="px-10 py-5 bg-blue-500 border-2 border-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            Start New Session
          </button>
        </div>

        <div className="space-y-6">
          {results.map((r, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border-4 border-slate-200 dark:border-slate-800 shadow-[0_8px_0_rgba(226,232,240,1)] dark:shadow-[0_8px_0_rgba(15,23,42,1)]">
              <div className="flex gap-4 items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500 border-2 border-blue-600 text-white font-black text-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_0_rgba(30,58,138,1)]">
                  Q{idx + 1}
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white pt-2 leading-relaxed">{questions[idx]}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Score Matrix */}
                <div className="md:col-span-1 space-y-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <div className="text-center mb-6">
                     <span className="text-4xl font-black text-slate-900 dark:text-white">{r.score}</span>
                     <span className="text-slate-400">/10</span>
                  </div>
                  
                  <div className="space-y-3 text-sm font-bold uppercase tracking-wider">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400">Clarity</span>
                      <span className="text-blue-500">{r.clarity}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: `${r.clarity*10}%`}}></div></div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500 dark:text-slate-400">Accuracy</span>
                      <span className="text-emerald-500">{r.technicalAccuracy}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${r.technicalAccuracy*10}%`}}></div></div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-500 dark:text-slate-400">Complete</span>
                      <span className="text-purple-500">{r.completeness}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: `${r.completeness*10}%`}}></div></div>
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="md:col-span-3 space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      <Terminal className="w-4 h-4" /> Assessment Feedback
                    </h4>
                    <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {r.feedback}
                    </p>
                  </div>
                  
                  {r.keyMissedPoints && r.keyMissedPoints.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">Key Missed Points</h4>
                      <ul className="space-y-2">
                        {r.keyMissedPoints.map((point, i) => (
                           <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300">
                             <XCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                             {point}
                           </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">Ideal Model Answer</h4>
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-200 leading-relaxed italic">
                      "{r.modelAnswer}"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Question State
  const resultForCurrent = results[currentQuestionIndex];

  return (
    <div className="p-4 md:p-8 h-full max-w-[1400px] mx-auto animate-in slide-in-from-right-8 duration-500 flex flex-col gap-6">
      {/* Top HUD */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-6 py-4 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full">
            <Mic className="w-4 h-4 animate-pulse" />
            RECORDING
          </div>
          <span className="uppercase tracking-wider opacity-60">TARGET:</span>
          <span>{role} <span className="opacity-50">/</span> {focusArea} <span className="opacity-50">/</span> {difficulty}</span>
        </div>
        <div className="flex items-center gap-4 font-mono font-bold">
          <div className="text-slate-400 tracking-widest text-sm">
            Q {currentQuestionIndex + 1} / {questions.length}
          </div>
          <div className="bg-slate-900 dark:bg-black text-white px-4 py-2 rounded-full flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            {formatTime(timer)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        {/* Left Side: Interviewer Prompt */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-950 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1">
                 <img src="https://api.dicebear.com/7.x/bottts/svg?seed=MeridianAI" alt="AI Avatar" className="w-full h-full rounded-full bg-slate-800" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Interviewer AI</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Meridian Architecture</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl rounded-tl-none p-6 border border-blue-100 dark:border-blue-900/30">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {questions[currentQuestionIndex]}
              </h2>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-500">
             <strong>TIP:</strong> Take your time. Be sure to address the 'why' and 'how' in technical questions. Structured thinking is highly scored.
          </div>
        </div>

        {/* Right Side: Answer Area */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-[#0B1120] rounded-[2rem] p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col relative">
          
          {!resultForCurrent ? (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">
                <CodeSquare className="w-5 h-5" />
                Your Response Workspace
              </div>
              
              <textarea
                className="flex-1 w-full p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2F] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none resize-none dark:text-slate-200 placeholder:text-slate-400 transition-all text-lg font-mono leading-relaxed shadow-inner"
                placeholder="Begin drafting your comprehensive answer here... Note: Use markdown or code blocks if required."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={isEvaluating}
              />
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={submitAnswer}
                  disabled={!currentAnswer.trim() || isEvaluating}
                  className="w-full sm:w-auto px-10 py-5 bg-blue-500 border-2 border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(30,58,138,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(30,58,138,1)] active:translate-y-[6px] active:shadow-none transition-all flex justify-center items-center gap-3"
                >
                  {isEvaluating ? (
                    <><Activity className="w-5 h-5 animate-spin" /> Processing Matrix...</>
                  ) : (
                    'Submit Assessment'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl dark:text-white flex items-center gap-2">
                  Evaluation Finished
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center">
                   <div className="text-3xl font-black text-slate-800 dark:text-white">{resultForCurrent.score}<span className="text-lg text-slate-400">/10</span></div>
                   <div className="text-xs uppercase font-bold text-slate-500 mt-1">Total Score</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 text-center">
                   <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{resultForCurrent.technicalAccuracy}<span className="text-lg text-blue-300">/10</span></div>
                   <div className="text-xs uppercase font-bold text-blue-500/70 mt-1">Accuracy</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 text-center">
                   <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{resultForCurrent.clarity}<span className="text-lg text-purple-300">/10</span></div>
                   <div className="text-xs uppercase font-bold text-purple-500/70 mt-1">Clarity</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2F] border border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Immediate Feedback</h4>
                  <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">
                    {resultForCurrent.feedback}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={nextQuestion}
                  className="w-full py-5 bg-white text-slate-800 border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[14px] shadow-[0_6px_0_rgba(226,232,240,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(226,232,240,1)] active:translate-y-[6px] active:shadow-none dark:shadow-[0_6px_0_rgba(15,23,42,1)] dark:hover:shadow-[0_4px_0_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-3"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'End Interview & View Report' : 'Proceed to Next Question'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterviewView;
