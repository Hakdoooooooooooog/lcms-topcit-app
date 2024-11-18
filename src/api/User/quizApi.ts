import { quizInstance } from "../../lib/helpers/axios";
import { QuizWithQuestions } from "../../lib/Types/quiz";

export const getQuizzesWithQuestions = async (): Promise<QuizWithQuestions[]> => {
  return await quizInstance
    .get(`/quizzes/topic`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
