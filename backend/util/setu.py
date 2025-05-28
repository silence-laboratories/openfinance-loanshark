import aiohttp
from util.constants import SETU_CLIENT_ID, SETU_CLIENT_SECRET
import time

AUTH_TOKEN_LAST_FETCHED = time.time()
AUTH_TOKEN_EXPIRY = 50
AUTH_TOKEN = None

# Helper functions
async def get_setu_access_token():
    url = f"https://orgservice-prod.setu.co/v1/users/login"
    payload = {
        "clientID": SETU_CLIENT_ID,
        "grant_type": "client_credentials",
        "secret": SETU_CLIENT_SECRET
    }
    headers = {
        "Content-Type": "application/json",
        "client": "bridge"
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload) as response:
                response.raise_for_status()
                response_json = await response.json()
        AUTH_TOKEN = response_json["access_token"]
    except aiohttp.ClientError as e:
        print(f"HTTP request failed: {e}")
        return None
    except ValueError as e:
        print(f"JSON decoding failed: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    return AUTH_TOKEN
