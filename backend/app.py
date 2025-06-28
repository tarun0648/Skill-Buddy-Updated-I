from flask import Flask, request, jsonify
from flask_cors import CORS
from routes import create_routes
import logging
import os

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, origins=['*'], supports_credentials=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(message)s'
    )
    
    try:
        # Create and register blueprints
        auth_bp, interview_bp, user_bp, feedback_bp, profile_bp = create_routes()
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(interview_bp, url_prefix='/api/interview')
        app.register_blueprint(user_bp, url_prefix='/api/user')
        app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
        app.register_blueprint(profile_bp, url_prefix='/api/profile')
        
    except Exception as e:
        app.logger.error(f"Failed to initialize routes: {e}")
        return None
    
    # Health check endpoint
    @app.route('/')
    def health_check():
        return jsonify({
            'message': 'Skillbuddy Interview Prep API is running!',
            'status': 'healthy',
            'version': '3.0.0',
            'features': [
                'Fixed Firebase Authentication',
                'Guest Interview Support',
                'XP Persistence System',
                'File Upload Support',
                'Enhanced Profile Management'
            ]
        })
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        app.logger.error(f"Internal error: {error}")
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    if app:
        port = int(os.environ.get('PORT', 5000))
        app.run(
            debug=True,
            host='0.0.0.0',
            port=port
        )
    else:
        print("Failed to create application")