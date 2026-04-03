import fs from 'fs';

let text = fs.readFileSync('App.tsx', 'utf8');
const regex = /\{\/\* High Conversion Gamified CTA \*\/\}[\s\S]*?(?=<\/main>)/;

const newText = `{/* High Conversion Gamified CTA */}
            <section className="py-32 px-6 bg-slate-50 relative overflow-hidden">
               {/* Hard geometric non-ai elements */}
               <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-rose-200 rounded-[4rem] rotate-12 -z-0 opacity-50 border-4 border-slate-900 shadow-[8px_8px_0_rgba(15,23,42,1)]" />
               <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-amber-200 rounded-[4rem] rotate-45 -z-0 opacity-50 border-4 border-slate-900 shadow-[8px_8px_0_rgba(15,23,42,1)]" />

              <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="bg-white border-4 border-slate-900 rounded-[3rem] p-16 md:p-24 text-center group shadow-[16px_16px_0_rgba(15,23,42,1)] relative overflow-hidden">
                   <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8 relative z-10">
                     Ready to <span className="text-rose-500">Level Up</span>?
                   </h2>
                   <p className="text-slate-700 text-xl font-bold max-w-2xl mx-auto mb-12 relative z-10">
                     Join thousands of users building their careers step-by-step. Get your roadmap, earn XP, and land the job.
                   </p>
                   <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                      <button
                        onClick={() => navigate('/signup')}
                        className="bg-emerald-400 text-slate-900 border-4 border-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-wide shadow-[0_8px_0_rgba(15,23,42,1)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-[8px] transition-all flex justify-center items-center gap-2"
                      >
                        Start Playing For Free
                      </button>
                   </div>
                </div>
              </div>
            </section>
          `;

text = text.replace(regex, newText);
fs.writeFileSync('App.tsx', text);
