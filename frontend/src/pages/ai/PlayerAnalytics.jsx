import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Users, 
  TrendingUp, 
  Scale, 
  RefreshCw 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { sportsApi } from '../../services/api';

export default function PlayerAnalytics() {
  const [players, setPlayers] = useState([]);
  const [playerAId, setPlayerAId] = useState('');
  const [playerBId, setPlayerBId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await sportsApi.getPlayers();
      const list = res.players || [];
      setPlayers(list);
      if (list.length >= 2) {
        setPlayerAId(list[0].id);
        setPlayerBId(list[1].id);
      }
    } catch (err) {
      console.warn('Player analytics fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const playerA = players.find(p => p.id === playerAId) || players[0];
  const playerB = players.find(p => p.id === playerBId) || players[1];

  const statsA = playerA?.stats || {};
  const statsB = playerB?.stats || {};

  const comparisonData = [
    { metric: 'Win Rate %', PlayerA: statsA.win_rate || 60, PlayerB: statsB.win_rate || 55 },
    { metric: 'Recent Form', PlayerA: statsA.recent_form || 75, PlayerB: statsB.recent_form || 70 },
    { metric: 'Consistency', PlayerA: statsA.consistency_score || 80, PlayerB: statsB.consistency_score || 75 },
    { metric: 'Matches', PlayerA: Math.min(100, (statsA.matches_played || 10) * 2), PlayerB: Math.min(100, (statsB.matches_played || 10) * 2) },
    { metric: 'Offense Pts', PlayerA: Math.min(100, ((statsA.goals_or_points || 20) / Math.max(1, statsA.matches_played || 1)) * 10), PlayerB: Math.min(100, ((statsB.goals_or_points || 20) / Math.max(1, statsB.matches_played || 1)) * 10) },
  ];

  const barComparisonData = [
    { name: 'Win %', [playerA?.full_name || 'Player 1']: statsA.win_rate, [playerB?.full_name || 'Player 2']: statsB.win_rate },
    { name: 'Recent Form', [playerA?.full_name || 'Player 1']: statsA.recent_form, [playerB?.full_name || 'Player 2']: statsB.recent_form },
    { name: 'Consistency', [playerA?.full_name || 'Player 1']: statsA.consistency_score, [playerB?.full_name || 'Player 2']: statsB.consistency_score },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Sports Intelligence • Comparative Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white">Player Performance Analytics</h1>
          <p className="text-xs text-slate-400">
            Head-to-head multi-variable statistical radar comparison and performance metric decomposition.
          </p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Player 1 Select */}
        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 bg-slate-900/70 space-y-2">
          <label className="text-xs font-bold text-indigo-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Select Contender A</span>
          </label>
          <select
            value={playerAId}
            onChange={(e) => setPlayerAId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.full_name} ({p.primary_sport})</option>
            ))}
          </select>
        </div>

        {/* Player 2 Select */}
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-slate-900/70 space-y-2">
          <label className="text-xs font-bold text-cyan-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Select Contender B</span>
          </label>
          <select
            value={playerBId}
            onChange={(e) => setPlayerBId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
          >
            {players.map(p => (
              <option key={p.id} value={p.id}>{p.full_name} ({p.primary_sport})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart (Left - 7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Multi-Axis Athletic Radar</span>
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparisonData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
                <Radar name={playerA?.full_name || 'Player A'} dataKey="PlayerA" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name={playerB?.full_name || 'Player B'} dataKey="PlayerB" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Head-to-Head Bar & Table (Right - 5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Head-to-Head Metrics Breakdown</span>
          </h3>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barComparisonData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                <Bar dataKey={playerA?.full_name || 'Player A'} fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey={playerB?.full_name || 'Player B'} fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between items-center py-1.5 px-3 rounded-xl bg-slate-950/60">
              <span className="text-slate-400">Matches Won:</span>
              <div className="space-x-3 font-mono font-bold">
                <span className="text-indigo-400">{statsA.matches_won || 0}</span>
                <span className="text-slate-600">vs</span>
                <span className="text-cyan-400">{statsB.matches_won || 0}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 px-3 rounded-xl bg-slate-950/60">
              <span className="text-slate-400">Points Scored:</span>
              <div className="space-x-3 font-mono font-bold">
                <span className="text-indigo-400">{statsA.goals_or_points || 0}</span>
                <span className="text-slate-600">vs</span>
                <span className="text-cyan-400">{statsB.goals_or_points || 0}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1.5 px-3 rounded-xl bg-slate-950/60">
              <span className="text-slate-400">Assists / Passes:</span>
              <div className="space-x-3 font-mono font-bold">
                <span className="text-indigo-400">{statsA.assists_or_passes || 0}</span>
                <span className="text-slate-600">vs</span>
                <span className="text-cyan-400">{statsB.assists_or_passes || 0}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
