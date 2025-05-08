import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});


api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post('/user/refresh');
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
)

export default api;
