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

export const chapterPDFInstance = axios.create({
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

const pendingRequests = new Map();

chapterPDFInstance.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem("session") || "{}");
    const userId = userData.state.user.userId;
    const isAuth = userData.state.user.isAuth;
    const requestKey = `${config.method}_${config.url}`;

    config.params = {
      isAuth: isAuth,
      userId: userId,
    };

    if (pendingRequests.has(requestKey)) {
      pendingRequests.get(requestKey).cancel("Request cancelled due to new request");
    }

    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;

    pendingRequests.set(requestKey, cancelToken);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

chapterPDFInstance.interceptors.response.use(
  (response) => {
    const requestKey = `${response.config.method}_${response.config.url}`;
    pendingRequests.delete(requestKey);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.resolve();
    }
    return Promise.reject(error);
  }
);
