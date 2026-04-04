import React, { useState } from 'react';
import { Bot, Play, CheckCircle, XCircle, ArrowRight, Star, Loader2, Award, ChevronRight } from 'lucide-react';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../../services/geminiService';
import { trackDailyActivity } from '../../services/courseService';

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
          await trackDailyActivity(userId, 100, 20); // 100 XP, 20 coins for good performance
        } else {
          await trackDailyActivity(userId, 20, 5); // Consolation prize
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

  // 1. Initial State: Setup Interview
  if (questions.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-600" />
            AI Mock Interviews
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Practice for your next technical interview with real-time AI feedback and grading.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g., Frontend React Developer, Python Data Scientist..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Difficulty Level
              </label>
              <div className="flex gap-4">
                {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-medium ${
                      difficulty === level 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-700'
                    }`}
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
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex justify-center items-center gap-3 transition-colors"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Preparing Interview...</>
            ) : (
              <><Play className="w-5 h-5" /> Start Interview</>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Check if we finished
  if (currentQuestionIndex === questions.length && results.length === questions.length) {
    const avgScore = results.reduce((acc, r) => acc + r.score, 0) / results.length;
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mb-4">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Interview Complete!</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Average Score: <span className="font-bold text-blue-600 dark:text-blue-400">{avgScore.toFixed(1)} / 10</span>
          </p>
        </div>

        <div className="space-y-6">
          {results.map((r, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Q{idx + 1}: {questions[idx]}</h3>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-4">
                <div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-older">Feedback (Score: {r.score}/10)</span>
                  <p className="mt-1 text-slate-700 dark:text-slate-300">{r.feedback}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-500 uppercase tracking-older">Ideal Answer</span>
                  <p className="mt-1 text-slate-700 dark:text-slate-300">{r.modelAnswer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            setQuestions([]);
            setRole('');
          }}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
        >
          Start Another Interview
        </button>
      </div>
    );
  }

  // Active Question State
  const resultForCurrent = results[currentQuestionIndex];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-medium text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-500" />
          {role} ({difficulty})
        </span>
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-600 h-full"></div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {questions[currentQuestionIndex]}
        </h2>

        {resultForCurrent ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-400 uppercase">Your Answer</span>
              <p className="mt-2 text-slate-800 dark:text-slate-200">{currentAnswer}</p>
            </div>

            <div className={`p-5 rounded-xl border \${resultForCurrent.score >= 7 ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30'}`}>
              <div className="flex items-center gap-2 mb-3">
                {resultForCurrent.score >= 7 ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                <span className="font-bold text-lg dark:text-white">
                  Score: {resultForCurrent.score}/10
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{resultForCurrent.feedback}</p>
            </div>

            <button
              onClick={nextQuestion}
              className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full h-48 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white placeholder:text-slate-400 transition-all font-mono"
              placeholder="Type your detailed answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              disabled={isEvaluating}
            />
            
            <button
              onClick={submitAnswer}
              disabled={!currentAnswer.trim() || isEvaluating}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-slate-900 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors"
            >
              {isEvaluating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating...</>
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterviewView;
