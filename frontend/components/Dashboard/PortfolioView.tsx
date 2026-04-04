
import React, { useEffect, useState, useRef } from 'react';
import { 
  Share2, 
  Award, 
  Edit2,
  Trophy,
  Clock,
  Zap,
  Flame,
  Scroll,
  Check,
  X,
  Loader2,
  Camera,
} from 'lucide-react';
import { User } from '../../types';
import { getStudentStats } from '../../services/courseService';
import { supabase } from '../../services/supabaseClient';
import { useNotifications } from './useNotifications';
import NotificationToast from './NotificationToast';

interface PortfolioViewProps {
  user?: User;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ user }) => {
  const [stats, setStats] = useState({ coursesEnrolled: 0, completedLessons: 0, totalXP: 0 });
  const { notifications, notify, dismiss } = useNotifications();

  // ── Avatar state ─────────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Name edit state ───────────────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name || 'Student');
  const [nameSaving, setNameSaving] = useState(false);

  const userName = nameValue || 'Student';

  useEffect(() => {
    if (user?.id) {
      getStudentStats(user.id).then(setStats);
      // Load existing avatar from profiles table
      supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (error) console.error('Profile fetch error:', error);
          if (data?.avatar_url) setAvatarUrl(data.avatar_url + '?t=' + Date.now());
          if (data?.full_name) setNameValue(data.full_name);
        });
    }
  }, [user]);

  // ── Upload avatar ─────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 2 * 1024 * 1024) {
      notify('Image must be under 2MB', 'error'); return;
    }

    setAvatarUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      // upsert so it works whether the row exists or not
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl }, { onConflict: 'id' });

      if (dbError) {
        console.error('DB save error:', dbError);
        throw dbError;
      }

      setAvatarUrl(publicUrl + '?t=' + Date.now());
      notify('Profile photo updated', 'success');
    } catch (err: any) {
      notify(err.message || 'Upload failed', 'error');
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Save name ─────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!nameValue.trim() || !user?.id) return;
    setNameSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: nameValue.trim() })
        .eq('id', user.id);
      if (error) throw error;
      setEditingName(false);
      notify('Name updated', 'success');
    } catch (err: any) {
      notify(err.message || 'Failed to update name', 'error');
    } finally {
      setNameSaving(false);
    }
  };

  const handleCancelName = () => {
    setNameValue(user?.name || 'Student');
    setEditingName(false);
  };

  return (
    <>
      <NotificationToast notifications={notifications} onDismiss={dismiss} />

      <div className="animate-reveal space-y-12 pb-20">
        <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800 mb-12">
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Identity</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">My Profile</h1>
        </header>

        {/* Profile Header/Banner — UI unchanged */}
        <div className="relative rounded-[3rem] overflow-hidden bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 shadow-none">
          <div className="h-64 bg-emerald-500 dark:bg-emerald-600 relative overflow-hidden border-b-4 border-emerald-600 dark:border-emerald-700">
            <div className="absolute inset-0 opacity-20 flex justify-around p-10 pointer-events-none">
              <Flame size={140} strokeWidth={2} className="text-white rotate-12 drop-shadow-md" />
              <Trophy size={180} strokeWidth={2} className="text-white -rotate-12 drop-shadow-md" />
            </div>
            <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-20%] right-[10%] w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
          </div>

          <div className="px-8 md:px-12 pb-12">
            {/* Avatar row — overlaps banner */}
            <div className="flex items-end justify-between -mt-20 relative z-10 mb-6">
              <div className="relative group shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] bg-indigo-100 border-[6px] border-white dark:border-slate-900 flex items-center justify-center overflow-hidden shadow-[0_8px_0_rgba(203,213,225,1)] dark:shadow-[0_8px_0_rgba(15,23,42,1)] group-hover:-translate-y-2 transition-transform">
                  {avatarUploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                      <Loader2 size={36} className="animate-spin text-blue-500" />
                    </div>
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`} alt="Avatar" className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -right-2 bottom-3 w-10 h-10 bg-blue-500 text-white rounded-[0.875rem] flex items-center justify-center shadow-[0_4px_0_rgba(37,99,235,1)] hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[0_6px_0_rgba(37,99,235,1)] active:translate-y-[4px] active:shadow-none transition-all border-2 border-blue-400 disabled:opacity-60"
                >
                  {avatarUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={17} strokeWidth={3} />}
                </button>
              </div>

              {/* Action buttons top-right */}
              <div className="flex gap-3 pb-1">
                <button className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-1 active:translate-y-[2px] active:shadow-none">
                  <Share2 size={16} strokeWidth={3} /> Share
                </button>
                <button
                  onClick={() => setEditingName(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all bg-emerald-500 text-white shadow-[0_4px_0_rgba(16,185,129,1)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(16,185,129,1)] active:translate-y-[4px] active:shadow-none"
                >
                  <Edit2 size={16} strokeWidth={3} /> Edit
                </button>
              </div>
            </div>

            {/* Name row — name left, stats right */}
            <div className="flex items-start justify-between gap-6 flex-wrap">

              {/* Left: handle + name + edit */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className="inline-flex items-center gap-2 text-slate-400 dark:text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] w-fit">
                  @{user?.email ? user.email.split('@')[0].toLowerCase() : 'user'}
                </div>

                {editingName ? (
                  <div className="flex items-center gap-3">
                    <input
                      autoFocus
                      value={nameValue}
                      onChange={e => setNameValue(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelName(); }}
                      className="text-3xl md:text-4xl font-display font-black text-slate-800 dark:text-white bg-transparent border-b-4 border-blue-500 outline-none leading-tight capitalize min-w-0 w-64"
                    />
                    <button onClick={handleSaveName} disabled={nameSaving} className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 hover:bg-emerald-600 transition-all disabled:opacity-50">
                      {nameSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                    </button>
                    <button onClick={handleCancelName} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <X size={16} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-slate-800 dark:text-white leading-tight capitalize">
                      {userName}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:text-blue-500 transition-all shrink-0"
                    >
                      <Edit2 size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest capitalize">{user?.role || 'Student'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* Right: XP + quests stats */}
              <div className="flex flex-col gap-3 items-end">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30 px-5 py-3 rounded-2xl">
                    <span className="text-xl font-black text-amber-600 dark:text-amber-400 leading-none">{stats.totalXP}</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-1">Total XP</span>
                  </div>
                  <div className="flex flex-col items-center bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/30 px-5 py-3 rounded-2xl">
                    <span className="text-xl font-black text-rose-600 dark:text-rose-400 leading-none">{stats.coursesEnrolled}</span>
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Quests</span>
                  </div>
                  <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-200 dark:border-blue-500/30 px-5 py-3 rounded-2xl">
                    <span className="text-xl font-black text-blue-600 dark:text-blue-400 leading-none">{stats.completedLessons}</span>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Lessons</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom grid — completely unchanged */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-12">
            <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all">
              <h3 className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px] mb-8 flex items-center gap-3">
                <Scroll size={18} className="text-slate-400" /> Lore
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-lg font-bold leading-relaxed italic border-l-4 border-blue-500 pl-6 mb-10 bg-blue-50 dark:bg-blue-900/10 py-4 rounded-r-2xl">
                "This hero is currently out on an adventure crafting their origin story."
              </p>
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 inline-flex">
                <Clock size={16} strokeWidth={3} className="text-slate-400" /> Member since Feb '26
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            <div className="bg-amber-400 border-4 border-amber-500 dark:border-amber-600 p-10 rounded-[3rem] shadow-[0_8px_0_rgba(217,119,6,1)] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(217,119,6,1)] transition-all flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div className="flex items-center gap-4 text-amber-900 mb-6 relative z-10">
                <div className="w-16 h-16 bg-white/40 rounded-[1.5rem] flex items-center justify-center border-2 border-white/50 shadow-inner group-hover:rotate-12 transition-transform">
                  <Award size={32} strokeWidth={2.5} className="text-amber-800" />
                </div>
                <span className="text-[13px] font-black uppercase tracking-widest bg-amber-500 text-amber-900 px-4 py-2 rounded-xl shadow-inner border border-amber-600">Guild Rank</span>
              </div>
              <h3 className="text-5xl font-display font-black text-slate-900 uppercase tracking-widest drop-shadow-sm relative z-10">Bronze</h3>
            </div>

            <div className="bg-rose-500 border-4 border-rose-600 dark:border-rose-700 p-10 rounded-[3rem] shadow-[0_8px_0_rgba(225,29,72,1)] hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(225,29,72,1)] transition-all flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div className="flex items-center gap-4 text-white mb-6 relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center border-2 border-white/30 shadow-inner group-hover:-rotate-12 transition-transform">
                  <Flame size={32} strokeWidth={2.5} className="text-white fill-white" />
                </div>
                <span className="text-[13px] font-black uppercase tracking-widest bg-rose-600 text-white px-4 py-2 rounded-xl shadow-inner border border-rose-700">Days Active</span>
              </div>
              <h3 className="text-6xl font-display font-black text-white relative z-10 drop-shadow-md">1</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioView;
