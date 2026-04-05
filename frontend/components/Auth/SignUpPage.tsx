import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, Rocket, User as UserIcon } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface SignUpPageProps {
  onNavigate: (view: 'home' | 'login' | 'onboarding') => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) throw signUpError;
      
      if (data.session) {
        onNavigate('onboarding');
      } else {
        setError('Please check your email to confirm your account.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative blobs */}
      <div className="absolute top-[10%] right-[-5%] w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-emerald-300/30 rounded-full mix-blend-multiply blur-3xl animate-blob pointer-events-none animation-delay-2000" />

      <button 
        onClick={() => onNavigate('home')}
        className="absolute top-8 left-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm transition-all hover:scale-105 hover:shadow-md"
      >
        <ArrowLeft size={18} /> Back to Game
      </button>

      <div className="w-full max-w-md bg-white border-2 border-slate-100 rounded-[2.5rem] p-10 shadow-xl relative z-10 animate-slide-up">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_0_rgba(29,78,216,1)] -rotate-3 hover:translate-y-[-2px] transition-all">
             <Rocket size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Create Player</h2>
          <p className="text-slate-500 font-medium">Start your tech journey free</p>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
             <span className="w-2 h-2 bg-amber-500 rounded-full" /> {error}
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white text-slate-900 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 transition-colors font-medium outline-none"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
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
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-[0_6px_0_rgba(29,78,216,1)] hover:shadow-[0_4px_0_rgba(29,78,216,1)] active:shadow-none active:translate-y-[6px] disabled:opacity-70 disabled:transform-none disabled:shadow-[0_6px_0_rgba(29,78,216,1)] flex justify-center items-center mt-6"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Free Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-medium">
          Already playing?{' '}
          <button onClick={() => onNavigate('login')} className="text-blue-600 font-bold hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
