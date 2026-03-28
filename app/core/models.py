from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    submission_type = Column(String, index=True) # "recycling" or "bill"
    image_hash = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Store JSON result of VLM as a string or use JSON column
    vlm_result = Column(String) 
    
    status = Column(String) # "pass" or "fail"
