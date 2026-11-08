import React, { useState } from 'react';
import { 
  Trophy, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Award,
  Edit3
} from 'lucide-react';

export default function Profile({ player, onRunPrediction, isCurrentUser = true }) {
  const current = player || {
    id: 'b103-david-kick',
    username: 'david_kick',
    full_name: 'David Silva',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    primary_sport: 'Football',
    position_role: 'Attacking Midfielder',
    team_name: 'Madrid FC',
    country: 'Spain',
    bio: 'Dedicated attacking playmaker focusing on high-efficiency passing and tempo control. Committed to science-backed conditioning and tactical growth.',
    stats: {
      matches_played: 42,
      matches_won: 28,
      win_rate: 66.7,
      goals_or_points: 18.0,
      assists_or_passes: 24.0,
      recent_form: 84.0,
      consistency_score: 82.0,
      minutes_played: 3450
    }
  };

  const [activeTab, setActiveTab] = useState('overview');
  const stats = current.stats || {};

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={current.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
            alt={current.full_name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-2xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-black text-white">{current.full_name}</h2>
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-400 font-medium">@{current.username}</p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={() => onRunPrediction && onRunPrediction(current)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Predict Performance</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl pt-1">
              {current.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                {current.primary_sport}
              </span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{current.position_role}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{current.team_name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {current.country}
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Matches Played</span>
            <div className="text-xl font-black text-white mt-0.5">{stats.matches_played || 0}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Win Rate</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{stats.win_rate || 0}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Goals / Points</span>
            <div className="text-xl font-black text-cyan-400 mt-0.5">{stats.goals_or_points || 0}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Recent Form (0-100)</span>
            <div className="text-xl font-black text-indigo-400 mt-0.5">{stats.recent_form || 0}</div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors ${
            activeTab === 'overview'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Athletic Breakdown
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`pb-3 transition-colors ${
            activeTab === 'media'
              ? 'text-indigo-400 border-b-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Media & Highlights
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Career Consistency Metrics</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Consistency Score:</span>
                <span className="font-bold text-slate-100">{stats.consistency_score || 80}/100</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Assists / Passes:</span>
                <span className="font-bold text-slate-100">{stats.assists_or_passes || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Minutes on Pitch:</span>
                <span className="font-bold text-slate-100">{stats.minutes_played || 0} mins</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">Season:</span>
                <span className="font-bold text-indigo-400">2025 / 2026 Competitive</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Scouting & Machine Learning Status</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ML Model Readiness:</span>
                <span className="text-emerald-400 font-bold">100% Synced</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Statistics have been normalized and validated against the Random Forest Regressor and K-Means Clustering models.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500"
            alt="Media 1"
            className="rounded-2xl object-cover h-48 w-full border border-slate-800 hover:scale-105 transition-transform"
          />
          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500"
            alt="Media 2"
            className="rounded-2xl object-cover h-48 w-full border border-slate-800 hover:scale-105 transition-transform"
          />
          <img
            src="https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=500"
            alt="Media 3"
            className="rounded-2xl object-cover h-48 w-full border border-slate-800 hover:scale-105 transition-transform"
          />
        </div>
      )}

    </div>
  );
}
