import axios from 'axios';

const API_BASE_URL = 'https://hackthon-backend-rb7g.onrender.com/api/chat';

const api = {
  async sendMessage(message) {
    try {
      console.log('Sending message to backend:', message);
      
      const response = await axios.post(API_BASE_URL, {
        message: message
      });
      
      console.log('Backend Response:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      // If we have a response property, use it
      if (response.data.response) {
        return { response: response.data.response };
      }
      
      // If we have debug information, log it
      if (response.data.debug) {
        console.log('Debug Info:', response.data.debug);
      }
      
      throw new Error('Unexpected response format from server');
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to connect to the server'
      );
    }
  }
};

export default api;
