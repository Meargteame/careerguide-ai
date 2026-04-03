import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Map as MapIcon, GraduationCap, Box, Sparkles } from 'lucide-react';
import { getCareerSuggestion } from '../services/geminiService';
import { CareerSuggestion } from '../types';

const CareerExplorer: React.FC = () => {
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareerSuggestion | null>(null);

  const handleExplore = async () => {
    if (!interest.trim()) return;
    setLoading(true);
    const suggestion = await getCareerSuggestion(interest);
    setResult(suggestion);
    setLoading(false);
  };

  return (
    <section id="explore" className="py-32 bg-amber-400 relative overflow-hidden">
      {/* Decorative dot pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-widest mb-8 px-6 py-2 bg-white rounded-full border-4 border-slate-900 shadow-[4px_4px_0_rgba(15,23,42,1)]">
               <Sparkles size={18} /> Career Idea Generator
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] mb-8">
               Not sure what <br/> <span className="text-white drop-shadow-[2px_4px_0_rgba(15,23,42,1)]">you want to play?</span>
            </h2>
            <p className="text-slate-900 text-xl font-bold mb-12 max-w-xl leading-relaxed">
              Tell us what you enjoy doing, what you're good at, or even just your hobbies. Our AI will suggest the perfect tech role for you, no blue required.
            </p>

            <div className="relative group max-w-2xl">
              <div className="relative bg-white border-4 border-slate-900 rounded-[2rem] p-2 flex flex-col sm:flex-row items-center shadow-[8px_8px_0_rgba(15,23,42,1)]">
                <div className="pl-4 hidden sm:block text-slate-400">
                  <Search size={28} />
                </div>
                <input 
                  type="text" 
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="I love designing and writing logic..."
                  className="flex-1 bg-transparent px-4 py-4 sm:py-6 outline-none text-slate-800 placeholder:text-slate-400 font-black text-lg w-full text-center sm:text-left"
                  onKeyPress={(e) => e.key === 'Enter' && handleExplore()}
                />
                <button 
                  onClick={handleExplore}
                  disabled={loading}
                  className="w-full sm:w-auto bg-rose-500 text-white border-4 border-slate-900 px-8 py-4 sm:py-6 rounded-[1.5rem] font-black uppercase tracking-wide transition-all disabled:opacity-50 shadow-[0_6px_0_rgba(15,23,42,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <div className="flex items-center gap-2">Discover <ArrowRight size={20} /></div>}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full min-h-[500px] flex items-center justify-center">
            {result ? (
              <div className="w-full bg-white border-4 border-slate-900 p-10 sm:p-12 rounded-[2.5rem] shadow-[12px_12px_0_rgba(15,23,42,1)] relative overflow-hidden group">
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-400 border-4 border-slate-900 px-5 py-2 rounded-full font-black text-slate-900 uppercase tracking-widest mb-6">
                      Perfect Match
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight">{result.career}</h3>
                    
                    <div className="space-y-8">
                      <div className="bg-slate-100 p-6 rounded-2xl border-4 border-slate-900">
                        <p className="text-lg text-slate-800 leading-relaxed font-bold">
                          "{result.reason}"
                        </p>
                      </div>

                      <div>
                        <span className="text-sm font-black text-slate-500 uppercase tracking-widest block mb-4">Core Skills Needed</span>
                        <div className="flex flex-wrap gap-3">
                          {result.topSkills.map((skill, i) => (
                            <div key={i} className="bg-white border-4 border-slate-900 px-6 py-3 rounded-xl shadow-[4px_4px_0_rgba(15,23,42,1)]">
                              <span className="font-black text-slate-900">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full mt-4 bg-emerald-400 border-4 border-slate-900 text-slate-900 py-5 rounded-[1.5rem] font-black uppercase tracking-wide text-lg transition-all shadow-[0_6px_0_rgba(15,23,42,1)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none flex items-center justify-center gap-3">
                         Build Your Full Roadmap <MapIcon size={20} />
                      </button>
                    </div>
                  </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[500px] bg-amber-300 border-4 border-slate-900 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 shadow-[12px_12px_0_rgba(15,23,42,1)]">
                 <div className="w-32 h-32 bg-white border-4 border-slate-900 shadow-[6px_6px_0_rgba(15,23,42,1)] rounded-full flex items-center justify-center mb-8 animate-bob">
                    <Box size={48} className="text-slate-900" />
                 </div>
                 <h4 className="text-slate-900 font-black text-3xl mb-4">Ready to generate.</h4>
                 <p className="text-amber-900 text-xl font-bold max-w-sm">Enter your interests on the left to discover.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CareerExplorer;
