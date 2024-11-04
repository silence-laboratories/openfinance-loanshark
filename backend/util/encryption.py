# -*- coding: utf-8 -*-
import os
import base64
import json
import aiohttp

from util.constants import RAHASYA_URL, SUPABASE_KEY, SUPABASE_URL, RUST_SERVICE_URL

from supabase import create_client, Client

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

async def get_encryption_key():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(RAHASYA_URL + "/ecc/v1/generateKey") as response:
                encryption_key = await response.json()
                nonce = os.urandom(32)
                # Encode the nonce in Base64
                encoded_nonce = base64.b64encode(nonce).decode('utf-8')
                encryption_key["KeyMaterial"]["Nonce"] = "KqhyUQkmkiy25Hl3WXRh2H8fe8gVpbfBrYR70p6yveE="
        return encryption_key
    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to get encryption key: {str(e)}")
    except json.JSONDecodeError:
        raise ValueError("Failed to decode JSON response for encryption key")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")

async def get_encryption_key_from_rust():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(RUST_SERVICE_URL + "/api/get-keys") as response:
                encryption_key = await response.json()
        return encryption_key
    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to get encryption key: {str(e)}")
    except json.JSONDecodeError:
        raise ValueError("Failed to decode JSON response for encryption key")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")


async def decrypt_data(fip_keymaterial, fiu_keymaterial, fiu_private_key, encrypted_data):
    try:
        decrypt_api_body = {
            "base64RemoteNonce": fiu_keymaterial['Nonce'],
            "base64YourNonce": fip_keymaterial['Nonce'],
            "base64Data": encrypted_data,
            "ourPrivateKey": fiu_private_key,
            "remoteKeyMaterial": fip_keymaterial
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(RAHASYA_URL + "/ecc/v1/decrypt", json=decrypt_api_body) as response:
                fi_data = await response.json()
        base64_data = fi_data["base64Data"]
        return base64.b64decode(base64_data)
    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to decrypt data: {str(e)}")
    except json.JSONDecodeError:
        raise ValueError("Failed to decode JSON response for decryption")
    except KeyError as e:
        raise ValueError(f"Missing required key in decryption data: {str(e)}")
    except base64.binascii.Error:
        raise ValueError("Invalid base64 encoded data")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")

async def encrypt_data(fiu_keymaterial, fip_keymaterial, fip_private_key, data_to_encrypt):
    try:
        encrypt_api_body = {
            "base64YourNonce": fip_keymaterial['Nonce'],
            "base64RemoteNonce": fiu_keymaterial['Nonce'],
            "data": data_to_encrypt,
            "remoteKeyMaterial": fiu_keymaterial,
            "ourPrivateKey": fip_private_key
        }

        async with aiohttp.ClientSession() as session:
            async with session.post(RAHASYA_URL + "/ecc/v1/encrypt", json=encrypt_api_body) as response:
                fi_data = await response.json()
        return fi_data["base64Data"]
    except aiohttp.ClientError as e:
        raise RuntimeError(f"Failed to encrypt data: {str(e)}")
    except json.JSONDecodeError:
        raise ValueError("Failed to decode JSON response for encryption")
    except KeyError as e:
        raise ValueError(f"Missing required key in encryption data: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")

async def process_encrypted_data(session_id, fi_data):
    try:
        response = (supabase.table("encryption_keys").select("session_id, fiu_encryption_key, fip_encryption_key").eq("session_id", session_id).execute())
        if not response.data:
            raise ValueError(f"No encryption keys found for session_id: {session_id}")

        fip_encryption_key = response.data[0]["fip_encryption_key"]
        fiu_encryption_key = response.data[0]["fiu_encryption_key"]

        fiu_nonce = fiu_encryption_key["Nonce"]
        fip_nonce = fip_encryption_key["KeyMaterial"]["Nonce"]
        fip_public_key = fip_encryption_key["KeyMaterial"]["DHPublicKey"]["KeyValue"]

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(RUST_SERVICE_URL + "/api/insights", json={"encrypted_data": fi_data, "remote_nonce" : fip_nonce, "our_nonce" : fiu_nonce, "remote_public_key" : fip_public_key, "session_id" : session_id}) as response:
                    data = await response.json()
            return data
        except aiohttp.ClientError as e:
            raise RuntimeError(f"Failed to get encryption key: {str(e)}")
        except json.JSONDecodeError:
            raise ValueError("Failed to decode JSON response for encryption key")
        except Exception as e:
            raise RuntimeError(f"An unexpected error occurred: {str(e)}")
    except IndexError:
        raise ValueError(f"Invalid response format for session_id: {session_id}")
    except KeyError as e:
        raise ValueError(f"Missing required key in encryption data: {str(e)}")
    except TypeError as e:
        return TypeError(f"An unexpected type error occurred: {str(e)}")
    except base64.binascii.Error:
        raise ValueError("Invalid base64 encoded data")
    except UnicodeDecodeError:
        raise ValueError("Failed to decode decrypted data")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")

async def process_insights(type, month=None):
    try:
        # response = (supabase.table("encryption_keys").select("session_id, fiu_encryption_key, fip_encryption_key").eq("session_id", session_id).execute())

        # fip_encryption_key = response.data[0]["fip_encryption_key"]
        # fiu_encryption_key = response.data[0]["fiu_encryption_key"]

        # fiu_nonce = fiu_encryption_key["Nonce"]
        # fip_nonce = fip_encryption_key["KeyMaterial"]["Nonce"]
        # fip_public_key = fip_encryption_key["KeyMaterial"]["DHPublicKey"]["KeyValue"]

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(RUST_SERVICE_URL + "/api/insight-type", json={"insight_type" : type, "month" : month}) as response:
                    data = await response.text()
                    final_data = json.loads(data)
            return {type: final_data[type]}
        except aiohttp.ClientError as e:
            raise RuntimeError(f"Failed to get encryption key: {str(e)}")
        except json.JSONDecodeError:
            raise ValueError("Failed to decode JSON response for encryption key")
        except Exception as e:
            raise RuntimeError(f"An unexpected error occurred: {str(e)}")
    except KeyError as e:
        raise ValueError(f"Missing required key in encryption data: {str(e)}")
    except TypeError as e:
        return TypeError(f"An unexpected type error occurred: {str(e)}")
    except base64.binascii.Error:
        raise ValueError("Invalid base64 encoded data")
    except UnicodeDecodeError:
        raise ValueError("Failed to decode decrypted data")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred: {str(e)}")

