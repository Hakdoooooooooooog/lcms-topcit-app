import { chapterInstance, uploadInstance } from '../../lib/helpers/axios';
export const updateChapter = async (
  formData: FormData,
  chapterId: string,
  topicId: string,
) => {
  return await chapterInstance
    .put(`/admin/chapter/update/${chapterId}?topicId=${topicId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response?.data;
    });
};

export const createChapter = async (formData: FormData) => {
  return await chapterInstance
    .post('/admin/chapter/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response?.data;
    });
};

export const PDFChapterChunkUpload = async (formData: FormData) => {
  return await uploadInstance
    .post('/admin/chapter/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error.response?.data;
    });
};
