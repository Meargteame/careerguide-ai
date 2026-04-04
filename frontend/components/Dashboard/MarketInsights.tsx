import React, { useState } from 'react';
import { getMoreJobs } from '../../services/geminiService';
import { 
  Users, 
  Smartphone, 
  Globe, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Cloud, 
  Code2, 
  ArrowUpRight, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Briefcase,
  Search,
  Building,
  GraduationCap,
  Clock,
  Star,
  ChevronRight,
  MonitorPlay,
  Bookmark,
  CheckCircle,
  Terminal,
  PenTool,
  Server,
  Layers,
  Loader2
} from 'lucide-react';

const ICONS: Record<string, any> = {
  Smartphone, Globe, ShieldAlert, Database, Cpu, Cloud, Code2, 
  TrendingUp, MonitorPlay, Terminal, PenTool, Server, Layers, Briefcase
};

interface MarketInsightsProps {
  onExploreCareer?: (career: string) => void;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ onExploreCareer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('bookmarked_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarks = bookmarkedJobs.includes(title) 
      ? bookmarkedJobs.filter(b => b !== title)
      : [...bookmarkedJobs, title];
      
    setBookmarkedJobs(newBookmarks);
    localStorage.setItem('bookmarked_jobs', JSON.stringify(newBookmarks));
  };

  const filters = ['All', 'Bookmarked', 'Web/App', 'Cyber/Data', 'Systems/Cloud', 'Design/Creative', 'Marketing/Business'];

  const [trendingJobs, setTrendingJobs] = useState<any[]>([
    { 
      title: 'Full Stack Engineer', 
      desc: 'Build scalable web applications from front to back.',
      icon: "Code2", 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      category: 'Web/App',
      salary: '$110K - $160K',
      growth: '+15%',
      companies: ['Google', 'Meta', 'Startups']
    },
    { 
      title: 'Frontend Developer', 
      desc: 'Create responsive user interfaces using modern frameworks.',
      icon: "Smartphone", 
      color: 'text-sky-500', 
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      category: 'Web/App',
      salary: '$90K - $150K',
      growth: '+18%',
      companies: ['Vercel', 'Airbnb', 'Stripe']
    },
    { 
      title: 'Backend Engineer', 
      desc: 'Design APIs and robust server logic.',
      icon: "Database", 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      category: 'Web/App',
      salary: '$110K - $170K',
      growth: '+12%',
      companies: ['Uber', 'Netflix', 'Shopify']
    },
    { 
      title: 'AI/ML Researcher', 
      desc: 'Develop predictive models and train neural networks.',
      icon: "Cpu", 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      category: 'Cyber/Data',
      salary: '$140K - $250K+',
      growth: '+35%',
      companies: ['OpenAI', 'Microsoft', 'Tesla']
    },
    { 
      title: 'Data Scientist', 
      desc: 'Analyze complex datasets to drive business decisions.',
      icon: "Database", 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      category: 'Cyber/Data',
      salary: '$120K - $170K',
      growth: '+28%',
      companies: ['Netflix', 'Spotify', 'Uber']
    },
    { 
      title: 'Cloud Security Architect', 
      desc: 'Design secure infrastructure for cloud deployments.',
      icon: "ShieldAlert", 
      color: 'text-rose-500', 
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      category: 'Systems/Cloud',
      salary: '$130K - $180K',
      growth: '+22%',
      companies: ['AWS', 'CrowdStrike', 'Banks']
    },
    { 
      title: 'DevOps Engineer', 
      desc: 'Automate software delivery and manage infrastructure.',
      icon: "Cloud", 
      color: 'text-amber-500', 
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      category: 'Systems/Cloud',
      salary: '$115K - $165K',
      growth: '+18%',
      companies: ['GitHub', 'Docker', 'Stripe']
    },
    { 
      title: 'UX/UI Designer', 
      desc: 'Craft intuitive and beautiful digital experiences.',
      icon: "Code2", 
      color: 'text-pink-500', 
      bg: 'bg-pink-50 dark:bg-pink-500/10',
      category: 'Design/Creative',
      salary: '$90K - $150K',
      growth: '+10%',
      companies: ['Apple', 'Figma', 'Adobe']
    },
    { 
      title: 'Digital Marketer', 
      desc: 'Drive growth through SEO, PPC, and content strategies.',
      icon: "TrendingUp", 
      color: 'text-orange-500', 
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      category: 'Marketing/Business',
      salary: '$70K - $130K',
      growth: '+14%',
      companies: ['HubSpot', 'Salesforce', 'Agencies']
    },
    { 
      title: 'Blockchain Developer', 
      desc: 'Build smart contracts and decentralized applications.',
      icon: "Code2", 
      color: 'text-violet-500', 
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      category: 'Web/App',
      salary: '$120K - $180K',
      growth: '+20%',
      companies: ['Coinbase', 'Ethereum', 'Web3 Startups']
    },
    { 
      title: '3D Animator / VFX', 
      desc: 'Create stunning visual effects and animations for games/movies.',
      icon: "MonitorPlay", 
      color: 'text-rose-500', 
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      category: 'Design/Creative',
      salary: '$80K - $140K',
      growth: '+8%',
      companies: ['Pixar', 'Epic Games', 'Blizzard']
    }
  ]);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreJobs = async () => {
    setLoadingMore(true);
    try {
      const existingTitles = trendingJobs.map(j => j.title);
      const newJobs = await getMoreJobs(existingTitles);
      
      if (newJobs && newJobs.length > 0) {
        setTrendingJobs(prev => [...prev, ...newJobs]);
      } else {
        alert("Failed to discover new guilds. The AI might be on cooldown.");
      }
    } catch (e) {
      console.error(e);
      alert("Error contacting the guild master (AI). Try again soon.");
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredJobs = trendingJobs.filter(job => 
    (activeFilter === 'All' || 
     (activeFilter === 'Bookmarked' ? bookmarkedJobs.includes(job.title) : job.category === activeFilter)) &&
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-reveal space-y-12 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b-4 border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Market Insights</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm mb-4">Job Board</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl">
            Explore fast-growing tech careers, compare loot drops (salaries), and discover top guilds (sectors) for 2026.
          </p>
        </div>
        
        <div className="flex bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-1.5 shadow-inner w-full md:w-auto overflow-x-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-xl font-black text-[12px] uppercase tracking-wider transition-all flex-1 md:flex-none whitespace-nowrap ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white shadow-[0_4px_0_rgba(30,58,138,1)] -translate-y-1' 
                  : 'text-slate-500 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 border-2 border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { label: 'Avg Loot Drop', value: '$135K', trend: '+8% this year', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100', shadow: 'shadow-[0_6px_0_rgba(167,243,208,1)]' },
          { label: 'Fast Travel', value: '42%', trend: 'Remote dominant', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-100', shadow: 'shadow-[0_6px_0_rgba(191,219,254,1)]' },
          { label: 'Fastest Growth', value: 'AI/ML', trend: '35% YoY increase', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-100', shadow: 'shadow-[0_6px_0_rgba(253,230,138,1)]' },
          { label: 'Open Quests', value: '1.2M+', trend: 'Globally listed', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-100', shadow: 'shadow-[0_6px_0_rgba(199,210,254,1)]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-none hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all relative overflow-hidden group">
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>
            <div className={`${stat.color} ${stat.bg} w-16 h-16 flex items-center justify-center rounded-[1.25rem] mb-6 relative z-10 ${stat.shadow} group-hover:rotate-6 transition-transform rotate-3`}>
              <stat.icon size={28} strokeWidth={2.5} />
            </div>
            <p className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2 relative z-10 drop-shadow-sm">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</p>
            <p className="text-sm font-medium text-emerald-500 mt-3 flex items-center gap-1 relative z-10">
              <TrendingUp size={14} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={24} strokeWidth={3} />
        <input 
          type="text" 
          placeholder="Search careers, skills, or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2rem] py-5 pl-16 pr-6 font-black text-slate-700 dark:text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 focus:-translate-y-1 focus:shadow-[0_8px_0_rgba(59,130,246,1)]"
        />
      </div>

      {/* Main Jobs Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full py-16 text-center border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50 group">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:text-blue-400" strokeWidth={2} />
            <h3 className="text-2xl font-display font-black text-slate-700 dark:text-slate-300 mb-2">No Guilds Found</h3>
            <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto">Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          filteredJobs.map((job, i) => {
            const Icon = typeof job.icon === 'string' ? (ICONS[job.icon] || Briefcase) : job.icon;
            
            return (
            <div key={i} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] hover:-translate-y-2 hover:border-blue-400 hover:shadow-[0_12px_0_rgba(226,232,240,1)] dark:hover:shadow-[0_12px_0_rgba(30,41,59,1)] transition-all group flex flex-col h-full relative overflow-hidden">
              <div className={`absolute -right-10 -top-10 w-32 h-32 ${job.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl pointer-events-none`}></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className={`w-16 h-16 ${job.bg} ${job.color} rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner`}>
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                <div className="flex gap-2">
                  <div className="bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 border-2 border-emerald-200 shadow-sm">
                    <TrendingUp size={14} strokeWidth={3} /> {job.growth}
                  </div>
                  <button 
                    onClick={(e) => toggleBookmark(job.title, e)}
                    className={`p-2 rounded-xl transition-all border-2 flex items-center justify-center ${
                      bookmarkedJobs.includes(job.title) 
                        ? 'bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30 shadow-[0_4px_0_rgba(199,210,254,1)] translate-y-[-2px]' 
                        : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-indigo-500/30'
                    }`}
                    title={bookmarkedJobs.includes(job.title) ? "Remove Bookmark" : "Bookmark Job"}
                  >
                    {bookmarkedJobs.includes(job.title) ? (
                      <CheckCircle size={18} strokeWidth={2.5} />
                    ) : (
                      <Bookmark size={18} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 leading-tight group-hover:text-blue-600 transition-colors relative z-10 line-clamp-2">
                {job.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 flex-1 text-sm relative z-10">
                {job.desc}
              </p>

              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[1.5rem] mb-8 relative z-10 border-2 border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    <DollarSign size={18} className="text-emerald-500" strokeWidth={3} />
                  </div>
                  <span className="text-base font-black text-slate-700 dark:text-slate-200">{job.salary}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    <Building size={18} className="text-blue-500" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] font-bold text-slate-600 dark:text-slate-300 leading-tight">
                    {job.companies.join(', ')}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => onExploreCareer?.(job.title)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[12px] group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2 group/btn border-2 border-transparent group-hover:shadow-[0_6px_0_rgba(37,99,235,1)] group-hover:-translate-y-1 active:translate-y-[2px] active:shadow-none relative z-10"
              >
                Create Roadmap <ArrowUpRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </div>
            );
          })
        )}
      </div>

      {/* Expand More Jobs API Trigger */}
      <div className="pt-8 flex justify-center">
        <button
          onClick={loadMoreJobs}
          disabled={loadingMore}
          className="bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black uppercase text-sm tracking-widest px-10 py-5 rounded-2xl transition-all shadow-[0_6px_0_rgba(15,23,42,1)] dark:shadow-[0_6px_0_rgba(203,213,225,1)] hover:shadow-[0_4px_0_rgba(15,23,42,1)] dark:hover:shadow-[0_4px_0_rgba(203,213,225,1)] active:shadow-none hover:translate-y-0.5 active:translate-y-[6px] flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loadingMore ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning the Matrix...
            </>
          ) : (
            <>
              <Cpu className="w-5 h-5" />
              AI: Load More Guilds
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default MarketInsights;
