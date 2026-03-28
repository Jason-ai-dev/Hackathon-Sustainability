from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import database, models
from app.services import hashing, vision
import json

router = APIRouter()

@router.post("/verify-bill")
async def verify_bill(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # Simple check for image (could be PDF in full app, but hackathon keeps to image for VLM easily)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image for processing.")
        
    image_bytes = await file.read()
    
    # Optional Duplicate check
    computed_hash = hashing.compute_hash(image_bytes)
    if hashing.is_duplicate(db, computed_hash):
        raise HTTPException(status_code=409, detail="Duplicate bill detected.")

    # Parse and metrics extraction via Vision API
    vlm_result = vision.parse_utility_bill(image_bytes)
    
    if "error" in vlm_result:
        raise HTTPException(status_code=500, detail=vlm_result["error"])
        
    minimal_usage_score_passed = vlm_result.get("minimal_usage_score", False)
    
    # 3. Store record
    submission = models.Submission(
        submission_type="bill",
        image_hash=computed_hash,
        vlm_result=json.dumps(vlm_result),
        status="pass" if minimal_usage_score_passed else "fail"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "status": "success" if minimal_usage_score_passed else "failed",
        "message": "Bill metrics show minimal usage!" if minimal_usage_score_passed else "Usage exceeds benchmarks.",
        "metrics": vlm_result,
        "submission_id": submission.id
    }
