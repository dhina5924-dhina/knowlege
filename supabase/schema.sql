-- ==============================================================================
-- AI-POWERED SPORTS MANAGEMENT PLATFORM - SUPABASE DATABASE SCHEMA
-- Compatible with PostgreSQL 14+ / Supabase
-- Safe & Non-Destructive: Uses IF NOT EXISTS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SPORTS LOOKUP TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'Team',
    icon_name VARCHAR(50) DEFAULT 'trophy',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE (Linked to auth.users if available, or standalone UUID)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    primary_sport VARCHAR(100) DEFAULT 'Football',
    position_role VARCHAR(100),
    team_name VARCHAR(150),
    country VARCHAR(100) DEFAULT 'Global',
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 3. SPORTS POSTS & MEDIA (Photos and Videos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
    sport_name VARCHAR(100) NOT NULL DEFAULT 'General',
    caption TEXT,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('photo', 'video', 'text')),
    media_url TEXT,
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 4. POST LIKES (One like per user per post)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, post_id)
);

-- ------------------------------------------------------------------------------
-- 5. POST COMMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 6. FOLLOWERS (Player follow system)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(follower_id, following_id)
);

-- ------------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('like', 'comment', 'follow', 'system', 'prediction')),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 8. PLAYER STATISTICS (Historical & Match Metrics for ML Modules)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    matches_played INT NOT NULL DEFAULT 0,
    matches_won INT NOT NULL DEFAULT 0,
    win_rate NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN matches_played > 0 THEN (matches_won::NUMERIC / matches_played::NUMERIC) * 100 ELSE 0 END
    ) STORED,
    goals_or_points NUMERIC(8,2) NOT NULL DEFAULT 0,
    assists_or_passes NUMERIC(8,2) NOT NULL DEFAULT 0,
    recent_form NUMERIC(5,2) NOT NULL DEFAULT 70.0, -- Recent 5-match rating (0-100)
    consistency_score NUMERIC(5,2) NOT NULL DEFAULT 75.0, -- 0-100 variance stability
    minutes_played INT DEFAULT 0,
    season VARCHAR(50) DEFAULT '2025/2026',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 9. PLAYER PREDICTIONS (Module 1 - Random Forest Output Storage)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.player_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    predicted_score NUMERIC(5,2) NOT NULL, -- 0-100 Future Performance Score
    confidence_interval JSONB DEFAULT '{"lower": 0, "upper": 100}'::JSONB,
    improvement_suggestions JSONB DEFAULT '[]'::JSONB,
    input_features JSONB NOT NULL,
    model_version VARCHAR(50) DEFAULT 'rf-v1.0',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- 10. TALENT CLUSTERS (Module 2 - K-Means Clustering Results)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.talent_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    cluster_id INT NOT NULL,
    cluster_label VARCHAR(100) NOT NULL, -- 'Elite High-Impact', 'High Potential', etc.
    pca_coordinates JSONB NOT NULL DEFAULT '{"x": 0.0, "y": 0.0}'::JSONB,
    feature_percentiles JSONB DEFAULT '{}'::JSONB,
    assessment_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(player_id, sport_name)
);

-- ------------------------------------------------------------------------------
-- 11. USER INTERESTS (Module 3 - Content-Based Filtering Preferences)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    interest_level INT DEFAULT 5 CHECK (interest_level BETWEEN 1 AND 10),
    preferred_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, sport_name)
);

-- ------------------------------------------------------------------------------
-- 12. RECOMMENDATIONS (Module 3 - Generated Feed Items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('post', 'player', 'community')),
    recommended_item_id UUID NOT NULL,
    relevance_score NUMERIC(5,4) NOT NULL, -- Cosine similarity score (0.0 to 1.0)
    reason TEXT,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_sport_name ON public.posts(sport_name);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_followers_following ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_player ON public.player_statistics(player_id);
CREATE INDEX IF NOT EXISTS idx_predictions_player ON public.player_predictions(player_id);
CREATE INDEX IF NOT EXISTS idx_clusters_player ON public.talent_clusters(player_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public likes are viewable by everyone" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Followers list viewable by everyone" ON public.followers FOR SELECT USING (true);
CREATE POLICY "Player stats viewable by everyone" ON public.player_statistics FOR SELECT USING (true);
CREATE POLICY "Player predictions viewable by everyone" ON public.player_predictions FOR SELECT USING (true);
CREATE POLICY "Talent clusters viewable by everyone" ON public.talent_clusters FOR SELECT USING (true);

-- Authenticated owner modification policies
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can insert their own posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (true);

CREATE POLICY "Users can manage their own likes" ON public.likes FOR ALL USING (true);
CREATE POLICY "Users can manage their own comments" ON public.comments FOR ALL USING (true);
CREATE POLICY "Users can manage their follows" ON public.followers FOR ALL USING (true);

CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Users can view their recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Users can manage their interests" ON public.user_interests FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- SEED INITIAL SPORTS
-- ------------------------------------------------------------------------------
INSERT INTO public.sports (name, slug, category, icon_name, description) VALUES
    ('Cricket', 'cricket', 'Team', 'activity', 'Bat-and-ball game played between two teams of eleven players.'),
    ('Football', 'football', 'Team', 'globe', 'Association football played between two teams of eleven players with a spherical ball.'),
    ('Basketball', 'basketball', 'Team', 'circle', 'Fast-paced team sport where players score by shooting a ball through a hoop.'),
    ('Tennis', 'tennis', 'Racket', 'crosshair', 'Racket sport played individually against a single opponent or between two teams of two.'),
    ('Badminton', 'badminton', 'Racket', 'wind', 'Racket sport played using racquets to hit a shuttlecock across a net.'),
    ('Athletics', 'athletics', 'Track & Field', 'zap', 'Collection of sporting events involving competitive running, jumping, throwing, and walking.')
ON CONFLICT (slug) DO NOTHING;
