import { quizInstance } from '../../lib/helpers/axios';
import { TopicWithQuizAndObjectiveQuestions } from '../../lib/Types/quiz';

export const getQuizzesWithQuestions = async (): Promise<
  TopicWithQuizAndObjectiveQuestions[]
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

export const startQuiz = async (
  quizId: string,
  topicId: string,
): Promise<any> => {
  return await quizInstance
    .post(`/quizzes/start`, {
      quizId,
      topicId,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const submitQuiz = async (assessmentData: {
  [key: string]: string;
}): Promise<any> => {
  return await quizInstance
    .post(`/quizzes/submit`, assessmentData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
