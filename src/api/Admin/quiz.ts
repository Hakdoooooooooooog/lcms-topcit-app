import { quizInstance } from '../../lib/helpers/axios';
import { QuizzesAssessment } from '../../lib/Types/quiz';

type QuizData = {
  [key: string]: any;
};

export const getQuizAssessments = async (): Promise<QuizzesAssessment[]> => {
  return await quizInstance
    .get('/admin/quizzes/assessments')
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
};

export const manageQuiz = async (data: QuizData) => {
  return await quizInstance
    .post('/admin/quizzes/manage', data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
};

export const updateQuiz = async (data: QuizData) => {
  return await quizInstance
    .put('/admin/quizzes/update', data)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
};
