import axios from 'axios';

// Use relative URL in production (Railway), localhost in development
const API_URL = process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : '/api');

const chatService = {
  // Start or get existing conversation
  async startConversation(sessionId, userEmail = null, assessmentId = null) {
    try {
      const response = await axios.post(`${API_URL}/chat/conversation/start`, {
        sessionId,
        userEmail,
        assessmentId
      });
      return response.data;
    } catch (error) {
      console.error('Error starting conversation:', error);
      throw new Error(error.response?.data?.error || 'Failed to start conversation');
    }
  },

  // Send a message and get AI response
  async sendMessage(message, conversationId = null, sessionId, userEmail = null, context = null) {
    try {
      const response = await axios.post(`${API_URL}/chat/message`, {
        message,
        conversationId,
        sessionId,
        userEmail,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error(error.response?.data?.error || 'Failed to send message');
    }
  },

  // Get conversation history
  async getConversationMessages(conversationId) {
    try {
      const response = await axios.get(`${API_URL}/chat/conversation/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch messages');
    }
  },

  // Get user's conversations
  async getUserConversations(sessionId, userEmail = null) {
    try {
      const params = sessionId ? { sessionId } : { userEmail };
      const response = await axios.get(`${API_URL}/chat/conversations`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch conversations');
    }
  }
};

export default chatService;

