import React from 'react';
import { 
  Trophy, 
  Search, 
  Bell, 
  PlusCircle, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  User,
  LogOut
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabase';

export default function Navbar({ 
  currentUser, 
  onOpenUpload, 
  onNavigate, 
  unreadCount = 2, 
  onLogout 
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('feed')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              SPORTS<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">PRO</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Intelligent Sports Management</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search players, sports, tactics, posts..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate('explore', { search: e.target.value });
                }
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-900/90 text-slate-200 placeholder-slate-500 border border-slate-800 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Action Controls & Supabase Status */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-slate-900 border-slate-800 text-slate-300">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Supabase:</span>
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-semibold" title="Fill .env to connect to live Supabase URL">
                <AlertCircle className="w-3 h-3" /> Ready / Active
              </span>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post Media</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar & Menu */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <button 
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-2 text-left group"
              >
                <img
                  src={currentUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-400 transition-all"
                />
                <span className="hidden lg:block text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                  {currentUser.user_metadata?.full_name || 'Athlete'}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Sign out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

