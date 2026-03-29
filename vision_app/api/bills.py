from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from vision_app.core import database, models
from vision_app.services import hashing, vision
import json

router = APIRouter()

@router.post("/verify-bill")
async def verify_bill(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # Simple check for image (could be PDF in full app, but hackathon keeps to image for VLM easily)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image for processing.")
        
    image_bytes = await file.read()

    # Generate hash for database record, but skip duplication check for bills
    computed_hash = hashing.compute_hash(image_bytes)

    # Parse and extract via Vision API
    vlm_result = vision.parse_utility_bill(image_bytes)
    
    if "error" in vlm_result:
        raise HTTPException(status_code=500, detail=vlm_result["error"])

    # 3. Store record
    submission = models.Submission(
        submission_type="bill",
        image_hash=computed_hash,
        vlm_result=json.dumps(vlm_result),
        status="pass"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "status": "success",
        "message": "Bill successfully parsed.",
        "data": vlm_result,
        "submission_id": submission.id
    }
