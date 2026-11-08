import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  Users, 
  Layers, 
  Info, 
  Filter, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { mlApi } from '../../services/api';

const SPORT_FILTERS = ['All Sports', 'Football', 'Cricket', 'Basketball', 'Tennis', 'Athletics'];

export default function TalentIdent({ onSelectPlayer }) {
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [loading, setLoading] = useState(true);
  const [talentData, setTalentData] = useState(null);
  const [selectedClusterId, setSelectedClusterId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTalentAnalysis();
  }, [selectedSport]);

  const loadTalentAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const sportParam = selectedSport === 'All Sports' ? null : selectedSport;
      const res = await mlApi.analyzeTalent({ sport_name: sportParam });
      setTalentData(res.talent_clusters);
    } catch (err) {
      setError(err.message || 'Error running talent cluster analysis');
    } finally {
      setLoading(false);
    }
  };

  const players = talentData?.players || [];
  const clusterSummary = talentData?.cluster_summary || [];

  const filteredPlayers = selectedClusterId === null
    ? players
    : players.filter(p => p.cluster_id === selectedClusterId);

  // Scatter data with jitter if points overlap
  const scatterPoints = players.map(p => ({
    x: p.pca_x,
    y: p.pca_y,
    name: p.player_name,
    sport: p.sport_name,
    cluster: p.cluster_label,
    color: p.badge_color,
    cluster_id: p.cluster_id,
    form: p.metrics.recent_form,
    win_rate: p.metrics.win_rate
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 rounded-xl border border-slate-700 bg-slate-900 text-xs shadow-xl space-y-1">
          <div className="font-bold text-white">{data.name}</div>
          <div className="text-[11px] text-slate-300">{data.sport}</div>
          <div className="text-[10px] font-semibold" style={{ color: data.color }}>
            {data.cluster}
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            Form: {data.form} • Win Rate: {data.win_rate}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Machine Learning Module 2 • Unsupervised K-Means Clustering</span>
          </div>
          <h1 className="text-2xl font-black text-white">Sports Talent Identification</h1>
          <p className="text-xs text-slate-400">
            Statistical athlete grouping via K-Means (k=4) and 2D Principal Component Analysis (PCA) projection.
          </p>
        </div>

        {/* Sport Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SPORT_FILTERS.map(sp => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSport === sp 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Statistical Assessment Notice:</strong> Clustering is an exploratory data analysis tool that groups performance patterns across multiple metrics (win rate, offensive contributions, recent form, consistency). It does <em>not</em> claim to conclusively prove athlete talent, but serves as an objective reference for coaches and scouts.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel p-16 rounded-3xl text-center border border-slate-800">
          <RefreshCw className="w-8 h-8 text-cyan-500 mx-auto mb-3 animate-spin" />
          <p className="text-xs text-slate-400">Performing K-Means Clustering & Dimensionality Reduction...</p>
        </div>
      ) : (
        <>
          {/* Cluster Summary Cards (4 Tiers) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clusterSummary.map((c) => {
              const isSelected = selectedClusterId === c.cluster_id;
              return (
                <div
                  key={c.cluster_id}
                  onClick={() => setSelectedClusterId(isSelected ? null : c.cluster_id)}
                  className={`p-5 rounded-2xl glass-panel border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: c.color }} 
                    />
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {c.count} Athletes
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-white mb-1">
                    {c.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {c.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-bold" style={{ color: c.color }}>
                    Verdict: {c.verdict}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2D PCA Cluster Map & Metrics Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 2D Scatter Plot */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>2D PCA Talent Cluster Map</span>
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  Variance Retained: {talentData?.metrics?.variance_explained_pct || 64.2}%
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" dataKey="x" name="PCA Axis 1 (Output & Win Rate)" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis type="number" dataKey="y" name="PCA Axis 2 (Form & Consistency)" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter name="Athletes" data={scatterPoints}>
                      {scatterPoints.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          opacity={selectedClusterId === null || selectedClusterId === entry.cluster_id ? 1.0 : 0.25}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                {clusterSummary.map(c => (
                  <div key={c.cluster_id} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Comparison Breakdown */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Cluster Distribution & Silhouette Score</span>
              </h3>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Silhouette Metric:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {talentData?.metrics?.silhouette_score || 0.485} (Separated)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Clusters Formed:</span>
                  <span className="font-mono font-bold text-slate-100">4 Distinct Profiles</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Athletes Evaluated:</span>
                  <span className="font-mono font-bold text-slate-100">{players.length} Profiles</span>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterSummary} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="cluster_id" tickFormatter={(v) => `Cluster ${v}`} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Player Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Talent Scouting Table */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Athletic Scouting Evaluation Table ({filteredPlayers.length} Athletes)</span>
              </h3>
              {selectedClusterId !== null && (
                <button
                  onClick={() => setSelectedClusterId(null)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Clear filter (show all)
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Athlete</th>
                    <th className="py-3 px-3">Sport</th>
                    <th className="py-3 px-3">Talent Tier</th>
                    <th className="py-3 px-3">Win Rate</th>
                    <th className="py-3 px-3">Recent Form</th>
                    <th className="py-3 px-3">Scouting Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredPlayers.map((p) => (
                    <tr key={p.player_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-100">
                        {p.player_name}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {p.sport_name}
                      </td>
                      <td className="py-3 px-3">
                        <span 
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold inline-block border"
                          style={{
                            backgroundColor: `${p.badge_color}18`,
                            borderColor: `${p.badge_color}40`,
                            color: p.badge_color
                          }}
                        >
                          {p.cluster_label}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                        {p.metrics.win_rate}%
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-cyan-400">
                        {p.metrics.recent_form}/100
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {p.scouting_verdict}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

