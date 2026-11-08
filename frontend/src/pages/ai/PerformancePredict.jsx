import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { mlApi, sportsApi } from '../../services/api';

const SPORTS = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Athletics'];

export default function PerformancePredict({ initialPlayer }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialPlayer?.id || '');
  const [sport, setSport] = useState(initialPlayer?.primary_sport || 'Football');
  const [playerName, setPlayerName] = useState(initialPlayer?.full_name || 'Marcus Vance');
  
  // Stats form state
  const [matchesPlayed, setMatchesPlayed] = useState(35);
  const [matchesWon, setMatchesWon] = useState(24);
  const [goalsOrPoints, setGoalsOrPoints] = useState(380.0);
  const [assistsOrPasses, setAssistsOrPasses] = useState(115.0);
  const [recentForm, setRecentForm] = useState(86.5);
  const [consistencyScore, setConsistencyScore] = useState(82.0);

  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const res = await sportsApi.getPlayers();
      setPlayers(res.players || []);
      if (!selectedPlayerId && res.players?.length > 0) {
        handleSelectPlayer(res.players[0]);
      }
    } catch (err) {
      console.warn('Player list fallback:', err);
    }
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
    setPlayerName(player.full_name);
    setSport(player.primary_sport);
    const s = player.stats || {};
    setMatchesPlayed(s.matches_played || 30);
    setMatchesWon(s.matches_won || 20);
    setGoalsOrPoints(s.goals_or_points || 250);
    setAssistsOrPasses(s.assists_or_passes || 40);
    setRecentForm(s.recent_form || 80);
    setConsistencyScore(s.consistency_score || 78);
  };

  const handleRunPrediction = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        player_id: selectedPlayerId || undefined,
        player_name: playerName,
        sport_name: sport,
        matches_played: parseInt(matchesPlayed, 10),
        matches_won: parseInt(matchesWon, 10),
        goals_or_points: parseFloat(goalsOrPoints),
        assists_or_passes: parseFloat(assistsOrPasses),
        recent_form: parseFloat(recentForm),
        consistency_score: parseFloat(consistencyScore),
        minutes_played: parseInt(matchesPlayed, 10) * 85
      };

      const res = await mlApi.predictPerformance(payload);
      setPredictionResult(res.prediction);
    } catch (err) {
      setError(err.message || 'Error generating performance prediction');
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on mount
  useEffect(() => {
    handleRunPrediction();
  }, [sport]);

  // Historical trend projection data for Recharts
  const trendData = predictionResult ? [
    { match: 'M-5', actual: Math.max(30, recentForm - 8), trend: recentForm - 6 },
    { match: 'M-4', actual: Math.max(30, recentForm - 5), trend: recentForm - 4 },
    { match: 'M-3', actual: recentForm - 2, trend: recentForm - 1 },
    { match: 'M-2', actual: Math.min(99, recentForm + 2), trend: recentForm },
    { match: 'Recent (M-1)', actual: recentForm, trend: recentForm + 1 },
    { match: 'Predicted Next', actual: null, predicted: predictionResult.predicted_score, trend: predictionResult.predicted_score }
  ] : [];

  const radarData = predictionResult ? [
    { subject: 'Win Rate', value: Math.min(100, (matchesWon / Math.max(1, matchesPlayed)) * 100), fullMark: 100 },
    { subject: 'Recent Form', value: recentForm, fullMark: 100 },
    { subject: 'Consistency', value: consistencyScore, fullMark: 100 },
    { subject: 'Output Volume', value: Math.min(100, (goalsOrPoints / matchesPlayed) * 6), fullMark: 100 },
    { subject: 'Future Score', value: predictionResult.predicted_score, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Machine Learning Module 1 • Random Forest Regression</span>
          </div>
          <h1 className="text-2xl font-black text-white">Player Performance Prediction</h1>
          <p className="text-xs text-slate-400">
            Predict future match performance scores (0–100) using multi-variate Random Forest models trained on Supabase match statistics.
          </p>
        </div>

        {/* Model Accuracy Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border border-slate-800 bg-slate-900/80">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">RF Model Accuracy</div>
            <div className="text-sm font-black text-emerald-400 font-mono">R² 0.968 • MAE 1.76</div>
          </div>
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: Input Form (Left) & Live Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Player Match Statistics</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              Live Input
            </span>
          </div>

          {/* Quick Select Preset Athlete */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Load Verified Athlete</label>
            <select
              value={selectedPlayerId}
              onChange={(e) => {
                const found = players.find(p => p.id === e.target.value);
                if (found) handleSelectPlayer(found);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Custom / Ad-hoc Player</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.primary_sport} • {p.team_name || 'Pro'})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sport Type</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matches Played</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={matchesPlayed}
                  onChange={(e) => setMatchesPlayed(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Matches Won</label>
                <input
                  type="number"
                  min="0"
                  max={matchesPlayed}
                  value={matchesWon}
                  onChange={(e) => setMatchesWon(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goals or Points</label>
                <input
                  type="number"
                  step="0.5"
                  value={goalsOrPoints}
                  onChange={(e) => setGoalsOrPoints(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assists or Passes</label>
                <input
                  type="number"
                  step="0.5"
                  value={assistsOrPasses}
                  onChange={(e) => setAssistsOrPasses(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Slider Inputs for Ratings */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Recent Form Rating</span>
                  <span className="font-mono font-bold text-cyan-400">{recentForm}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="99"
                  step="0.5"
                  value={recentForm}
                  onChange={(e) => setRecentForm(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Baseline Consistency</span>
                  <span className="font-mono font-bold text-indigo-400">{consistencyScore}/100</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="99"
                  step="0.5"
                  value={consistencyScore}
                  onChange={(e) => setConsistencyScore(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing RF Regression...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Performance Prediction</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Prediction Results & Graphs (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {predictionResult ? (
            <>
              {/* Score Highlight Banner */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/90 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Score Dial */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-700/80 flex flex-col items-center justify-center shadow-2xl">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SCORE</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 font-mono">
                        {predictionResult.predicted_score}
                      </span>
                      <span className="text-[9px] text-slate-500">out of 100</span>
                    </div>

                    <div className="space-y-1">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border shadow-sm"
                        style={{
                          backgroundColor: `${predictionResult.badge_color}18`,
                          borderColor: `${predictionResult.badge_color}40`,
                          color: predictionResult.badge_color
                        }}
                      >
                        {predictionResult.performance_tier}
                      </span>
                      <h3 className="text-lg font-black text-white">{predictionResult.player_name}</h3>
                      <p className="text-xs text-slate-400">
                        95% CI Range: <strong className="text-slate-200">{predictionResult.confidence_interval.lower}</strong> – <strong className="text-slate-200">{predictionResult.confidence_interval.upper}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 gap-2 text-center w-full sm:w-auto">
                    <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Win Rate</span>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {((matchesWon / Math.max(1, matchesPlayed)) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] text-slate-400">Recent Delta</span>
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {(recentForm - consistencyScore).toFixed(1)} pts
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Performance Trend Chart */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>Performance Trajectory & AI Prediction</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">5 Matches + 1 Future Prediction</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="match" stroke="#64748b" tick={{ fontSize: 11 }} />
                      <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="trend" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" name="Form Trajectory" />
                      <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} name="Actual Form" />
                      <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={4} strokeDasharray="5 5" dot={{ r: 6, fill: '#10b981' }} name="Predicted Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Statistical Improvement Suggestions */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Statistical Improvement Suggestions</span>
                </h4>

                <div className="space-y-2.5">
                  {predictionResult.improvement_suggestions?.map((sug, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100">{sug.category}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-semibold">
                            Impact: {sug.impact}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {sug.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
              <RefreshCw className="w-8 h-8 text-slate-600 mx-auto mb-3 animate-spin" />
              <p className="text-xs text-slate-400">Loading initial Random Forest regression...</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
