import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, XCircle, ArrowRight, Loader2,
  Award, AlertCircle, Zap, ArrowLeft, Trophy, RotateCcw
} from 'lucide-react';
import { generateSingleQuestion } from '../../services/geminiService';
import { saveQuizResult } from '../../services/quizService';
import { supabase } from '../../services/supabaseClient';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const LETTERS = ['A', 'B', 'C', 'D'];
const TOTAL = 5;

const QuizPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const decodedTopic = decodeURIComponent(topic || '');

  const [questions, setQuestions] = useState<(Question | null)[]>(Array(TOTAL).fill(null));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Track which indices are already being fetched to avoid duplicate requests
  const fetching = useRef<Set<number>>(new Set());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  // Fetch a question by index if not already loaded/fetching
  const fetchQuestion = (index: number) => {
    if (index >= TOTAL) return;
    if (fetching.current.has(index)) return;
    if (questions[index] !== null) return;

    fetching.current.add(index);
    generateSingleQuestion(decodedTopic, index, TOTAL).then(q => {
      if (q) {
        setQuestions(prev => {
          const next = [...prev];
          next[index] = q;
          return next;
        });
      }
    });
  };

  // On mount: fetch question 0 immediately, prefetch question 1
  useEffect(() => {
    fetchQuestion(0);
    fetchQuestion(1);
  }, [decodedTopic]);

  // When user moves to a new question, prefetch the one after next
  useEffect(() => {
    fetchQuestion(current + 1);
    fetchQuestion(current + 2);
  }, [current]);

  const handleSelect = (option: string) => {
    if (showResult || !questions[current]) return;
    setSelected(option);
    setShowResult(true);
    if (option === questions[current]!.correctAnswer) setScore(p => p + 1);
  };

  const handleNext = () => {
    if (current < TOTAL - 1) {
      setCurrent(p => p + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      if (userId) saveQuizResult(userId, decodedTopic, score, TOTAL);
    }
  };

  const handleRetry = () => {
    fetching.current.clear();
    setQuestions(Array(TOTAL).fill(null));
    setCurrent(0); setScore(0);
    setSelected(null); setShowResult(false); setFinished(false);
    setTimeout(() => { fetchQuestion(0); fetchQuestion(1); }, 50);
  };

  const progress = ((current + (showResult ? 1 : 0)) / TOTAL) * 100;
  const percentage = Math.round((score / TOTAL) * 100);
  const q = questions[current];

  // ── Finished ─────────────────────────────────────────────────────────────
  if (finished) {
    const isPerfect = percentage === 100;
    const isGood = percentage >= 60;
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className={`rounded-[2.5rem] overflow-hidden border-2 ${isPerfect ? 'border-amber-300 dark:border-amber-500' : isGood ? 'border-emerald-300 dark:border-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className={`p-12 text-center relative overflow-hidden ${isPerfect ? 'bg-amber-400' : isGood ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Trophy className="absolute top-4 right-4 text-white" size={120} />
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  <Award size={48} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="text-white/70 text-xs font-black uppercase tracking-[0.3em] mb-1">Final Score</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-7xl font-black text-white">{score}</span>
                  <span className="text-3xl text-white/50 font-bold mb-2">/{TOTAL}</span>
                </div>
                <p className="text-white/80 font-bold mt-2">
                  {isPerfect ? '🏆 Perfect! Legendary.' : isGood ? '✅ Great work. Keep it up.' : '📚 Keep studying and retry.'}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: 'Correct', value: score, color: 'text-emerald-500' },
                  { label: 'Wrong', value: TOTAL - score, color: 'text-rose-500' },
                  { label: 'Score', value: `${percentage}%`, color: 'text-violet-500' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                    <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Accuracy</span><span>{percentage}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isPerfect ? 'bg-amber-400' : isGood ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => navigate('/dashboard')} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft size={16} /> Dashboard
                </button>
                <button onClick={handleRetry} className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-violet-600 text-white hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                  <RotateCcw size={16} /> Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors font-bold text-sm">
            <ArrowLeft size={18} /> Exit Quiz
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-500/10 px-4 py-2 rounded-xl border border-violet-200 dark:border-violet-500/30">
              <Zap size={14} className="text-violet-500" strokeWidth={3} />
              <span className="text-sm font-black text-violet-600 dark:text-violet-400">{score} pts</span>
            </div>
            <div className="text-sm font-black text-slate-400">
              <span className="text-slate-800 dark:text-white">{current + 1}</span>/{TOTAL}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-3xl space-y-6">

          {/* Topic badge */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
              <Zap size={14} className="text-violet-500" strokeWidth={3} />
            </div>
            <span className="text-xs font-black text-violet-500 uppercase tracking-[0.2em]">{decodedTopic}</span>
          </div>

          {/* Question card — shows skeleton while loading */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10">
            {!q ? (
              /* Loading skeleton */
              <div className="animate-pulse space-y-6">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full w-24" />
                <div className="space-y-2">
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-full" />
                  <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-full w-4/5" />
                </div>
                <div className="space-y-3 pt-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700" />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium pt-2">
                  <Loader2 size={16} className="animate-spin text-violet-400" />
                  Generating question...
                </div>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Question {current + 1}</p>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white leading-snug mb-8">
                  {q.question}
                </h2>

                {/* Prefetch indicator for next question */}
                {questions[current + 1] === null && current < TOTAL - 1 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 dark:text-slate-600 font-bold mb-4">
                    <Loader2 size={10} className="animate-spin" /> loading next question...
                  </div>
                )}

                <div className="grid gap-3">
                  {q.options.map((option, idx) => {
                    const isSelected = selected === option;
                    const isCorrect = showResult && option === q.correctAnswer;
                    const isWrong = showResult && isSelected && option !== q.correctAnswer;
                    const isDimmed = showResult && !isCorrect && !isWrong;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(option)}
                        disabled={showResult}
                        className={`w-full text-left rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 p-4
                          ${isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : ''}
                          ${isWrong ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10' : ''}
                          ${isDimmed ? 'opacity-40 border-slate-100 dark:border-slate-800 cursor-default' : ''}
                          ${!showResult ? 'border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer active:scale-[0.99]' : ''}
                        `}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all
                          ${isCorrect ? 'bg-emerald-500 text-white' : ''}
                          ${isWrong ? 'bg-rose-500 text-white' : ''}
                          ${!isCorrect && !isWrong ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' : ''}
                        `}>
                          {LETTERS[idx]}
                        </div>
                        <span className={`flex-1 text-sm font-bold leading-snug
                          ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : ''}
                          ${isWrong ? 'text-rose-700 dark:text-rose-400' : ''}
                          ${!isCorrect && !isWrong ? 'text-slate-700 dark:text-slate-200' : ''}
                        `}>{option}</span>
                        {isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                        {isWrong && <XCircle className="text-rose-500 shrink-0" size={20} />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Explanation + Next */}
          {showResult && q && (
            <div className="animate-in slide-in-from-bottom-3 duration-300 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-l-4 border-blue-500 border border-slate-200 dark:border-slate-800 p-6">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Explanation</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{q.explanation}</p>
              </div>
              <button
                onClick={handleNext}
                disabled={current < TOTAL - 1 && questions[current + 1] === null}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
              >
                {current < TOTAL - 1 ? (
                  questions[current + 1] === null
                    ? <><Loader2 size={16} className="animate-spin" /> Loading next...</>
                    : <>Next Question <ArrowRight size={16} strokeWidth={3} /></>
                ) : <>See Results <ArrowRight size={16} strokeWidth={3} /></>}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
