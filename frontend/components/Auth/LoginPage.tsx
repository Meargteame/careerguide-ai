import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, PlayCircle } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface LoginPageProps {
  onNavigate: (view: 'home' | 'signup') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      // On success, App.tsx handles auth state change and routing
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: 'https://careerguide-phi.vercel.app/dashboard'
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply blur-3xl animate-blob pointer-events-none animation-delay-2000" />
      
      <button 
        onClick={() => onNavigate('home')}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm transition-all hover:scale-105 hover:shadow-md"
      >
        <ArrowLeft size={18} /> Back to Game
      </button>

      <div className="w-full max-w-md bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-xl relative z-10 animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_rgba(29,78,216,1)] rotate-3">
             <PlayCircle size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium">Continue your career journey</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
             <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> {error}
          </div>
        )}

        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:translate-y-1 mb-6 group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
          Continue with Google
        </button>

        <div className="relative flex items-center py-4 mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">or sign in with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 transition-colors font-medium outline-none"
                placeholder="player@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-slate-700">Password</label>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white text-slate-900 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-colors font-medium outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-[0_6px_0_rgba(29,78,216,1)] hover:shadow-[0_4px_0_rgba(29,78,216,1)] active:shadow-none active:translate-y-[6px] disabled:opacity-70 disabled:transform-none disabled:shadow-[0_6px_0_rgba(29,78,216,1)] flex justify-center items-center mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Login to Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          New player?{' '}
          <button onClick={() => onNavigate('signup')} className="text-blue-600 font-bold hover:underline">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
