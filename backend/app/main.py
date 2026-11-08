"""
FastAPI Server Entry Point
AI-Powered Sports Management Platform
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.config import settings
from backend.app.routers.ml_routes import router as ml_router
from backend.app.routers.sports_routes import router as sports_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend services for AI-Powered Sports Management Platform with Random Forest, K-Means, and Content-Based Filtering."
)

# Enable CORS for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(ml_router)
app.include_router(sports_router)

@app.get("/")
async def root():
    return {
        "message": "AI-Powered Sports Management Platform API is running.",
        "version": settings.VERSION,
        "supabase_connected": settings.is_supabase_configured,
        "docs_url": "/docs",
        "endpoints": {
            "performance_prediction": "/api/ml/performance/predict",
            "talent_identification": "/api/ml/talent/analyze",
            "personalized_recommendations": "/api/ml/recommendations/{user_id}",
            "prediction_history": "/api/ml/performance/history/{player_id}",
            "dashboard_analytics": "/api/ml/dashboard/analytics",
            "sports_posts": "/api/sports/posts",
            "sports_players": "/api/sports/players"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "supabase_connected": settings.is_supabase_configured,
        "ml_models_ready": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
