import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, ShieldCheck, Users, Trophy } from 'lucide-react';
import { sportsApi } from '../services/api';

const SPORTS = ['All', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Athletics'];

export default function Explore({ onSelectPlayer, initialSearch = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSport, setSelectedSport] = useState('All');
  const [players, setPlayers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [followedIds, setFollowedIds] = useState(new Set(['b101-sarah-cricket']));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedSport, searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [playerRes, commRes] = await Promise.all([
        sportsApi.getPlayers(selectedSport, searchTerm),
        sportsApi.getCommunities()
      ]);
      setPlayers(playerRes.players || []);
      setCommunities(commRes.communities || []);
    } catch (err) {
      console.warn('Explore load fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = (playerId) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      if (next.has(playerId)) {
        next.delete(playerId);
      } else {
        next.add(playerId);
      }
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      
      {/* Header & Search */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            <span>Discover Athletes & Communities</span>
          </h2>
          <p className="text-xs text-slate-400">Search verified athletes, review match statistics, and follow players.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by player name or username..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {SPORTS.map(sp => (
              <button
                key={sp}
                onClick={() => setSelectedSport(sp)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSport === sp 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Athletes Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Athletes ({players.length})</span>
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="glass-panel p-5 rounded-2xl h-44 animate-pulse bg-slate-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((p) => {
              const isFollowing = followedIds.has(p.id);
              const stats = p.stats || {};
              return (
                <div key={p.id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all bg-slate-900/70 space-y-4">
                  <div className="flex items-start justify-between">
                    <div 
                      onClick={() => onSelectPlayer && onSelectPlayer(p)} 
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                        alt={p.full_name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-400 transition-all"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                            {p.full_name}
                          </h4>
                          {p.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-xs text-slate-400">@{p.username}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                          {p.primary_sport} • {p.position_role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats Mini Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Matches</div>
                      <div className="text-xs font-bold text-slate-200">{stats.matches_played || 0}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Win Rate</div>
                      <div className="text-xs font-bold text-emerald-400">{stats.win_rate || 0}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Recent Form</div>
                      <div className="text-xs font-bold text-cyan-400">{stats.recent_form || 0}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => toggleFollow(p.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isFollowing
                          ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow Player</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => onSelectPlayer && onSelectPlayer(p)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sports Communities Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Active Sports Communities</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communities.map((comm) => (
            <div key={comm.id} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{comm.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {comm.sport_name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {comm.description}
                </p>
                <div className="text-[11px] text-cyan-400 font-semibold pt-1">
                  {comm.members_count.toLocaleString()} Registered Athletes
                </div>
              </div>

              <button
                onClick={() => alert(`Joined ${comm.name} community!`)}
                className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 transition-colors"
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
