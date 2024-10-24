import { topicInstance } from "../../lib/helpers/axios";

export const createTopic = async (data: FormData) => {
  return await topicInstance
    .post("admin/topic/create", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((err) => err.response.data);
};
