from fastapi import APIRouter
import os

# Generate a route for processing sparams
router = APIRouter()

# Process the sparam files
@router.get("/repo_url", tags=["repo_url"])
async def get_repo_url():
    return os.environ.get(
        "SPLOT_REPO_URL",
        "https://gitlab.firstrf.com/first-rf-web/splot-docker"
    )
