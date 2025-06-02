import uuid

# Flask
from flask import Flask, jsonify, request, Blueprint

from flask_cors import CORS, cross_origin

# Utils
from util.timestamp import datetime_now

# Constants
from util.constants import  SUPABASE_URL, SUPABASE_KEY, AA_REDIRECT_URL

# Encryption
from util.encryption import process_insights

from util.web_redirection import build_url

from supabase import create_client, Client

from util.aa import consent_handle_request, consent_fetch_request, consent_create_request, fi_request_request, fi_fetch_request

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

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

##### Postman APIs

# Create consent API
@api_v1.route('/create-consent', methods=['POST'])
# @cross_origin()
async def consent():
    try:
        request_body = request.json
        phone = request_body["phone"]
        return await consent_create_request(phone)
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/get-redirection-url', methods=['POST'])
# @cross_origin()
async def get_redirect_url():
    try:
        request_body = request.json
        phone = request_body["phone"]
        consent_handle = request_body["consentHandle"]
        url = await build_url(consent_handle, f"{AA_REDIRECT_URL}", phone)
        return {"url": url}
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/consent-handle', methods=['POST'])
async def consent_handle():
    try:
        request_body = request.json
        consent_handle = request_body["consentHandle"]
        return await consent_handle_request(consent_handle)
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/consent-fetch', methods=['POST'])
async def consent_fetch():
    try:
        request_body = request.json
        consent_id = request_body["consentId"]
        return await consent_fetch_request(consent_id)
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/fi-request', methods=['POST'])
async def fi_request():
    try:
        request_body = request.json
        consent_id = request_body["consentId"]
        digital_signature = request_body["digitalSignature"]
        return await fi_request_request(consent_id, digital_signature)
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@api_v1.route('/fi-fetch', methods=['POST'])
async def fi_fetch():
    try:
        request_body = request.json
        session_id = request_body["sessionId"]
        link_ref_number = request_body["linkRefNumber"]
        return await fi_fetch_request(session_id, link_ref_number)
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
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
        return data
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except ValueError as e:
        return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
    except TypeError as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

# Loanshark routes for the web app (UI APIs)

@api_v1.route('/create-consent-loanshark', methods=['POST'])
async def consent_loanshark():
    try:
        request_body = request.json
        phone = request_body["phone"]
        consent_create_response = await consent_create_request(phone)
        request_body["consentHandle"] = consent_create_response["ConsentHandle"]
        response = supabase.table("user").insert(request_body).execute()
        url = await build_url(consent_create_response["ConsentHandle"], f"{AA_REDIRECT_URL}/user/loan?phone={phone}&id={response.data[0]['id']}", phone)
        return {"id" : response.data[0]["id"], "url": url}
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@app.route('/FI/Notification', methods=['POST'])
async def fi_notification():
    try:
        request_body = request.json
        # Extract linkRefNumber(s)
        link_ref_numbers = []
        session_id = request_body["FIStatusNotification"]["sessionId"]
        fi_status_response = request_body.get("FIStatusNotification", {}).get("FIStatusResponse", [])
        for fi_status in fi_status_response:
            accounts = fi_status.get("Accounts", [])
            for account in accounts:
                link_ref_number = account.get("linkRefNumber")
                if link_ref_number:
                    link_ref_numbers.append(link_ref_number)
        user_data = supabase.table("user").select().eq("sessionId", session_id).execute()
        if user_data.data:
            user_id = user_data.data[0]["id"]
            user_link_ref_numbers = user_data.data[0]["linkRefNumbers"] if user_data.data[0]["linkRefNumbers"] else []
            user_link_ref_numbers.extend(link_ref_numbers)
            supabase.table("user").update({"linkRefNumbers": user_link_ref_numbers}).eq("id", user_id).execute()
        
        response = {
            "ver": "2.0.0",
            "timestamp": datetime_now(),
            "txnid": str(uuid.uuid4()),
            "response": "OK"
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# Route for FIP encryption - MOCK AA
# @api_v1.route('/fip-encrypt', methods=['POST'])
# async def fip_encrypt():
#     try:
#         request_body = request.json
#         session_id = request_body["sessionId"]
#         await update_fi_fetch_mock_response(session_id, MOCK_AA_SCENARIO_FI_FETCH_SUCCESS)
#         return {"status": "ENCRYPTION_SUCCESS", "sessionId" : session_id}
#     except KeyError as e:
#         return jsonify({"error": f"Missing required field: {str(e)}"}), 400
#     except Exception as e:
#         return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# Route for FIU decryption - MOCK AA
# @api_v1.route('/fiu-decrypt', methods=['POST'])
# async def fiu_decrypt():
#     try:
#         request_body = request.json
#         session_id = request_body["sessionId"]
#         fi_data = request_body["encryptedFI"]
#         xml_data = await process_encrypted_data(session_id, fi_data)
#         return xml_data
#     except KeyError as e:
#         return jsonify({"error": f"Missing required field: {str(e)}"}), 400
#     except ValueError as e:
#         return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
#     except TypeError as e:
#         return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
#     except Exception as e:
#         return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# Register blueprint for v1
app.register_blueprint(api_v1)
CORS(app, resources={r"/*": {"origins": "*"}})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
