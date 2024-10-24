import { userInstance } from "../../lib/helpers/axios";
import { ChaptersWithSubChaptersWithinTopic } from "../../lib/Types/chapters";
import { Topic } from "../../lib/Types/topics";

export const getAllTopics = async (): Promise<Topic[]> => {
  return await userInstance
    .get("/topics")
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const getTopicsWithAllChapters = async (): Promise<ChaptersWithSubChaptersWithinTopic[]> => {
  return await userInstance
    .get("/topics/chapters")
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};
export const getTopicWithId = async (topic_id: number): Promise<Topic> => {
  return await userInstance
    .get(`/topics/${topic_id}`)
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};
