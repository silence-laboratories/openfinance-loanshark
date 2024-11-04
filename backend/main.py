import uuid

# Flask
from flask import Flask, jsonify, request, Blueprint

from flask_cors import CORS, cross_origin

# Utils
from util.timestamp import datetime_now, get_expiry_datetime

# Constants
from util.constants import MOCK_AA_ENTITY_ID, MOCK_AA_ENTITY_HANDLE

# Mock AA Scenarios
from util.constants import MOCK_AA_SCENARIO_CREATE_CONSENT_SUCCESS, MOCK_AA_SCENARIO_CONSENT_HANDLE_SUCCESS, MOCK_AA_SCENARIO_CONSENT_FETCH_SUCCESS, MOCK_AA_SCENARIO_FI_REQUEST_SUCCESS, MOCK_AA_SCENARIO_FI_FETCH_SUCCESS

# Request handler
from util.request_handler import make_headers, make_request, fi_request_handler, update_fi_request_mock_response, update_fi_fetch_mock_response

# Encryption
from util.encryption import process_encrypted_data, process_insights

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

# Create consent API
@api_v1.route('/create-consent', methods=['POST'])
@cross_origin()
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
                    "id": f"9876543210@{MOCK_AA_ENTITY_HANDLE}",
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
        headers = await make_headers(body, MOCK_AA_ENTITY_ID, MOCK_AA_SCENARIO_CREATE_CONSENT_SUCCESS)
        consent = await make_request('/proxy/v2/Consent', 'POST', headers, body)
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
        consent_handle = await make_request('/proxy/v2/Consent/handle', 'POST', headers, body)
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
        consent_fetch = await make_request('/proxy/v2/Consent/fetch', 'POST', headers, body)
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

        fi_request = await make_request('/proxy/v2/FI/request', 'POST', headers, body)
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
        fi_fetch = await make_request('/proxy/v2/FI/fetch', 'POST', headers, body)
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

# Notifications of FIU yet to implemented

# Register blueprint for v1
app.register_blueprint(api_v1)
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
