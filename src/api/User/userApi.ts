import { axiosRootApiUrl, accessTokenInstance, userInstance } from "../../lib/helpers/axios";
import { UpdateProfile, UserLogin, UserProfile, UserRegister } from "../../lib/Types/user";

export const userLogin = async (login: UserLogin) => {
  return await axiosRootApiUrl
    .post("/auth/login", login)
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const userRegister = async (register: UserRegister) => {
  return await axiosRootApiUrl
    .post("/auth/register", register)
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const verifyUserAccessToken = async () => {
  return await accessTokenInstance
    .post("/auth/verify")
    .then((res) => res.data)
    .catch((error) => {
      return error.response?.data;
    });
};

export const updateUserAccessToken = async () => {
  return await accessTokenInstance
    .put("/user/refresh")
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const userLogout = async () => {
  return await axiosRootApiUrl
    .post("/user/logout")
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const getUserProfile = async (): Promise<UserProfile> => {
  return await userInstance
    .get("/user/profile")
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const updateUserProfile = async (data: UpdateProfile) => {
  return await userInstance
    .put("/user/updateData", {
      username: data.username,
    })
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};
