import axios from "axios";
import { updateUserAccessToken } from "../../api/User/userApi";
export const axiosRootApiUrl = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

export const accessTokenInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

export const userInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

export const chapterInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

export const topicInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

userInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("session") || "{}");
  const userId = userData.state.user.userId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    userId: userId,
  };

  return config;
});

accessTokenInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("session") || "{}");
  const userId = userData.state.user.userId;
  const isAuth = userData.state.user.isAuth;

  config.data = {
    isAuth: isAuth,
    userId: userId,
  };

  return config;
});

accessTokenInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.data.message === "Access token expired") {
      try {
        const response = await updateUserAccessToken();
        return response;
      } catch (error) {
        return error;
      }
    }
  }
);

chapterInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("session") || "{}");
  const userId = userData.state.user.userId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    userId: userId,
  };

  return config;
});

topicInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(localStorage.getItem("session") || "{}");
  const userId = userData.state.user.userId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    userId: userId,
  };

  return config;
});
