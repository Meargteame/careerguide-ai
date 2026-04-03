
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
    <div className={`w-14 h-8 rounded-full p-1 transition-colors cursor-pointer ${active ? 'bg-secondary' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  );

  return (
    <div className="animate-reveal max-w-4xl mx-auto space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-display font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">Settings</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Change your settings</p>
      </header>

      {/* Preferences Section */}
      <section className="space-y-6">
        <h3 className="text-slate-400 font-display font-bold text-lg uppercase tracking-widest">Look & Feel</h3>
        <div className="space-y-4">
          {[
            { label: "Theme", icon: <Palette size={20} />, active: true, detail: "Auto" },
            { label: "Sounds", icon: <Volume2 size={20} />, active: true },
            { label: "Notifications", icon: <Bell size={20} />, active: true },
          ].map((item, i) => (
            <div key={i} className="dashboard-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-between hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                   {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-primary dark:text-white">{item.label}</h4>
                  {item.detail && <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.detail}</p>}
                </div>
              </div>
              <ToggleSwitch active={item.active} />
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="space-y-6">
        <h3 className="text-slate-400 font-display font-bold text-lg uppercase tracking-widest">Security</h3>
        <div className="space-y-4">
          {[
            { label: "Email", icon: <Mail size={20} />, detail: user.email },
            { label: "User ID", icon: <Shield size={20} />, detail: `ID: ${user.id.substring(0, 8)}...` },
          ].map((item, i) => (
            <div key={i} className="dashboard-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-between hover:border-slate-200 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                   {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-primary dark:text-white">{item.label}</h4>
                  {item.detail && <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.detail}</p>}
                </div>
              </div>
              <button className="bg-slate-100 dark:bg-slate-800 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all">
                Update
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full bg-red-50 dark:bg-red-950/20 text-red-500 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 border border-red-100 dark:border-red-900/30"
        >
           <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
