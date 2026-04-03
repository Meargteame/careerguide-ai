
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Loader2, Award, AlertCircle, Zap, X } from 'lucide-react';
import { generateQuiz } from '../../services/geminiService';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizRunnerProps {
  topic: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

const QuizRunner: React.FC<QuizRunnerProps> = ({ topic, onClose, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await generateQuiz(topic);
        if (!ignore && data && data.length > 0) setQuestions(data);
      } catch (e) {
        console.error('Quiz fetch error:', e);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchQuiz();
    return () => { ignore = true; };
  }, [topic]);

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option === questions[currentQuestion].correctAnswer) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      onComplete(score);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100 : 0;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 duration-300 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400" />
          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="animate-spin text-violet-500" size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">Generating Quiz</h3>
            <p className="text-sm text-slate-400 font-medium">Writing questions for <span className="text-violet-500 font-bold">"{topic}"</span></p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 duration-300 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-orange-400" />
          <div className="p-10 text-center">
            <AlertCircle className="text-rose-500 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Couldn't Load Quiz</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">Something went wrong. Please try again.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all">Close</button>
              <button onClick={() => window.location.reload()} className="flex-1 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all">Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Finished ─────────────────────────────────────────────────────────────
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const isPerfect = percentage === 100;
    const isGood = percentage >= 60;
    return (
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-md px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 zoom-in-95 duration-300 overflow-hidden">
          <div className={`h-1 w-full bg-gradient-to-r ${isPerfect ? 'from-amber-400 to-yellow-300' : isGood ? 'from-emerald-400 to-teal-400' : 'from-blue-400 to-indigo-400'}`} />
          <div className="p-10 text-center">
            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 ${isPerfect ? 'bg-amber-100 dark:bg-amber-500/20' : isGood ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-blue-100 dark:bg-blue-500/20'}`}>
              <Award size={40} className={isPerfect ? 'text-amber-500' : isGood ? 'text-emerald-500' : 'text-blue-500'} strokeWidth={1.5} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Final Score</p>
            <div className="flex items-end justify-center gap-1 mb-2">
              <span className="text-6xl font-black text-slate-800 dark:text-white">{score}</span>
              <span className="text-2xl text-slate-300 dark:text-slate-600 font-bold mb-2">/{questions.length}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${isPerfect ? 'bg-amber-400' : isGood ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">
              {isPerfect ? '🏆 Perfect score! Legendary.' : isGood ? '✅ Solid work. Keep it up.' : '📚 Keep studying and retry.'}
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all active:scale-95"
            >
              Back to Arena
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────
  const q = questions[currentQuestion];

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-2xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 zoom-in-95 duration-300 overflow-hidden max-h-[92vh] flex flex-col">

        {/* Progress bar */}
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
              <Zap size={16} className="text-violet-500" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-[0.2em]">Quiz</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[260px]">{topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-lg font-black text-slate-800 dark:text-white">{currentQuestion + 1}</span>
              <span className="text-sm text-slate-300 dark:text-slate-600 font-bold">/{questions.length}</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:rotate-90 transition-all duration-200"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-7 py-6">

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-6 leading-snug">
            {q.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = showResult && option === q.correctAnswer;
              const isWrong = showResult && isSelected && option !== q.correctAnswer;
              const isDimmed = showResult && !isCorrect && !isWrong;

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 p-4 group
                    ${isCorrect ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : ''}
                    ${isWrong ? 'border-rose-400 bg-rose-50 dark:bg-rose-500/10' : ''}
                    ${isDimmed ? 'opacity-40 border-slate-100 dark:border-slate-800 cursor-default' : ''}
                    ${!showResult ? 'border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 cursor-pointer' : ''}
                  `}
                >
                  {/* Letter badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-all
                    ${isCorrect ? 'bg-emerald-500 text-white' : ''}
                    ${isWrong ? 'bg-rose-500 text-white' : ''}
                    ${!isCorrect && !isWrong ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-violet-500 group-hover:text-white' : ''}
                  `}>
                    {LETTERS[idx]}
                  </div>
                  <span className={`flex-1 text-sm font-bold leading-snug
                    ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : ''}
                    ${isWrong ? 'text-rose-700 dark:text-rose-400' : ''}
                    ${!isCorrect && !isWrong ? 'text-slate-700 dark:text-slate-200' : ''}
                  `}>
                    {option}
                  </span>
                  {isCorrect && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
                  {isWrong && <XCircle className="text-rose-500 shrink-0" size={20} />}
                </button>
              );
            })}
          </div>

          {/* Explanation + Next */}
          {showResult && (
            <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-4">
              <div className="rounded-2xl border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-500/10 p-5">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Explanation</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{q.explanation}</p>
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ArrowRight size={16} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRunner;
