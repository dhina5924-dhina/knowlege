import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { sportsApi } from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await sportsApi.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.warn('Notifications fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-indigo-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'prediction':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <span>Activity Notifications</span>
          </h2>
          <p className="text-xs text-slate-400">Likes, comments, athlete follows, and AI prediction updates.</p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mark all read</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="p-4 rounded-2xl glass-panel animate-pulse h-16 bg-slate-900" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No new activity notifications.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl glass-panel border flex items-center justify-between gap-4 transition-all ${
                item.is_read 
                  ? 'border-slate-800/80 bg-slate-900/40 text-slate-400' 
                  : 'border-indigo-500/30 bg-slate-900/90 text-slate-100 shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-700/60">
                  {getIcon(item.type)}
                </div>
                <div>
                  <p className="text-xs font-medium leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                    {item.time}
                  </span>
                </div>
              </div>

              {!item.is_read && (
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

