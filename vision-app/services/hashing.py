from PIL import Image
import imagehash
from sqlalchemy.orm import Session
from app.core import models
import io

HASH_TOLERANCE = 5

def compute_hash(image_bytes: bytes) -> str:
    img = Image.open(io.BytesIO(image_bytes))
    return str(imagehash.phash(img))

def is_duplicate(db: Session, computed_hash: str) -> bool:
    # Basic check against exact matches first to save processing
    existing = db.query(models.Submission).filter(models.Submission.image_hash == computed_hash).first()
    if existing:
        return True
    
    # Check within Hamming distance
    query_hash = imagehash.hex_to_hash(computed_hash)
    all_hashes = db.query(models.Submission.image_hash).all()
    for (h,) in all_hashes:
        if h:
            h_obj = imagehash.hex_to_hash(h)
            if query_hash - h_obj < HASH_TOLERANCE:
                return True
    
    return False
