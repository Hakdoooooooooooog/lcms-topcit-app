import { userInstance } from '../../lib/helpers/axios';
import { ChaptersWithSubChaptersWithinTopic } from '../../lib/Types/chapters';
import { Topics } from '../../lib/Types/topics';

export const getAllTopics = async (): Promise<Topics[]> => {
  return await userInstance
    .get('/topics')
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};

export const getTopicsWithAllChapters = async (): Promise<
  ChaptersWithSubChaptersWithinTopic[]
> => {
  return await userInstance
    .get('/topics/chapters')
    .then((res) => res.data)
    .catch((error) => {
      return error.response.data;
    });
};
