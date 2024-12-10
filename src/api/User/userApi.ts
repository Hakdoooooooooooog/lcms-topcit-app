import {
  axiosRootApiUrl,
  accessTokenInstance,
  userInstance,
} from '../../lib/helpers/axios';
import {
  UpdateProfile,
  UserLogin,
  UserProfile,
  UserProgress,
  UserRegister,
} from '../../lib/Types/user';

export const userLogin = async (login: UserLogin) => {
  return await axiosRootApiUrl
    .post('/auth/login', login)
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const userRegister = async (register: UserRegister) => {
  return await axiosRootApiUrl
    .post('/auth/register', register)
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const verifyUserAccessToken = async (): Promise<{
  userData: {
    isAuth: boolean;
    userId: string;
    role: string;
  };
}> => {
  return await accessTokenInstance
    .post('/auth/verify')
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const userLogout = async () => {
  return await axiosRootApiUrl
    .post('/user/logout')
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getUserProfile = async (): Promise<UserProfile> => {
  return await userInstance
    .get('/user/profile')
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getUserProgress = async (): Promise<UserProgress> => {
  return await userInstance
    .get('/user/progress')
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateUserProfile = async (data: UpdateProfile) => {
  return await userInstance
    .put('/user/updateData', {
      username: data.username,
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const updateUserChapterProgress = async (
  chapterId: string,
  topicId: string,
): Promise<{
  message: string;
  curr_chap_id: string;
  curr_topic_id: string;
}> => {
  return await userInstance
    .post('/user/progress/update', {
      chapterId,
      topic_id: topicId,
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};
