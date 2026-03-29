FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire vision_app directory into the container
COPY vision_app/ ./vision_app/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the FastApi application using uvicorn
CMD ["uvicorn", "vision_app.main:app", "--host", "0.0.0.0", "--port", "8000"]
