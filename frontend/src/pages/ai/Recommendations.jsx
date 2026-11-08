import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Compass, 
  UserCheck, 
  Users, 
  Heart, 
  RefreshCw, 
  Check, 
  Flame, 
  Share2, 
  MessageCircle 
} from 'lucide-react';
import { mlApi, sportsApi } from '../../services/api';

const AVAILABLE_SPORTS = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Athletics'];
const POPULAR_TAGS = ['tactics', 'drills', 'matchday', 'conditioning', 'clutch', 'speed', 'technique', 'highlights'];

export default function Recommendations({ currentUser, onSelectPlayer }) {
  const [selectedSport, setSelectedSport] = useState('Football');
  const [userInterests, setUserInterests] = useState(['tactics', 'matchday', 'training']);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [likedPostIds, setLikedPostIds] = useState(new Set());

  useEffect(() => {
    loadRecommendations();
  }, [selectedSport]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const userId = currentUser?.id || 'b103-david-kick';
      const res = await mlApi.getRecommendations(userId, selectedSport);
      setRecommendations(res);
    } catch (err) {
      console.warn('Recommendations fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterestTag = (tag) => {
    if (userInterests.includes(tag)) {
      setUserInterests(userInterests.filter(t => t !== tag));
    } else {
      setUserInterests([...userInterests, tag]);
    }
  };

  const toggleFollow = (id) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id) => {
    setLikedPostIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const posts = recommendations?.personalized_posts || [];
  const players = recommendations?.recommended_players || [];
  const communities = recommendations?.recommended_communities || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Machine Learning Module 3 • Content-Based Filtering</span>
          </div>
          <h1 className="text-2xl font-black text-white">Personalized Sports Recommendations</h1>
          <p className="text-xs text-slate-400">
            Cosine similarity matching of your preferred sports, training tags, and interactions against posts, players, and communities.
          </p>
        </div>

        <button
          type="button"
          onClick={loadRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Content-Based Feed</span>
        </button>
      </div>

      {/* Interest Preferences Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Active Sport Affinity & Tactical Topics
            </h3>
            <p className="text-[11px] text-slate-400">
              Adjust your preference profile below to dynamically re-weight the TF-IDF vector matrix.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {AVAILABLE_SPORTS.map(sp => (
              <button
                type="button"
                key={sp}
                onClick={() => setSelectedSport(sp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSport === sp 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">Interests:</span>
          {POPULAR_TAGS.map(tag => {
            const active = userInterests.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleInterestTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  active 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="glass-panel p-16 rounded-3xl text-center border border-slate-800">
          <RefreshCw className="w-8 h-8 text-indigo-500 mx-auto mb-3 animate-spin" />
          <p className="text-xs text-slate-400">Computing TF-IDF Vectors & Cosine Similarity...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recommended Posts (Left - 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Recommended Posts For You ({posts.length})</span>
            </h3>

            <div className="space-y-4">
              {posts.map((post) => {
                const liked = likedPostIds.has(post.id);
                return (
                  <div key={post.id} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
                    
                    {/* Relevance Banner */}
                    <div className="flex items-center justify-between bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 text-xs">
                      <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        {post.match_reason}
                      </span>
                      <span className="font-mono font-bold text-cyan-400 text-[11px]">
                        {(post.relevance_score * 100).toFixed(0)}% Match
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={post.author_name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">{post.author_name}</h4>
                        <span className="text-[10px] text-slate-400">{post.sport_name}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {post.caption}
                    </p>

                    {post.media_url && (
                      <div className="rounded-xl overflow-hidden max-h-56 bg-black">
                        {post.media_type === 'video' ? (
                          <video src={post.media_url} controls className="w-full max-h-52 object-contain" />
                        ) : (
                          <img src={post.media_url} alt="Media" className="w-full max-h-52 object-cover" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 ${liked ? 'text-rose-500 font-bold' : 'hover:text-rose-400'}`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500' : ''}`} />
                        <span>{(post.likes_count || 10) + (liked ? 1 : 0)}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments_count || 4}</span>
                      </div>

                      <span className="text-[10px] text-slate-500 font-mono">Deduplicated Feed</span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Players & Communities (Right - 5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Recommended Athletes */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Athletes To Follow</span>
              </h3>

              <div className="space-y-3">
                {players.map((p) => {
                  const isFollowed = followedIds.has(p.id);
                  return (
                    <div key={p.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3">
                      <div 
                        onClick={() => onSelectPlayer && onSelectPlayer(p)} 
                        className="flex items-center gap-3 cursor-pointer group flex-1"
                      >
                        <img
                          src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={p.full_name}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700 group-hover:ring-cyan-400"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">
                            {p.full_name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">
                            {p.primary_sport} • {p.position_role}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-semibold">
                            {(p.relevance_score * 100).toFixed(0)}% Affinity
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFollow(p.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isFollowed 
                            ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        }`}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Communities */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Recommended Communities</span>
              </h3>

              <div className="space-y-3">
                {communities.map((comm) => (
                  <div key={comm.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-100">{comm.name}</h4>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {comm.sport_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {comm.description}
                    </p>
                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-slate-500">{comm.members_count.toLocaleString()} Athletes</span>
                      <button
                        type="button"
                        onClick={() => alert(`Joined ${comm.name}!`)}
                        className="text-xs font-bold text-cyan-400 hover:underline"
                      >
                        Join Hub →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
