import React, { useEffect, useRef, useState } from 'react';
import { PlayCircle, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

const CourseGeneratorPromo: React.FC = () => {
  const [active, setActive] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-50 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          
          <div className="relative">
            {/* 3D Generated Course Card */}
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] relative z-20 animate-float">
              <div className="bg-emerald-100 text-emerald-600 font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6 w-max border-2 border-emerald-200">
                <Sparkles size={16} /> Course Synthesized
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-4">Complete System Design</h3>
              <p className="text-slate-500 font-medium mb-6">4 Weeks • Intermediate • 1,200 XP</p>
              
              <div className="space-y-4 mb-8">
                {[1, 2, 3].map((module) => (
                  <div key={module} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-400">
                      {module}
                    </div>
                    <div>
                      <div className="h-4 bg-slate-200 rounded-full w-32 mb-2"></div>
                      <div className="h-3 bg-slate-100 rounded-full w-24"></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex bg-slate-50 border-2 border-blue-100 p-2 rounded-2xl">
                <div className="bg-blue-600 text-white font-bold py-4 rounded-xl text-center w-full flex justify-center items-center gap-2 shadow-[0_4px_0_rgba(29,78,216,1)]">
                  <PlayCircle size={20} /> Play Course
                </div>
              </div>
            </div>

            {/* Abstract Background Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-100 rounded-full -z-10 opacity-60" />
          </div>

          <div>
             <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-6 px-6 py-2 bg-emerald-50 rounded-full border-2 border-emerald-100 animate-bob">
              <BookOpen size={18} /> Instant Content
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
              AI Generates <span className="text-emerald-600">Full Interactive Courses</span> in Seconds.
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-10">
              Stop scouring unstructured tutorials. Type any skill you need, and our AI instantly synthesizes a gamified course with modules, lessons, and boss-fight quizzes tailored precisely to your level.
            </p>
            
            <ul className="space-y-6 mb-12">
              {[
                "Instant syllabus generation for any niche tool or framework",
                "Built-in knowledge checks and XP tracking per lesson",
                "Level-aware content (Beginner, Intermediate, Advanced)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                  <span className="text-lg font-medium text-slate-700">{item}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CourseGeneratorPromo;
