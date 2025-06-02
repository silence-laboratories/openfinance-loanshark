import uuid
from util.request_handler import make_headers, make_request
from util.timestamp import datetime_now, get_expiry_datetime
from util.constants import AA_ENTITY_HANDLE
from util.request_handler import fi_request_handler
from flask import jsonify


async def consent_create_request(phone):
    try:
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "ConsentDetail": {
                "consentStart": datetime_now(),
                "consentExpiry": get_expiry_datetime(),
                "consentMode": "STORE",
                "fetchType": "PERIODIC",
                "consentTypes": ["PROFILE", "SUMMARY", "TRANSACTIONS"],
                "fiTypes": ["DEPOSIT"],
                "DataConsumer": {"id": "silence-fiu", "type": "FIU"},
                "Customer": {
                    "id": f"{phone}@{AA_ENTITY_HANDLE}",
                    "Identifiers": [
                        {
                            "type": "MOBILE",
                            "value": f"91{phone}"
                        }
                    ]
                },
                "Purpose": {
                    "code": "101",
                    "refUri": "https://api.rebit.org.in/aa/purpose/101.xml",
                    "text": "Wealth management service",
                    "Category": {"type": "string"}
                },
                "FIDataRange": {"from": "2023-07-06T11:39:57.153Z", "to": "2023-12-06T11:39:57.153Z"},
                "DataLife": {"unit": "YEAR", "value": 1},
                "Frequency": {"unit": "HOUR", "value": 1},
            }
        }
        headers = await make_headers(body)
        consent = await make_request('/API/v2/Consent', 'POST', headers, body)
        return consent
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

async def consent_handle_request(consent_handle):
    try:
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "ConsentHandle": consent_handle
        }
        headers = await make_headers(body)
        consent_handle = await make_request('/API/v2/Consent/handle', 'POST', headers, body)
        return consent_handle
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    

async def consent_fetch_request(consent_id):
    try:
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "consentId": consent_id
        }
        headers = await make_headers(body)
        consent_fetch = await make_request('/API/v2/Consent/fetch', 'POST', headers, body)
        return consent_fetch
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

async def fi_request_request(consent_id, digital_signature):
    try:
        session_id, key_material = await fi_request_handler()
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "Consent": {
                "id": consent_id,
                "digitalSignature": digital_signature
            },
            "FIDataRange": {"from": "2023-07-06T11:39:57.153Z", "to": "2023-12-06T11:39:57.153Z"},
            "KeyMaterial": key_material
        }
        headers = await make_headers(body)
        fi_request = await make_request('/API/v2/FI/request', 'POST', headers, body)
        return fi_request
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

async def fi_fetch_request(session_id, link_ref_number):
    try:
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "sessionId": session_id,
            "fipId": "setu-fip",
            "linkRefNumber": [{"id": link_ref_number}]
        }
        headers = await make_headers(body)
        fi_fetch = await make_request('/API/v2/FI/fetch', 'POST', headers, body)
        return fi_fetch
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500