
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
    <div className="animate-reveal space-y-12 relative">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">Community Chat</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Talk, share, and learn with others.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-white px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-secondary/20 flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-primary dark:text-white">New Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tag</label>
                <select 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-secondary"
                >
                  <option>Academics</option>
                  <option>Collaboration</option>
                  <option>DevOps</option>
                  <option>Career</option>
                  <option>General</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Your Message</label>
                <textarea 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What do you want to share?"
                  className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-medium text-primary dark:text-white outline-none focus:border-secondary resize-none"
                />
              </div>
              
              <button 
                onClick={handlePost}
                className="w-full bg-primary dark:bg-secondary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Send size={16} /> Post
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-3 space-y-6">
          {threads.map((thread, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-secondary border border-slate-100 dark:border-slate-800 uppercase">
                    {thread.user.split(' ')[0][0]}{thread.user.split(' ')[1][0]}
                  </div>
                  <div>
                    <p className="font-bold text-primary dark:text-white">{thread.user}</p>
                    <p className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">{thread.time}</p>
                  </div>
                </div>
                <span className="bg-slate-50 dark:bg-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800">{thread.tag}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-primary dark:text-white mb-10 leading-snug hover:text-secondary transition-colors">{thread.title}</h3>
              
              <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-slate-800">
                <div className="flex gap-10">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-secondary font-bold text-xs transition-colors">
                    <ThumbsUp size={18} /> {thread.likes}
                  </button>
                  <button className="flex items-center gap-2 text-slate-400 hover:text-secondary font-bold text-xs transition-colors">
                    <MessageSquare size={18} /> {thread.replies}
                  </button>
                </div>
                <button className="text-slate-200 dark:text-slate-700 hover:text-secondary transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h4 className="text-xl font-black text-primary dark:text-white mb-8 flex items-center gap-3">
              <Hash className="text-secondary" /> Popular Nodes
            </h4>
            <div className="flex flex-wrap gap-3">
              {['#ReactJS', '#Tech2024', '#Internships', '#GoLang', '#GlobalTech', '#Enterprise', '#Hackathon'].map((tag) => (
                <button key={tag} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-secondary text-white p-10 rounded-[3rem] shadow-xl text-center border border-transparent dark:border-secondary/20">
            <Users size={48} className="mx-auto mb-6" />
            <h4 className="text-2xl font-black mb-4">Pro Mentors</h4>
            <p className="text-white/60 text-sm font-medium leading-relaxed mb-8">
              Join the elite alumni network and get direct guidance from industry pros.
            </p>
            <button className="w-full bg-white text-secondary py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-50 transition-all">
              Apply to Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
