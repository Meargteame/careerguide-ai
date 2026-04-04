import React, { useEffect, useState } from 'react';
import { Store, Zap, Shield, Crown, Coins, Flame, Star, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

interface MarketplaceViewProps {
  userId: string;
}

const ITEMS = [
  { id: 'border_gold', title: 'Gold Profile Border', desc: 'Display a shining gold ring around your avatar.', price: 50, icon: Crown, color: 'text-amber-500' },
  { id: 'title_scholar', title: '"The Scholar" Title', desc: 'Equip the exclusive Scholar title in the Tavern.', price: 100, icon: Star, color: 'text-indigo-500' },
  { id: 'xp_potion', title: 'XP Booster (24h)', desc: 'Double XP from all completed lessons for 24 hours.', price: 150, icon: Zap, color: 'text-emerald-500' },
  { id: 'streak_freeze', title: 'Streak Freeze', desc: 'Missed a day? Automatically keeps your streak active.', price: 200, icon: Flame, color: 'text-orange-500' },
];

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ userId }) => {
  const [coins, setCoins] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('meridian_coins, achievements').eq('id', userId).single();
      if (!error && data) {
        setCoins(data.meridian_coins || 0);
        // Map achievements to find items
        const rawItems = (data.achievements || []).filter((a: any) => a.type === 'item').map((a: any) => a.id);
        setInventory(rawItems);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId: string, price: number, title: string) => {
    if (coins < price) return;
    setPurchasing(itemId);
    
    try {
      const { data: profile } = await supabase.from('profiles').select('meridian_coins, achievements').eq('id', userId).single();
      if (!profile) return;

      const newCoins = (profile.meridian_coins || 0) - price;
      const currentAch = profile.achievements || [];
      const newAch = [...currentAch, { id: itemId, title, type: 'item', date: new Date().toISOString() }];

      const { error } = await supabase.from('profiles').update({
        meridian_coins: newCoins,
        achievements: newAch
      }).eq('id', userId);

      if (!error) {
        setCoins(newCoins);
        setInventory(prev => [...prev, itemId]);
      }
    } catch (e) {
      console.error("Purchase failed", e);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="animate-reveal max-w-5xl mx-auto pb-20">
      <header className="pb-10 border-b-4 border-slate-100 dark:border-slate-800 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 flex items-center justify-center md:justify-start gap-2">
            <Store size={14} /> Meridian Exchange
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm mb-4">
            The Marketplace
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg max-w-xl mx-auto md:mx-0">
            Spend your hard-earned coins on exclusive cosmetics and boosts.
          </p>
        </div>
        
        {/* Wallet */}
        <div className="bg-amber-100 dark:bg-amber-500/20 px-8 py-5 rounded-[2rem] border-2 border-amber-200 dark:border-amber-500/30 flex flex-col items-center shadow-sm">
          <Coins size={32} className="text-amber-500 mb-2" strokeWidth={2.5} />
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 leading-none">{coins}</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mt-1">Available Coins</span>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {ITEMS.map(item => {
            const isOwned = inventory.includes(item.id);
            const canAfford = coins >= item.price;
            const ActIcon = item.icon;

            return (
              <div key={item.id} className={`bg-white dark:bg-slate-900 border-2 transition-all p-8 rounded-[2.5rem] flex flex-col ${isOwned ? 'border-emerald-300 dark:border-emerald-700/50 opacity-90' : 'border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1'}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shrink-0`}>
                     <ActIcon size={32} className={item.color} strokeWidth={2.5} />
                  </div>
                  {!isOwned && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-200 dark:border-amber-500/20">
                      <Coins size={16} className="text-amber-500" />
                      <span className="font-black text-amber-600 dark:text-amber-400">{item.price}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 grow leading-relaxed">{item.desc}</p>

                <button 
                  onClick={() => !isOwned && handlePurchase(item.id, item.price, item.title)}
                  disabled={isOwned || !canAfford || purchasing === item.id}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2
                    ${isOwned ? 'bg-emerald-500 text-white cursor-default' : 
                      !canAfford ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 
                      'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 shadow-[0_8px_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_rgba(67,56,202,1)] hover:translate-y-1'}
                  `}
                >
                  {purchasing === item.id ? 'Processing...' :
                    isOwned ? <><CheckCircle2 size={18} /> Owned</> : 
                    !canAfford ? 'Not Enough Coins' : 'Purchase Item'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplaceView;