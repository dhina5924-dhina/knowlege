import React from 'react';
import { 
  Home, 
  Compass, 
  Users, 
  Bell, 
  UserCheck, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Compass as RecommendIcon, 
  BarChart3, 
  History,
  Activity
} from 'lucide-react';

export default function Sidebar({ currentView, onNavigate }) {
  const mainNav = [
    { id: 'feed', label: 'Sports Feed', icon: Home },
    { id: 'explore', label: 'Explore & Search', icon: Compass },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Athlete Profile', icon: UserCheck },
  ];

  const aiNav = [
    { id: 'ai-predict', label: '1. Performance Prediction', icon: TrendingUp, tag: 'Random Forest' },
    { id: 'ai-talent', label: '2. Talent Identification', icon: Award, tag: 'K-Means' },
    { id: 'ai-recommend', label: '3. Personalized Recs', icon: RecommendIcon, tag: 'Content-Based' },
    { id: 'ai-analytics', label: '4. Player Analytics', icon: BarChart3, tag: 'Comparative' },
    { id: 'ai-history', label: '5. Prediction History', icon: History, tag: 'Audit Log' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block py-6 px-4 bg-[#0B0F17] border-r border-slate-800/80 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        
        {/* Main Section */}
        <div>
          <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Social & Community
          </h3>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active 
                      ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Sports Intelligence Section */}
        <div>
          <div className="px-3 flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI Sports Intelligence
            </h3>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold border border-cyan-500/20">
              3 ML MODS
            </span>
          </div>

          <nav className="space-y-1">
            {aiNav.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex flex-col items-start px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 shadow-sm' 
                      : 'text-slate-350 text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className={active ? 'text-white font-bold' : ''}>{item.label}</span>
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 pl-5.5 font-normal">
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live ML Health Summary Widget */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>ML Engine Status</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between items-center">
              <span>Random Forest:</span>
              <span className="font-mono text-emerald-400 font-semibold">R² 0.968</span>
            </div>
            <div className="flex justify-between items-center">
              <span>K-Means Clusters:</span>
              <span className="font-mono text-cyan-400 font-semibold">k=4 Tiers</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TF-IDF Filter:</span>
              <span className="font-mono text-indigo-400 font-semibold">Cosine Sim</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}
