from joserfc.rfc7797 import serialize_compact, deserialize_compact # type: ignore
from joserfc.jwk import RSAKey # type: ignore

import json
from util.constants import PRIVATE_KEY, PUBLIC_KEY

# Create JWS
def create_jws(payload):
  try:
    private_key = RSAKey.import_key(PRIVATE_KEY)
    payload = json.dumps(payload, separators=(',', ':'))
    protected = {"alg": private_key.alg, "kid": private_key.kid, "b64": False, "crit": ["b64"]}
    return serialize_compact(protected, payload, private_key)
  except ValueError as e:
    # Handle invalid key format or payload
    print(f"ValueError in create_jws: {e}")
    return None
  except TypeError as e:
    # Handle incorrect data types
    print(f"TypeError in create_jws: {e}")
    return None
  except Exception as e:
    # Handle any other unexpected errors
    print(f"Unexpected error in create_jws: {e}")
    return None

# Verify JWS
def verify_jws(jws, payload):
  public_key = RSAKey.import_key(PUBLIC_KEY)
  payload = json.dumps(payload, separators=(',', ':'))
  try:
    deserialize_compact(jws, public_key, payload)
    return True
  except ValueError as e:
    # Handle invalid JWS format or payload
    print(f"ValueError: {e}")
    return False
  except Exception as e:
    # Handle any other exceptions
    print(f"An error occurred: {e}")
    return False
