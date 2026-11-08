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

export default function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [currentUser, setCurrentUser] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [exploreInitialSearch, setExploreInitialSearch] = useState('');

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleNavigate = (viewId, params = {}) => {
    if (params.search) {
      setExploreInitialSearch(params.search);
    }
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    setCurrentView('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunPrediction = (player) => {
    setSelectedPlayer(player);
    setCurrentView('ai-predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setCurrentView('feed');
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
          onNavigate={(id) => setCurrentView(id)}
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
                setCurrentView('feed');
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
          setCurrentView('feed');
        }}
      />
    </div>
  );
}
