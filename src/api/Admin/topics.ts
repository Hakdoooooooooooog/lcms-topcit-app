import { topicInstance } from "../../lib/helpers/axios";

export const createTopic = async (data: FormData) => {
  return await topicInstance
    .post("/topic/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    .put(`/topic/update/${topicId}`, data)
    .then((res) => res.data)
    .catch((err) => err.response.data);
};
