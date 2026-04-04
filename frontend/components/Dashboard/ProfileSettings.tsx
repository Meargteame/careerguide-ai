
import React, { useState } from 'react';
import { 
  Volume2, 
  Moon, 
  Sun,
  Mail, 
  Bell, 
  Lock, 
  LogOut,
  Shield,
  Palette,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { User } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useNotifications } from './useNotifications';
import NotificationToast from './NotificationToast';

interface ProfileSettingsProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  const { notifications, notify, dismiss } = useNotifications();

  // ── Preferences state ────────────────────────────────────────────────────
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('pref_sound') !== 'false');
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('pref_notif') !== 'false');
  const [emailNotif, setEmailNotif]     = useState(() => localStorage.getItem('pref_email_notif') !== 'false');

  // ── Email change ─────────────────────────────────────────────────────────
  const [newEmail, setNewEmail]         = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);

  // ── Password change ──────────────────────────────────────────────────────
  const [newPassword, setNewPassword]       = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw]                 = useState(false);
  const [pwLoading, setPwLoading]           = useState(false);
  const [showPwInput, setShowPwInput]       = useState(false);

  // ── Toggle handlers ──────────────────────────────────────────────────────
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('pref_sound', String(next));
    notify(next ? 'Sounds enabled' : 'Sounds disabled', 'info');
  };

  const toggleNotif = () => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    localStorage.setItem('pref_notif', String(next));
    if (next && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') notify('Browser notifications enabled', 'success');
        else notify('Browser permission denied — in-app notifications still active', 'info');
      });
    } else {
      notify('Notifications disabled', 'info');
    }
  };

  const toggleEmailNotif = () => {
    const next = !emailNotif;
    setEmailNotif(next);
    localStorage.setItem('pref_email_notif', String(next));
    notify(next ? 'Email notifications enabled' : 'Email notifications disabled', 'info');
  };

  // ── Update email ─────────────────────────────────────────────────────────
  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      notify('Please enter a valid email address', 'error'); return;
    }
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      notify('Confirmation sent — check your new inbox', 'success');
      setNewEmail(''); setShowEmailInput(false);
    } catch (err: any) {
      notify(err.message || 'Failed to update email', 'error');
    } finally { setEmailLoading(false); }
  };

  // ── Update password ──────────────────────────────────────────────────────
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      notify('Password must be at least 6 characters', 'error'); return;
    }
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match', 'error'); return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      notify('Password updated successfully', 'success');
      setNewPassword(''); setConfirmPassword(''); setShowPwInput(false);
    } catch (err: any) {
      notify(err.message || 'Failed to update password', 'error');
    } finally { setPwLoading(false); }
  };

  // ── Original ToggleSwitch UI ─────────────────────────────────────────────
  const ToggleSwitch = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      className={`w-16 h-10 rounded-2xl p-1.5 transition-colors cursor-pointer border-2 shadow-inner flex items-center ${active ? 'bg-emerald-500 border-emerald-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}
    >
      <div className={`w-6 h-6 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <>
      <NotificationToast notifications={notifications} onDismiss={dismiss} />

      <div className="animate-reveal max-w-4xl mx-auto space-y-12 pb-20">
        <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800">
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Controls</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">Settings</h1>
        </header>

        {/* ── Look & Feel ── */}
        <section className="space-y-6">
          <h3 className="text-slate-800 dark:text-slate-300 font-display font-black text-2xl uppercase tracking-wider flex items-center gap-3">
            <Palette className="text-blue-500" strokeWidth={3} /> Look & Feel
          </h3>
          <div className="space-y-4">
            {/* Theme */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 border-2 border-transparent group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                  <Palette size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Theme</h4>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <ToggleSwitch active={theme === 'dark'} onToggle={onToggleTheme} />
            </div>

            {/* Sounds */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-amber-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-amber-500 border-2 border-transparent group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                  <Volume2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Sounds</h4>
                </div>
              </div>
              <ToggleSwitch active={soundEnabled} onToggle={toggleSound} />
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-rose-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-rose-500 border-2 border-transparent group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                  <Bell size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Notifications</h4>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">In-app &amp; browser</p>
                </div>
              </div>
              <ToggleSwitch active={notifEnabled} onToggle={toggleNotif} />
            </div>

            {/* Email Notifications */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 border-2 border-transparent group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                  <Mail size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Email Notifications</h4>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Weekly summaries</p>
                </div>
              </div>
              <ToggleSwitch active={emailNotif} onToggle={toggleEmailNotif} />
            </div>
          </div>
        </section>

        {/* ── Security ── */}
        <section className="space-y-6">
          <h3 className="text-slate-800 dark:text-slate-300 font-display font-black text-2xl uppercase tracking-wider flex items-center gap-3 mt-12">
            <Shield className="text-emerald-500" strokeWidth={3} /> Security
          </h3>
          <div className="space-y-4">

            {/* Email */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Mail size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Email</h4>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailInput(p => !p)}
                  className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-all border-2 border-slate-200 dark:border-slate-700 shadow-sm active:translate-y-[2px] active:shadow-none"
                >
                  Update
                </button>
              </div>
              {showEmailInput && (
                <div className="mt-5 pt-5 border-t-2 border-slate-100 dark:border-slate-800 flex gap-3 animate-in slide-in-from-top-2 duration-200">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="New email address"
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-indigo-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  />
                  <button
                    onClick={handleUpdateEmail}
                    disabled={emailLoading || !newEmail.trim()}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-[12px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-40 flex items-center gap-2 shadow-[0_4px_0_rgba(79,70,229,0.4)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(79,70,229,0.4)] active:translate-y-[4px] active:shadow-none"
                  >
                    {emailLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    Send
                  </button>
                </div>
              )}
            </div>

            {/* Password */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Lock size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">Password</h4>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPwInput(p => !p)}
                  className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-all border-2 border-slate-200 dark:border-slate-700 shadow-sm active:translate-y-[2px] active:shadow-none"
                >
                  Update
                </button>
              </div>
              {showPwInput && (
                <div className="mt-5 pt-5 border-t-2 border-slate-100 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    <button onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  />
                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                            newPassword.length >= i * 3
                              ? i <= 1 ? 'bg-rose-400' : i <= 2 ? 'bg-amber-400' : i <= 3 ? 'bg-blue-400' : 'bg-emerald-500'
                              : 'bg-slate-100 dark:bg-slate-800'
                          }`} />
                        ))}
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {newPassword.length < 4 ? 'Too short' : newPassword.length < 7 ? 'Weak' : newPassword.length < 10 ? 'Good' : 'Strong'}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleUpdatePassword}
                    disabled={pwLoading || !newPassword || !confirmPassword}
                    className="w-full py-4 rounded-xl bg-emerald-500 text-white text-[12px] font-black uppercase tracking-widest shadow-[0_4px_0_rgba(16,185,129,0.5)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(16,185,129,0.5)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-40 disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {pwLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    Update Password
                  </button>
                </div>
              )}
            </div>

            {/* User ID (read-only, original) */}
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 transition-transform">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">User ID</h4>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">ID: {user.id.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Logout ── */}
        <div className="pt-12 mt-12 border-t-4 border-slate-100 dark:border-slate-800">
          <button
            onClick={onLogout}
            className="w-full bg-rose-500 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[13px] shadow-[0_8px_0_rgba(225,29,72,1)] hover:bg-rose-600 hover:translate-y-[2px] hover:shadow-[0_6px_0_rgba(225,29,72,1)] active:translate-y-[8px] active:shadow-[0_0px_0_rgba(225,29,72,1)] transition-all flex items-center justify-center gap-3 border-2 border-rose-600 group"
          >
            <LogOut size={20} strokeWidth={3} className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform" /> Save & Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
