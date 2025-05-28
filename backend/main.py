import uuid

# Flask
from flask import Flask, jsonify, request, Blueprint

from flask_cors import CORS, cross_origin

# Utils
from util.timestamp import datetime_now, get_expiry_datetime

# Constants
from util.constants import MOCK_AA_ENTITY_ID, MOCK_AA_ENTITY_HANDLE, SETU_PRODUCT_INSTANCE_ID

# Mock AA Scenarios
from util.constants import MOCK_AA_SCENARIO_CREATE_CONSENT_SUCCESS, MOCK_AA_SCENARIO_CONSENT_HANDLE_SUCCESS, MOCK_AA_SCENARIO_CONSENT_FETCH_SUCCESS, MOCK_AA_SCENARIO_FI_REQUEST_SUCCESS, MOCK_AA_SCENARIO_FI_FETCH_SUCCESS

# Request handler
from util.request_handler import make_headers, make_request, fi_request_handler, setu_make_request, update_fi_request_mock_response, update_fi_fetch_mock_response

# Encryption
from util.encryption import process_encrypted_data, process_insights

# Setu
from util.setu import get_setu_access_token

app = Flask(__name__)
api_v1 = Blueprint('api_v1', __name__, url_prefix='/api/v1')

# Routes

# Hello world route
@api_v1.route('/')
@cross_origin()
def hello():
    try:
        return 'Hello world with Flask'
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


##### MOCK AA APIs

# Create consent API
@api_v1.route('/create-consent', methods=['POST'])
# @cross_origin()
async def consent():
    try:
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "ConsentDetail": {
                "consentStart": datetime_now(),
                "consentExpiry": get_expiry_datetime(),
                "consentMode": "VIEW",
                "fetchType": "ONETIME",
                "consentTypes": ["PROFILE", "SUMMARY", "TRANSACTIONS"],
                "fiTypes": ["DEPOSIT"],
                "DataConsumer": {"id": "silence-aa", "type": "FIU"},
                "Customer": {
                    "id": f"7032523251@{MOCK_AA_ENTITY_HANDLE}",
                },
                "Purpose": {
                    "code": "101",
                    "refUri": "https://api.rebit.org.in/aa/purpose/101.xml",
                    "text": "Wealth management service",
                    "Category": {"type": "string"}
                },
                "FIDataRange": {"from": "2023-07-06T11:39:57.153Z", "to": "2023-12-06T11:39:57.153Z"},
                "DataLife": {"unit": "YEAR", "value": 1},
                "Frequency": {"unit": "DAY", "value": 24},
            }
        }
        print(body)
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_CREATE_CONSENT_SUCCESS)
        print(headers)
        consent = await make_request('/router/v2/Consent', 'POST', headers, body)
        return consent
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/consent-handle', methods=['POST'])
async def consent_handle():
    try:
        request_body = request.json
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "ConsentHandle": request_body["consentHandle"]
        }
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_CONSENT_HANDLE_SUCCESS)
        consent_handle = await make_request('/router/v2/Consent/handle', 'POST', headers, body)
        return consent_handle
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/consent-fetch', methods=['POST'])
async def consent_fetch():
    try:
        request_body = request.json
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "consentId": request_body["consentId"]
        }
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_CONSENT_FETCH_SUCCESS)
        consent_fetch = await make_request('/router/v2/Consent/fetch', 'POST', headers, body)
        return consent_fetch
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/fi-request', methods=['POST'])
async def fi_request():
    try:
        request_body = request.json
        result = await fi_request_handler()
        session_id, key_material = result
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "Consent": {
                "id": request_body["consentId"],
                "digitalSignature": request_body["digitalSignature"]
            },
            "FIDataRange": {
                "from": "2018-11-27T06:26:29.761Z",
                "to": "2018-12-27T06:26:29.761Z"
            },
            "KeyMaterial": key_material
        }
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_FI_REQUEST_SUCCESS)

        response = await update_fi_request_mock_response(session_id, MOCK_AA_SCENARIO_FI_REQUEST_SUCCESS)

        fi_request = await make_request('/router/v2/FI/request', 'POST', headers, body)
        return fi_request
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Route for FIP encryption
@api_v1.route('/fip-encrypt', methods=['POST'])
async def fip_encrypt():
    try:
        request_body = request.json
        session_id = request_body["sessionId"]
        await update_fi_fetch_mock_response(session_id, MOCK_AA_SCENARIO_FI_FETCH_SUCCESS)
        return {"status": "ENCRYPTION_SUCCESS", "sessionId" : session_id}
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/fi-fetch', methods=['POST'])
async def fi_fetch():
    try:
        request_body = request.json
        body = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "sessionId": request_body["sessionId"],
            "fipId": "silence-fip",
            "linkRefNumber": [{"id": "1234-5678-9999"}]
        }
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_FI_FETCH_SUCCESS)
        fi_fetch = await make_request('/router/v2/FI/fetch', 'POST', headers, body)
        return fi_fetch
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Route for FIU decryption
@api_v1.route('/fiu-decrypt', methods=['POST'])
async def fiu_decrypt():
    try:
        request_body = request.json
        session_id = request_body["sessionId"]
        fi_data = request_body["encryptedFI"]
        xml_data = await process_encrypted_data(session_id, fi_data)
        return xml_data
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except TypeError as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Route for FIU decryption
@api_v1.route('/get-insights', methods=['POST'])
async def get_insights():
    try:
        request_body = request.json
        insight_type = request_body["insight_type"]
        month = request_body["month"]
        data = await process_insights(insight_type, month)
        print(data)
        return data
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except TypeError as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

##### Setu & OneMoney AA APIs

# Create consent API
@api_v1.route('/create-consent-setu', methods=['POST'])
async def setu_consent():
    try:
        request_body = request.json
        body = {
            "consentDuration": {
                "unit": "MONTH",
                "value": "24"
            },
            "vua": f"{request_body['phone']}@onemoney",
            "dataRange": {
                "from": request_body["dataRange"]["from"],
                "to": request_body["dataRange"]["to"]
            },
            "consentTypes": [
                "PROFILE",
                "SUMMARY",
                "TRANSACTIONS"
            ]
        }
        print(body)
        access_token = await get_setu_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}",
            "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID
        }
        print(headers)
        consent = await setu_make_request('/consents', 'POST', headers, body)
        return consent
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Notification route for Setu
@api_v1.route('/notification-setu', methods=['POST'])
async def notification_setu():
    try:
        request_body = request.json
        notification_type = request_body['type']
        # Data Session Status Update
        if notification_type == 'SESSION_STATUS_UPDATE':
            # Handle session status update
            if not all(key in request_body for key in ['dataSessionId', 'consentId', 'data']):
                return jsonify({"error": "Missing required fields for SESSION_STATUS_UPDATE"}), 400
                
            # Process session status update
            session_status = request_body['data']['status']
            if session_status == 'COMPLETED':
                try:
                    access_token = await get_setu_access_token()
                    headers = {
                        "Authorization": f"Bearer {access_token}",
                        "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID
                    }
                    session_id = request_body["dataSessionId"]
                    data_session = await setu_make_request(f'/sessions/{session_id}', 'GET', headers, None)
                    print(data_session)
                except KeyError as e:
                    return jsonify({"error": f"Missing required field: {str(e)}"}), 400
                except Exception as e:
                    return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
        
        # Consent Status Update
        elif notification_type == 'CONSENT_STATUS_UPDATE':
            # Process consent status update
            consent_status = request_body['data']['status']
            
            if consent_status == 'ACTIVE':
                try:
                    body = {
                        "dataRange": {
                            "from": "2023-01-01T00:00:00Z",
                            "to": "2025-01-24T00:00:00Z"
                            },
                        "consentId": request_body['consentId'],
                        "format": "json"
                    }
                    access_token = await get_setu_access_token()
                    headers = {
                        "Authorization": f"Bearer {access_token}",
                        "x-product-instance-id": SETU_PRODUCT_INSTANCE_ID
                    }
                    data_session = await setu_make_request('/sessions', 'POST', headers, body)
                    print(data_session)
                except KeyError as e:
                    return jsonify({"error": f"Missing required field: {str(e)}"}), 400
                except Exception as e:
                    return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
            
        else:
            return jsonify({"error": f"Unknown notification type: {notification_type}"}), 400
            
        # Return success response
        return jsonify({
            "status": "success",
            "message": f"Successfully processed {notification_type} notification",
            "notificationId": request_body['notificationId']
        }), 200
        
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Register blueprint for v1
app.register_blueprint(api_v1)
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
