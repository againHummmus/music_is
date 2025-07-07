import axios from "axios";

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});


api.interceptors.response.use(
  response => response, // For successful responses (2xx), just pass them through
  async error => {
    const originalRequest = error.config;

    // Check if the error has a response and if it's a 401 status
    if (error.response?.status === 401) {
      // If it's a 401 and we've already retried, reject to prevent infinite loops
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      // Mark the original request as retried
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await api.post('/user/refresh');
        // If refresh is successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject the promise with the refresh error
        return Promise.reject(refreshError);
      }
    }

    // For any other error status (e.g., 500, 400, etc.) that is NOT a 401,
    // we will return the error.response directly instead of rejecting the promise.
    // This means the 'try' block in the calling function will receive this response.
    if (error.response) {
      return error.response;
    }

    // If there's no error.response (e.g., network error, request timeout),
    // then it's a true error that should still be rejected.
    return Promise.reject(error);
  }
);

export default api;
