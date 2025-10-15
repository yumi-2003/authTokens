import axios from "axios";
import { store } from "../app/store";
import { logoutUser } from "../features/auth/authThunks";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true, // send refresh token cookie automatically
});

//request interceptor: attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token ?? null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//response interceptor: auto refresh if 401 (expired)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // if 401 and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        //call refresh token endpoint
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        if (newAccessToken) {
          // update redux store
          store.dispatch({
            type: "auth/setAccessToken",
            payload: newAccessToken,
          });
          //retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (error) {
        console.error("Refresh token failed:", error);
        store.dispatch(logoutUser());
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
