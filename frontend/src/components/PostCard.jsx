import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Tag, Send } from 'lucide-react';
import { sportsApi } from '../services/api';

export default function PostCard({ post, onAuthorClick }) {
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah Taylor', text: 'Incredible form and technique! Keep it up 🔥' },
    { id: 2, user: 'Marcus Vance', text: 'That agility is top tier.' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    try {
      await sportsApi.toggleLike(post.id);
    } catch (err) {
      console.warn('Like toggle failed:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    const commentObj = {
      id: Date.now(),
      user: 'You',
      text: newComment.trim()
    };
    setComments(prev => [...prev, commentObj]);
    setNewComment('');
    try {
      await sportsApi.addComment(post.id, commentObj.text, 'You');
    } catch (err) {
      console.warn('Comment save failed:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <article className="glass-panel rounded-2xl overflow-hidden mb-6 border border-slate-800/80 bg-slate-900/60 shadow-xl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div 
          onClick={() => onAuthorClick && onAuthorClick(post)} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={post.author_name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
              {post.author_name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>@{post.author_username || 'athlete'}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {post.sport_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Media (Photo or Video) */}
      <div className="relative bg-black w-full overflow-hidden max-h-[500px] flex items-center justify-center">
        {post.media_type === 'video' ? (
          <video
            src={post.media_url}
            controls
            className="w-full max-h-[480px] object-contain"
            poster="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"
          />
        ) : (
          <img
            src={post.media_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'}
            alt="Sports media"
            className="w-full max-h-[480px] object-cover hover:scale-[1.01] transition-transform duration-300"
            loading="lazy"
          />
        )}
      </div>

      {/* Content & Actions */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        <p className="text-sm text-slate-200 leading-relaxed">
          {post.caption}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-xs text-cyan-400 hover:underline cursor-pointer">
                #{t.replace('#', '')}
              </span>
            ))}
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-slate-400 text-xs font-semibold">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-rose-500 bg-rose-500/10' 
                  : 'hover:text-rose-400 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length}</span>
            </button>
          </div>

          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: post.sport_name, text: post.caption, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Post link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="pt-3 border-t border-slate-800/80 space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="text-xs bg-slate-800/50 p-2.5 rounded-xl">
                  <span className="font-bold text-slate-200 mr-1.5">{c.user}:</span>
                  <span className="text-slate-300">{c.text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a sports comment or encouragement..."
                className="flex-1 bg-slate-950 px-3 py-1.5 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={submittingComment}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Post</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

