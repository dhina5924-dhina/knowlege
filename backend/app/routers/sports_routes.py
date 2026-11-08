"""
Sports Platform Router
Endpoints supporting the 10 core sports features (players, posts, photos/videos, likes, comments, follows, notifications).
"""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

from backend.app.supabase_client import (
    get_all_players,
    get_player_by_id,
    get_all_posts,
    SAMPLE_POSTS,
    SAMPLE_COMMUNITIES
)

router = APIRouter(prefix="/api/sports", tags=["Sports Platform Core"])

class CreatePostRequest(BaseModel):
    user_id: Optional[str] = "b103-david-kick"
    sport_name: str
    caption: str
    media_type: str = "photo" # photo, video
    media_url: str
    tags: List[str] = []

class CommentRequest(BaseModel):
    post_id: str
    user_name: Optional[str] = "Sports Fan"
    comment_text: str

@router.get("/players")
async def list_players(sport: Optional[str] = None, search: Optional[str] = None):
    players = get_all_players()
    if sport:
        players = [p for p in players if p['primary_sport'].lower() == sport.lower()]
    if search:
        s = search.lower()
        players = [p for p in players if s in p['full_name'].lower() or s in p['username'].lower()]
    return {'players': players, 'total': len(players)}

@router.get("/players/{player_id}")
async def get_player(player_id: str):
    player = get_player_by_id(player_id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return {'player': player}

@router.get("/posts")
async def list_posts(sport: Optional[str] = None):
    posts = get_all_posts()
    if sport and sport.lower() != 'all':
        posts = [p for p in posts if p.get('sport_name', '').lower() == sport.lower()]
    return {'posts': posts, 'total': len(posts)}

@router.post("/posts")
async def create_post(req: CreatePostRequest):
    new_post = {
        'id': f"post-{uuid.uuid4().hex[:8]}",
        'author_name': 'You (Authenticated Athlete)',
        'author_username': 'current_user',
        'author_avatar': 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        'sport_name': req.sport_name,
        'caption': req.caption,
        'media_type': req.media_type,
        'media_url': req.media_url,
        'likes_count': 0,
        'comments_count': 0,
        'tags': req.tags,
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    SAMPLE_POSTS.insert(0, new_post)
    return {'success': True, 'post': new_post}

@router.post("/posts/{post_id}/like")
async def toggle_like(post_id: str):
    for p in SAMPLE_POSTS:
        if str(p['id']) == str(post_id):
            p['likes_count'] = p.get('likes_count', 0) + 1
            return {'success': True, 'likes_count': p['likes_count'], 'is_liked': True}
    return {'success': True, 'likes_count': 1, 'is_liked': True}

@router.post("/posts/{post_id}/comment")
async def add_comment(post_id: str, req: CommentRequest):
    for p in SAMPLE_POSTS:
        if str(p['id']) == str(post_id):
            p['comments_count'] = p.get('comments_count', 0) + 1
            break
    return {
        'success': True,
        'comment': {
            'id': f"comm-{uuid.uuid4().hex[:6]}",
            'post_id': post_id,
            'user_name': req.user_name,
            'comment_text': req.comment_text,
            'created_at': datetime.now(timezone.utc).isoformat()
        }
    }

@router.get("/communities")
async def list_communities():
    return {'communities': SAMPLE_COMMUNITIES}

@router.get("/notifications")
async def list_notifications():
    return {
        'notifications': [
            {'id': 'notif-1', 'type': 'like', 'message': 'David Silva liked your football tactics video', 'time': '10m ago', 'is_read': False},
            {'id': 'notif-2', 'type': 'comment', 'message': 'Sarah Taylor commented: "Superb technique!"', 'time': '1h ago', 'is_read': False},
            {'id': 'notif-3', 'type': 'follow', 'message': 'Marcus Vance started following your sports profile', 'time': '3h ago', 'is_read': True},
            {'id': 'notif-4', 'type': 'prediction', 'message': 'AI Performance prediction score updated: 91.5 Elite tier', 'time': '1d ago', 'is_read': True}
        ]
    }
