"""
Supabase Client & Data Access Layer
Safely connects to the user's Supabase PostgreSQL project using server-side credentials.
Provides fallback data simulation when credentials are not yet configured.
"""
import uuid
from typing import Dict, Any, List, Optional
from backend.app.config import settings

# Attempt to import supabase-py
supabase_client = None
if settings.is_supabase_configured:
    try:
        from supabase import create_client, Client
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        supabase_client: Client = create_client(settings.SUPABASE_URL, key)
        print("Connected to Supabase Project successfully.")
    except Exception as e:
        print(f"Notice: Supabase client initialization error: {e}. Falling back to demo sports dataset.")
        supabase_client = None

# Realistic demo dataset for immediate testability and offline mode
SAMPLE_PLAYERS = [
    {
        'id': 'b101-sarah-cricket',
        'username': 'sarah_cricket',
        'full_name': 'Sarah Taylor',
        'email': 'sarah@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        'primary_sport': 'Cricket',
        'position_role': 'Wicketkeeper / Top-Order Batter',
        'team_name': 'London Strikers',
        'country': 'England',
        'is_verified': True,
        'stats': {
            'matches_played': 48,
            'matches_won': 34,
            'win_rate': 70.83,
            'goals_or_points': 1840.0,
            'assists_or_passes': 42.0,
            'recent_form': 91.5,
            'consistency_score': 88.0,
            'minutes_played': 4200
        }
    },
    {
        'id': 'b102-marcus-dunk',
        'username': 'marcus_dunk',
        'full_name': 'Marcus Vance',
        'email': 'marcus@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'primary_sport': 'Basketball',
        'position_role': 'Point Guard',
        'team_name': 'Chicago Hawks',
        'country': 'USA',
        'is_verified': True,
        'stats': {
            'matches_played': 54,
            'matches_won': 38,
            'win_rate': 70.37,
            'goals_or_points': 1240.0,
            'assists_or_passes': 460.0,
            'recent_form': 89.0,
            'consistency_score': 84.5,
            'minutes_played': 1780
        }
    },
    {
        'id': 'b103-david-kick',
        'username': 'david_kick',
        'full_name': 'David Silva',
        'email': 'david@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        'primary_sport': 'Football',
        'position_role': 'Attacking Midfielder',
        'team_name': 'Madrid FC',
        'country': 'Spain',
        'is_verified': True,
        'stats': {
            'matches_played': 42,
            'matches_won': 28,
            'win_rate': 66.67,
            'goals_or_points': 18.0,
            'assists_or_passes': 24.0,
            'recent_form': 84.0,
            'consistency_score': 82.0,
            'minutes_played': 3450
        }
    },
    {
        'id': 'b104-elena-tennis',
        'username': 'elena_tennis',
        'full_name': 'Elena Rostova',
        'email': 'elena@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'primary_sport': 'Tennis',
        'position_role': 'Singles Specialist',
        'team_name': 'Pro Tennis Circuit',
        'country': 'Serbia',
        'is_verified': True,
        'stats': {
            'matches_played': 36,
            'matches_won': 26,
            'win_rate': 72.22,
            'goals_or_points': 410.0,
            'assists_or_passes': 85.0,
            'recent_form': 93.0,
            'consistency_score': 89.0,
            'minutes_played': 2600
        }
    },
    {
        'id': 'b105-alex-runner',
        'username': 'alex_runner',
        'full_name': 'Alex Kiprono',
        'email': 'alex@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        'primary_sport': 'Athletics',
        'position_role': 'Middle Distance 1500m',
        'team_name': 'Rift Athletic Club',
        'country': 'Kenya',
        'is_verified': True,
        'stats': {
            'matches_played': 24,
            'matches_won': 16,
            'win_rate': 66.67,
            'goals_or_points': 180.0,
            'assists_or_passes': 12.0,
            'recent_form': 78.5,
            'consistency_score': 81.0,
            'minutes_played': 1200
        }
    },
    {
        'id': 'b106-leo-forward',
        'username': 'leo_striker',
        'full_name': 'Leonardo Rossi',
        'email': 'leo@sportsplatform.com',
        'avatar_url': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
        'primary_sport': 'Football',
        'position_role': 'Center Forward',
        'team_name': 'Milan Calcio',
        'country': 'Italy',
        'is_verified': False,
        'stats': {
            'matches_played': 28,
            'matches_won': 14,
            'win_rate': 50.0,
            'goals_or_points': 14.0,
            'assists_or_passes': 4.0,
            'recent_form': 68.0,
            'consistency_score': 65.0,
            'minutes_played': 2100
        }
    }
]

SAMPLE_POSTS = [
    {
        'id': 'post-001',
        'author_name': 'David Silva',
        'author_username': 'david_kick',
        'author_avatar': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        'sport_name': 'Football',
        'caption': 'Unbelievable team chemistry in yesterday match! Controlled the midfield tempo for 90 minutes. High pressing drills paying off! ⚽ #football #midfield #training #matchday',
        'media_type': 'photo',
        'media_url': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
        'likes_count': 142,
        'comments_count': 18,
        'tags': ['football', 'training', 'matchday', 'tactics'],
        'created_at': '2026-11-06T14:30:00Z'
    },
    {
        'id': 'post-002',
        'author_name': 'Sarah Taylor',
        'author_username': 'sarah_cricket',
        'author_avatar': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        'sport_name': 'Cricket',
        'caption': 'Net sessions focused on spin variation and footwork behind the stumps. Always fine-tuning the basics! 🏏 #cricket #wicketkeeping #batting #nets',
        'media_type': 'photo',
        'media_url': 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?w=800',
        'likes_count': 230,
        'comments_count': 34,
        'tags': ['cricket', 'wicketkeeping', 'batting', 'technique'],
        'created_at': '2026-11-07T09:15:00Z'
    },
    {
        'id': 'post-003',
        'author_name': 'Marcus Vance',
        'author_username': 'marcus_dunk',
        'author_avatar': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'sport_name': 'Basketball',
        'caption': 'Fourth quarter buzzer beater! Transition offense and fast break execution at full speed. 🏀 #basketball #clutch #pointguard #hoops',
        'media_type': 'video',
        'media_url': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        'likes_count': 389,
        'comments_count': 52,
        'tags': ['basketball', 'clutch', 'pointguard', 'speed'],
        'created_at': '2026-11-07T18:40:00Z'
    },
    {
        'id': 'post-004',
        'author_name': 'Elena Rostova',
        'author_username': 'elena_tennis',
        'author_avatar': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'sport_name': 'Tennis',
        'caption': 'Working on top-spin cross-court angles and first-serve velocity ahead of next week tournament. 🎾 #tennis #serve #forehand #conditioning',
        'media_type': 'photo',
        'media_url': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
        'likes_count': 185,
        'comments_count': 21,
        'tags': ['tennis', 'serve', 'tactics', 'tournament'],
        'created_at': '2026-11-08T06:20:00Z'
    }
]

SAMPLE_COMMUNITIES = [
    {
        'id': 'comm-01',
        'sport_name': 'Football',
        'name': 'Elite Football Strategy & Scouting',
        'members_count': 4200,
        'description': 'Tactical analysis, scouting reports, and high-performance training for modern football players.'
    },
    {
        'id': 'comm-02',
        'sport_name': 'Cricket',
        'name': 'All-Rounder Cricket Hub',
        'members_count': 3850,
        'description': 'Mastering pace, spin, and modern batting strike rates through data-driven analysis.'
    },
    {
        'id': 'comm-03',
        'sport_name': 'Basketball',
        'name': 'Pro Hoops & Conditioning Lab',
        'members_count': 2950,
        'description': 'Playmaking breakdowns, shot-selection metrics, and vertical agility conditioning.'
    },
    {
        'id': 'comm-04',
        'sport_name': 'Tennis',
        'name': 'Championship Court Masters',
        'members_count': 1820,
        'description': 'Rally depth, court positioning, and endurance strategies for competitive tennis athletes.'
    }
]

# Database Access Functions
def get_all_players() -> List[Dict[str, Any]]:
    if supabase_client:
        try:
            res = supabase_client.table('profiles').select('*, player_statistics(*)').execute()
            if res.data:
                formatted = []
                for p in res.data:
                    stats = p.get('player_statistics', [{}])
                    stat_obj = stats[0] if stats else {}
                    formatted.append({
                        'id': p.get('id'),
                        'username': p.get('username'),
                        'full_name': p.get('full_name'),
                        'email': p.get('email'),
                        'avatar_url': p.get('avatar_url'),
                        'primary_sport': p.get('primary_sport', 'Football'),
                        'position_role': p.get('position_role', ''),
                        'team_name': p.get('team_name', ''),
                        'country': p.get('country', 'Global'),
                        'is_verified': p.get('is_verified', False),
                        'stats': {
                            'matches_played': stat_obj.get('matches_played', 20),
                            'matches_won': stat_obj.get('matches_won', 12),
                            'win_rate': float(stat_obj.get('win_rate', 60.0)),
                            'goals_or_points': float(stat_obj.get('goals_or_points', 50.0)),
                            'assists_or_passes': float(stat_obj.get('assists_or_passes', 15.0)),
                            'recent_form': float(stat_obj.get('recent_form', 75.0)),
                            'consistency_score': float(stat_obj.get('consistency_score', 80.0)),
                            'minutes_played': stat_obj.get('minutes_played', 1500)
                        }
                    })
                return formatted
        except Exception as e:
            print(f"Supabase query warning: {e}")
    return SAMPLE_PLAYERS

def get_player_by_id(player_id: str) -> Optional[Dict[str, Any]]:
    players = get_all_players()
    for p in players:
        if str(p['id']) == str(player_id):
            return p
    return None

def get_all_posts() -> List[Dict[str, Any]]:
    if supabase_client:
        try:
            res = supabase_client.table('posts').select('*, profiles(username, full_name, avatar_url)').order('created_at', desc=True).execute()
            if res.data:
                formatted = []
                for item in res.data:
                    prof = item.get('profiles') or {}
                    formatted.append({
                        'id': item.get('id'),
                        'author_name': prof.get('full_name', 'Athlete'),
                        'author_username': prof.get('username', 'athlete'),
                        'author_avatar': prof.get('avatar_url', ''),
                        'sport_name': item.get('sport_name', 'Football'),
                        'caption': item.get('caption', ''),
                        'media_type': item.get('media_type', 'photo'),
                        'media_url': item.get('media_url', ''),
                        'likes_count': item.get('likes_count', 0),
                        'comments_count': item.get('comments_count', 0),
                        'tags': item.get('tags', []),
                        'created_at': item.get('created_at', '')
                    })
                return formatted
        except Exception as e:
            print(f"Supabase posts query warning: {e}")
    return SAMPLE_POSTS

def save_player_prediction(prediction_data: Dict[str, Any]) -> bool:
    if supabase_client:
        try:
            supabase_client.table('player_predictions').insert({
                'player_id': prediction_data.get('player_id'),
                'sport_name': prediction_data.get('sport_name'),
                'predicted_score': prediction_data.get('predicted_score'),
                'confidence_interval': prediction_data.get('confidence_interval'),
                'improvement_suggestions': prediction_data.get('improvement_suggestions'),
                'input_features': prediction_data.get('input_features', {})
            }).execute()
            return True
        except Exception as e:
            print(f"Supabase prediction save warning: {e}")
    return False

def get_prediction_history(player_id: Optional[str] = None) -> List[Dict[str, Any]]:
    if supabase_client:
        try:
            q = supabase_client.table('player_predictions').select('*, profiles(full_name, username, primary_sport)').order('created_at', desc=True)
            if player_id:
                q = q.eq('player_id', player_id)
            res = q.limit(20).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Supabase predictions history warning: {e}")
    # Fallback simulated history
    return [
        {
            'id': 'pred-001',
            'player_name': 'Sarah Taylor',
            'sport_name': 'Cricket',
            'predicted_score': 88.4,
            'performance_tier': 'World-Class / Elite',
            'created_at': '2026-11-07T12:00:00Z',
            'model_version': 'rf-v1.0'
        },
        {
            'id': 'pred-002',
            'player_name': 'Marcus Vance',
            'sport_name': 'Basketball',
            'predicted_score': 84.2,
            'performance_tier': 'Advanced / High-Impact',
            'created_at': '2026-11-06T15:30:00Z',
            'model_version': 'rf-v1.0'
        },
        {
            'id': 'pred-003',
            'player_name': 'David Silva',
            'sport_name': 'Football',
            'predicted_score': 79.5,
            'performance_tier': 'Advanced / High-Impact',
            'created_at': '2026-11-05T10:15:00Z',
            'model_version': 'rf-v1.0'
        }
    ]
