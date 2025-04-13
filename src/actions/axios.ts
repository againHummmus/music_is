import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/refresh`,
          {},
          { withCredentials: true }
        );
        return api.request(originalRequest);
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
