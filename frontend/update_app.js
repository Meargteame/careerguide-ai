const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

const s1 = `            {/* Clean abstract shapes instead of AI glowing blur blobs */}
               <div className="absolute top-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-blue-100 rounded-[4rem] rotate-12 -z-0 opacity-50" />
               <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-amber-100 rounded-full -z-0 opacity-50" />
               
              <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-16 md:p-24 text-center group shadow-xl">
                   <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                     Ready to <span className="text-blue-600">Level Up</span>?
                   </h2>
                   <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto mb-12">
                     Join thousands of users building their careers step-by-step. Get your roadmap, earn XP, and land the job.
                   </p>
                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={() => navigate('/signup')}
                        className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-wide shadow-[0_8px_0_rgba(37,99,235,0.3)] hover:shadow-[0_4px_0_rgba(37,99,235,0.3)] hover:translate-y-1 active:shadow-none active:translate-y-2 transition-all flex justify-center items-center gap-2"
                      >
                        Start Playing For Free
                      </button>
                   </div>
                </div>
              </div>`;

const s2 = `            {/* High Conversion Gamified CTA */}
            <section className="py-32 px-6 bg-slate-100 relative overflow-hidden border-t-8 border-slate-200">
               {/* Extremely flat geometric shapes in background */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300 rounded-full -translate-y-1/2 translate-x-1/3 border-8 border-slate-900 shadow-[8px_8px_0_rgba(15,23,42,1)]" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-2xl rotate-12 translate-y-1/3 -translate-x-1/4 border-8 border-slate-900 shadow-[8px_8px_0_rgba(15,23,42,1)]" />
               
              <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                <div className="bg-white border-8 border-slate-900 rounded-[3rem] p-16 md:p-24 text-center group shadow-[16px_16px_0_rgba(15,23,42,1)]">
                   <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                     Ready to <span className="text-rose-500">Level Up?</span>
                   </h2>
                   <p className="text-slate-700 text-xl font-bold max-w-2xl mx-auto mb-12">
                     Join thousands of users building their careers step-by-step. Get your roadmap, earn XP, and land the job. No glowing AI blobs here.
                   </p>
                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={() => navigate('/signup')}
                        className="bg-emerald-400 border-4 border-slate-900 text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-wide shadow-[0_8px_0_rgba(15,23,42,1)] hover:translate-y-[4px] hover:shadow-[0_4px_0_rgba(15,23,42,1)] active:shadow-none active:translate-y-[8px] transition-all flex justify-center items-center gap-2 text-xl"
                      >
                        Start Playing For Free
                      </button>
                   </div>
                </div>
              </div>`;

if (content.includes(s1)) {
    content = content.replace(s1, s2);
    fs.writeFileSync('App.tsx', content);
    console.log("Updated App.tsx successfully");
} else {
    console.log("Could not exact match s1 in App.tsx. Will search loosely.");
    
    // Instead of precise matching, just regex replace the CTA section
    const ctaRegex = /\{\/\* High Conversion Gamified CTA \*\/\}.*?(?=\s*<\/main>)/s;
    if (ctaRegex.test(content)) {
        content = content.replace(ctaRegex, s2);
        fs.writeFileSync('App.tsx', content);
        console.log("Updated via Regex.");
    } else {
        console.log("Regex failed too.");
    }
}
