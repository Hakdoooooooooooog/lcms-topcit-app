import { quizInstance } from '../../lib/helpers/axios';
import {
  QuizAssessmentScores,
  TopicQuizAssessments,
  TopicWithQuiz,
} from '../../lib/Types/quiz';

export const getQuizzesWithQuestions = async (): Promise<TopicWithQuiz[]> => {
  return await quizInstance
    .get(`/quizzes/topic`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};

export const getQuizAssessment = async (
  quizID: string,
): Promise<TopicQuizAssessments> => {
  return await quizInstance
    .get(`/quizzes/topic/assessment/${quizID}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getQuizAssessmentScores = async ({
  quizID,
}: {
  quizID: string;
}): Promise<QuizAssessmentScores[]> => {
  return await quizInstance
    .get(`/quizzes/assessment/${quizID}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
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

export const submitQuiz = async ({
  topicId,
  quizId,
  assessmentData,
}: {
  topicId: string;
  quizId: string;
  assessmentData: { [key: string]: string };
}): Promise<any> => {
  return await quizInstance
    .post(`/quizzes/submit/${topicId}/${quizId}`, assessmentData)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
