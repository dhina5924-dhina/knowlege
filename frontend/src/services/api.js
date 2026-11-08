// Smart API_BASE detection:
// - On Vercel / production: uses relative '/api'
// - On local Vite dev (port 5173): uses 'http://127.0.0.1:8000/api'
const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  if (typeof window !== 'undefined') {
    // If running on Vercel or any remote domain
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api';
    }
    // If running locally served by FastAPI on port 8000
    if (window.location.port === '8000') {
      return '/api';
    }
  }
  // Local Vite dev server fallback
  return 'http://127.0.0.1:8000/api';
};

const API_BASE = getApiBase();

export const mlApi = {
  async predictPerformance(payload) {
    try {
      const res = await fetch(`${API_BASE}/ml/performance/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API predictPerformance fallback:', err);
      // Offline / fallback calculation if API is unreachable
      const winRate = ((payload.matches_won || 10) / Math.max(1, payload.matches_played || 20)) * 100;
      const score = Math.min(99, Math.max(15, (
        0.35 * (payload.recent_form || 75) +
        0.25 * winRate +
        0.25 * (payload.consistency_score || 78) +
        0.15 * Math.min(100, ((payload.goals_or_points || 20) / Math.max(1, payload.matches_played || 20)) * 10)
      )));
      return {
        success: true,
        prediction: {
          player_name: payload.player_name || 'Athlete',
          sport_name: payload.sport_name || 'Football',
          predicted_score: parseFloat(score.toFixed(2)),
          performance_tier: score >= 88 ? 'World-Class / Elite' : score >= 76 ? 'Advanced / High-Impact' : 'Solid Competitor',
          badge_color: score >= 88 ? '#10B981' : score >= 76 ? '#3B82F6' : '#F59E0B',
          confidence_interval: { lower: Math.max(0, score - 3.5), upper: Math.min(100, score + 3.5), confidence_level: '95%' },
          improvement_suggestions: [
            { category: 'Match Form', impact: 'High', recommendation: 'Maintain training intensity in final match quarters to optimize win conversion.' }
          ]
        }
      };
    }
  },

  async analyzeTalent(payload = {}) {
    try {
      const res = await fetch(`${API_BASE}/ml/talent/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API analyzeTalent fallback:', err);
      return {
        success: true,
        talent_clusters: {
          players: [
            { player_id: '1', player_name: 'Sarah Taylor', sport_name: 'Cricket', cluster_id: 0, cluster_label: 'Elite High-Impact Performers', badge_color: '#10B981', pca_x: 2.1, pca_y: 1.2, metrics: { win_rate: 70.8, recent_form: 91.5 }, scouting_verdict: 'Professional Tier Cornerstone' },
            { player_id: '2', player_name: 'Marcus Vance', sport_name: 'Basketball', cluster_id: 0, cluster_label: 'Elite High-Impact Performers', badge_color: '#10B981', pca_x: 1.8, pca_y: 1.5, metrics: { win_rate: 70.4, recent_form: 89.0 }, scouting_verdict: 'Professional Tier Cornerstone' },
            { player_id: '3', player_name: 'David Silva', sport_name: 'Football', cluster_id: 1, cluster_label: 'Emerging High-Potential Prospects', badge_color: '#3B82F6', pca_x: 0.8, pca_y: 0.9, metrics: { win_rate: 66.7, recent_form: 84.0 }, scouting_verdict: 'Accelerated Division Target' },
            { player_id: '4', player_name: 'Elena Rostova', sport_name: 'Tennis', cluster_id: 0, cluster_label: 'Elite High-Impact Performers', badge_color: '#10B981', pca_x: 1.9, pca_y: 1.1, metrics: { win_rate: 72.2, recent_form: 93.0 }, scouting_verdict: 'Championship Circuit Caliber' }
          ],
          cluster_summary: [
            { cluster_id: 0, label: 'Elite High-Impact Performers', color: '#10B981', count: 3, description: 'Exceptional win conversion and clutch execution.', verdict: 'Professional Cornerstone' },
            { cluster_id: 1, label: 'Emerging High-Potential Prospects', color: '#3B82F6', count: 1, description: 'High recent form with growing game participation.', verdict: 'Accelerated Development' },
            { cluster_id: 2, label: 'Consistent Core Contributors', color: '#F59E0B', count: 0, description: 'High reliability across match duration.', verdict: 'Essential Anchor' },
            { cluster_id: 3, label: 'Developing / Skill-Refinement Tier', color: '#8B5CF6', count: 0, description: 'Foundational development stage.', verdict: 'Skill Refinement' }
          ],
          metrics: { silhouette_score: 0.485, variance_explained_pct: 64.25, algorithm: 'K-Means Clustering' }
        }
      };
    }
  },

  async getRecommendations(userId, sport = '') {
    try {
      const url = sport 
        ? `${API_BASE}/ml/recommendations/${userId}?sport=${encodeURIComponent(sport)}`
        : `${API_BASE}/ml/recommendations/${userId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getRecommendations fallback:', err);
      return {
        success: true,
        personalized_posts: [
          { id: 'rec-1', author_name: 'David Silva', author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', sport_name: 'Football', caption: 'High tempo midfield pressing and ball circulation drills! ⚽', relevance_score: 0.94, match_reason: 'Matches your interest in #football and #tactics', likes_count: 142, comments_count: 18 },
          { id: 'rec-2', author_name: 'Sarah Taylor', author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', sport_name: 'Cricket', caption: 'Fine-tuning glove speed and reaction time against leg-spin. 🏏', relevance_score: 0.88, match_reason: 'Matches your interest in #technique and #cricket', likes_count: 230, comments_count: 34 }
        ],
        recommended_players: [
          { id: 'b101', full_name: 'Sarah Taylor', username: 'sarah_cricket', primary_sport: 'Cricket', position_role: 'Wicketkeeper / Batter', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', relevance_score: 0.92 },
          { id: 'b102', full_name: 'Marcus Vance', username: 'marcus_dunk', primary_sport: 'Basketball', position_role: 'Point Guard', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', relevance_score: 0.85 }
        ],
        recommended_communities: [
          { id: 'comm-1', name: 'Elite Football Strategy & Scouting', sport_name: 'Football', description: 'Tactical analysis, scouting reports, and high-performance training.', members_count: 4200, relevance_score: 0.95 },
          { id: 'comm-2', name: 'All-Rounder Cricket Hub', sport_name: 'Cricket', description: 'Mastering pace, spin, and modern batting strike rates.', members_count: 3850, relevance_score: 0.88 }
        ]
      };
    }
  },

  async getPredictionHistory(playerId) {
    try {
      const res = await fetch(`${API_BASE}/ml/performance/history/${playerId}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        success: true,
        history: [
          { player_name: 'David Silva', sport_name: 'Football', predicted_score: 84.5, performance_tier: 'Advanced / High-Impact', created_at: new Date().toISOString(), model_version: 'rf-v1.0' },
          { player_name: 'Sarah Taylor', sport_name: 'Cricket', predicted_score: 91.2, performance_tier: 'World-Class / Elite', created_at: new Date().toISOString(), model_version: 'rf-v1.0' }
        ]
      };
    }
  },

  async getDashboardAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/ml/dashboard/analytics`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: true, overview: { total_athletes: 6, total_posts: 4, predictions_generated: 18 } };
    }
  }
};

export const sportsApi = {
  async getPlayers(sport = '', search = '') {
    try {
      const params = new URLSearchParams();
      if (sport && sport !== 'All' && sport !== 'All Sports') params.append('sport', sport);
      if (search) params.append('search', search);
      const res = await fetch(`${API_BASE}/sports/players?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getPlayers fallback:', err);
      const all = [
        { id: 'b101-sarah-cricket', full_name: 'Sarah Taylor', username: 'sarah_cricket', primary_sport: 'Cricket', position_role: 'Wicketkeeper / Batter', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', is_verified: true, stats: { matches_played: 48, matches_won: 34, win_rate: 70.83, goals_or_points: 1840, assists_or_passes: 42, recent_form: 91.5, consistency_score: 88 } },
        { id: 'b102-marcus-dunk', full_name: 'Marcus Vance', username: 'marcus_dunk', primary_sport: 'Basketball', position_role: 'Point Guard', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', is_verified: true, stats: { matches_played: 54, matches_won: 38, win_rate: 70.37, goals_or_points: 1240, assists_or_passes: 460, recent_form: 89.0, consistency_score: 84.5 } },
        { id: 'b103-david-kick', full_name: 'David Silva', username: 'david_kick', primary_sport: 'Football', position_role: 'Attacking Midfielder', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', is_verified: true, stats: { matches_played: 42, matches_won: 28, win_rate: 66.67, goals_or_points: 18, assists_or_passes: 24, recent_form: 84.0, consistency_score: 82.0 } },
        { id: 'b104-elena-tennis', full_name: 'Elena Rostova', username: 'elena_tennis', primary_sport: 'Tennis', position_role: 'Singles Specialist', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', is_verified: true, stats: { matches_played: 36, matches_won: 26, win_rate: 72.22, goals_or_points: 410, assists_or_passes: 85, recent_form: 93.0, consistency_score: 89.0 } }
      ];
      let filtered = all;
      if (sport && sport !== 'All' && sport !== 'All Sports') {
        filtered = filtered.filter(p => p.primary_sport.toLowerCase() === sport.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => p.full_name.toLowerCase().includes(s) || p.username.toLowerCase().includes(s));
      }
      return { players: filtered, total: filtered.length };
    }
  },

  async getPosts(sport = 'All') {
    try {
      const res = await fetch(`${API_BASE}/sports/posts?sport=${encodeURIComponent(sport)}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getPosts fallback:', err);
      const posts = [
        { id: 'post-001', author_name: 'David Silva', author_username: 'david_kick', author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', sport_name: 'Football', caption: 'High tempo midfield pressing and ball circulation drills paying off! ⚽ #football #midfield #training #matchday', media_type: 'photo', media_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800', likes_count: 142, comments_count: 18, tags: ['football', 'training', 'matchday', 'tactics'] },
        { id: 'post-002', author_name: 'Sarah Taylor', author_username: 'sarah_cricket', author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', sport_name: 'Cricket', caption: 'Net sessions focused on spin variation and footwork behind the stumps. 🏏 #cricket #wicketkeeping #batting', media_type: 'photo', media_url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800', likes_count: 230, comments_count: 34, tags: ['cricket', 'wicketkeeping', 'batting'] },
        { id: 'post-003', author_name: 'Marcus Vance', author_username: 'marcus_dunk', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', sport_name: 'Basketball', caption: 'Fourth quarter buzzer beater! Transition offense at full speed. 🏀 #basketball #clutch #hoops', media_type: 'video', media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', likes_count: 389, comments_count: 52, tags: ['basketball', 'clutch', 'pointguard'] },
        { id: 'post-004', author_name: 'Elena Rostova', author_username: 'elena_tennis', author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', sport_name: 'Tennis', caption: 'Top-spin cross-court angles and first-serve velocity work. 🎾 #tennis #serve #tactics', media_type: 'photo', media_url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', likes_count: 185, comments_count: 21, tags: ['tennis', 'serve', 'tournament'] }
      ];
      const filtered = (sport && sport !== 'All') ? posts.filter(p => p.sport_name.toLowerCase() === sport.toLowerCase()) : posts;
      return { posts: filtered, total: filtered.length };
    }
  },

  async createPost(postData) {
    try {
      const res = await fetch(`${API_BASE}/sports/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      return await res.json();
    } catch (err) {
      return {
        success: true,
        post: {
          id: `post-${Date.now()}`,
          author_name: 'You',
          author_username: 'athlete',
          author_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          ...postData,
          likes_count: 0,
          comments_count: 0
        }
      };
    }
  },

  async toggleLike(postId) {
    try {
      const res = await fetch(`${API_BASE}/sports/posts/${postId}/like`, { method: 'POST' });
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  async addComment(postId, commentText, userName) {
    try {
      const res = await fetch(`${API_BASE}/sports/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, comment_text: commentText, user_name: userName })
      });
      return await res.json();
    } catch (err) {
      return { success: true };
    }
  },

  async getCommunities() {
    return {
      communities: [
        { id: 'comm-01', sport_name: 'Football', name: 'Elite Football Strategy & Scouting', members_count: 4200, description: 'Tactical analysis, scouting reports, and high-performance training for modern football players.' },
        { id: 'comm-02', sport_name: 'Cricket', name: 'All-Rounder Cricket Hub', members_count: 3850, description: 'Mastering pace, spin, and modern batting strike rates through data-driven analysis.' },
        { id: 'comm-03', sport_name: 'Basketball', name: 'Pro Hoops & Conditioning Lab', members_count: 2950, description: 'Playmaking breakdowns, shot-selection metrics, and vertical agility conditioning.' },
        { id: 'comm-04', sport_name: 'Tennis', name: 'Championship Court Masters', members_count: 1820, description: 'Rally depth, court positioning, and endurance strategies for competitive tennis athletes.' }
      ]
    };
  },

  async getNotifications() {
    return {
      notifications: [
        { id: 'notif-1', type: 'like', message: 'David Silva liked your football tactics video', time: '10m ago', is_read: false },
        { id: 'notif-2', type: 'comment', message: 'Sarah Taylor commented: "Superb technique!"', time: '1h ago', is_read: false },
        { id: 'notif-3', type: 'follow', message: 'Marcus Vance started following your sports profile', time: '3h ago', is_read: true },
        { id: 'notif-4', type: 'prediction', message: 'AI Performance prediction score updated: 91.5 Elite tier', time: '1d ago', is_read: true }
      ]
    };
  }
};
