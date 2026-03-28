from fastapi import FastAPI
from vision_app.api import recycling, bills
from vision_app.core.database import engine, Base

# Create DB Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sustainability Hackathon API",
    description="Backend for AI Recycling & Usage Verification",
    version="1.0.0"
)

app.include_router(recycling.router, prefix="/api", tags=["recycling"])
app.include_router(bills.router, prefix="/api", tags=["bills"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Sustainability API. Visit /docs for Swagger UI."}
