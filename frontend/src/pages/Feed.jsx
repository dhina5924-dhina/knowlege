import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { sportsApi } from '../services/api';
import { Flame, Trophy, TrendingUp, Users, ArrowRight, Sparkles } from 'lucide-react';

const SPORTS_PILLS = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Athletics'];

export default function Feed({ onNavigate, onAuthorClick }) {
  const [posts, setPosts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('All');
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    loadFeed();
  }, [selectedSport]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const [postsRes, commsRes] = await Promise.all([
        sportsApi.getPosts(selectedSport),
        sportsApi.getCommunities()
      ]);
      setPosts(postsRes.posts || []);
      setCommunities(commsRes.communities || []);
    } catch (err) {
      console.warn('Feed load fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {SPORTS_PILLS.map((sp) => {
          const active = selectedSport === sp;
          return (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sp === 'All' ? '⚡ All Feeds' : sp}
            </button>
          );
        })}
      </div>

      {/* Grid Layout: Feed + Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-3 bg-slate-800 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-48 bg-slate-800/80 rounded-xl" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl p-8 border border-slate-800">
              <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No posts in this category yet</h3>
              <p className="text-xs text-slate-500 mt-1">Be the first athlete to upload photos or videos!</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onAuthorClick={(p) => onAuthorClick && onAuthorClick(p)} 
              />
            ))
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <div className="hidden lg:block space-y-6">
          
          {/* AI Predict Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>AI Feature Highlight</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">
              Player Performance Prediction
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Powered by Random Forest Regression. Input your match stats to predict your future score and receive statistical improvement tips.
            </p>
            <button
              onClick={() => onNavigate('ai-predict')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              <span>Launch Predictor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sports Communities Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Sports Communities</span>
              </h4>
              <button 
                onClick={() => onNavigate('explore')}
                className="text-[11px] font-semibold text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {communities.slice(0, 3).map((comm) => (
                <div key={comm.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-100 hover:text-indigo-400 cursor-pointer">
                      {comm.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {comm.sport_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {comm.description}
                  </p>
                  <div className="mt-2 text-[10px] text-cyan-400 font-semibold">
                    {comm.members_count.toLocaleString()} Athletes Active
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Talent Scouting Widget */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Talent Scouting</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">K-Means</span>
            </div>
            <p className="text-xs text-slate-400">
              Cluster athlete statistics into 4 objective performance tiers using unsupervised clustering.
            </p>
            <button
              onClick={() => onNavigate('ai-talent')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Talent Clusters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
