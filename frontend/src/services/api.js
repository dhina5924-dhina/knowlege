const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api';

export const mlApi = {
  async predictPerformance(payload) {
    const res = await fetch(`${API_BASE}/ml/performance/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to generate performance prediction');
    return res.json();
  },

  async analyzeTalent(payload = {}) {
    const res = await fetch(`${API_BASE}/ml/talent/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to analyze talent clusters');
    return res.json();
  },

  async getRecommendations(userId, sport = '') {
    const url = sport 
      ? `${API_BASE}/ml/recommendations/${userId}?sport=${encodeURIComponent(sport)}`
      : `${API_BASE}/ml/recommendations/${userId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch personalized recommendations');
    return res.json();
  },

  async getPredictionHistory(playerId) {
    const res = await fetch(`${API_BASE}/ml/performance/history/${playerId}`);
    if (!res.ok) throw new Error('Failed to fetch prediction history');
    return res.json();
  },

  async getDashboardAnalytics() {
    const res = await fetch(`${API_BASE}/ml/dashboard/analytics`);
    if (!res.ok) throw new Error('Failed to fetch ML analytics');
    return res.json();
  }
};

export const sportsApi = {
  async getPlayers(sport = '', search = '') {
    const params = new URLSearchParams();
    if (sport && sport !== 'All') params.append('sport', sport);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/sports/players?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch players');
    return res.json();
  },

  async getPlayerById(id) {
    const res = await fetch(`${API_BASE}/sports/players/${id}`);
    if (!res.ok) throw new Error('Failed to fetch player details');
    return res.json();
  },

  async getPosts(sport = 'All') {
    const res = await fetch(`${API_BASE}/sports/posts?sport=${encodeURIComponent(sport)}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE}/sports/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    if (!res.ok) throw new Error('Failed to publish post');
    return res.json();
  },

  async toggleLike(postId) {
    const res = await fetch(`${API_BASE}/sports/posts/${postId}/like`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to like post');
    return res.json();
  },

  async addComment(postId, commentText, userName) {
    const res = await fetch(`${API_BASE}/sports/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, comment_text: commentText, user_name: userName })
    });
    if (!res.ok) throw new Error('Failed to submit comment');
    return res.json();
  },

  async getCommunities() {
    const res = await fetch(`${API_BASE}/sports/communities`);
    if (!res.ok) throw new Error('Failed to fetch sports communities');
    return res.json();
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE}/sports/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }
};

