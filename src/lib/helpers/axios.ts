import axios from 'axios';
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

export const forgotPasswordInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
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

export const quizInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

export const uploadInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  withCredentials: true,
});

userInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
  const studentId = userData.state.user.studentId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    studentId: studentId,
  };

  return config;
});

quizInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
  const studentId = userData.state.user.studentId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    studentId: studentId,
  };

  return config;
});

accessTokenInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
  const studentId = userData.state.user.studentId;
  const isAuth = userData.state.user.isAuth;

  config.data = {
    isAuth: isAuth,
    studentId: studentId,
  };

  return config;
});

chapterInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
  const studentId = userData.state.user.studentId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    studentId: studentId,
  };

  return config;
});

topicInstance.interceptors.request.use((config) => {
  const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
  const studentId = userData.state.user.studentId;
  const isAuth = userData.state.user.isAuth;

  config.params = {
    isAuth: isAuth,
    studentId: studentId,
  };

  return config;
});

const pendingRequests = new Map();

chapterPDFInstance.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(sessionStorage.getItem('session') || '{}');
    const studentId = userData.state.user.studentId;
    const isAuth = userData.state.user.isAuth;
    const userRole = userData.state.user.userRole;
    const requestKey = `${config.method}_${config.url}`;

    config.params = {
      isAuth: isAuth,
      studentId: studentId,
      userRole: userRole,
    };

    if (pendingRequests.has(requestKey)) {
      pendingRequests
        .get(requestKey)
        .cancel('Request cancelled due to new request');
    }

    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;

    pendingRequests.set(requestKey, cancelToken);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
  },
);
