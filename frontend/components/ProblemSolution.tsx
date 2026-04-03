import React from 'react';
import { Compass, Ghost, Trophy, ArrowRight, Frown, Smile } from 'lucide-react';

const ProblemSolution: React.FC = () => {
  return (
    <section id="how-it-works" className="py-32 bg-slate-50 border-y-2 border-slate-100 relative overflow-hidden">
      
      {/* Playful background element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl opacity-50 pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-widest mb-6 px-6 py-2 bg-rose-50 rounded-full border-2 border-rose-100 animate-bob">
            <Compass size={18} /> The Problem
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            The tech industry is <span className="text-rose-500">confusing.</span>
          </h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
            Bootcamps are expensive. University is outdated. Self-teaching leaves you wondering: "Am I actually ready for a job?"
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* THE PROBLEM CARD */}
          <div className="bg-white border-2 border-slate-200 p-10 rounded-[2.5rem] shadow-lg relative group transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-6 right-6 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 rotate-12 group-hover:rotate-0 transition-transform">
              <Frown size={24} />
            </div>
            <div className="mb-8">
              <span className="text-rose-500 font-black text-2xl uppercase tracking-wider block mb-2">Tutorial Hell</span>
              <h3 className="text-4xl font-black text-slate-900 leading-tight">The old way of learning</h3>
            </div>
            <ul className="space-y-6">
              {[
                { text: "Endless 10-hour video tutorials with no actual practice." },
                { text: "Copying code without understanding how to build from scratch." },
                { text: "No clear finish line. Just hoping you know enough to apply." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <Ghost size={16} />
                  </div>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* THE SOLUTION CARD */}
          <div className="bg-blue-600 border-2 border-blue-700 p-10 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] relative group transition-all duration-500 hover:-translate-y-2 lg:scale-105 z-10">
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform animate-bounce">
              <Smile size={32} />
            </div>
            <div className="mb-8">
              <span className="text-blue-200 font-black text-2xl uppercase tracking-wider block mb-2">The Solution</span>
              <h3 className="text-4xl font-black text-white leading-tight">Your actionable <br/>Career Roadmap</h3>
            </div>
            <ul className="space-y-6">
              {[
                { text: "Step-by-step interactive map tailored specifically to your dream job." },
                { text: "Instant feedback. Real coding tasks that prove you know your stuff." },
                { text: "Verified checkpoints that confidently tell you: 'You are ready to apply'." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-blue-100 flex items-center justify-center shrink-0">
                    <Trophy size={16} />
                  </div>
                  <p className="text-blue-50 font-medium text-lg leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
            
            <button className="mt-10 w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-[4px] active:shadow-none flex justify-center items-center gap-2">
               Get Your Free Roadmap <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
