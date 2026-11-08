import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePostModal from './components/CreatePostModal';

// Pages
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Auth from './pages/Auth';

// AI Sports Intelligence Pages
import PerformancePredict from './pages/ai/PerformancePredict';
import TalentIdent from './pages/ai/TalentIdent';
import Recommendations from './pages/ai/Recommendations';
import PlayerAnalytics from './pages/ai/PlayerAnalytics';
import PredictionHistory from './pages/ai/PredictionHistory';

import { authService } from './services/supabase';

// Helper to get view from URL hash
const getViewFromHash = () => {
  const hash = window.location.hash.replace('#', '').trim();
  const validViews = [
    'feed', 'explore', 'profile', 'notifications', 'auth',
    'ai-predict', 'ai-talent', 'ai-recommend', 'ai-analytics', 'ai-history'
  ];
  return validViews.includes(hash) ? hash : 'feed';
};

export default function App() {
  const [currentView, setCurrentView] = useState(getViewFromHash);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [exploreInitialSearch, setExploreInitialSearch] = useState('');

  // Sync with browser URL hash navigation (Prevents reload resets and enables permanent bookmarkable links)
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(getViewFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when currentView changes
  const handleNavigate = (viewId, params = {}) => {
    if (params.search) {
      setExploreInitialSearch(params.search);
    }
    if (window.location.hash !== `#${viewId}`) {
      window.location.hash = `#${viewId}`;
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    handleNavigate('profile');
  };

  const handleRunPrediction = (player) => {
    setSelectedPlayer(player);
    handleNavigate('ai-predict');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    handleNavigate('feed');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        onOpenUpload={() => setIsUploadOpen(true)}
        onNavigate={handleNavigate}
        unreadCount={2}
        onLogout={handleLogout}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(id) => handleNavigate(id)}
        />

        {/* Content Body Area */}
        <main className="flex-1 min-w-0 pb-16">
          {currentView === 'feed' && (
            <Feed
              onNavigate={handleNavigate}
              onAuthorClick={(post) => {
                handleSelectPlayer({
                  id: post.id,
                  full_name: post.author_name,
                  username: post.author_username,
                  avatar_url: post.author_avatar,
                  primary_sport: post.sport_name
                });
              }}
            />
          )}

          {currentView === 'explore' && (
            <Explore
              onSelectPlayer={handleSelectPlayer}
              initialSearch={exploreInitialSearch}
            />
          )}

          {currentView === 'profile' && (
            <Profile
              player={selectedPlayer}
              onRunPrediction={handleRunPrediction}
              isCurrentUser={!selectedPlayer || selectedPlayer?.id === currentUser?.id}
            />
          )}

          {currentView === 'notifications' && (
            <Notifications />
          )}

          {currentView === 'auth' && (
            <Auth
              onAuthSuccess={(user) => {
                setCurrentUser(user);
                handleNavigate('feed');
              }}
            />
          )}

          {/* AI SPORTS INTELLIGENCE DASHBOARD PAGES */}
          {currentView === 'ai-predict' && (
            <PerformancePredict
              initialPlayer={selectedPlayer}
            />
          )}

          {currentView === 'ai-talent' && (
            <TalentIdent
              onSelectPlayer={handleSelectPlayer}
            />
          )}

          {currentView === 'ai-recommend' && (
            <Recommendations
              currentUser={currentUser}
              onSelectPlayer={handleSelectPlayer}
            />
          )}

          {currentView === 'ai-analytics' && (
            <PlayerAnalytics />
          )}

          {currentView === 'ai-history' && (
            <PredictionHistory />
          )}
        </main>
      </div>

      {/* Upload Media Modal */}
      <CreatePostModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPostCreated={(newPost) => {
          setIsUploadOpen(false);
          handleNavigate('feed');
        }}
      />
    </div>
  );
}
