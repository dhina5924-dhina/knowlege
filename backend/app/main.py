"""
FastAPI Server Entry Point
AI-Powered Sports Management Platform
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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

# Include API Routers FIRST
app.include_router(ml_router)
app.include_router(sports_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "supabase_connected": settings.is_supabase_configured,
        "ml_models_ready": True
    }

# Mount React Frontend Build (dist) as static files at root
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST):
    # Mount assets folder
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # Serve index.html for root and SPA routes
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # If API path was not matched, return 404
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        # Otherwise serve index.html for SPA hash/history routes
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Frontend build not found"}
else:
    @app.get("/")
    async def root():
        return {
            "message": "AI-Powered Sports Management Platform Backend is running.",
            "version": settings.VERSION,
            "docs_url": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
