import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Heart, Smile, PartyPopper, Share2, Plus, Users, Hash, X, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const EMOJIS = [
  { id: 'likes', icon: ThumbsUp, color: 'text-blue-500' },
  { id: 'love', icon: Heart, color: 'text-rose-500' },
  { id: 'laugh', icon: Smile, color: 'text-amber-500' },
  { id: 'celebrate', icon: PartyPopper, color: 'text-emerald-500' }
];

const getLocalUsername = () => {
  let user = localStorage.getItem('community_user');
  if (!user) {
    user = 'Dev' + Math.floor(Math.random() * 10000);
    localStorage.setItem('community_user', user);
  }
  return user;
};

const CommunityView: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('Academics');
  const [replyText, setReplyText] = useState('');
  
  const myUser = getLocalUsername();

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_threads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setThreads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (threadId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_replies')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        setReplies(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchThreads();
    
    // Subscribe to threads
    const threadsChannel = supabase.channel('custom-all-threads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_threads' }, payload => {
        fetchThreads();
        if (payload.new && activeThread && payload.new.id === activeThread.id) {
          setActiveThread(payload.new);
        }
      })
      .subscribe();

    // Subscribe to replies
    const repliesChannel = supabase.channel('custom-all-replies')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_replies' }, payload => {
        if (activeThread && (payload.new?.thread_id === activeThread.id || payload.old?.thread_id === activeThread.id)) {
          fetchReplies(activeThread.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(threadsChannel);
      supabase.removeChannel(repliesChannel);
    };
  }, [activeThread?.id]);

  const handlePost = async () => {
    if (!newTitle.trim()) return;
    
    setIsModalOpen(false);
    const { error } = await supabase.from('community_threads').insert([{
      user_name: myUser,
      avatar_text: myUser.substring(0, 2).toUpperCase(),
      title: newTitle,
      content: newContent,
      category: newTag
    }]);

    if (error) {
      alert("Failed to post. Have you run the community SQL migration?");
    }
    
    setNewTitle('');
    setNewContent('');
    fetchThreads();
  };

  const handleReply = async () => {
    if (!replyText.trim() || !activeThread) return;
    
    // Increment the activeThread locally for snappy UI
    setActiveThread((prev: any) => ({ ...prev, replies_count: (prev.replies_count || 0) + 1 }));
    
    const { error } = await supabase.from('community_replies').insert([{
      thread_id: activeThread.id,
      user_name: myUser,
      avatar_text: myUser.substring(0, 2).toUpperCase(),
      content: replyText
    }]);

    if (!error) {
      setReplyText('');
      fetchReplies(activeThread.id);
      
      // Update thread reply count
      await supabase.from('community_threads').update({
        replies_count: (activeThread.replies_count || 0) + 1
      }).eq('id', activeThread.id);
      
      fetchThreads();
    }
  };

  const handleReaction = async (threadId: string, reaction: string, currentValue: number) => {
    // Optimistic Update
    setThreads(currentThreads => currentThreads.map(t => 
      t.id === threadId ? { ...t, [reaction]: currentValue + 1 } : t
    ));
    if (activeThread && activeThread.id === threadId) {
      setActiveThread((prev: any) => ({ ...prev, [reaction]: currentValue + 1 }));
    }

    await supabase.from('community_threads')
      .update({ [reaction]: currentValue + 1 })
      .eq('id', threadId);
  };
  
  const handleReplyReaction = async (replyId: string, currentValue: number) => {
    // Optimistic Update
    setReplies(currentReplies => currentReplies.map(r => 
      r.id === replyId ? { ...r, likes: currentValue + 1 } : r
    ));

    await supabase.from('community_replies')
      .update({ likes: currentValue + 1 })
      .eq('id', replyId);
  };

  if (activeThread) {
    return (
      <div className="animate-reveal space-y-8 pb-20">
        <button 
          onClick={() => setActiveThread(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 font-bold uppercase tracking-widest text-sm transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Tavern
        </button>

        <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-16 h-16 shrink-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase">
              {activeThread.avatar_text || activeThread.user_name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1">
                {activeThread.user_name} • {new Date(activeThread.created_at).toLocaleDateString()}
              </p>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight mb-4">{activeThread.title}</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">{activeThread.content}</p>
              
              <div className="flex flex-wrap gap-4">
                {EMOJIS.map(emoji => (
                  <button 
                    key={emoji.id}
                    onClick={() => handleReaction(activeThread.id, emoji.id, activeThread[emoji.id] || 0)}
                    className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold group"
                  >
                    <emoji.icon size={18} className={`group-hover:${emoji.color} group-hover:scale-110 transition-all`} /> 
                    {activeThread[emoji.id] || 0}
                  </button>
                ))}
                <button className="flex items-center gap-2 ml-auto text-blue-500 font-bold hover:bg-blue-50 dark:hover:bg-blue-500/20 px-4 py-2 rounded-xl transition-colors">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>
          </div>
          
          {/* Replies Section */}
          <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800 pt-10">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-3">
              <MessageSquare size={18} className="text-emerald-500" />
              {replies.length} Replies
            </h3>
            
            <div className="space-y-6 mb-10">
              {replies.map(reply => (
                <div key={reply.id} className="flex gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 shrink-0 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl flex items-center justify-center font-black shadow-inner uppercase">
                   {reply.avatar_text || reply.user_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 mb-2">{reply.user_name} • {new Date(reply.created_at).toLocaleDateString()}</p>
                    <p className="text-slate-700 dark:text-slate-200 mb-4">{reply.content}</p>
                    <button 
                      onClick={() => handleReplyReaction(reply.id, reply.likes || 0)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-500"
                    >
                      <ThumbsUp size={14} /> {reply.likes || 0}
                    </button>
                  </div>
                </div>
              ))}
              {replies.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                  No replies yet. Be the first to share your wisdom!
                </p>
              )}
            </div>

            {/* Post Reply */}
            <div className="flex gap-4">
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 font-medium text-slate-700 dark:text-white outline-none focus:border-emerald-400 focus:bg-white resize-none h-32"
              />
              <button 
                onClick={handleReply}
                disabled={!replyText.trim()}
                className="flex-none bg-emerald-500 text-white rounded-2xl px-8 font-black uppercase tracking-widest text-[12px] shadow-[0_6px_0_rgba(16,185,129,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(16,185,129,1)] active:translate-y-[6px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="flex flex-col items-center gap-2">
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Send</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-reveal space-y-12 relative pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b-4 border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Tavern</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">Community</h1>
        </div>
      </header>

      {/* Inline Post Composer */}
      <div className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 flex flex-col gap-4 shadow-sm relative overflow-hidden transition-all focus-within:border-emerald-400 focus-within:shadow-[0_12px_0_rgba(16,185,129,0.2)]">
        <div className="flex gap-4">
          <div className="w-12 h-12 shrink-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-black shadow-inner uppercase text-lg">
            {myUser.substring(0, 2)}
          </div>
          <div className="flex-1 space-y-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What knowledge do you seek? (Short Title)"
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-700 dark:text-white outline-none focus:border-emerald-400 transition-colors"
            />
            {newTitle.length > 0 && (
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Elaborate on your question, quest, or project..."
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-medium text-slate-700 dark:text-white outline-none focus:border-emerald-400 resize-none animate-in fade-in slide-in-from-top-2 duration-200"
              />
            )}
            <div className={`flex flex-wrap items-center justify-between gap-4 pt-2 transition-all duration-300 ${newTitle.length > 0 ? 'opacity-100 h-auto' : 'opacity-50 h-10'}`}>
              <div className="flex gap-2 overflow-x-auto">
                {['Academics', 'Collaboration', 'DevOps', 'Career'].map(tag => (
                   <button
                     key={tag}
                     onClick={() => setNewTag(tag)}
                     className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-2 whitespace-nowrap ${
                       newTag === tag
                         ? 'bg-emerald-500 text-white border-emerald-600'
                         : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                     }`}
                   >
                     {tag}
                   </button>
                ))}
              </div>
              <button 
                onClick={handlePost} 
                disabled={!newTitle.trim()} 
                className="px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[12px] bg-emerald-500 text-white shadow-[0_4px_0_rgba(16,185,129,0.6)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(16,185,129,0.6)] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shrink-0 group"
              >
                <Send size={16} strokeWidth={3} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Post Quest
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
           <p className="font-bold uppercase tracking-widest text-sm">Syncing with Real-Time Server...</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-20 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
           <Users size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
           <h2 className="text-2xl font-black text-slate-700 dark:text-slate-300">Quiet Tavern</h2>
           <p className="text-slate-500 font-bold mt-2">No threads exist yet. Run the SQL migration and start a quest!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {threads.map((thread) => (
            <div 
              key={thread.id} 
              onClick={() => { setActiveThread(thread); fetchReplies(thread.id); }}
              className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all cursor-pointer group flex flex-col sm:flex-row gap-6"
            >
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 text-lg uppercase group-hover:bg-emerald-100 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors shadow-sm">
                  {thread.avatar_text || thread.user_name?.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1">
                    <Hash size={12} /> {thread.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{thread.user_name} • {new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight group-hover:text-emerald-500 transition-colors truncate">
                  {thread.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-1 mb-4">{thread.content}</p>
                <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-500">
                    <MessageSquare size={16} /> {thread.replies_count || 0} Replies
                  </div>
                  <div className="flex gap-3 text-slate-400">
                     {activeThread?.id === thread.id ? null : (
                       <>
                         <div className="flex items-center gap-1"><ThumbsUp size={14}/> {thread.likes || 0}</div>
                         <div className="flex items-center gap-1"><Heart size={14}/> {thread.love || 0}</div>
                         <div className="flex items-center gap-1"><Smile size={14}/> {thread.laugh || 0}</div>
                         <div className="flex items-center gap-1"><PartyPopper size={14}/> {thread.celebrate || 0}</div>
                       </>
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityView;
