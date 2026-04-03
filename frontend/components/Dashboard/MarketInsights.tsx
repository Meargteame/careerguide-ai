import React, { useState } from 'react';
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
  MonitorPlay
} from 'lucide-react';

interface MarketInsightsProps {
  onExploreCareer?: (career: string) => void;
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ onExploreCareer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Web/App', 'Cyber/Data', 'Systems/Cloud'];

  const trendingJobs = [
    { 
      title: 'Full Stack Engineer', 
      desc: 'Build scalable web applications from front to back.',
      icon: Code2, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      category: 'Web/App',
      salary: '$110K - $160K',
      growth: '+15%',
      companies: ['Google', 'Meta', 'Startups']
    },
    { 
      title: 'AI/ML Researcher', 
      desc: 'Develop predictive models and train neural networks.',
      icon: Cpu, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      category: 'Cyber/Data',
      salary: '$140K - $200K',
      growth: '+35%',
      companies: ['OpenAI', 'Microsoft', 'Tesla']
    },
    { 
      title: 'Cloud Security Architect', 
      desc: 'Design secure infrastructure for cloud deployments.',
      icon: ShieldAlert, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      category: 'Systems/Cloud',
      salary: '$130K - $180K',
      growth: '+22%',
      companies: ['AWS', 'CrowdStrike', 'Banks']
    },
    { 
      title: 'Data Scientist', 
      desc: 'Analyze complex datasets to drive business decisions.',
      icon: Database, 
      color: 'text-brand', 
      bg: 'bg-brand/5',
      category: 'Cyber/Data',
      salary: '$120K - $170K',
      growth: '+28%',
      companies: ['Netflix', 'Spotify', 'Uber']
    },
    { 
      title: 'iOS Developer', 
      desc: 'Create highly Performant applications for Apple devices.',
      icon: Smartphone, 
      color: 'text-sky-500', 
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      category: 'Web/App',
      salary: '$105K - $155K',
      growth: '+12%',
      companies: ['Apple', 'Airbnb', 'Lyft']
    },
    { 
      title: 'DevOps Engineer', 
      desc: 'Automate software delivery and manage infrastructure.',
      icon: Cloud, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      category: 'Systems/Cloud',
      salary: '$115K - $165K',
      growth: '+18%',
      companies: ['GitHub', 'Docker', 'Stripe']
    }
  ];

  const filteredJobs = trendingJobs.filter(job => 
    (activeFilter === 'All' || job.category === activeFilter) &&
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-reveal space-y-12 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold text-primary dark:text-white tracking-tight mb-2">Market Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Explore fast-growing tech careers, compare salary expectations, and discover top hiring sectors for 2026.
          </p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm w-full md:w-auto">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex-1 md:flex-none ${
                activeFilter === filter 
                  ? 'bg-secondary text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Tech Salary', value: '$135K', trend: '+8% this year', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
          { label: 'Remote Flexibility', value: '42%', trend: 'Hybrid dominant', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
          { label: 'Fastest Growth', value: 'AI/ML', trend: '35% YoY increase', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
          { label: 'Open Positions', value: '1.2M+', trend: 'Globally listed', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>
            <div className={`${stat.color} ${stat.bg} w-12 h-12 flex items-center justify-center rounded-2xl mb-6 relative z-10`}>
              <stat.icon size={24} />
            </div>
            <p className="text-3xl font-black text-primary dark:text-white tracking-tight mb-1 relative z-10">{stat.value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">{stat.label}</p>
            <p className="text-sm font-medium text-emerald-500 mt-3 flex items-center gap-1 relative z-10">
              <TrendingUp size={14} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search careers, skills, or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-6 font-semibold text-slate-700 dark:text-white focus:ring-4 focus:ring-secondary/20 outline-none transition-all placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* Main Jobs Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No roles found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your search or filters to see more results.</p>
          </div>
        ) : (
          filteredJobs.map((job, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
              
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${job.bg} ${job.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <job.icon size={28} />
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={12} /> {job.growth}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-primary dark:text-white mb-3 leading-tight group-hover:text-secondary transition-colors">
                {job.title}
              </h3>
              
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6 flex-1 text-sm">
                {job.desc}
              </p>

              <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign size={16} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{job.salary}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {job.companies.join(', ')}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => onExploreCareer?.(job.title)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-primary dark:text-white rounded-xl font-bold group-hover:bg-secondary group-hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                Generate Path <ArrowUpRight size={18} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default MarketInsights;
