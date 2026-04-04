import React, { useState, useEffect } from 'react';
import {
  Volume2, Moon, Sun, Mail, Bell, Lock, LogOut,
  Shield, Palette, Eye, EyeOff, CheckCircle2, Loader2, User as UserIcon
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
  const [soundEnabled, setSoundEnabled] = useState(() =>
    localStorage.getItem('pref_sound') !== 'false'
  );
  const [notifEnabled, setNotifEnabled] = useState(() =>
    localStorage.getItem('pref_notif') !== 'false'
  );
  const [emailNotif, setEmailNotif] = useState(() =>
    localStorage.getItem('pref_email_notif') !== 'false'
  );

  // ── Email change state ───────────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // ── Password change state ────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // ── Display name state ───────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(user.name);
  const [nameLoading, setNameLoading] = useState(false);

  // Persist preference toggles to localStorage immediately
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

  // ── Update display name ──────────────────────────────────────────────────
  const handleUpdateName = async () => {
    if (!displayName.trim() || displayName === user.name) return;
    setNameLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: displayName.trim() })
        .eq('id', user.id);
      if (error) throw error;
      notify('Display name updated successfully', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to update name', 'error');
    } finally {
      setNameLoading(false);
    }
  };

  // ── Update email ─────────────────────────────────────────────────────────
  const handleUpdateEmail = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      notify('Please enter a valid email address', 'error');
      return;
    }
    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      notify('Confirmation sent to your new email — check your inbox', 'success');
      setNewEmail('');
    } catch (err: any) {
      notify(err.message || 'Failed to update email', 'error');
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Update password ──────────────────────────────────────────────────────
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      notify('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      notify('Password updated successfully', 'success');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      notify(err.message || 'Failed to update password', 'error');
    } finally {
      setPwLoading(false);
    }
  };

  // ── Reusable toggle switch ───────────────────────────────────────────────
  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full border-2 transition-all duration-300 flex items-center px-1 shrink-0
        ${active ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  // ── Section wrapper ──────────────────────────────────────────────────────
  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <section className="space-y-4">
      <h3 className="flex items-center gap-3 text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider">
        {icon} {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all hover:border-slate-300 dark:hover:border-slate-700">
      {children}
    </div>
  );

  return (
    <>
      <NotificationToast notifications={notifications} onDismiss={dismiss} />

      <div className="animate-reveal max-w-2xl mx-auto space-y-10 pb-20">
        <header className="pb-8 border-b border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Account</p>
          <h1 className="text-4xl font-display font-black text-slate-800 dark:text-white">Settings</h1>
        </header>

        {/* ── Profile ── */}
        <Section title="Profile" icon={<UserIcon size={20} className="text-blue-500" />}>
          <Card>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Display Name</label>
            <div className="flex gap-3">
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-blue-400 transition-all"
              />
              <button
                onClick={handleUpdateName}
                disabled={nameLoading || displayName === user.name}
                className="px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-black hover:bg-blue-700 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {nameLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                Save
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Current: <span className="font-bold text-slate-500 dark:text-slate-400">{user.email}</span></p>
          </Card>
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance" icon={<Palette size={20} className="text-violet-500" />}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                  {theme === 'light' ? <Sun size={18} className="text-violet-500" /> : <Moon size={18} className="text-violet-500" />}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 dark:text-white">Dark Mode</p>
                  <p className="text-[11px] text-slate-400">Currently {theme === 'dark' ? 'on' : 'off'}</p>
                </div>
              </div>
              <Toggle active={theme === 'dark'} onToggle={onToggleTheme} />
            </div>
          </Card>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" icon={<Bell size={20} className="text-rose-500" />}>
          {[
            {
              label: 'In-App Notifications',
              desc: 'Toasts for course completions, XP gains, quiz results',
              icon: <Bell size={18} className="text-rose-500" />,
              bg: 'bg-rose-100 dark:bg-rose-500/20',
              active: notifEnabled,
              onToggle: toggleNotif,
            },
            {
              label: 'Email Notifications',
              desc: 'Weekly progress summaries and new course alerts',
              icon: <Mail size={18} className="text-indigo-500" />,
              bg: 'bg-indigo-100 dark:bg-indigo-500/20',
              active: emailNotif,
              onToggle: toggleEmailNotif,
            },
            {
              label: 'Sound Effects',
              desc: 'Audio feedback for XP gains and quiz answers',
              icon: <Volume2 size={18} className="text-amber-500" />,
              bg: 'bg-amber-100 dark:bg-amber-500/20',
              active: soundEnabled,
              onToggle: toggleSound,
            },
          ].map(item => (
            <Card key={item.label}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{item.label}</p>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                </div>
                <Toggle active={item.active} onToggle={item.onToggle} />
              </div>
            </Card>
          ))}
        </Section>

        {/* ── Security ── */}
        <Section title="Security" icon={<Shield size={20} className="text-emerald-500" />}>
          {/* Change email */}
          <Card>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Change Email</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
              <button
                onClick={handleUpdateEmail}
                disabled={emailLoading || !newEmail.trim()}
                className="px-5 py-3 rounded-xl bg-emerald-600 text-white text-sm font-black hover:bg-emerald-700 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {emailLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                Send
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">A confirmation link will be sent to the new address.</p>
          </Card>

          {/* Change password */}
          <Card>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Change Password</label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
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
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
              {/* Strength indicator */}
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
                  <p className="text-[10px] text-slate-400">
                    {newPassword.length < 4 ? 'Too short' : newPassword.length < 7 ? 'Weak' : newPassword.length < 10 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
              <button
                onClick={handleUpdatePassword}
                disabled={pwLoading || !newPassword || !confirmPassword}
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-black hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {pwLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                Update Password
              </button>
            </div>
          </Card>
        </Section>

        {/* ── Logout ── */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onLogout}
            className="w-full bg-rose-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_6px_0_rgba(225,29,72,0.4)] hover:bg-rose-600 hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(225,29,72,0.4)] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <LogOut size={18} strokeWidth={3} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
