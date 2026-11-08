import React, { useState } from 'react';
import { Trophy, Mail, Lock, User, Sparkles, Check, AlertCircle } from 'lucide-react';
import { authService, isSupabaseConfigured } from '../services/supabase';

export default function Auth({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [sport, setSport] = useState('Football');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      if (isRegister) {
        user = await authService.register(email, password, {
          full_name: fullName,
          primary_sport: sport
        });
      } else {
        user = await authService.login(email, password);
      }
      if (onAuthSuccess) onAuthSuccess(user);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoProfile) => {
    setLoading(true);
    try {
      const user = await authService.login(demoProfile.email, 'password123');
      const enhancedUser = {
        ...user,
        user_metadata: {
          username: demoProfile.username,
          full_name: demoProfile.name,
          primary_sport: demoProfile.sport,
          avatar_url: demoProfile.avatar
        }
      };
      localStorage.setItem('sports_auth_user', JSON.stringify(enhancedUser));
      if (onAuthSuccess) onAuthSuccess(enhancedUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Join the Platform' : 'Athlete Sign In'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSupabaseConfigured 
              ? 'Secured with Supabase PostgreSQL & Auth' 
              : 'Sign in to access AI Sports Intelligence & feeds'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. David Silva"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Sport</label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Football">Football</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Athletics">Athletics</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@sportsplatform.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>

        {/* 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Instant 1-Click Demo Athletes</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Sarah (Cricket)', username: 'sarah_cricket', sport: 'Cricket', email: 'sarah@sportsplatform.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
              { name: 'Marcus (Hoops)', username: 'marcus_dunk', sport: 'Basketball', email: 'marcus@sportsplatform.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
              { name: 'David (Football)', username: 'david_kick', sport: 'Football', email: 'david@sportsplatform.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
              { name: 'Elena (Tennis)', username: 'elena_tennis', sport: 'Tennis', email: 'elena@sportsplatform.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
            ].map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickDemoLogin(p)}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors flex items-center gap-2 group"
              >
                <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                <span className="text-[11px] font-medium text-slate-300 group-hover:text-white truncate">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
