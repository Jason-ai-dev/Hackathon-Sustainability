from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, status
from sqlalchemy.orm import Session
from vision_app.core import database, models
from vision_app.services import hashing, vision
import json

router = APIRouter()

@router.post("/verify-recycling")
async def verify_recycling(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
        
    image_bytes = await file.read()
    
    # 1. Duplicate check (Anti-Cheat)
    computed_hash = hashing.compute_hash(image_bytes)
    if hashing.is_duplicate(db, computed_hash):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate image detected. Reusing old images is not allowed."
        )
        
    # 2. Vision API processing
    vlm_result = vision.verify_recycling_image(image_bytes)
    
    if "error" in vlm_result:
        raise HTTPException(status_code=500, detail=vlm_result["error"])

    # Extract conditions
    item = vlm_result.get("item", "unknown")
    bin_detected = vlm_result.get("bin_detected", "unknown")
    is_compatible = vlm_result.get("is_compatible", False)
    reason = vlm_result.get("reason", "")

    # Simple logic
    passed = is_compatible

    # 3. Store submission record
    submission = models.Submission(
        submission_type="recycling",
        image_hash=computed_hash,
        vlm_result=json.dumps(vlm_result),
        status="pass" if passed else "fail"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return {
        "status": "success" if passed else "failed",
        "message": "Recycling verified! Action approved." if passed else f"Action denied: {reason}",
        "details": vlm_result,
        "submission_id": submission.id
    }
