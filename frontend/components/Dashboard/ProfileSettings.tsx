
import React from 'react';
import { 
  Volume2, 
  Moon, 
  Accessibility, 
  Mail, 
  Bell, 
  CreditCard, 
  Lock, 
  LogOut,
  ChevronRight,
  User as UserIcon,
  Shield,
  Palette
} from 'lucide-react';
import { User } from '../../types';

interface ProfileSettingsProps {
  user: User;
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onLogout }) => {
  const ToggleSwitch = ({ active }: { active?: boolean }) => (
    <div className={`w-16 h-10 rounded-2xl p-1.5 transition-colors cursor-pointer border-2 shadow-inner flex items-center ${active ? 'bg-emerald-500 border-emerald-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}>
      <div className={`w-6 h-6 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="animate-reveal max-w-4xl mx-auto space-y-12 pb-20">
      <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800">
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Controls</p>
        <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">Settings</h1>
      </header>

      {/* Preferences Section */}
      <section className="space-y-6">
        <h3 className="text-slate-800 dark:text-slate-300 font-display font-black text-2xl uppercase tracking-wider flex items-center gap-3">
          <Palette className="text-blue-500" strokeWidth={3} /> Look & Feel
        </h3>
        <div className="space-y-4">
          {[
            { label: "Theme", icon: <Palette size={24} strokeWidth={2.5} />, active: true, detail: "Auto", color: "text-blue-500", bg: "bg-blue-100" },
            { label: "Sounds", icon: <Volume2 size={24} strokeWidth={2.5} />, active: true, color: "text-amber-500", bg: "bg-amber-100" },
            { label: "Notifications", icon: <Bell size={24} strokeWidth={2.5} />, active: true, color: "text-rose-500", bg: "bg-rose-100" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 ${item.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center ${item.color} border-2 border-transparent group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm`}>
                   {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">{item.label}</h4>
                  {item.detail && <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">{item.detail}</p>}
                </div>
              </div>
              <ToggleSwitch active={item.active} />
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="space-y-6">
        <h3 className="text-slate-800 dark:text-slate-300 font-display font-black text-2xl uppercase tracking-wider flex items-center gap-3 mt-12">
           <Shield className="text-emerald-500" strokeWidth={3} /> Security
        </h3>
        <div className="space-y-4">
          {[
            { label: "Email", icon: <Mail size={24} strokeWidth={2.5} />, detail: user.email, color: "text-indigo-500", bg: "bg-indigo-100" },
            { label: "User ID", icon: <Shield size={24} strokeWidth={2.5} />, detail: `ID: ${user.id.substring(0, 8)}...`, color: "text-slate-500", bg: "bg-slate-200" },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[6px] border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_8px_0_rgba(226,232,240,1)] transition-all group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 ${item.bg} dark:bg-slate-800 rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                   {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800 dark:text-white mb-1">{item.label}</h4>
                  {item.detail && <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">{item.detail}</p>}
                </div>
              </div>
              <button className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-all border-2 border-slate-200 shadow-sm active:translate-y-[2px] active:shadow-none">
                Update
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-12 mt-12 border-t-4 border-slate-100 dark:border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full bg-rose-500 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[13px] shadow-[0_8px_0_rgba(225,29,72,1)] hover:bg-rose-600 hover:translate-y-[2px] hover:shadow-[0_6px_0_rgba(225,29,72,1)] active:translate-y-[8px] active:shadow-[0_0px_0_rgba(225,29,72,1)] transition-all flex items-center justify-center gap-3 border-2 border-rose-600 group"
        >
           <LogOut size={20} strokeWidth={3} className="group-hover:-translate-x-1 group-hover:scale-110 transition-transform" /> Save & Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
