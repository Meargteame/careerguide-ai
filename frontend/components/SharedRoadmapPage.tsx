import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader2, AlertCircle, GraduationCap, Clock, Layers,
  Target, ArrowLeft, ChevronDown, ChevronUp, Atom,
  Youtube, FileText, Globe, BookOpen, ArrowRight
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { DetailedRoadmap } from '../types';

const SharedRoadmapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<DetailedRoadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    supabase
      .from('roadmaps')
      .select('road_data, title, role')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); }
        else { setRoadmap(data.road_data as DetailedRoadmap); }
        setLoading(false);
      });
  }, [id]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Youtube size={14} className="text-red-500" />;
      case 'course': return <BookOpen size={14} className="text-amber-500" />;
      case 'documentation': return <FileText size={14} className="text-slate-500" />;
      default: return <Globe size={14} className="text-emerald-500" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="animate-spin text-emerald-500 mx-auto" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading roadmap...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <AlertCircle className="text-rose-400 mx-auto" size={48} />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Roadmap Not Found</h2>
        <p className="text-slate-400">This roadmap may have been deleted or the link is invalid.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all">
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <GraduationCap size={16} strokeWidth={2.5} />
            </div>
            <span className="font-display font-black text-lg text-slate-800 dark:text-white">Meridian</span>
          </div>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-[0_4px_0_rgba(16,185,129,0.5)] hover:translate-y-[2px] hover:shadow-[0_2px_0_rgba(16,185,129,0.5)] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Get Started Free
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero */}
        <div className="bg-emerald-500 border-4 border-emerald-600 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-[0_8px_0_rgba(16,185,129,1)]">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Target size={280} strokeWidth={0.5} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">
              Shared Roadmap
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-tight">
              {roadmap!.title}
            </h1>
            <p className="text-emerald-100 text-lg font-bold leading-relaxed max-w-2xl">
              {roadmap!.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-emerald-600/50 border border-emerald-400 rounded-2xl px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl text-emerald-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Est. Time</p>
                  <p className="text-lg font-black">~6 Months</p>
                </div>
              </div>
              <div className="bg-emerald-600/50 border border-emerald-400 rounded-2xl px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-xl text-emerald-600 flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Phases</p>
                  <p className="text-lg font-black">{roadmap!.phases.length} Levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-wider">Learning Path</h2>
          {roadmap!.phases.map((phase, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border-x-4 border-t-2 border-b-[8px] border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:-translate-y-1 hover:border-amber-400 transition-all">
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 font-black text-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white">{phase.title}</h3>
                    <p className="text-sm text-slate-400 font-bold">{phase.description}</p>
                  </div>
                </div>
                <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-2 border-amber-200 dark:border-amber-700 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest shrink-0">
                  {phase.duration}
                </span>
              </div>

              <div className="space-y-3">
                {phase.topics?.map((topic, topicIdx) => {
                  const topicId = `${idx}-${topicIdx}`;
                  const isExpanded = expandedTopic === topicId;
                  return (
                    <div key={topicIdx} className="border-2 border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-amber-300 transition-all">
                      <button
                        onClick={() => setExpandedTopic(isExpanded ? null : topicId)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-xl ${isExpanded ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                            <Atom size={16} className={isExpanded ? 'animate-spin' : ''} />
                          </div>
                          <span className="font-black text-sm text-slate-700 dark:text-slate-200">{topic.title}</span>
                        </div>
                        {isExpanded
                          ? <ChevronUp size={18} className="text-amber-500" strokeWidth={3} />
                          : <ChevronDown size={18} className="text-slate-400" strokeWidth={3} />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 pt-4">
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Key Concepts</p>
                            <div className="flex flex-wrap gap-2">
                              {topic.concepts.map((c, i) => (
                                <span key={i} className="text-[11px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">Resources</p>
                            <div className="space-y-2">
                              {topic.resources.map((res, i) => (
                                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 border-2 border-transparent hover:border-amber-200 transition-all group"
                                >
                                  {getResourceIcon(res.type)}
                                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex-1 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400">{res.title}</span>
                                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-amber-600 transition-all" strokeWidth={3} />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-slate-900 dark:bg-white rounded-[2.5rem] p-10 text-center space-y-5">
          <h3 className="text-3xl font-display font-black text-white dark:text-slate-900">Want your own AI roadmap?</h3>
          <p className="text-slate-400 dark:text-slate-600 font-bold">Generate a personalized career path in seconds — free.</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_6px_0_rgba(16,185,129,0.5)] hover:translate-y-[2px] hover:shadow-[0_4px_0_rgba(16,185,129,0.5)] active:translate-y-[4px] active:shadow-none transition-all"
          >
            Create My Roadmap
          </button>
        </div>
      </main>
    </div>
  );
};

export default SharedRoadmapPage;
