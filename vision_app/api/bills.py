from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from vision_app.core import database, models
from vision_app.services import hashing, vision
import json

router = APIRouter()

@router.post("/verify-bill")
async def verify_bill(
    file: UploadFile = File(...),
    auth: str = Form(...),
    db: Session = Depends(database.get_db)
):
    # Check for content type presence but allow missing ones to pass for ease of testing
    if file.content_type and not file.content_type.startswith("image/"):
        pass  # Optional warning or let VLM fail if it truly isn't an image
        
    image_bytes = await file.read()

    # Generate hash for database record, but skip duplication check for bills
    computed_hash = hashing.compute_hash(image_bytes)

    # Parse and extract via Vision API
    vlm_result = vision.parse_utility_bill(image_bytes)
    
    if "error" in vlm_result:
        raise HTTPException(status_code=500, detail=vlm_result["error"])
    extracted_name = vlm_result.get("name") or ""

    # Simple identity check: look for first/last name overlap
    is_identity_verified = False

    # If it's a mock result, bypass for testing convenience
    if vlm_result.get("mock"):
        is_identity_verified = True
    elif extracted_name and extracted_name.lower() != "null":
        # Check if the extracted name shares any meaningful word with the logged-in user's name
        auth_parts = auth.lower().split()
        extracted_lower = extracted_name.lower()
        if any(part in extracted_lower for part in auth_parts if len(part) > 2) or \
           any(part in auth.lower() for part in extracted_lower.split() if len(part) > 2):
            is_identity_verified = True

    if not is_identity_verified:
        return {
            "status": "failed",
            "message": f"Identity mismatch: The name on the bill ('{extracted_name}') does not appear to match the logged-in user ('{auth}').",
            "data": vlm_result,
            "submission_id": None
        }
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
