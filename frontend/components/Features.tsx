import React, { useEffect, useRef, useState } from 'react';
import { Map, Zap, Target, Trophy, Briefcase, Brain, Star } from 'lucide-react';

const Features: React.FC = () => {
  const [active, setActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const featureList = [
    {
      title: "AI Curated Roadmaps",
      desc: "Stop wandering. Our AI engine builds a step-by-step skill tree specific to the exact job role you want.",
      icon: Map,
      color: "text-blue-500",
      bg: "bg-blue-100",
      shadow: "hover:shadow-[0_8px_0_rgba(59,130,246,1)] hover:-translate-y-2",
      delay: "0",
    },
    {
      title: "Earn Real XP",
      desc: "Every tutorial finished, every module read earns you Experience Points. Watch your global rank climb as you learn.",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-100",
      shadow: "hover:shadow-[0_8px_0_rgba(245,158,11,1)] hover:-translate-y-2",
      delay: "100",
    },
    {
      title: "Boss-Fight Quizzes",
      desc: "Don't just watch videos. Face challenging AI-generated assessments at the end of each module to prove you know it.",
      icon: Brain,
      color: "text-rose-500",
      bg: "bg-rose-100",
      shadow: "hover:shadow-[0_8px_0_rgba(244,63,94,1)] hover:-translate-y-2",
      delay: "200",
    },
    {
      title: "Market Insights",
      desc: "A live dashboard showing what skills companies are actively hiring for right now. Learn what actually pays.",
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-100",
      shadow: "hover:shadow-[0_8px_0_rgba(16,185,129,1)] hover:-translate-y-2",
      delay: "300",
    },
    {
      title: "Public Skill Portfolio",
      desc: "Forget boring CVs. Convert your completed courses into verified badges and a public profile that recruiters love.",
      icon: Trophy,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      shadow: "hover:shadow-[0_8px_0_rgba(99,102,241,1)] hover:-translate-y-2",
      delay: "400",
    },
    {
      title: "Daily Streaks",
      desc: "Consistency is key. Keep your flame alive by coding every day. Turn self-improvement into your newest healthy addiction.",
      icon: Star,
      color: "text-orange-500",
      bg: "bg-orange-100",
      shadow: "hover:shadow-[0_8px_0_rgba(249,115,22,1)] hover:-translate-y-2",
      delay: "500",
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      
      {/* Decorative animated elements */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-50 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        <div className="text-center mb-24 transition-all duration-1000" style={{ opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(20px)' }}>
          <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-6 px-6 py-2 bg-blue-50 rounded-full border-2 border-blue-100 animate-bob">
            <Target size={18} /> Game Mechanics
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
            How The <span className="text-blue-600">Game is Played</span>
          </h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
            We ripped out the boring syllabus and replaced it with an engaging, interactive system designed to get you hired.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((f, i) => (
            <div 
              key={i} 
              className={`bg-white border-2 border-slate-100 p-8 rounded-3xl transition-all duration-300 group cursor-default shadow-sm ${f.shadow}`}
              style={{ 
                transitionDelay: `${f.delay}ms`,
                opacity: active ? 1 : 0, 
                transform: active ? 'translateY(0)' : 'translateY(40px)' 
              }}
            >
              <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                <f.icon size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default Features;
