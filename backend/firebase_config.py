import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
import os
import json
import logging

def initialize_firebase():
    """Initialize Firebase Admin SDK with better error handling"""
    try:
        # Check if Firebase is already initialized
        if firebase_admin._apps:
            app = firebase_admin.get_app()
            db = firestore.client(app)
            # Note: Storage bucket might fail if credentials are invalid
            try:
                bucket = storage.bucket()
            except Exception as e:
                logging.warning(f"Storage bucket initialization failed: {e}")
                bucket = None
            return db, bucket
        
        # Try to load from service account file first
        if os.path.exists('firebase-service-account.json'):
            print("Loading Firebase credentials from service account file...")
            
            # Validate the service account file
            with open('firebase-service-account.json', 'r') as f:
                service_account_data = json.load(f)
                
            # Check if the private key is valid
            if 'private_key' not in service_account_data or not service_account_data['private_key']:
                raise ValueError("Invalid private key in service account file")
                
            cred = credentials.Certificate('firebase-service-account.json')
        else:
            # Load from environment variables (for production)
            print("Loading Firebase credentials from environment variables...")
            
            # Ensure all required environment variables are present
            required_env_vars = [
                'FIREBASE_PROJECT_ID',
                'FIREBASE_PRIVATE_KEY_ID',
                'FIREBASE_PRIVATE_KEY',
                'FIREBASE_CLIENT_EMAIL',
                'FIREBASE_CLIENT_ID'
            ]
            
            missing_vars = [var for var in required_env_vars if not os.environ.get(var)]
            if missing_vars:
                raise ValueError(f"Missing environment variables: {missing_vars}")
            
            firebase_config = {
                "type": "service_account",
                "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
                "private_key_id": os.environ.get('FIREBASE_PRIVATE_KEY_ID'),
                "private_key": os.environ.get('FIREBASE_PRIVATE_KEY').replace('\\n', '\n'),
                "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
                "client_id": os.environ.get('FIREBASE_CLIENT_ID'),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ.get('FIREBASE_CLIENT_EMAIL')}"
            }
            cred = credentials.Certificate(firebase_config)
        
        # Initialize Firebase Admin SDK
        app = firebase_admin.initialize_app(cred, {
            'storageBucket': f"{os.environ.get('FIREBASE_PROJECT_ID', 'login-page-13eae')}.appspot.com"
        })
        
        db = firestore.client()
        
        # Try to initialize storage bucket
        try:
            bucket = storage.bucket()
        except Exception as e:
            logging.warning(f"Storage bucket initialization failed: {e}")
            bucket = None
        
        print("Firebase initialized successfully!")
        return db, bucket
    
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        logging.error(f"Firebase initialization error: {e}")
        
        # Return None for both to indicate failure, but don't crash the app
        # This allows the app to run without Firebase features
        return None, None

def verify_user_token(id_token):
    """Verify Firebase ID token"""
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None

def create_user_account(email, password):
    """Create a new user in Firebase Auth"""
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        return user
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def upload_file_to_storage(file_data, file_name, user_id):
    """Upload file to Firebase Storage"""
    try:
        _, bucket = initialize_firebase()
        if not bucket:
            logging.error("Firebase Storage not available")
            return None
        
        # Create a unique file path
        file_path = f"resumes/{user_id}/{file_name}"
        blob = bucket.blob(file_path)
        
        # Upload the file
        blob.upload_from_string(file_data)
        
        # Make the file publicly accessible (optional)
        blob.make_public()
        
        return blob.public_url
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None