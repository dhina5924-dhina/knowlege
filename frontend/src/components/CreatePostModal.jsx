import React, { useState } from 'react';
import { X, Image, Video, UploadCloud, Check, AlertCircle } from 'lucide-react';
import { authService } from '../services/supabase';
import { sportsApi } from '../services/api';

const SPORTS_LIST = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Athletics', 'Other'];

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const [sport, setSport] = useState('Football');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File validation
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isImage && !isVideo) {
      setError('Please choose an image (PNG, JPG, WEBP) or video (MP4, WEBM).');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB maximum limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
    setMediaType(isVideo ? 'video' : 'photo');
    setMediaUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !mediaUrl) {
      setError('Please add a caption or upload media.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let finalUrl = mediaUrl;
      if (selectedFile) {
        finalUrl = await authService.uploadStorageMedia('sports-media', selectedFile);
      }

      const res = await sportsApi.createPost({
        sport_name: sport,
        caption: caption.trim(),
        media_type: mediaType,
        media_url: finalUrl,
        tags: [sport.toLowerCase(), 'sports', 'training']
      });

      if (onPostCreated) onPostCreated(res.post);
      onClose();
    } catch (err) {
      setError(err.message || 'Error publishing post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg glass-panel bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-400" />
            Upload Sports Media
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sport Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sport Category</label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              {SPORTS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Post Caption & Insights</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your match highlights, tactical breakdown, or training drill..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* File Picker & Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Upload Photo or Video</label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-slate-950/60">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {mediaUrl ? (
                <div className="relative group max-h-48 flex items-center justify-center overflow-hidden rounded-xl">
                  {mediaType === 'video' ? (
                    <video src={mediaUrl} className="max-h-44 rounded-lg" controls />
                  ) : (
                    <img src={mediaUrl} alt="Preview" className="max-h-44 object-cover rounded-lg" />
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-semibold transition-opacity">
                    Click to change media
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="flex justify-center gap-3 text-slate-400">
                    <Image className="w-8 h-8 text-indigo-400" />
                    <Video className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Drag and drop or click to upload sports media
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Photos (PNG, JPG, WEBP) up to 10MB • Videos (MP4, WEBM) up to 50MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing to Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Publish Post</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

