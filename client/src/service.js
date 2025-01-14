import axios from 'axios';

// Set the base URL for the API
axios.defaults.baseURL = 'http://localhost:5236';

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

const api = {
  getTasks: async () => {
    try {
      const result = await axios.get('/');
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  addTask: async (name) => {
    try {
      const newTask = { name, isComplete: false };
      const result = await axios.post('/', newTask);
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
