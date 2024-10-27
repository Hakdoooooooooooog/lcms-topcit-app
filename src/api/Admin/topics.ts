import { topicInstance } from "../../lib/helpers/axios";

export const createTopic = async (data: FormData) => {
  return await topicInstance
    .post("/admin/topic/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": import.meta.env.VITE_APP_BASE_URL,
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};

export const editTopic = async (
  data: { topicTitle?: string; description?: string },
  topicId: string
) => {
  return await topicInstance
    .put(`/admin/topic/update/${topicId}`, data, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": import.meta.env.VITE_APP_BASE_URL,
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};
