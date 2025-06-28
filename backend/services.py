from models import User, SimpleInterviewSession, Feedback, INTERVIEW_QUESTIONS_DB
from datetime import datetime
import random
import logging
import json
import os

# Local storage fallback when Firebase is not available
LOCAL_STORAGE_PATH = 'local_storage'

def ensure_local_storage():
    """Ensure local storage directory exists"""
    if not os.path.exists(LOCAL_STORAGE_PATH):
        os.makedirs(LOCAL_STORAGE_PATH)
        os.makedirs(os.path.join(LOCAL_STORAGE_PATH, 'users'))
        os.makedirs(os.path.join(LOCAL_STORAGE_PATH, 'sessions'))
        os.makedirs(os.path.join(LOCAL_STORAGE_PATH, 'feedback'))

class UserService:
    def __init__(self, db=None, storage_bucket=None):
        self.db = db
        self.storage_bucket = storage_bucket
        ensure_local_storage()
    
    def create_user(self, uid, email, first_name="", last_name="", temporary_xp=0):
        """Create a new user in Firestore or local storage"""
        try:
            user = User(uid, email, first_name, last_name)
            # Add any temporary XP earned before signup
            if temporary_xp > 0:
                user.xp_points += temporary_xp
                user.calculate_level()
                user.achievements.append({
                    'type': 'welcome_bonus',
                    'timestamp': datetime.now().isoformat(),
                    'description': f'Welcome bonus: {temporary_xp} XP!'
                })
            
            user_data = user.to_dict()
            
            if self.db:
                # Use Firebase
                self.db.collection('users').document(uid).set(user_data)
            else:
                # Fallback to local storage
                with open(os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json'), 'w') as f:
                    json.dump(user_data, f, default=str)
                    
            logging.info(f"User created successfully: {uid}")
            return user
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            raise e
    
    def get_user(self, uid):
        """Get user by UID from Firebase or local storage"""
        try:
            if self.db:
                # Try Firebase first
                doc = self.db.collection('users').document(uid).get()
                if doc.exists:
                    return doc.to_dict()
            
            # Fallback to local storage
            file_path = os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json')
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    return json.load(f)
                    
            return None
        except Exception as e:
            logging.error(f"Error getting user {uid}: {e}")
            # Try local storage as fallback
            file_path = os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json')
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    return json.load(f)
            return None
    
    def update_user(self, uid, data):
        """Update user data in Firebase or local storage"""
        try:
            data['updated_at'] = datetime.now().isoformat()
            
            if self.db:
                self.db.collection('users').document(uid).update(data)
            else:
                # Update local storage
                user_data = self.get_user(uid)
                if user_data:
                    user_data.update(data)
                    with open(os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json'), 'w') as f:
                        json.dump(user_data, f, default=str)
                        
            logging.info(f"User updated successfully: {uid}")
        except Exception as e:
            logging.error(f"Error updating user {uid}: {e}")
            # Fallback to local storage
            user_data = self.get_user(uid)
            if user_data:
                user_data.update(data)
                with open(os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json'), 'w') as f:
                    json.dump(user_data, f, default=str)
    
    def add_xp_to_user(self, uid, xp_amount, source="Interview"):
        """Add XP points to user and update level"""
        try:
            user_data = self.get_user(uid)
            
            if not user_data:
                return None
            
            current_xp = user_data.get('xp_points', 50)
            current_level = user_data.get('level', 1)
            
            # Create User object to calculate new level
            user = User(uid, user_data.get('email'))
            user.xp_points = current_xp
            user.level = current_level
            user.achievements = user_data.get('achievements', [])
            
            # Add XP and calculate level
            xp_result = user.add_xp(xp_amount, source)
            
            # Update user in database
            update_data = {
                'xp_points': user.xp_points,
                'level': user.level,
                'achievements': user.achievements,
                'updated_at': datetime.now().isoformat()
            }
            
            if self.db:
                user_ref = self.db.collection('users').document(uid)
                user_ref.update(update_data)
            else:
                # Update local storage
                user_data.update(update_data)
                with open(os.path.join(LOCAL_STORAGE_PATH, 'users', f'{uid}.json'), 'w') as f:
                    json.dump(user_data, f, default=str)
                    
            logging.info(f"XP added to user {uid}: {xp_amount} ({source})")
            return xp_result
        except Exception as e:
            logging.error(f"Error adding XP to user {uid}: {e}")
            return None
    
    def update_profile_data(self, uid, profile_data):
        """Update user profile data (GitHub, LinkedIn, Resume)"""
        try:
            update_data = {
                'updated_at': datetime.now().isoformat()
            }
            
            if 'github_profile' in profile_data:
                update_data['github_profile'] = profile_data['github_profile']
            
            if 'linkedin_profile' in profile_data:
                update_data['linkedin_profile'] = profile_data['linkedin_profile']
            
            if 'resume_uploaded' in profile_data:
                update_data['resume_uploaded'] = profile_data['resume_uploaded']
                update_data['resume_file_name'] = profile_data.get('resume_file_name', '')
                update_data['resume_url'] = profile_data.get('resume_url', '')
            
            self.update_user(uid, update_data)
            logging.info(f"Profile data updated for user {uid}")
            return update_data
        except Exception as e:
            logging.error(f"Error updating profile data for user {uid}: {e}")
            raise e

class InterviewService:
    def __init__(self, db=None):
        self.db = db
        ensure_local_storage()
    
    def get_questions_by_career(self, career_path):
        """Get interview questions for a specific career path"""
        return INTERVIEW_QUESTIONS_DB.get(career_path, [])
    
    def create_session(self, user_id, career_path):
        """Create a new interview session"""
        try:
            session = SimpleInterviewSession(user_id, career_path)
            questions = self.get_questions_by_career(career_path)
            session.total_questions = len(questions)
            
            # Store session in Firestore or local storage
            session_data = session.to_dict()
            
            if self.db:
                self.db.collection('interview_sessions').document(session.session_id).set(session_data)
            else:
                # Fallback to local storage
                with open(os.path.join(LOCAL_STORAGE_PATH, 'sessions', f'{session.session_id}.json'), 'w') as f:
                    json.dump(session_data, f, default=str)
                    
            logging.info(f"Interview session created: {session.session_id}")
            return session
        except Exception as e:
            logging.error(f"Error creating interview session: {e}")
            # Still return the session object for local use
            session = SimpleInterviewSession(user_id, career_path)
            questions = self.get_questions_by_career(career_path)
            session.total_questions = len(questions)
            return session
    
    def get_session(self, session_id):
        """Get session from storage"""
        try:
            if self.db:
                doc = self.db.collection('interview_sessions').document(session_id).get()
                if doc.exists:
                    return doc.to_dict()
            
            # Fallback to local storage
            file_path = os.path.join(LOCAL_STORAGE_PATH, 'sessions', f'{session_id}.json')
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    return json.load(f)
                    
            return None
        except Exception as e:
            logging.error(f"Error getting session {session_id}: {e}")
            return None
    
    def update_session(self, session_id, data):
        """Update session data"""
        try:
            if self.db:
                self.db.collection('interview_sessions').document(session_id).update(data)
            else:
                # Update local storage
                session_data = self.get_session(session_id)
                if session_data:
                    session_data.update(data)
                    with open(os.path.join(LOCAL_STORAGE_PATH, 'sessions', f'{session_id}.json'), 'w') as f:
                        json.dump(session_data, f, default=str)
        except Exception as e:
            logging.error(f"Error updating session {session_id}: {e}")
    
    def add_response(self, session_id, question_id, question_text, response_text, category="General", difficulty="intermediate"):
        """Add a response to an interview session"""
        try:
            session_data = self.get_session(session_id)
            
            if not session_data:
                return None
            
            # Add response
            response = {
                'question_id': question_id,
                'question_text': question_text,
                'response': response_text,
                'category': category,
                'difficulty': difficulty,
                'timestamp': datetime.now().isoformat()
            }
            
            session_data['responses'].append(response)
            session_data['questions_answered'] = len(session_data['responses'])
            session_data['completion_percentage'] = (session_data['questions_answered'] / session_data['total_questions']) * 100 if session_data['total_questions'] > 0 else 0
            
            # Update session
            self.update_session(session_id, session_data)
            logging.info(f"Response added to session {session_id}")
            return session_data
        except Exception as e:
            logging.error(f"Error adding response to session {session_id}: {e}")
            return None
    
    def complete_session(self, session_id, user_service):
        """Complete an interview session and award XP"""
        try:
            session_data = self.get_session(session_id)
            
            if not session_data:
                return None
            
            # Calculate XP
            base_xp = 50
            completion_percentage = session_data.get('completion_percentage', 0)
            questions_answered = len(session_data.get('responses', []))
            
            completion_bonus = int(completion_percentage * 0.5)
            response_quality_bonus = min(questions_answered * 10, 50)
            
            xp_earned = base_xp + completion_bonus + response_quality_bonus
            
            # Update session
            update_data = {
                'status': 'completed',
                'completed_at': datetime.now().isoformat(),
                'xp_earned': xp_earned
            }
            
            session_data.update(update_data)
            self.update_session(session_id, update_data)
            
            # Award XP to user
            if session_data['user_id'] != 'guest':
                user_service.add_xp_to_user(session_data['user_id'], xp_earned, "Interview Completion")
            
            # Update user interview stats
            self.update_user_interview_stats(session_data['user_id'], session_data['career_path'], True, user_service)
            
            logging.info(f"Session completed: {session_id}, XP earned: {xp_earned}")
            return session_data
        except Exception as e:
            logging.error(f"Error completing session {session_id}: {e}")
            return None
    
    def update_user_interview_stats(self, user_id, career_path, completed=False, user_service=None):
        """Update user's interview statistics"""
        try:
            if user_id == 'guest' or not user_service:
                return
            
            user_data = user_service.get_user(user_id)
            
            if not user_data:
                return
            
            total_interviews = user_data.get('total_interviews', 0) + 1
            completed_interviews = user_data.get('completed_interviews', 0)
            if completed:
                completed_interviews += 1
            
            career_paths = user_data.get('career_paths_practiced', {})
            career_paths[career_path] = career_paths.get(career_path, 0) + 1
            
            update_data = {
                'total_interviews': total_interviews,
                'completed_interviews': completed_interviews,
                'career_paths_practiced': career_paths,
                'updated_at': datetime.now().isoformat()
            }
            
            user_service.update_user(user_id, update_data)
            logging.info(f"Interview stats updated for user {user_id}")
        except Exception as e:
            logging.error(f"Error updating interview stats for user {user_id}: {e}")

class FeedbackService:
    def __init__(self, db=None):
        self.db = db
        ensure_local_storage()
    
    def submit_feedback(self, user_id, session_id, rating, comments=None):
        """Submit feedback for an interview session"""
        try:
            feedback = Feedback(user_id, session_id, rating, comments)
            feedback_data = feedback.to_dict()
            
            if self.db:
                self.db.collection('feedback').add(feedback_data)
            else:
                # Fallback to local storage
                feedback_id = f"{user_id}_{session_id}_{datetime.now().timestamp()}"
                with open(os.path.join(LOCAL_STORAGE_PATH, 'feedback', f'{feedback_id}.json'), 'w') as f:
                    json.dump(feedback_data, f, default=str)
                    
            logging.info(f"Feedback submitted for session {session_id}")
            return feedback
        except Exception as e:
            logging.error(f"Error submitting feedback: {e}")
            raise e