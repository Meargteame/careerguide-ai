import React from 'react';
import { GraduationCap, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t-4 border-slate-200 text-slate-500 py-16 relative overflow-hidden">
      
      {/* Decorative solid top bar instead of glowing gradient */}
      <div className="absolute top-0 right-0 w-full h-2 bg-blue-500" />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white rotate-3 shadow-[0_4px_0_rgba(29,78,216,1)]">
                <GraduationCap size={22} strokeWidth={2.5} />
              </div>
              <span className="text-slate-900 font-display font-black text-2xl tracking-tight">Career<span className="text-blue-600">Guide</span></span>
            </div>
            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-sm mb-8">
              Turning the chaotic tech journey into an interactive, gamified roadmap that actually gets you hired.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all hover:-translate-y-1 shadow-[0_4px_0_rgba(226,232,240,1)] hover:shadow-[0_4px_0_rgba(59,130,246,1)]">
                <Twitter size={20} className="fill-current" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-800 hover:text-slate-800 transition-all hover:-translate-y-1 shadow-[0_4px_0_rgba(226,232,240,1)] hover:shadow-[0_4px_0_rgba(30,41,59,1)]">
                <Github size={20} className="fill-current" />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-700 hover:text-blue-700 transition-all hover:-translate-y-1 shadow-[0_4px_0_rgba(226,232,240,1)] hover:shadow-[0_4px_0_rgba(29,78,216,1)]">
                <Linkedin size={20} className="fill-current" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-black mb-6 text-lg tracking-wide uppercase">The Game</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">How it Works</a></li>
              <li><a href="#explore" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">Career Explorer</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">PVP Leaderboards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-slate-900 font-black mb-6 text-lg tracking-wide uppercase">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-500 hover:text-slate-900 font-bold transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold text-slate-400">© {new Date().getFullYear()} Meridian. All rights reserved.</p>
          <div className="flex items-center gap-2 font-bold bg-white border-2 border-slate-200 px-5 py-3 rounded-full shadow-sm text-slate-500">
            Built with <Heart className="text-rose-500 mx-1 fill-rose-500" size={18} /> for future devs
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
