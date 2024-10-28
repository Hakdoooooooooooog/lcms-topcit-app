import { chapterInstance } from "../../lib/helpers/axios";
export const updateChapter = async (formData: FormData, chapterId: string, topicId: string) => {
  return await chapterInstance
    .put(`/admin/chapter/update/${chapterId}?topicId=${topicId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      return error.response?.data;
    });
};

export const createChapter = async (formData: FormData) => {
  return await chapterInstance
    .post("/admin/chapter/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      return error.response?.data;
    });
};
