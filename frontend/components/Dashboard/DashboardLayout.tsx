import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  LineChart, 
  Settings as SettingsIcon, 
  LogOut, 
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Users,
  UserCircle,
  Sun,
  Moon,
  ShieldCheck,
  Menu,
  Flame,
  Gem,
} from 'lucide-react';import DashboardHome from './DashboardHome';
import RoadmapGenerator from './RoadmapGenerator';
import ProgressView from './ProgressView';
import MarketInsights from './MarketInsights';
import ProfileSettings from './ProfileSettings';
import LibraryView from './LibraryView';
import AssessmentView from './AssessmentView';
import CommunityView from './CommunityView';
import PortfolioView from './PortfolioView';
import AdminManagement from './AdminManagement';
import { User } from '../../types';
import { useNotifications } from './useNotifications';
import NotificationToast from './NotificationToast';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export type Tab = 'overview' | 'roadmaps' | 'progress' | 'careers' | 'courses' | 'assessments' | 'community' | 'profile' | 'settings' | 'admin';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, theme, onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedCareer, setSelectedCareer] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { notifications, notify, dismiss } = useNotifications();

  const [liveXp, setLiveXp] = useState(user.xp);
  
  useEffect(() => {
     setLiveXp(user.xp);
  }, [user.xp]);

  useEffect(() => {
     const handleXpEvent = (e: any) => setLiveXp(e.detail);
     window.addEventListener('xp-updated', handleXpEvent);
     return () => window.removeEventListener('xp-updated', handleXpEvent);
  }, []);

  useEffect(() => {
     if (activeTab !== 'roadmaps') {
        setSelectedCareer(undefined);
     }
  }, [activeTab]);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'roadmaps', label: 'AI Generator', icon: MapIcon },
    { id: 'careers', label: 'Jobs', icon: ShieldCheck },
    { id: 'community', label: 'Chat', icon: Users },
    { id: 'progress', label: 'My Stats', icon: LineChart },
    { id: 'assessments', label: 'Quizzes', icon: ClipboardCheck },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (user.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <DashboardHome user={user} onNavigateToRoadmaps={() => setActiveTab('roadmaps')} onNavigateToAssessments={() => setActiveTab('assessments')} onOpenCourse={() => setActiveTab('courses')} />;
      case 'roadmaps': return <RoadmapGenerator userId={user.id} initialQuery={selectedCareer} />;
      case 'progress': return <ProgressView userId={user.id} />;
      case 'courses': return <LibraryView userId={user.id} />;
      case 'assessments': return <AssessmentView userId={user.id} />;
      case 'careers': return <MarketInsights onExploreCareer={(c) => { setSelectedCareer(c); setActiveTab('roadmaps'); }} />;

      case 'community': return <CommunityView />;
      case 'profile': return <PortfolioView user={user} />;
      case 'settings': return <ProfileSettings user={user} onLogout={onLogout} theme={theme} onToggleTheme={onToggleTheme} />;
      case 'admin': return <AdminManagement />;
      default: return <DashboardHome user={user} onNavigateToRoadmaps={() => setActiveTab('roadmaps')} onNavigateToAssessments={() => setActiveTab('assessments')} onOpenCourse={() => setActiveTab('courses')} />;
    }
  };

  return (
    <div className="flex bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300 relative overflow-hidden">
      <NotificationToast notifications={notifications} onDismiss={dismiss} />
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-over on mobile */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] z-50
        bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-800 
        flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_4px_0_rgba(30,58,138,1)] rotate-3 group-hover:rotate-6 transition-transform">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <span className="text-slate-900 dark:text-white font-display font-black text-2xl tracking-tight">Meridian</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as Tab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] transition-all duration-200 group font-bold
                  ${isActive
                    ? 'bg-blue-500 text-white shadow-[0_4px_0_rgba(37,99,235,1)] -translate-y-[2px]'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 border-2 border-transparent hover:border-slate-200 dark:hover:bg-slate-800 dark:hover:border-slate-700 hover:text-blue-600'
                  }
                `}
              >
                <Icon size={22} strokeWidth={2.5} className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-blue-600'}`} />
                <span className={`text-[15px] ${isActive ? 'text-white font-black' : 'font-bold'}`}>
                  {item.label}
                </span>

                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions (User & Theme) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <div className={`w-10 h-6 rounded-full border-2 transition-colors flex items-center px-0.5 ${theme === 'dark' ? 'bg-blue-500 border-blue-600' : 'bg-slate-200 border-slate-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-3 px-2 py-1">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-brand flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-950">
               {user.name.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</div>
               <div className="text-xs text-slate-400 truncate capitalize">{user.role}</div>
             </div>
             <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                title="Logout"
             >
                <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header (Only visible on small screens) */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <Menu size={24} />
            </button>
            <span className="font-display font-bold text-lg text-slate-800 dark:text-white truncate">
               {menuItems.find(i => i.id === activeTab)?.label}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary to-brand flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-900">
             {user.name.charAt(0)}
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="font-display font-bold text-2xl text-slate-800 dark:text-white">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-500 fill-orange-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{user.streak} Days</span>
              </div>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-2">
                <Gem size={18} className="text-blue-500 fill-blue-500" />
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{liveXp} XP</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Scroller */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-black/20 p-4 md:p-8">
          <div className="w-full xl:max-w-none mx-auto space-y-8 pb-20">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
