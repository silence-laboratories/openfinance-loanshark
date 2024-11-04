import aiohttp
from util.constants import SAHAMATI_BASEPATH, CLIENT_ID, CLIENT_SECRET, USERNAME, PASSWORD
import time

AUTH_TOKEN_LAST_FETCHED = time.time()
AUTH_TOKEN_EXPIRY = 50
AUTH_TOKEN = None

# Helper functions
async def get_access_token():
    global AUTH_TOKEN, AUTH_TOKEN_LAST_FETCHED
    if not AUTH_TOKEN or (time.time() - AUTH_TOKEN_LAST_FETCHED) > AUTH_TOKEN_EXPIRY:
        url = f"{SAHAMATI_BASEPATH}/iam/v1/entity/token/generate"
        payload = f"id={CLIENT_ID}&secret={CLIENT_SECRET}"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, data=payload) as response:
                    response.raise_for_status()
                    response_json = await response.json()
            AUTH_TOKEN = response_json["accessToken"]
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

async def get_user_token():
    url = f"{SAHAMATI_BASEPATH}/iam/v1/user/token/generate"
    payload = f"username={USERNAME}&password={PASSWORD}"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, data=payload) as response:
                response.raise_for_status()
                response_json = await response.json()
        access_token = response_json["accessToken"]
    except aiohttp.ClientError as e:
        print(f"HTTP request failed: {e}")
        return None
    except ValueError as e:
        print(f"JSON decoding failed: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    return access_token

async def update_mock_response(payload, scenario_id):
    url = f"{SAHAMATI_BASEPATH}/simulate/v2/response/update"
    headers = {
        "x-scenario-id": scenario_id,
        "Content-Type": "application/json",
        "Authorization": f"Bearer {await get_user_token()}",
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.put(url, headers=headers, json=payload) as response:
                response.raise_for_status()
                response_json = await response.json()
        return response_json
    except aiohttp.ClientError as e:
        print(f"HTTP request failed: {e}")
        return None
    except ValueError as e:
        print(f"JSON decoding failed: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
