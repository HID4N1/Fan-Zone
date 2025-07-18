import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def test_ors_api():
    api_key = os.getenv("ORS_API_KEY")
    if not api_key:
        print("ORS_API_KEY not found in environment variables.")
        return

    url = "https://api.openrouteservice.org/v2/directions/foot-walking"
    headers = {
        "Authorization": api_key,
        "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8"
    }
    # Sample coordinates: from Casablanca city center to a nearby point
    json_body = {
        "coordinates": [[-7.589967, 33.573110], [-7.590000, 33.574000]]
    }

    try:
        response = requests.post(url, headers=headers, json=json_body, timeout=10)
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Exception during ORS API call: {e}")

if __name__ == "__main__":
    test_ors_api()
