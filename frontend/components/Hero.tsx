import React, { useState, useEffect } from 'react';
import { Rocket, Target, Zap, Trophy, ShieldCheck, ArrowRight, Star, Flame, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = "Software Engineer";
  
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTypedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(typing);
        setTimeout(() => {
          setTypedText('');
          i = 0;
        }, 3000);
      }
    }, 150);
    return () => clearInterval(typing);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-[#f8fafc]">
      
      {/* Background Gamified Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-2xl animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-2xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-20 left-40 w-72 h-72 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-2xl animate-blob" style={{ animationDelay: '4s' }} />
      
      {/* Floating Gamified Achievement Cards */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
        <div className="absolute top-[25%] left-[8%] bg-white p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 animate-float flex flex-col items-center gap-2 rotate-[-5deg]">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-1">
            <Flame size={24} className="animate-pulse" />
          </div>
          <span className="text-sm font-bold text-slate-700">14 Day Streak!</span>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
             <div className="w-full h-full bg-amber-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute top-[60%] right-[10%] bg-white p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-slate-100 animate-float-fast flex items-center gap-4 rotate-[5deg]">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-500">
            <Trophy size={28} />
          </div>
          <div>
             <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">XP Gained</span>
             <span className="block text-xl font-black text-slate-800">+500 React</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-5 py-2 rounded-full mb-8 shadow-sm animate-reveal">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-sm font-bold text-slate-600">
              The smartest way to learn tech skills.
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-sans font-black tracking-tight mb-6 leading-[1.05] animate-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="text-slate-900">Stop watching tutorials.</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Start playing the game.
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-500 font-medium mb-12 animate-reveal" style={{ animationDelay: '0.2s' }}>
            Learning to code shouldn't be boring. Generate a custom roadmap, earn XP for completing tasks, pass interactive check-points, and level up your career.
          </p>

          {/* Clean Interactive Search */}
          <div className="w-full max-w-xl relative group animate-reveal" style={{ animationDelay: '0.3s' }}>
             <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-2 flex flex-col md:flex-row shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-blue-400 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] group">
               <div className="flex-1 flex items-center px-6 py-4">
                 <Target className="text-blue-500 mr-3 animate-bob" size={28} />
                 <span className="text-slate-400 text-lg font-medium">I want to be a</span>
                 <span className="text-slate-800 font-bold text-lg ml-2 border-r-2 border-blue-500 pr-1 animate-pulse">
                   {typedText}
                 </span>
               </div>
               <button className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group/btn shadow-[0_6px_0_rgba(29,78,216,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(29,78,216,1)] active:translate-y-[6px] active:shadow-none">
                 Play Now <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
               </button>
             </div>
          </div>
          
          {/* Social Proof */}
          <div className="mt-20 flex flex-col items-center animate-reveal" style={{ animationDelay: '0.4s' }}>
             <div className="flex -space-x-4 mb-4">
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className={`w-12 h-12 rounded-full border-4 border-[#f8fafc] bg-slate-200 flex items-center justify-center overflow-hidden z-[${10-i}]`}>
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
             <div className="flex items-center gap-2">
               <div className="flex text-amber-400">
                 {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" />)}
               </div>
               <span className="text-slate-600 font-bold">Trusted by 10,000+ Level 100 learners</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
