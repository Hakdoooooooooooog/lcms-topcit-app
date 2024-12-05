import { quizInstance } from '../../lib/helpers/axios';
import { QuizWithQuestions } from '../../lib/Types/quiz';

export const getQuizzesWithQuestions = async (): Promise<
  QuizWithQuestions[]
> => {
  return await quizInstance
    .get(`/quizzes/topic`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const submitQuiz = async (
  assessmentData: {
    [key: string]: string;
  },
  quizData: { topicId: string; userId: string; quizId: string },
): Promise<any> => {
  return await quizInstance
    .post(`/quizzes/submit`, assessmentData, {
      params: {
        topicId: quizData.topicId,
        userId: quizData.userId,
        quizId: quizData.quizId,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
