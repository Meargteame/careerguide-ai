import React, { useEffect, useState } from 'react';
import { Trophy, Star, TrendingUp, Users, Crown, Medal, Hexagon } from 'lucide-react';
import { getLeaderboard } from '../../services/courseService';

interface ProfileNode {
  id: string;
  full_name: string;
  xp: number;
  meridian_coins: number;
}

const LeaderboardView: React.FC = () => {
  const [leaders, setLeaders] = useState<ProfileNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-500 border-amber-200 dark:border-amber-500/30';
    if (index === 1) return 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 border-slate-300 dark:border-slate-600';
    if (index === 2) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 border-orange-200 dark:border-orange-800/40';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={24} className="text-amber-500 drop-shadow-sm" />;
    if (index === 1) return <Medal size={24} className="text-slate-400 drop-shadow-sm" />;
    if (index === 2) return <Hexagon size={24} className="text-orange-500 drop-shadow-sm fill-orange-100 dark:fill-orange-900/30" />;
    return <span className="font-black text-lg opacity-60">#{index + 1}</span>;
  };

  return (
    <div className="animate-reveal max-w-5xl mx-auto pb-20">
      <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800 mb-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-[12px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center md:justify-start gap-2">
            <Trophy size={14} /> Meridian Rankings
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm mb-4">
            Global Leaderboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl mx-auto md:mx-0">
            Top scholars based on overall experience points (XP). 
          </p>
        </div>
        
        {/* Total Users Stat box */}
        <div className="bg-indigo-50 dark:bg-indigo-500/10 px-8 py-5 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-500/20 flex flex-col items-center shadow-sm">
          <Users size={32} className="text-indigo-500 mb-2" strokeWidth={2.5} />
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{leaders.length}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 dark:text-indigo-300 mt-1">Found Scholars</span>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {leaders.map((leader, index) => {
            const rankStyle = getRankStyle(index);
            const level = Math.floor((leader.xp || 0) / 1000) + 1;
            
            return (
              <div 
                key={leader.id} 
                className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[2rem] border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${rankStyle} bg-white dark:bg-slate-900 group`}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center bg-white dark:bg-slate-800 border-2 ${rankStyle} shadow-sm group-hover:scale-110 transition-transform`}>
                  {getRankIcon(index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-black text-slate-800 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                    {leader.full_name || "Unknown Scholar"}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 opacity-80">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                      Level {level}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right">
                  <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-xl md:text-2xl font-black leading-none">{leader.xp}</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Total XP</span>
                </div>
              </div>
            );
          })}
          
          {leaders.length === 0 && !loading && (
             <div className="text-center p-12 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
                 <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                 <p className="text-slate-500 font-bold text-lg">The leaderboard is quiet... Go claim the top spot!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;