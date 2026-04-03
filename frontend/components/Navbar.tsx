import React, { useState, useEffect } from 'react';
import { Menu, GraduationCap, Zap, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'home' | 'login' | 'signup') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 md:px-8 py-4 pointer-events-none">
      <nav className={`w-full max-w-[1440px] flex items-center justify-between pointer-events-auto transition-all duration-300 ${isScrolled ? 'px-6 py-3 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]' : 'py-2'}`}>
        
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)] group-hover:scale-105 group-hover:-rotate-3 transition-transform">
            <GraduationCap size={26} strokeWidth={2.5} />
          </div>
          <span className="text-slate-900 font-display font-black text-2xl tracking-tight">Career<span className="text-blue-600">Guide</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-2 py-1.5 shadow-sm">
          {[
            { label: 'The Problem', href: '#how-it-works' },
            { label: 'Features', href: '#features' },
            { label: 'Explore Careers', href: '#explore' },
          ].map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-white hover:shadow-sm"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => onNavigate('login')}
            className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate('signup')}
            className="group bg-blue-600 text-white px-7 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 shadow-[0_6px_0_rgba(29,78,216,1)] hover:shadow-[0_4px_0_rgba(29,78,216,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px]"
          >
            Start Playing <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-900 bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-colors">
          <Menu size={20} />
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
