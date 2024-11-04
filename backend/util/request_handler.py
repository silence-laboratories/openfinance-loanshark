import base64
import json
import requests
import uuid
import aiohttp

from util.jws import create_jws
from util.sahamati import get_access_token, update_mock_response
from util.constants import SAHAMATI_BASEPATH, SUPABASE_URL, SUPABASE_KEY, MOCK_AA_ENTITY_ID
from util.encryption import get_encryption_key, encrypt_data, get_encryption_key_from_rust
from util.timestamp import datetime_now


import os
from supabase import create_client, Client

url: str = SUPABASE_URL
key: str = SUPABASE_KEY
supabase: Client = create_client(url, key)

# Mock XML Data
# xml_data='''<Account xmlns="http://api.rebit.org.in/FISchema/deposit" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://api.rebit.org.in/FISchema/deposit ../FISchema/deposit.xsd" linkedAccRef="f5192fed-6c9c-493b-b85d-aa8235c7399c" maskedAccNumber="XXXXXX8988" version="1.2" type="deposit"><Profile><Holders type="SINGLE"><Holder name="YOGESH  MALVIYA" dob="1992-09-04" mobile="9098597913" nominee="NOT-REGISTERED" email="yogzmalviya@gmail.com" pan="ECEPM3212A" ckycCompliance="false" /></Holders></Profile><Summary currentBalance="163.8" currency="INR" exchgeRate="" balanceDateTime="2022-12-14T14:01:16.628+05:30" type="SAVINGS" branch="BHOPAL - ARERA COLONY" facility="CC" ifscCode="KKBK0005886" micrCode="" openingDate="2021-10-13" currentODLimit="0" drawingLimit="163.80" status="ACTIVE"><Pending amount="0.0" /></Summary><Transactions startDate="2022-06-12" endDate="2022-12-14"><Transaction txnId="S25836278" type="DEBIT" mode="OTHERS" amount="400.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="PCD/8587/KARNIKA MARKETING PRIV/REWA120622/16:56" reference="216311406416" /><Transaction txnId="S18628747" type="CREDIT" mode="OTHERS" amount="100.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="UPI/YOGESH MALVIYA/216305036794/NA" reference="UPI-216377280207" /><Transaction txnId="S18624783" type="CREDIT" mode="OTHERS" amount="1781.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="UPI/YOGESH MALVIYA/216305030230/NA" reference="UPI-216377277537" /><Transaction txnId="S30323399" type="DEBIT" mode="OTHERS" amount="148.75" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="UPI/RazorpayZomato/216386232803/ZomatoOnlineOrd" reference="UPI-216389748326" /><Transaction txnId="S25864256" type="DEBIT" mode="OTHERS" amount="150.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="PCD/8587/KARNIKA MARKETING PRIV/REWA120622/16:58" reference="216311406641" /><Transaction txnId="S42506559" type="DEBIT" mode="OTHERS" amount="19.0" currentBalance="1130.44" transactionTimestamp="2022-06-13T00:00:00+05:30" valueDate="2022-06-13" narration="UPI/Dheerendra Jain/216464548973/Oid202206131918" reference="UPI-216402403500" /><Transaction txnId="S34780351" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="1130.44" transactionTimestamp="2022-06-13T00:00:00+05:30" valueDate="2022-06-13" narration="UPI/Dheerendra Jain/216418410134/Oid202206131028" reference="UPI-216494338490" /><Transaction txnId="S52138551" type="CREDIT" mode="OTHERS" amount="140.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/RAKESH KUMAR KH/216513632305/UPI" reference="UPI-216512500252" /><Transaction txnId="S52219985" type="DEBIT" mode="OTHERS" amount="80.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/RAJORIYA DK RES/216534278929/Oid202206141402" reference="UPI-216512585462" /><Transaction txnId="S52543272" type="DEBIT" mode="OTHERS" amount="90.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/DOLARAJ PANDEY/216535664081/Oid202206141422" reference="UPI-216512923895" /><Transaction txnId="S49857268" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/Dheerendra Jain/216513640392/Oid202206141124" reference="UPI-216510130969" /><Transaction txnId="S59635821" type="DEBIT" mode="OTHERS" amount="7.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/AJAY SINGH CHAN/216581233716/NA" reference="UPI-216520498917" /><Transaction txnId="S58074054" type="DEBIT" mode="OTHERS" amount="40.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/Kamla Kirana An/216572940941/Oid202206142008" reference="UPI-216518879372" /><Transaction txnId="S59871653" type="DEBIT" mode="OTHERS" amount="10.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="UPI/Khambra atta ch/216582362979/Oid202206142138" reference="UPI-216520744851" /><Transaction txnId="S68033575" type="DEBIT" mode="OTHERS" amount="10000.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="ATL/8587/504492/AYODHYA BYPASS BHOPALB150622/14:49" reference="1339" /><Transaction txnId="S68046504" type="DEBIT" mode="OTHERS" amount="5000.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="ATL/8587/504492/AYODHYA BYPASS BHOPALB150622/14:50" reference="1340" /><Transaction txnId="S67859118" type="DEBIT" mode="OTHERS" amount="10.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="UPI/Dheerendra Jain/216639456809/Oid202206151436" reference="UPI-216628866949" /><Transaction txnId="S68014733" type="DEBIT" mode="OTHERS" amount="10000.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="ATL/8587/504492/AYODHYA BYPASS BHOPALB150622/14:48" reference="1337" /><Transaction txnId="S67807420" type="CREDIT" mode="OTHERS" amount="25000.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="UPI/NEELESH KUMAR R/216639223940/NA" reference="UPI-216628812474" /><Transaction txnId="S64612409" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="UPI/Dheerendra Jain/216614557129/Oid202206151100" reference="UPI-216625472907" /><Transaction txnId="S73822348" type="CREDIT" mode="OTHERS" amount="100.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="UPI/MANISH SINGH SE/216633880288/Payment from Ph" reference="UPI-216635131933" /><Transaction txnId="S64925736" type="CREDIT" mode="OTHERS" amount="50.0" currentBalance="1095.44" transactionTimestamp="2022-06-15T00:00:00+05:30" valueDate="2022-06-15" narration="UPI/YOGESH MALVIYA/216616006858/NA" reference="UPI-216625802232" /><Transaction txnId="S82281243" type="DEBIT" mode="OTHERS" amount="91.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/SHAHZAD/216720503888/Oid202206161349" reference="UPI-216743951643" /><Transaction txnId="S81867125" type="DEBIT" mode="OTHERS" amount="100.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/SHAHZAD/216728587203/Oid202206161324" reference="UPI-216743514433" /><Transaction txnId="S82615902" type="DEBIT" mode="OTHERS" amount="19.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/SHAHZAD/216731993255/Oid202206161410" reference="UPI-216744305431" /><Transaction txnId="S79300359" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/Dheerendra Jain/216716994190/Oid202206161031" reference="UPI-216740801158" /><Transaction txnId="S87520495" type="DEBIT" mode="OTHERS" amount="28.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/PRAVEEN SINGH P/216765917293/NA" reference="UPI-216749484218" /><Transaction txnId="S82997957" type="DEBIT" mode="OTHERS" amount="50.0" currentBalance="763.44" transactionTimestamp="2022-06-16T00:00:00+05:30" valueDate="2022-06-16" narration="UPI/Razorpay Softwa/216733645101/YoungMindsPubli" reference="UPI-216744707958" /><Transaction txnId="S95117648" type="DEBIT" mode="OTHERS" amount="50.0" currentBalance="481.44" transactionTimestamp="2022-06-17T00:00:00+05:30" valueDate="2022-06-17" narration="UPI/SHAHZAD/216813760901/Oid202206171142" reference="UPI-216857415055" /><Transaction txnId="S931130" type="DEBIT" mode="OTHERS" amount="38.0" currentBalance="481.44" transactionTimestamp="2022-06-17T00:00:00+05:30" valueDate="2022-06-17" narration="UPI/Dheerendra Jain/216850984631/Oid202206171828" reference="UPI-216863512011" /><Transaction txnId="S1350006" type="DEBIT" mode="OTHERS" amount="150.0" currentBalance="481.44" transactionTimestamp="2022-06-17T00:00:00+05:30" valueDate="2022-06-17" narration="UPI/Manish Singh Se/216852956494/NA" reference="UPI-216863974769" /><Transaction txnId="S94211352" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="481.44" transactionTimestamp="2022-06-17T00:00:00+05:30" valueDate="2022-06-17" narration="UPI/Dheerendra Jain/216819463618/Oid202206171038" reference="UPI-216856459353" /><Transaction txnId="S12384982" type="DEBIT" mode="OTHERS" amount="10.0" currentBalance="450.44" transactionTimestamp="2022-06-18T00:00:00+05:30" valueDate="2022-06-18" narration="UPI/Mehta traders/216938053316/Oid202206181500" reference="UPI-216975359748" /><Transaction txnId="S20247944" type="DEBIT" mode="OTHERS" amount="21.0" currentBalance="450.44" transactionTimestamp="2022-06-18T00:00:00+05:30" valueDate="2022-06-18" narration="UPI/SHAHZAD/216980278532/Oid202206182347" reference="UPI-216983734817" /><Transaction txnId="S31627541" type="DEBIT" mode="OTHERS" amount="1000.0" currentBalance="300.57" transactionTimestamp="2022-06-19T00:00:00+05:30" valueDate="2022-06-19" narration="UPI/Akshay Adlak/217021352961/MB UPI" reference="UPI-217095781141" /></Transactions></Account>'''

xml_data = '''<Account xmlns="http://api.rebit.org.in/FISchema/deposit" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://api.rebit.org.in/FISchema/deposit ../FISchema/deposit.xsd" linkedAccRef="f5192fed-6c9c-493b-b85d-aa8235c7399c" maskedAccNumber="XXXXXX8988" version="1.2" type="deposit"><Profile><Holders type="SINGLE"><Holder name="YOGESH  MALVIYA" dob="1992-09-04" mobile="9098597913" nominee="NOT-REGISTERED" email="yogzmalviya@gmail.com" pan="ECEPM3212A" ckycCompliance="false" /></Holders></Profile><Summary currentBalance="163.8" currency="INR" exchgeRate="" balanceDateTime="2022-12-14T14:01:16.628+05:30" type="SAVINGS" branch="BHOPAL - ARERA COLONY" facility="CC" ifscCode="KKBK0005886" micrCode="" openingDate="2021-10-13" currentODLimit="0" drawingLimit="163.80" status="ACTIVE"><Pending amount="0.0" /></Summary><Transactions startDate="2022-06-12" endDate="2022-12-14"><Transaction txnId="S25836278" type="DEBIT" mode="OTHERS" amount="400.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="1PCD/8587/KARNIKA MARKETING PRIV/REWA120622/16:56" reference="216311406416" /><Transaction txnId="S18628747" type="CREDIT" mode="OTHERS" amount="100.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="9UPI/YOGESH MALVIYA/216305036794/NA" reference="UPI-216377280207" /><Transaction txnId="S18624783" type="CREDIT" mode="OTHERS" amount="1781.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="9UPI/YOGESH MALVIYA/216305030230/NA" reference="UPI-216377277537" /><Transaction txnId="S30323399" type="DEBIT" mode="OTHERS" amount="148.75" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="2UPI/RazorpayZomato/216386232803/ZomatoOnlineOrd" reference="UPI-216389748326" /><Transaction txnId="S25864256" type="DEBIT" mode="OTHERS" amount="150.0" currentBalance="1193.44" transactionTimestamp="2022-06-12T00:00:00+05:30" valueDate="2022-06-12" narration="3PCD/8587/KARNIKA MARKETING PRIV/REWA120622/16:58" reference="216311406641" /><Transaction txnId="S42506559" type="DEBIT" mode="OTHERS" amount="19.0" currentBalance="1130.44" transactionTimestamp="2022-06-13T00:00:00+05:30" valueDate="2022-06-13" narration="4UPI/Dheerendra Jain/216464548973/Oid202206131918" reference="UPI-216402403500" /><Transaction txnId="S34780351" type="DEBIT" mode="OTHERS" amount="44.0" currentBalance="1130.44" transactionTimestamp="2022-06-13T00:00:00+05:30" valueDate="2022-06-13" narration="5UPI/Dheerendra Jain/216418410134/Oid202206131028" reference="UPI-216494338490" /><Transaction txnId="S52138551" type="CREDIT" mode="OTHERS" amount="140.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="9UPI/RAKESH KUMAR KH/216513632305/UPI" reference="UPI-216512500252" /><Transaction txnId="S52219985" type="DEBIT" mode="OTHERS" amount="80.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="6UPI/RAJORIYA DK RES/216534278929/Oid202206141402" reference="UPI-216512585462" /><Transaction txnId="S52543272" type="DEBIT" mode="OTHERS" amount="90.0" currentBalance="999.44" transactionTimestamp="2022-06-14T00:00:00+05:30" valueDate="2022-06-14" narration="7UPI/DOLARAJ PANDEY/216535664081/Oid202206141422" reference="UPI-216512923895" /></Transactions></Account>'''


# Helper functions
def getXRequestMeta(id):
    try:
        return base64.b64encode(json.dumps({"recipient-id": id}).encode()).decode()
    except Exception as e:
        print(f"Error in getXRequestMeta: {e}")
        return None

def getXJWSSignature(payload):
    try:
        return create_jws(payload)
    except Exception as e:
        print(f"Error in getXJWSSignature: {e}")
        return None

# Helper function to make headers
async def make_headers(body, entity_id, scenario_id):
    try:
        headers = {
            "x-jws-signature": getXJWSSignature(body),
            "Content-Type": "application/json",
            "client_api_key": await get_access_token(),
            "x-request-meta": getXRequestMeta(entity_id),
            "x-scenario-id" : scenario_id
        }
        return headers
    except Exception as e:
        print(f"Error in make_headers: {e}")
        return None

# Helper function to make requests
async def make_request(endpoint, method, headers, body):
    try:
        url = f"{SAHAMATI_BASEPATH}{endpoint}"
        async with aiohttp.ClientSession() as session:
            async with session.request(method, url, headers=headers, json=body) as response:
                response_json = await response.json()
        return response_json
    except Exception as e:
        print(f"Error in make_request: {e}")
        return None

async def fi_request_handler():
    try:
        encryption_key = await get_encryption_key_from_rust()
        return encryption_key["session_id"], encryption_key["KeyMaterial"]
    except Exception as e:
        print(f"Error in fi_request_handler: {e}")
        return None, None

async def update_fi_request_mock_response(session_id, scenario_id):
    try:
        print("Session in mock FI request", session_id)
        payload = {
            "entityId": MOCK_AA_ENTITY_ID,
            "endpoint": "/FI/request",
            "responseCode": 200,
            "scenario": scenario_id,
            "response": {
                "ver": "2.0.0",
                "timestamp": datetime_now(),
                "txnid": str(uuid.uuid4()),
                "consentId": "e83ec63a-ab78-4fda-a62f-b2e8c9d18959",
                "sessionId": session_id
            }
        }
        response_json = await update_mock_response(payload, scenario_id)
        return response_json
    except Exception as e:
        print(f"Error in update_fi_request_mock_response: {e}")
        return None

async def update_fi_fetch_mock_response(session_id, scenario_id):
    try:
        fip_encryption_key = await get_encryption_key()
        response = supabase.table("encryption_keys").upsert({"session_id": session_id, "fip_encryption_key": fip_encryption_key}).execute()
        fiu_encryption_key = response.data[0]["fiu_encryption_key"]
        print(fip_encryption_key)
        encrypted_data = await encrypt_data(fiu_encryption_key, fip_encryption_key["KeyMaterial"], fip_encryption_key["privateKey"], xml_data)
        payload = {
            "entityId": MOCK_AA_ENTITY_ID,
            "endpoint": "/FI/fetch",
            "responseCode": 200,
            "scenario": scenario_id,
            "response": {
                "ver": "2.0.0",
                "timestamp": datetime_now(),
                "txnid": str(uuid.uuid4()),
                "FI": [
                {
                    "fipID": "silence-fip",
                    "data": [
                    {
                        "linkRefNumber": "1234-5678-9999",
                        "maskedAccNumber": "XXXXXXXX4020",
                        "encryptedFI": encrypted_data
                    }
                    ],
                    "KeyMaterial": fip_encryption_key["KeyMaterial"]
                }
                ]
            }
        }
        response_json = await update_mock_response(payload, scenario_id)
        return response_json
    except Exception as e:
        print(f"Error in update_fi_fetch_mock_response: {e}")
        return None
