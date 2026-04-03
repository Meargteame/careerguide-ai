
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Share2, Plus, Users, Hash, X, Send } from 'lucide-react';

const CommunityView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('Academics'); // Default value matches options
  
  const [threads, setThreads] = useState([
    { user: "Alex B.", time: "2h ago", title: "Any tips for the Advanced Level Compiler Design project?", likes: 24, replies: 12, tag: "Academics" },
    { user: "Sarah K.", time: "5h ago", title: "Looking for a backend partner for the SaaS Hackathon!", likes: 45, replies: 8, tag: "Collaboration" },
    { user: "David M.", time: "1d ago", title: "How to properly set up Docker on Windows for Enterprise ISP constraints?", likes: 112, replies: 56, tag: "DevOps" },
    { user: "Hannah T.", time: "2d ago", title: "CareerPath AI helped me land an internship at Top Tech Companies!", likes: 890, replies: 122, tag: "Success" },
  ]);

  const handlePost = () => {
    if (!newTitle.trim()) return;
    const newThread = {
      user: "Me (You)",
      time: "Just now",
      title: newTitle,
      likes: 0,
      replies: 0,
      tag: newTag
    };
    setThreads([newThread, ...threads]); // Prepend new thread
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="animate-reveal space-y-12 relative pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b-4 border-slate-100 dark:border-slate-800">
        <div>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Tavern</p>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none drop-shadow-sm">Community</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all bg-emerald-500 text-white shadow-[0_6px_0_rgba(16,185,129,1)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(16,185,129,1)] active:translate-y-[6px] active:shadow-none flex items-center justify-center gap-2 group"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> Start Quest
        </button>
      </header>

      {isModalOpen && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-none">
          <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl w-full rounded-[2rem] border border-slate-200/80 dark:border-slate-700/80 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] animate-in slide-in-from-top-4 zoom-in-95 duration-300 overflow-hidden">
            
            {/* Accent top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-7">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <Send size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-0.5">Community Board</p>
                    <h3 className="text-xl font-display font-black text-slate-800 dark:text-white tracking-tight">New Post</h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:rotate-90 transition-all duration-200"
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Category pills */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {['Academics', 'Collaboration', 'DevOps', 'Career', 'General'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setNewTag(tag)}
                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                          newTag === tag
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-[0_4px_0_rgba(16,185,129,0.4)] -translate-y-0.5'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:text-emerald-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message input */}
                <div className="relative">
                  <textarea
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="What knowledge do you seek?"
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 font-medium text-slate-700 dark:text-white outline-none focus:border-emerald-400 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm leading-relaxed"
                  />
                  <span className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-300 dark:text-slate-600">
                    {newTitle.length} chars
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border-2 border-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={!newTitle.trim()}
                    className="flex-[2] py-3.5 rounded-xl font-black uppercase tracking-widest text-[11px] bg-emerald-500 text-white shadow-[0_4px_0_rgba(16,185,129,0.6)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(16,185,129,0.6)] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:transform-none disabled:shadow-[0_4px_0_rgba(16,185,129,0.6)]"
                  >
                    <Send size={14} strokeWidth={3} /> Post to Board
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-6">
          {threads.map((thread, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 hover:-translate-y-2 hover:shadow-[0_12px_0_rgba(226,232,240,1)] transition-all cursor-pointer group flex flex-col sm:flex-row gap-6">
              
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[1.25rem] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-300 text-lg uppercase group-hover:bg-emerald-100 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors shadow-sm">
                  {thread.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col items-center">
                   <div className="flex items-center gap-1 text-slate-400 font-bold hover:text-emerald-500 cursor-pointer p-1 rounded-lg transition-colors">
                     <ThumbsUp size={16} strokeWidth={3} className="group-hover:-rotate-12 transition-transform" /> 
                   </div>
                   <span className="text-[11px] font-black text-slate-500 mt-1">{thread.likes}</span>
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg text-sm border-2 border-slate-100 dark:border-slate-700">{thread.user}</span>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{thread.time}</span>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 shadow-sm ml-auto sm:ml-0">{thread.tag}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-6 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 md:line-clamp-none">
                  {thread.title}
                </h3>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl transition-all border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-200 hover:bg-emerald-50 shadow-sm">
                    <MessageSquare size={16} strokeWidth={2.5} /> {thread.replies} Replies
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                    <Share2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          {/* Tags Box */}
          <div className="bg-slate-50 dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-none">
            <h4 className="text-xl font-display font-black text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-3">
              <Hash size={24} className="text-blue-500" strokeWidth={3} /> Trending
            </h4>
            <div className="flex flex-wrap gap-2">
              {['#ReactJS', '#Tech2024', '#Internships', '#GoLang', '#GlobalTech', '#Enterprise', '#Hackathon'].map((tag) => (
                <button key={tag} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm hover:shadow-[0_4px_0_rgba(191,219,254,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Card */}
          <div className="bg-amber-400 dark:bg-amber-500 border-4 border-amber-500 dark:border-amber-600 text-slate-900 p-8 rounded-[2.5rem] shadow-[0_8px_0_rgba(217,119,6,1)] relative overflow-hidden group hover:-translate-y-1 transition-transform">
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border-2 border-white/40 shadow-inner group-hover:rotate-6 transition-transform">
                 <Users size={36} className="text-slate-900" strokeWidth={2.5} />
              </div>
              <h4 className="text-3xl font-display font-black mb-3 tracking-wide drop-shadow-sm uppercase">Pro Mentors</h4>
              <p className="text-slate-800/80 text-sm font-bold leading-relaxed mb-8">
                Join the elite alumni network and get direct guidance from industry pros.
              </p>
              <button className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[12px] hover:bg-slate-800 transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none">
                Apply to Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
