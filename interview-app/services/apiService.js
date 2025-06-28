// services/apiService.js

const getApiBaseUrl = () => {
  const COMPUTER_IP = '172.20.10.7'; // Update with your actual IP
  const LOCAL_URL = `http://${COMPUTER_IP}:5000/api`;
  const PRODUCTION_URL = 'https://your-backend-domain.com/api';
  
  if (__DEV__) {
    return LOCAL_URL;
  } else {
    return PRODUCTION_URL;
  }
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
    console.log('API Base URL:', this.baseURL);
  }

  setAuthToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}` };
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      
      if (error.message === 'Network request failed' || error.message.includes('fetch')) {
        throw new Error(`Cannot connect to server. Make sure backend is running on ${this.baseURL}`);
      }
      
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/`);
      const data = await response.json();
      console.log('Backend connection test successful:', data);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }

  // Auth methods
  async register(email, password, firstName = '', lastName = '', temporaryXP = 0) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName,
        temporaryXP
      }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Profile methods
  async updateProfile(userId, profileData) {
    return this.request('/profile/update-profile', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...profileData
      }),
    });
  }

  async addXP(userId, xpAmount, source = 'Manual') {
    return this.request('/profile/add-xp', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        xp_amount: xpAmount,
        source: source
      }),
    });
  }

  // Interview methods
  async getQuestions(careerPath) {
    return this.request(`/interview/questions/${careerPath}`);
  }

  async startInterview(userId, careerPath) {
    return this.request('/interview/start', {
      method: 'POST',
      body: JSON.stringify({ 
        user_id: userId, 
        career_path: careerPath
      }),
    });
  }

  async submitResponse(sessionId, questionId, questionText, response, category = 'General', difficulty = 'intermediate') {
    return this.request('/interview/response', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        question_id: questionId,
        question_text: questionText,
        response: response,
        category: category,
        difficulty: difficulty
      }),
    });
  }

  async endInterview(sessionId) {
    return this.request('/interview/end', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  // User methods
  async getUserProfile(userId) {
    return this.request(`/user/profile/${userId}`);
  }

  // Get user's interview sessions
  async getUserSessions(userId, limit = 10) {
    try {
      // For now, return empty sessions since this endpoint doesn't exist in the backend yet
      // You can implement this endpoint in your Flask backend later
      return {
        sessions: [],
        total: 0
      };
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return {
        sessions: [],
        total: 0
      };
    }
  }

  // Feedback methods
  async submitFeedback(userId, sessionId, rating, comments = null) {
    return this.request('/feedback/submit', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        session_id: sessionId,
        rating: rating,
        comments: comments,
      }),
    });
  }
}

export default new ApiService();