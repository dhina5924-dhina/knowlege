import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  RefreshCw, 
  Table, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Download,
  Layers,
  Sparkles,
  Trophy
} from 'lucide-react';
import { sportsApi, mlApi } from '../services/api';
import { isSupabaseConfigured } from '../services/supabase';

const TABLES = [
  { id: 'predictions', name: 'player_predictions', label: '1. ML Predictions', icon: Sparkles },
  { id: 'stats', name: 'player_statistics', label: '2. Player Statistics', icon: Trophy },
  { id: 'profiles', name: 'profiles', label: '3. Athlete Profiles', icon: Table },
  { id: 'posts', name: 'posts', label: '4. Uploaded Posts & Media', icon: FileText },
  { id: 'clusters', name: 'talent_clusters', label: '5. Talent Clusters', icon: Layers }
];

export default function DataExplorer() {
  const [activeTable, setActiveTable] = useState('predictions');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Table Data States
  const [predictionsData, setPredictionsData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [profilesData, setProfilesData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [clustersData, setClustersData] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [playersRes, postsRes, historyRes, talentRes] = await Promise.all([
        sportsApi.getPlayers(),
        sportsApi.getPosts('All'),
        mlApi.getPredictionHistory('b103-david-kick'),
        mlApi.analyzeTalent()
      ]);

      const players = playersRes.players || [];
      setProfilesData(players);
      setPostsData(postsRes.posts || []);
      setPredictionsData(historyRes.history || []);
      
      const statsList = players.map(p => ({
        id: `stat-${p.id}`,
        player_name: p.full_name,
        sport_name: p.primary_sport,
        ...(p.stats || {})
      }));
      setStatsData(statsList);

      setClustersData(talentRes.talent_clusters?.players || []);
    } catch (err) {
      console.warn('Data load warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentData = () => {
    switch (activeTable) {
      case 'predictions': return predictionsData;
      case 'stats': return statsData;
      case 'profiles': return profilesData;
      case 'posts': return postsData;
      case 'clusters': return clustersData;
      default: return [];
    }
  };

  const rawList = getCurrentData();
  const filteredList = rawList.filter(item => {
    if (!searchTerm) return true;
    const str = JSON.stringify(item).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Database & Storage Viewer</span>
          </div>
          <h1 className="text-2xl font-black text-white">Stored Platform Data Explorer</h1>
          <p className="text-xs text-slate-400">
            Inspect all active records stored in Supabase PostgreSQL tables, ML outputs, and uploaded media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 bg-slate-900 border-slate-800">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Storage Backend:</span>
            {isSupabaseConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Supabase Live
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> Supabase Ready / Fallback
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Table Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABLES.map((t) => {
          const Icon = t.icon;
          const active = activeTable === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                setActiveTable(t.id);
                setSelectedRecord(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-black/40 font-mono">
                {t.id === 'predictions' ? predictionsData.length :
                 t.id === 'stats' ? statsData.length :
                 t.id === 'profiles' ? profilesData.length :
                 t.id === 'posts' ? postsData.length :
                 clustersData.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search across ${TABLES.find(t => t.id === activeTable)?.name} records...`}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Main Table View */}
      <div className="glass-panel rounded-3xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400">table: public.{TABLES.find(t => t.id === activeTable)?.name}</span>
            <span className="text-[11px] text-slate-500">({filteredList.length} rows loaded)</span>
          </div>

          <button
            type="button"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredList, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `${TABLES.find(t => t.id === activeTable)?.name}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
            Fetching data rows...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No records found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/60">
                  <th className="py-3 px-4"># Row</th>
                  {activeTable === 'predictions' && (
                    <>
                      <th className="py-3 px-4">Athlete</th>
                      <th className="py-3 px-4">Sport</th>
                      <th className="py-3 px-4">Predicted Score</th>
                      <th className="py-3 px-4">Performance Tier</th>
                      <th className="py-3 px-4">Model Tag</th>
                    </>
                  )}
                  {activeTable === 'stats' && (
                    <>
                      <th className="py-3 px-4">Athlete</th>
                      <th className="py-3 px-4">Sport</th>
                      <th className="py-3 px-4">Matches</th>
                      <th className="py-3 px-4">Win Rate %</th>
                      <th className="py-3 px-4">Points / Goals</th>
                      <th className="py-3 px-4">Recent Form</th>
                    </>
                  )}
                  {activeTable === 'profiles' && (
                    <>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Primary Sport</th>
                      <th className="py-3 px-4">Role / Position</th>
                      <th className="py-3 px-4">Verified</th>
                    </>
                  )}
                  {activeTable === 'posts' && (
                    <>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Sport</th>
                      <th className="py-3 px-4">Media Type</th>
                      <th className="py-3 px-4">Likes</th>
                      <th className="py-3 px-4">Comments</th>
                      <th className="py-3 px-4">Caption</th>
                    </>
                  )}
                  {activeTable === 'clusters' && (
                    <>
                      <th className="py-3 px-4">Athlete</th>
                      <th className="py-3 px-4">Sport</th>
                      <th className="py-3 px-4">Talent Tier</th>
                      <th className="py-3 px-4">PCA (x, y)</th>
                      <th className="py-3 px-4">Scouting Verdict</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredList.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{index + 1}</td>
                    
                    {activeTable === 'predictions' && (
                      <>
                        <td className="py-3 px-4 font-bold text-white">{item.player_name || item.profiles?.full_name || 'Athlete'}</td>
                        <td className="py-3 px-4 text-slate-300">{item.sport_name || 'General'}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">{item.predicted_score} / 100</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {item.performance_tier || 'Advanced'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{item.model_version || 'rf-v1.0'}</td>
                      </>
                    )}

                    {activeTable === 'stats' && (
                      <>
                        <td className="py-3 px-4 font-bold text-white">{item.player_name}</td>
                        <td className="py-3 px-4 text-slate-300">{item.sport_name}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{item.matches_played}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-400">{item.win_rate}%</td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{item.goals_or_points}</td>
                        <td className="py-3 px-4 font-mono text-indigo-300">{item.recent_form}/100</td>
                      </>
                    )}

                    {activeTable === 'profiles' && (
                      <>
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <img src={item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
                          <span>{item.full_name}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-400">@{item.username}</td>
                        <td className="py-3 px-4 text-indigo-300 font-semibold">{item.primary_sport}</td>
                        <td className="py-3 px-4 text-slate-300">{item.position_role}</td>
                        <td className="py-3 px-4">
                          {item.is_verified ? (
                            <span className="text-emerald-400 text-[10px] font-bold">✓ Verified</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Standard</span>
                          )}
                        </td>
                      </>
                    )}

                    {activeTable === 'posts' && (
                      <>
                        <td className="py-3 px-4 font-bold text-white">{item.author_name}</td>
                        <td className="py-3 px-4 text-slate-300">{item.sport_name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.media_type === 'video' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-300'}`}>
                            {item.media_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-400">{item.likes_count || 0}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{item.comments_count || 0}</td>
                        <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{item.caption}</td>
                      </>
                    )}

                    {activeTable === 'clusters' && (
                      <>
                        <td className="py-3 px-4 font-bold text-white">{item.player_name}</td>
                        <td className="py-3 px-4 text-slate-300">{item.sport_name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border" style={{ backgroundColor: `${item.badge_color}20`, borderColor: item.badge_color, color: item.badge_color }}>
                            {item.cluster_label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400 text-[11px]">({item.pca_x}, {item.pca_y})</td>
                        <td className="py-3 px-4 text-slate-300 text-[11px]">{item.scouting_verdict}</td>
                      </>
                    )}

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>JSON</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* JSON Record Inspector Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Raw Record Inspector (PostgreSQL Row)</span>
              </h3>
              <button 
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                Close
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-auto max-h-96">
              {JSON.stringify(selectedRecord, null, 2)}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
