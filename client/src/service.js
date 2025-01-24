import axios from 'axios';

// Set the base URL for the API
axios.defaults.baseURL = process.env.REACT_APP_API_URL; 
axios.defaults.headers['Content-Type'] = 'application/json';
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    console.error('Error in response:', error);
    return Promise.reject(error);
  }
);
const apiUrl = process.env.REACT_APP_API_URL;
const api = {
  getTasks: async () => {
    try {
      const result = await axios.get(`${apiUrl}`);
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  addTask: async (name) => {
    try {
      const newTask = { name, isComplete: false };
      const result = await axios.post(`${apiUrl}`, newTask);
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  setCompleted: async (id, isComplete) => {
    try {
      const result = await axios.put(`/${id}`, { isComplete });
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const result = await axios.delete(`/${id}`);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
