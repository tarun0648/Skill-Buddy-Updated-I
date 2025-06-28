from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import base64
import os
from services import UserService, InterviewService, FeedbackService
from firebase_config import initialize_firebase, upload_file_to_storage
import logging

# Create blueprints
auth_bp = Blueprint('auth', __name__)
interview_bp = Blueprint('interview', __name__)
user_bp = Blueprint('user', __name__)
feedback_bp = Blueprint('feedback', __name__)
profile_bp = Blueprint('profile', __name__)

def create_routes():
    # Initialize Firebase with error handling
    db, storage_bucket = initialize_firebase()
    
    # If Firebase fails, create a warning but continue
    if not db:
        logging.warning("Firebase initialization failed. Running in limited mode.")
        # You could implement a fallback storage mechanism here
        # For now, we'll return empty blueprints or implement local storage
    
    # Initialize services (they should handle None db gracefully)
    user_service = UserService(db, storage_bucket)
    interview_service = InterviewService(db)
    feedback_service = FeedbackService(db)
    
    # Authentication Routes
    @auth_bp.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('firstName', '')
            last_name = data.get('lastName', '')
            temporary_xp = data.get('temporaryXP', 0)  # XP earned before signup
            
            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Create user ID from email (simplified approach)
            user_id = email.replace('@', '_').replace('.', '_').replace('+', '_')
            
            # Check if user already exists
            existing_user = user_service.get_user(user_id)
            if existing_user:
                return jsonify({'error': 'User already exists'}), 400
            
            # Create user in Firestore
            user = user_service.create_user(user_id, email, first_name, last_name, temporary_xp)
            
            return jsonify({
                'message': 'User created successfully',
                'user_id': user_id,
                'xp_bonus': temporary_xp
            }), 201
            
        except Exception as e:
            logging.error(f"Registration error: {e}")
            return jsonify({'error': str(e)}), 500

    @auth_bp.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'error': 'Email and password are required'}), 400
            
            # Create user ID from email (simplified approach)
            user_id = email.replace('@', '_').replace('.', '_').replace('+', '_')
            
            # Get user data from Firestore
            user_data = user_service.get_user(user_id)
            
            if user_data:
                return jsonify({
                    'message': 'Login successful',
                    'user_id': user_id,
                    'email': user_data.get('email'),
                    'uid': user_id,
                    'user_data': user_data
                }), 200
            else:
                return jsonify({'error': 'User not found. Please register first.'}), 404
                
        except Exception as e:
            logging.error(f"Login error: {e}")
            return jsonify({'error': 'Login failed'}), 401

    @auth_bp.route('/logout', methods=['POST'])
    def logout():
        return jsonify({'message': 'Logged out successfully'}), 200

    # Profile Management Routes
    @profile_bp.route('/update-profile', methods=['POST'])
    def update_profile():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            
            if not user_id:
                return jsonify({'error': 'User ID is required'}), 400
            
            profile_data = {}
            
            if 'github_profile' in data:
                profile_data['github_profile'] = data['github_profile']
            
            if 'linkedin_profile' in data:
                profile_data['linkedin_profile'] = data['linkedin_profile']
            
            if 'resume_data' in data:
                # Handle resume upload
                resume_data = data.get('resume_data')
                resume_filename = data.get('resume_filename', 'resume.pdf')
                
                if resume_data and storage_bucket:
                    # Decode base64 file data
                    try:
                        file_data = base64.b64decode(resume_data)
                        # Upload to Firebase Storage
                        resume_url = upload_file_to_storage(file_data, resume_filename, user_id)
                        
                        if resume_url:
                            profile_data['resume_uploaded'] = True
                            profile_data['resume_file_name'] = resume_filename
                            profile_data['resume_url'] = resume_url
                        else:
                            # Fallback: just mark as uploaded without URL
                            profile_data['resume_uploaded'] = True
                            profile_data['resume_file_name'] = resume_filename
                    except Exception as e:
                        logging.error(f"Resume upload error: {e}")
                        return jsonify({'error': 'Invalid resume data'}), 400
                else:
                    # If no storage bucket, just mark as uploaded
                    profile_data['resume_uploaded'] = True
                    profile_data['resume_file_name'] = resume_filename
            
            if 'resume_uploaded' in data and data['resume_uploaded'] == False:
                # Remove resume
                profile_data['resume_uploaded'] = False
                profile_data['resume_file_name'] = ''
                profile_data['resume_url'] = ''
            
            result = user_service.update_profile_data(user_id, profile_data)
            
            return jsonify({
                'message': 'Profile updated successfully',
                'updated_data': result
            }), 200
            
        except Exception as e:
            logging.error(f"Update profile error: {e}")
            return jsonify({'error': 'Failed to update profile'}), 500

    @profile_bp.route('/add-xp', methods=['POST'])
    def add_xp():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            xp_amount = data.get('xp_amount')
            source = data.get('source', 'Manual')
            
            if not user_id or not xp_amount:
                return jsonify({'error': 'User ID and XP amount are required'}), 400
            
            if not isinstance(xp_amount, int) or xp_amount <= 0:
                return jsonify({'error': 'XP amount must be a positive integer'}), 400
            
            result = user_service.add_xp_to_user(user_id, xp_amount, source)
            
            if not result:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'message': 'XP added successfully',
                'xp_data': result
            }), 200
            
        except Exception as e:
            logging.error(f"Add XP error: {e}")
            return jsonify({'error': 'Failed to add XP'}), 500

    # Interview Routes
    @interview_bp.route('/questions/<career_path>', methods=['GET'])
    def get_questions(career_path):
        try:
            questions = interview_service.get_questions_by_career(career_path)
            
            if not questions:
                return jsonify({'error': 'Invalid career path'}), 400
            
            return jsonify({
                'career_path': career_path,
                'questions': questions,
                'total': len(questions)
            }), 200
            
        except Exception as e:
            logging.error(f"Get questions error: {e}")
            return jsonify({'error': 'Failed to fetch questions'}), 500

    @interview_bp.route('/start', methods=['POST'])
    def start_interview():
        try:
            data = request.get_json()
            user_id = data.get('user_id', 'guest')  # Allow guest users
            career_path = data.get('career_path')
            
            if not career_path:
                return jsonify({'error': 'Career path is required'}), 400
            
            # Create interview session
            session = interview_service.create_session(user_id, career_path)
            questions = interview_service.get_questions_by_career(career_path)
            
            return jsonify({
                'message': 'Interview session started',
                'session_id': session.session_id,
                'questions': questions,
                'career_path': career_path,
                'total_questions': len(questions)
            }), 201
            
        except Exception as e:
            logging.error(f"Start interview error: {e}")
            return jsonify({'error': 'Failed to start interview'}), 500

    @interview_bp.route('/response', methods=['POST'])
    def submit_response():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            question_id = data.get('question_id')
            question_text = data.get('question_text', '')
            response = data.get('response')
            category = data.get('category', 'General')
            difficulty = data.get('difficulty', 'intermediate')
            
            if not session_id or question_id is None or not response:
                return jsonify({'error': 'Session ID, question ID, and response are required'}), 400
            
            # Add response to session
            updated_session = interview_service.add_response(
                session_id, question_id, question_text, response, category, difficulty
            )
            
            if not updated_session:
                return jsonify({'error': 'Session not found'}), 404
            
            return jsonify({
                'message': 'Response submitted successfully',
                'questions_answered': updated_session.get('questions_answered', 0),
                'completion_percentage': updated_session.get('completion_percentage', 0)
            }), 200
            
        except Exception as e:
            logging.error(f"Submit response error: {e}")
            return jsonify({'error': 'Failed to submit response'}), 500

    @interview_bp.route('/end', methods=['POST'])
    def end_interview():
        try:
            data = request.get_json()
            session_id = data.get('session_id')
            
            if not session_id:
                return jsonify({'error': 'Session ID is required'}), 400
            
            # Complete the session and award XP
            completed_session = interview_service.complete_session(session_id, user_service)
            
            if not completed_session:
                return jsonify({'error': 'Session not found'}), 404
            
            return jsonify({
                'message': 'Interview session completed successfully',
                'session_data': completed_session,
                'xp_earned': completed_session.get('xp_earned', 0)
            }), 200
            
        except Exception as e:
            logging.error(f"End interview error: {e}")
            return jsonify({'error': 'Failed to end interview'}), 500

    # User Routes
    @user_bp.route('/profile/<user_id>', methods=['GET'])
    def get_user_profile(user_id):
        try:
            user_data = user_service.get_user(user_id)
            
            if not user_data:
                return jsonify({'error': 'User not found'}), 404
            
            # Get user sessions if db is available
            sessions = []
            if db:
                try:
                    sessions_query = db.collection('interview_sessions').where('user_id', '==', user_id).limit(10)
                    for doc in sessions_query.get():
                        session_data = doc.to_dict()
                        sessions.append(session_data)
                except Exception as e:
                    logging.error(f"Error fetching sessions: {e}")
            
            # Calculate statistics
            total_sessions = len(sessions)
            completed_sessions = len([s for s in sessions if s.get('status') == 'completed'])
            completion_rate = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            stats = {
                'total_sessions': total_sessions,
                'completed_sessions': completed_sessions,
                'completion_rate': completion_rate,
                'career_paths': user_data.get('career_paths_practiced', {}),
                'total_questions_answered': sum(len(s.get('responses', [])) for s in sessions)
            }
            
            return jsonify({
                'user': user_data,
                'statistics': stats,
                'recent_sessions': sessions
            }), 200
            
        except Exception as e:
            logging.error(f"Get user profile error: {e}")
            return jsonify({'error': 'Failed to fetch user profile'}), 500

    # Feedback Routes
    @feedback_bp.route('/submit', methods=['POST'])
    def submit_feedback():
        try:
            data = request.get_json()
            user_id = data.get('user_id')
            session_id = data.get('session_id')
            rating = data.get('rating')
            comments = data.get('comments')
            
            if not user_id or not session_id or not rating:
                return jsonify({'error': 'User ID, session ID, and rating are required'}), 400
            
            if not isinstance(rating, int) or rating < 1 or rating > 5:
                return jsonify({'error': 'Rating must be an integer between 1 and 5'}), 400
            
            # Submit feedback
            feedback_service.submit_feedback(user_id, session_id, rating, comments)
            
            # Award bonus XP for providing feedback
            if user_id != 'guest':
                user_service.add_xp_to_user(user_id, 25, "Feedback Provided")
            
            return jsonify({
                'message': 'Feedback submitted successfully',
                'bonus_xp': 25 if user_id != 'guest' else 0
            }), 201
            
        except Exception as e:
            logging.error(f"Submit feedback error: {e}")
            return jsonify({'error': 'Failed to submit feedback'}), 500

    return auth_bp, interview_bp, user_bp, feedback_bp, profile_bp