import base64
import os
import json
import requests

# Set your API keys as needed or use local API
VISION_API_URL = os.getenv(
    "VISION_API_URL", "https://api.openai.com/v1/chat/completions")
VISION_API_KEY = os.getenv(
    "VISION_API_KEY", "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")

def verify_recycling_image(image_bytes: bytes) -> dict:
    '''
    Analyze recycling image to check material, bin, and crushed status.
    '''
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = (
        "Identify the primary item being thrown away and its material (e.g., plastic bottle, cardboard box, glass jar). "
        "Also identify the main recycling or waste bin visible in the image based on its color. "
        "Determine if the item is compatible with that specific bin according to these strict hackathon rules: "
        "- Blue Bin: Only for cardboard. "
        "- Cyan/Green Bin: Only for glass. "
        "- Red Bin: Only for plastics and metal cans. "
        "- Black Bin: For general waste. "
        "Return strictly JSON with keys: 'item' (string), 'bin_detected' (string), 'is_compatible' (bool), and 'reason' (string explaining why)."
    )

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {VISION_API_KEY}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 300
    }

    try:
        if VISION_API_KEY:
            response = requests.post(VISION_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            message_content = data['choices'][0]['message']['content']
            if message_content is None:
                raise ValueError(
                    f"No content returned. Full response: {json.dumps(data)}")
            return json.loads(message_content)
        else:
            return {"item": "unknown", "bin_detected": "unknown", "is_compatible": True, "reason": "mock", "mock": True}
    except Exception as e:
        error_msg = str(e)
        # Attempt to get more info from the response if it was an HTTP error
        if isinstance(e, requests.exceptions.HTTPError) and e.response is not None:
            error_msg += f". Response text: {e.response.text}"
        print(f"Vision API Error: {error_msg}")
        return {"error": f"Failed to analyze image: {error_msg}"}

def parse_utility_bill(image_bytes: bytes) -> dict:
    '''
    Parse bill for metrics and minimal usage score calculation.
    '''
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = (
        "Extract total electricity (kWh) and water (cubic meters) usage from this bill, "
        "along with the billing period in days. Return JSON with keys: "
        "'electricity_kwh' (float or null), 'water_m3' (float or null), 'period_days' (int)."
    )
    
    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                     {"type": "text", "text": prompt},
                     {
                         "type": "image_url",
                         "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                     }
                ]
            }
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 300
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {VISION_API_KEY}"
    }
    
    try:
        if VISION_API_KEY:
            response = requests.post(VISION_API_URL, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            message_content = data['choices'][0]['message']['content']
            if message_content is None:
                raise ValueError(
                    f"No content returned. Full response: {json.dumps(data)}")
            parsed = json.loads(message_content)
            
            # Simple benchmark check (example: 8 kWh/day average single person UK)
            days = parsed.get("period_days", 30) or 30
            kwh = parsed.get("electricity_kwh")
            if kwh is not None:
                parsed["minimal_usage_score"] = float(kwh) / days < 8.0 # Pass if less than average
            
            return parsed
        else:
            return {"electricity_kwh": 100.0, "water_m3": 10.0, "period_days": 30, "minimal_usage_score": True, "mock": True}
    except Exception as e:
        error_msg = str(e)
        if isinstance(e, requests.exceptions.HTTPError) and e.response is not None:
            error_msg += f". Response text: {e.response.text}"
        print(f"Vision API Error: {error_msg}")
        return {"error": f"Failed to extract bill data: {error_msg}"}
