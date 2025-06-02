import base64
import hashlib
import os
import secrets
import urllib.parse
from datetime import datetime, timezone
from uuid import uuid4
from util.constants import AA_REDIRECTION_SECRET

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class EncryptionUtil:
    AES_ALGO = "AES"
    KEY_ALGO = "PBKDF2WithHmacSHA256"
    AES_CBC_PKCS5 = "AES/CBC/PKCS5Padding"
    SECRET_KEY = AA_REDIRECTION_SECRET
    FI = "silence-fiu"

    @staticmethod
    def encrypt(str_to_encrypt, salt):
        """Encrypt string using AES-256-CBC with PBKDF2 key derivation"""
        # Fixed IV (all zeros) - matching Java implementation
        iv = bytes([0] * 16)
        
        try:
            # PBKDF2 key derivation
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,  # 256 bits
                salt=salt.encode('utf-8'),
                iterations=65536,
            )
            key = kdf.derive(EncryptionUtil.SECRET_KEY.encode('utf-8'))
            
            # AES encryption
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
            encryptor = cipher.encryptor()
            
            # PKCS5 padding (equivalent to PKCS7 for AES)
            data = str_to_encrypt.encode('utf-8')
            padding_length = 16 - (len(data) % 16)
            padded_data = data + bytes([padding_length] * padding_length)
            
            encrypted = encryptor.update(padded_data) + encryptor.finalize()
            
            # URL-safe base64 encoding
            return base64.urlsafe_b64encode(encrypted).decode('utf-8')
            
        except Exception as e:
            print(f"Encryption error: {e}")
            return None

    @staticmethod
    def decrypt(str_to_decrypt, salt):
        """Decrypt string using AES-256-CBC with PBKDF2 key derivation"""
        # Fixed IV (all zeros) - matching Java implementation
        iv = bytes([0] * 16)
        
        try:
            # PBKDF2 key derivation
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,  # 256 bits
                salt=salt.encode('utf-8'),
                iterations=65536,
            )
            key = kdf.derive(EncryptionUtil.SECRET_KEY.encode('utf-8'))
            
            # Decode from URL-safe base64
            encrypted_data = base64.urlsafe_b64decode(str_to_decrypt.encode('utf-8'))
            
            # AES decryption
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
            decryptor = cipher.decryptor()
            
            decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()
            
            # Remove PKCS5 padding
            padding_length = decrypted_padded[-1]
            decrypted = decrypted_padded[:-padding_length]
            
            return decrypted.decode('utf-8')
            
        except Exception as e:
            print(f"Decryption error: {e}")
            return None

    @staticmethod
    def get_random_nonce(num_bytes):
        """Generate random nonce"""
        return secrets.token_bytes(num_bytes)

    @staticmethod
    def xor(data, key):
        """XOR operation between data and key"""
        key_bytes = key.encode('utf-8') if isinstance(key, str) else key
        data_bytes = data if isinstance(data, bytes) else data.encode('utf-8')
        
        result = bytearray()
        for i in range(len(data_bytes)):
            result.append(data_bytes[i] ^ key_bytes[i % len(key_bytes)])
        
        return bytes(result)

    @staticmethod
    def get_reqdate_utc():
        """Get current UTC datetime in required format"""
        now = datetime.now(timezone.utc)
        formatted = now.strftime("%d%m%Y%H%M%S%f")
        # Remove last 3 digits to match Java's substring operation
        formatted = formatted[:-5]
        return formatted

    @staticmethod
    def build_ecreq(txnid, sessionid, userid, redirect, srcref):
        """Build URL-encoded payload string"""
        try:
            payload = {
                "txnid": txnid,
                "sessionid": sessionid,
                "userid": userid,
                "redirect": redirect,
                "srcref": srcref
            }
            
            # URL encode the parameters
            encoded_params = []
            for key, value in payload.items():
                encoded_key = urllib.parse.quote(key, safe='')
                encoded_value = urllib.parse.quote(value, safe='')
                encoded_params.append(f"{encoded_key}={encoded_value}")
            
            return "&".join(encoded_params)
            
        except Exception as e:
            raise RuntimeError(f"Error building ecreq: {e}")

    @staticmethod
    def decrypt_xored_value(xored_value, key):
        """Decrypt XOR encrypted value"""
        decoded = base64.b64decode(xored_value.encode('utf-8'))
        return EncryptionUtil.xor(decoded, key).decode('utf-8')

    @staticmethod
    def encrypt_value_to_xor(value, key):
        """Encrypt value using XOR and base64 encode"""
        xored = EncryptionUtil.xor(value.encode('utf-8'), key)
        return base64.b64encode(xored).decode('utf-8')


async def build_url(consentHandle, redirectUrl, phone):
    """Main function replicating Java main method"""
    # Generate salt (reqdate)
    salt = EncryptionUtil.get_reqdate_utc()
    
    # Generate UUIDs
    txnid = str(uuid4())
    sessionid = str(uuid4())
    
    # Build payload
    payload = EncryptionUtil.build_ecreq(
        txnid, 
        sessionid, 
        f"{phone}@finvu",
        redirectUrl, 
        consentHandle
    )
    
    # Encrypt payload
    enc_data = EncryptionUtil.encrypt(payload, salt)
    xored_fi = EncryptionUtil.encrypt_value_to_xor(EncryptionUtil.FI, salt)
    
    # Build final URL
    final_url = f"https://sweecarsandbox.finvu.in?fi={xored_fi}&reqdate={salt}&ecreq={enc_data}&aaVersion=2.0.0"
    return final_url