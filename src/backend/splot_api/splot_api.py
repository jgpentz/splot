"""Main module."""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import files, sparams, vswr, repo_url

# TODO: create a dev/prod environment where we actually specify the CORS
# domains we allow. Especially important if we deploy this to the internet
ORIGINS = ["*"]

def initialize() -> FastAPI:
    # Create the api, add CORS origins, and set up the routes
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(sparams.router)
    app.include_router(files.router)
    app.include_router(vswr.router)
    app.include_router(repo_url.router)
    return app


app = initialize()

if __name__ == "__main__":
    # TODO: create a dev/prod environment where we specify 127.0.0.1 in dev and 0.0.0.0 in prod
    uvicorn.run("splot_api:app", port=8080, host="0.0.0.0", reload=True)
