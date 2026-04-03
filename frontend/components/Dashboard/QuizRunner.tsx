
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Loader2, Award, AlertCircle } from 'lucide-react';
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
        if (!ignore) {
            if (data && data.length > 0) {
                setQuestions(data);
            } else {
                console.warn("Quiz generation returned empty data");
            }
        }
      } catch (e) {
        console.error("Quiz fetch error:", e);
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
    if (option === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      onComplete(score + (selectedOption === questions[currentQuestion].correctAnswer ? 0 : 0)); // Score already updated
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-800">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-6" size={48} />
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Making Quiz...</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">We are writing questions for "{topic}".</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-800">
          <AlertCircle className="text-rose-500 mx-auto mb-6" size={56} />
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">Quiz Error</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg font-medium">We couldn't make the quiz right now. Please try again.</p>
          <div className="flex gap-4 justify-center">
             <button onClick={onClose} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-500 hover:text-primary transition-all">Close</button>
             <button onClick={() => window.location.reload()} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-600/20">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="fixed inset-0 z-[200] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-reveal">
        <div className="bg-white dark:bg-slate-900 p-16 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-secondary to-indigo-600" />
          
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-secondary">
             <Award size={48} strokeWidth={1.5} />
          </div>

          <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-2">You Finished!</h3>
          <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-8">Score</p>
          
          <div className="mb-10">
            <span className="text-7xl font-black text-slate-800 dark:text-white">{score}</span>
            <span className="text-3xl text-slate-300 dark:text-slate-600 font-bold">/{questions.length}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 text-lg leading-relaxed">
            {percentage >= 80 ? "Great job! You know this well." : "Good try. Try again later."}
          </p>

          <button onClick={onClose} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all shadow-xl active:scale-95 shadow-slate-900/20">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">Quiz</h4>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate max-w-md">{topic}</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="block text-2xl font-black text-slate-800 dark:text-white leading-none">0{currentQuestion + 1}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">of 0{questions.length}</span>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors">
               <XCircle size={20} />
             </button>
          </div>
        </div>

        {/* Question Area */}
        <div className="p-10 md:p-14 overflow-y-auto flex-1">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-12 leading-tight">
            {q.question}
          </h2>

          <div className="space-y-4">
            {q.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrect = showResult && option === q.correctAnswer;
              const isWrong = showResult && isSelected && option !== q.correctAnswer;
              
              let styleClass = "border-slate-200 dark:border-slate-800 hover:border-secondary hover:bg-slate-50 dark:hover:bg-slate-900";
              if (isCorrect) styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500";
              if (isWrong) styleClass = "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400";
              if (showResult && !isCorrect && !isWrong) styleClass = "opacity-50 border-slate-100 dark:border-slate-800";

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showResult}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${styleClass}`}
                >
                <span className={`text-lg font-bold ${isCorrect || isWrong ? '' : 'text-slate-800 dark:text-slate-300'}`}>{option}</span>
                  {isCorrect && <CheckCircle2 className="text-emerald-500" size={24} />}
                  {isWrong && <XCircle className="text-rose-500" size={24} />}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-10 animate-reveal">
               <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-blue-500">
                 <h5 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Explanation</h5>
                 <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{q.explanation}</p>
               </div>
               
               <div className="mt-8 flex justify-end">
                 <button 
                   onClick={handleNext}
                   className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl active:scale-95"
                 >
                   {currentQuestion < questions.length - 1 ? "Next Protocol" : "Complete Audit"} <ArrowRight size={18} />
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRunner;
