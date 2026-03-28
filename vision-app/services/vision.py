import base64
import os
import json
import requests

# Set your API keys as needed or use local API
VISION_API_URL = os.getenv("VISION_API_URL", "https://openrouter.ai/api/v1/chat/completions")
VISION_API_KEY = os.getenv("VISION_API_KEY", "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")

def verify_recycling_image(image_bytes: bytes) -> dict:
    '''
    Analyze recycling image to check material, bin, and crushed status.
    '''
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = (
        "Identify the material (e.g., plastic, paper, glass), "
        "verify if it is held over a UK recycling bin (blue/green/brown), "
        "and confirm if the item has been forcibly crushed/crumpled. "
        "Return strictly JSON with keys: 'material' (string), 'in_bin' (bool), and 'is_crushed' (bool)."
    )

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {VISION_API_KEY}",
        "HTTP-Referer": "http://localhost:8000",
        "X-OpenRouter-Title": "Sustainability Hackathon"
    }

    payload = {
        "model": "openai/gpt-4o",
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
            response = requests.post(VISION_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return json.loads(data['choices'][0]['message']['content'])
        else:
            return {"material": "unknown", "in_bin": True, "is_crushed": True, "mock": True}
    except Exception as e:
        print(f"Vision API Error: {e}")
        return {"error": "Failed to analyze image"}

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
        "model": "openai/gpt-4o",
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
         "Authorization": f"Bearer {VISION_API_KEY}",
         "HTTP-Referer": "http://localhost:8000",
         "X-OpenRouter-Title": "Sustainability Hackathon"
    }
    
    try:
        if VISION_API_KEY:
            response = requests.post(VISION_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            parsed = json.loads(data['choices'][0]['message']['content'])
            
            # Simple benchmark check (example: 8 kWh/day average single person UK)
            days = parsed.get("period_days", 30) or 30
            kwh = parsed.get("electricity_kwh")
            if kwh is not None:
                parsed["minimal_usage_score"] = float(kwh) / days < 8.0 # Pass if less than average
            
            return parsed
        else:
             return {"electricity_kwh": 100.0, "water_m3": 10.0, "period_days": 30, "minimal_usage_score": True, "mock": True}
    except Exception as e:
        print(f"Vision API Error: {e}")
        return {"error": "Failed to extract bill data"}
