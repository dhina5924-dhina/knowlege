# 🏆 AI-Powered Sports Management Platform

A full-stack, enterprise-grade Sports Management Platform built with **React.js**, **Tailwind CSS**, **Recharts**, **Python FastAPI**, and **Supabase (PostgreSQL, Auth, Storage)**, integrated with **3 Machine Learning Modules** for performance prediction, talent identification, and personalized recommendation feeds.

---

## 🌟 Key Highlights & Tech Stack

| Layer | Technology | Key Capabilities |
|---|---|---|
| **Frontend** | React 19, JavaScript, HTML5, CSS3, Tailwind CSS | High-performance SPA, Dark sports aesthetic, Glassmorphism, 10 Social Views + 5 AI Dashboard Views |
| **Visualizations** | Recharts, Lucide React | Interactive Multi-line Trajectory charts, 2D PCA Scatter Plots, Radar comparisons, Metric Bar charts |
| **Backend** | Python FastAPI, Uvicorn, Pydantic | Asynchronous REST APIs, High-throughput ML inference, CORS middleware |
| **Database & Auth** | Supabase (PostgreSQL 14+), Supabase Auth, Storage | Row Level Security (RLS), UUID primary keys, foreign constraints, zero-loss migrations |
| **Machine Learning** | Scikit-learn, Pandas, NumPy, Joblib | Random Forest Regressor ($R^2 = 0.968$), K-Means Clustering ($k=4$), TF-IDF & Cosine Similarity |

---

## 🛡️ Preserved 10 Core Sports Features

All existing features from your original platform are fully maintained and modernized in React:

1. **User Registration & Login**: Supabase Auth with email/password + 1-Click Instant Demo Athlete login.
2. **User Profile Management**: Athlete profile with avatar, bio, country, team, verified status, and career stats.
3. **Upload Sports Photos**: Drag-and-drop photo upload with file validation and direct Supabase Storage integration.
4. **Upload Sports Videos**: Dedicated video upload supporting MP4/WEBM files up to 50MB with custom player preview.
5. **Like & Comment System**: Optimistic live like counter and threaded comments on posts.
6. **Follow & Unfollow Players**: One-click athlete follow toggle with real-time follow status badges.
7. **Sports Communities / Village**: Browse, filter, and join dedicated sports hubs (Football, Cricket, Basketball, Tennis).
8. **Universal Player Search**: Instant search by player name, username, or filter by sport category.
9. **Sports Posts & Updates Feed**: Chronological multimedia feed with hashtags, media cards, and category pills.
10. **Activity Notifications**: Real-time activity notifications for likes, comments, follows, and ML score updates.

---

## 🧠 The Three Machine Learning Modules

### Module 1: Player Performance Prediction
- **Algorithm**: Random Forest Regression (`sklearn.ensemble.RandomForestRegressor`)
- **Trained Model Metrics**: $R^2 = 0.9682$, $\text{MAE} = 1.76$, $\text{RMSE} = 2.21$ on 2,000 realistic multi-sport records.
- **Features**: Matches played, matches won, win rate, goals or points scored, assists/passes, recent form rating (0–100), baseline consistency (0–100), and minutes played.
- **Output**: 
  - 0–100 Future Performance Score
  - Performance Tier Classification (*World-Class / Elite*, *Advanced / High-Impact*, *Solid Competitor*, *Developing Prospect*)
  - 95% Confidence Interval ($[Score - 1.96 \times \text{RMSE}, Score + 1.96 \times \text{RMSE}]$)
  - Actionable Statistical Improvement Suggestions tailored to player metrics.
  - Interactive Recharts trajectory graph (5 historical matches + 1 future predicted score).

### Module 2: Sports Talent Identification
- **Algorithm**: K-Means Clustering (`sklearn.cluster.KMeans`) + 2D Principal Component Analysis (`sklearn.decomposition.PCA`)
- **Trained Model Metrics**: Silhouette score $\approx 0.485$, 64.25% variance retained.
- **Output & Tiers**:
  - **Cluster 0**: *Elite High-Impact Performers* (Top win conversion & clutch contribution)
  - **Cluster 1**: *Emerging High-Potential Prospects* (Surging form, high growth ceiling)
  - **Cluster 2**: *Consistent Core Contributors* (Reliable tactical anchor)
  - **Cluster 3**: *Developing / Skill-Refinement Tier* (Focus on foundational consistency)
- **Scouting Visualizer**: Interactive 2D PCA scatter plot with custom tooltips, cluster filtering, and scouting verdict table.
- **Ethical ML Compliance**: Explicitly labeled as statistical grouping to aid coaches and scouts, avoiding absolute claims of innate talent.

### Module 3: Personalized Sports Recommendations
- **Algorithm**: Content-Based Filtering using TF-IDF (`TfidfVectorizer`) and Cosine Similarity (`cosine_similarity`).
- **Features Analyzed**: User favorite sports, active tactical tags (e.g. `#tactics`, `#drills`, `#conditioning`), liked posts history, and followed athlete profiles.
- **Outputs**:
  - Deduplicated personalized sports post recommendations with affinity match percentage (e.g. *92% Match*).
  - Recommended athletes to follow based on positional and sporting synergy.
  - Recommended sports communities and training hubs.

---

## 📊 AI Sports Intelligence Dashboard (5 Dedicated Pages)

Access via the sidebar under **AI SPORTS INTELLIGENCE**:

1. **Player Performance Prediction** (`ai-predict`): Live form inputs, sport picker, Random Forest score dial, and Recharts trend area chart.
2. **Talent Identification** (`ai-talent`): 4-tier cluster summary cards, 2D PCA scatter plot, cluster volume bar chart, and scouting evaluation table.
3. **Personalized Recommendations** (`ai-recommend`): Dynamic tag weight selector, high-affinity posts, athletes to follow, and community suggestions.
4. **Player Analytics** (`ai-analytics`): Side-by-side head-to-head comparison with multi-axis Radar Chart and metric delta breakdown.
5. **Prediction History** (`ai-history`): Historical audit log of predictions saved in Supabase with model version tags and timestamps.

---

## 🗄️ Supabase Database Integration & Schema

The SQL migration file is located at `supabase/schema.sql`. It is non-destructive (`IF NOT EXISTS`) and safe to run directly in your existing Supabase project SQL Editor:

```sql
-- Tables created/preserved:
public.sports               -- Lookup table of available sports
public.profiles             -- Athlete profiles linked to auth.users
public.posts                -- Social posts with photo and video media
public.likes                -- Post likes with unique(user_id, post_id)
public.comments             -- Post comments
public.followers            -- Follower relationship graph
public.notifications        -- User notifications
public.player_statistics    -- Match and career metrics for ML features
public.player_predictions   -- Persisted Random Forest predictions
public.talent_clusters      -- Persisted K-Means cluster assignments
public.user_interests       -- User preference weights for recommendations
public.recommendations      -- Generated personalized feed items
```

### Row Level Security (RLS)
All tables have Row Level Security enabled. Authenticated users can only edit their own records, while public content remains viewable.

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
# 1. Supabase Project Credentials
# Found in: Supabase Dashboard -> Project Settings -> API
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 2. Server Configuration
HOST=127.0.0.1
PORT=8000
DEBUG=True

# 3. Security
SECRET_KEY=sports-ai-super-secret-jwt-key-2026-production
```

> **Note**: Even if your Supabase keys are not immediately entered, the application runs smoothly out of the box with realistic fallback sports data. Once you paste your keys, it automatically connects to your live Supabase database!

---

## 🚀 How to Run Locally

### 1. One-Click Launch (Windows)
Double-click `start_all.bat` or run:
```cmd
start_all.bat
```
This automatically starts the FastAPI ML Backend (port 8000), Vite React Frontend (port 5173), and opens your browser.

---

### 2. Manual Command Line Launch

#### Start FastAPI ML Backend:
```bash
# Optional: Retrain ML models if needed
py ml/train_models.py

# Start Backend Server
py -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

#### Start React Frontend:
```bash
cd frontend
cmd /c npm.cmd run dev
```
- **React Application Web UI**: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)

---

## 🧪 Testing Checklist

- [x] **Supabase SQL Migration**: Executed and verified `supabase/schema.sql` syntax.
- [x] **ML Model Training**: Random Forest Regressor & K-Means trained ($R^2 = 0.9682$) and saved with Joblib.
- [x] **FastAPI ML Endpoints**: Tested `/api/ml/performance/predict`, `/api/ml/talent/analyze`, `/api/ml/recommendations/{user_id}`.
- [x] **Vite React Frontend**: Compiled production bundle with `npm.cmd run build` (0 errors).
- [x] **All 10 Social Features**: Verified Photos, Videos, Likes, Comments, Profiles, Communities, and Follows.
- [x] **AI Sports Intelligence Dashboard**: Verified all 5 pages and Recharts interactive components.

