from datetime import datetime
from typing import List, Dict, Optional
import uuid

class User:
    def __init__(self, uid: str, email: str, first_name: str = "", last_name: str = "", created_at: datetime = None):
        self.uid = uid
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.created_at = created_at or datetime.now()
        self.updated_at = datetime.now()
        self.xp_points = 50  # Initial XP points
        self.level = 1
        self.github_profile = ""
        self.linkedin_profile = ""
        self.resume_uploaded = False
        self.resume_file_name = ""
        self.resume_url = ""
        self.total_interviews = 0
        self.completed_interviews = 0
        self.career_paths_practiced = {}
        self.interview_sessions = []
        self.achievements = []
        self.preferences = {}
        self.temporary_xp = 0  # For guest users before signup
    
    def calculate_level(self):
        """Calculate level based on XP points"""
        level = 1
        xp_needed = 100
        total_xp_for_level = 0
        
        while self.xp_points >= total_xp_for_level + xp_needed:
            total_xp_for_level += xp_needed
            level += 1
            xp_needed = level * 100
        
        self.level = level
        return level
    
    def add_xp(self, amount: int, source: str = "Unknown"):
        """Add XP points and recalculate level"""
        old_level = self.level
        self.xp_points += amount
        new_level = self.calculate_level()
        
        if new_level > old_level:
            # Level up achievement
            self.achievements.append({
                'type': 'level_up',
                'level': new_level,
                'timestamp': datetime.now(),
                'description': f'Reached level {new_level}!'
            })
        
        return {
            'xp_gained': amount,
            'total_xp': self.xp_points,
            'current_level': new_level,
            'level_up': new_level > old_level,
            'source': source
        }
    
    def get_xp_progress(self):
        """Get XP progress for current level"""
        level = 1
        xp_needed = 100
        total_xp_for_level = 0
        
        while self.xp_points >= total_xp_for_level + xp_needed:
            total_xp_for_level += xp_needed
            level += 1
            xp_needed = level * 100
        
        current_level_xp = self.xp_points - total_xp_for_level
        xp_to_next_level = xp_needed - current_level_xp
        
        return {
            'current_level_xp': current_level_xp,
            'xp_to_next_level': xp_to_next_level,
            'next_level_requirement': xp_needed,
            'progress_percentage': (current_level_xp / xp_needed) * 100 if xp_needed > 0 else 100
        }
    
    def to_dict(self):
        return {
            'uid': self.uid,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'xp_points': self.xp_points,
            'level': self.level,
            'github_profile': self.github_profile,
            'linkedin_profile': self.linkedin_profile,
            'resume_uploaded': self.resume_uploaded,
            'resume_file_name': self.resume_file_name,
            'resume_url': self.resume_url,
            'total_interviews': self.total_interviews,
            'completed_interviews': self.completed_interviews,
            'career_paths_practiced': self.career_paths_practiced,
            'interview_sessions': self.interview_sessions,
            'achievements': self.achievements,
            'preferences': self.preferences,
            'temporary_xp': self.temporary_xp
        }

class SimpleInterviewSession:
    def __init__(self, user_id: str, career_path: str, session_id: str = None):
        self.session_id = session_id or str(uuid.uuid4())
        self.user_id = user_id
        self.career_path = career_path
        self.started_at = datetime.now()
        self.completed_at = None
        self.status = 'in_progress'
        self.questions_answered = 0
        self.total_questions = 0
        self.responses = []
        self.xp_earned = 0
        self.completion_percentage = 0
    
    def add_response(self, question_id, question_text, response_text, category="General", difficulty="intermediate"):
        """Add a response to the session"""
        response = {
            'question_id': question_id,
            'question_text': question_text,
            'response': response_text,
            'category': category,
            'difficulty': difficulty,
            'timestamp': datetime.now()
        }
        self.responses.append(response)
        self.questions_answered = len(self.responses)
        self.completion_percentage = (self.questions_answered / self.total_questions) * 100 if self.total_questions > 0 else 0
    
    def complete_session(self):
        """Mark session as completed and calculate XP"""
        self.status = 'completed'
        self.completed_at = datetime.now()
        
        # Calculate XP based on completion and responses
        base_xp = 50
        completion_bonus = int(self.completion_percentage * 0.5)  # Up to 50 bonus XP for 100% completion
        response_quality_bonus = min(len(self.responses) * 10, 50)  # Up to 50 XP for detailed responses
        
        self.xp_earned = base_xp + completion_bonus + response_quality_bonus
        return self.xp_earned
    
    def to_dict(self):
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'career_path': self.career_path,
            'started_at': self.started_at,
            'completed_at': self.completed_at,
            'status': self.status,
            'questions_answered': self.questions_answered,
            'total_questions': self.total_questions,
            'responses': self.responses,
            'xp_earned': self.xp_earned,
            'completion_percentage': self.completion_percentage
        }

class Feedback:
    def __init__(self, user_id: str, session_id: str, rating: int, comments: str = None):
        self.user_id = user_id
        self.session_id = session_id
        self.rating = rating
        self.comments = comments
        self.submitted_at = datetime.now()
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'session_id': self.session_id,
            'rating': self.rating,
            'comments': self.comments,
            'submitted_at': self.submitted_at
        }

# Enhanced Interview Questions Database
INTERVIEW_QUESTIONS_DB = {
    'SoftwareDev': [
        {'id': 1, 'question': 'Can you explain the difference between REST and GraphQL APIs?', 'category': 'API Design', 'difficulty': 'intermediate'},
        {'id': 2, 'question': 'What is the difference between synchronous and asynchronous programming?', 'category': 'Programming Concepts', 'difficulty': 'intermediate'},
        {'id': 3, 'question': 'Explain the concept of Big O notation and its importance.', 'category': 'Algorithms', 'difficulty': 'intermediate'},
        {'id': 4, 'question': 'What are the main principles of object-oriented programming?', 'category': 'Programming Concepts', 'difficulty': 'beginner'},
        {'id': 5, 'question': 'How do you handle errors in your code?', 'category': 'Error Handling', 'difficulty': 'intermediate'},
        {'id': 6, 'question': 'What is the difference between SQL and NoSQL databases?', 'category': 'Databases', 'difficulty': 'intermediate'},
        {'id': 7, 'question': 'Explain the concept of version control and Git.', 'category': 'Tools', 'difficulty': 'beginner'},
        {'id': 8, 'question': 'What is test-driven development (TDD)?', 'category': 'Testing', 'difficulty': 'intermediate'},
        {'id': 9, 'question': 'How do you optimize code performance?', 'category': 'Performance', 'difficulty': 'advanced'},
        {'id': 10, 'question': 'Explain the concept of microservices architecture.', 'category': 'Architecture', 'difficulty': 'advanced'}
    ],
    'DataAnalyst': [
        {'id': 1, 'question': 'What tools do you use for data visualization and why?', 'category': 'Tools', 'difficulty': 'beginner'},
        {'id': 2, 'question': 'How would you handle missing data in a dataset?', 'category': 'Data Cleaning', 'difficulty': 'intermediate'},
        {'id': 3, 'question': 'Explain the difference between correlation and causation.', 'category': 'Statistics', 'difficulty': 'intermediate'},
        {'id': 4, 'question': 'What is the difference between mean, median, and mode?', 'category': 'Statistics', 'difficulty': 'beginner'},
        {'id': 5, 'question': 'How do you validate the accuracy of your analysis?', 'category': 'Data Quality', 'difficulty': 'intermediate'},
        {'id': 6, 'question': 'Explain A/B testing and its importance.', 'category': 'Testing', 'difficulty': 'intermediate'},
        {'id': 7, 'question': 'What is the difference between supervised and unsupervised learning?', 'category': 'Machine Learning', 'difficulty': 'intermediate'},
        {'id': 8, 'question': 'How do you handle outliers in your data?', 'category': 'Data Cleaning', 'difficulty': 'intermediate'},
        {'id': 9, 'question': 'Explain the concept of data normalization.', 'category': 'Data Processing', 'difficulty': 'intermediate'},
        {'id': 10, 'question': 'What are KPIs and how do you choose them?', 'category': 'Business Intelligence', 'difficulty': 'intermediate'}
    ],
    'UIDesigner': [
        {'id': 1, 'question': 'How do you approach user research for a new design project?', 'category': 'User Research', 'difficulty': 'intermediate'},
        {'id': 2, 'question': 'What is the difference between UX and UI design?', 'category': 'Design Fundamentals', 'difficulty': 'beginner'},
        {'id': 3, 'question': 'How do you ensure accessibility in your designs?', 'category': 'Accessibility', 'difficulty': 'intermediate'},
        {'id': 4, 'question': 'Explain the design thinking process.', 'category': 'Design Process', 'difficulty': 'intermediate'},
        {'id': 5, 'question': 'What are design systems and why are they important?', 'category': 'Design Systems', 'difficulty': 'intermediate'},
        {'id': 6, 'question': 'How do you handle user feedback on your designs?', 'category': 'User Feedback', 'difficulty': 'intermediate'},
        {'id': 7, 'question': 'What is responsive design and how do you implement it?', 'category': 'Responsive Design', 'difficulty': 'intermediate'},
        {'id': 8, 'question': 'Explain the concept of information architecture.', 'category': 'Information Architecture', 'difficulty': 'intermediate'},
        {'id': 9, 'question': 'How do you measure the success of a design?', 'category': 'Design Metrics', 'difficulty': 'intermediate'},
        {'id': 10, 'question': 'What are the latest design trends you follow?', 'category': 'Design Trends', 'difficulty': 'beginner'}
    ],
    'DigitalMarketer': [
        {'id': 1, 'question': 'Explain how you would run a successful paid advertising campaign.', 'category': 'Paid Advertising', 'difficulty': 'intermediate'},
        {'id': 2, 'question': 'What metrics do you track for email marketing campaigns?', 'category': 'Email Marketing', 'difficulty': 'intermediate'},
        {'id': 3, 'question': 'How do you measure the ROI of social media marketing?', 'category': 'Social Media', 'difficulty': 'intermediate'},
        {'id': 4, 'question': 'Explain the concept of marketing funnel.', 'category': 'Marketing Strategy', 'difficulty': 'beginner'},
        {'id': 5, 'question': 'What is SEO and how do you optimize for it?', 'category': 'SEO', 'difficulty': 'intermediate'},
        {'id': 6, 'question': 'How do you segment your audience for campaigns?', 'category': 'Audience Targeting', 'difficulty': 'intermediate'},
        {'id': 7, 'question': 'What is content marketing and its benefits?', 'category': 'Content Marketing', 'difficulty': 'beginner'},
        {'id': 8, 'question': 'How do you handle negative feedback on social media?', 'category': 'Social Media Management', 'difficulty': 'intermediate'},
        {'id': 9, 'question': 'Explain the concept of marketing automation.', 'category': 'Marketing Automation', 'difficulty': 'intermediate'},
        {'id': 10, 'question': 'What are the key components of a digital marketing strategy?', 'category': 'Marketing Strategy', 'difficulty': 'intermediate'}
    ]
}