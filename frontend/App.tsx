import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Features from './components/Features';
import CourseGeneratorPromo from './components/CourseGeneratorPromo';
import CareerExplorer from './components/CareerExplorer';
import Footer from './components/Footer';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import OnboardingPage from './components/Auth/OnboardingPage';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import QuizPage from './components/Dashboard/QuizPage';
import { User } from './types';
import { supabase } from './services/supabaseClient';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        navigate('/'); 
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (sbUser: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      const mappedUser: User = {
        id: sbUser.id,
        name: profile?.full_name || sbUser.email?.split('@')[0] || 'Student',
        email: sbUser.email!,
        role: profile?.role || 'student',
        academicYear: profile?.academic_year || 'Undecided',
        enrolledPaths: [], 
        xp: profile?.xp || 0,
        streak: profile?.streak || 0
      };

      setUser(mappedUser);
      const currentPath = window.location.pathname;
      if (['/', '/login', '/signup'].includes(currentPath)) {
         navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const navigateTo = (newView: 'home' | 'login' | 'signup' | 'onboarding' | 'dashboard') => {
    if (newView === 'home') navigate('/');
    else navigate(`/${newView}`);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold animate-pulse-slow">Loading...</div>;
  }

  const handleOnboardingComplete = (selectedCareer: string) => {
    if (user) {
      setUser({ ...user, enrolledPaths: [selectedCareer], xp: 50 });
    }
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onNavigate={navigateTo} />} />
      <Route path="/signup" element={<SignUpPage onNavigate={navigateTo} />} />
      <Route path="/onboarding" element={<OnboardingPage onComplete={handleOnboardingComplete} />} />
      <Route path="/dashboard" element={
        user ? <DashboardLayout user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} /> : <Navigate to="/login" />
      } />
      <Route path="/quiz/:topic" element={
        user ? <QuizPage /> : <Navigate to="/login" />
      } />
      <Route path="/" element={
        <div className="min-h-screen bg-white transition-colors duration-300">
          <Navbar onNavigate={navigateTo} theme={theme} onToggleTheme={toggleTheme} />
          <main>
            <Hero />
            <ProblemSolution />
            <Features />
            <CourseGeneratorPromo />
            <CareerExplorer />
            
            {/* High Conversion Gamified CTA */}
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
          </main>
          <Footer />
        </div>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
