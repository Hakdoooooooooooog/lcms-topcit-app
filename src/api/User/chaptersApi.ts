import { AxiosRequestConfig } from 'axios';
import { chapterInstance, chapterPDFInstance } from '../../lib/helpers/axios';
import { ChaptersWithSubChaptersWithinTopic } from '../../lib/Types/chapters';

export const getAllChaptersWithinTopic = async (
  topic_id: string | undefined,
): Promise<ChaptersWithSubChaptersWithinTopic> => {
  return await chapterInstance
    .get(`/topics/chapters/${topic_id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getChapterPDFFiles = async (
  chapter_id: string | undefined,
  topic_id: string | undefined,
  options?: AxiosRequestConfig<any>,
): Promise<{ url: string }> => {
  return await chapterPDFInstance
    .get(`/chapters/files/${chapter_id}?topic_id=${topic_id}`, {
      ...options,
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response.data;
    });
};
