import { Topics } from './topics';

export type quiz = {
  id: number;
  topic_id: number;
  title: string;
  quiz_type: string;
  max_attempts: number | null;
  created_at: Date | null;
};

export type objective_questions = {
  id: number;
  quiz_id: number;
  question: string;
  question_type: string;
  correct_answer: string;
  multiple_choice_options: multiple_choice_options[];
};

export type multiple_choice_options = {
  option_text: string;
};

export type quiz_attempts = {
  quiz_id: number;
  score: number;
  attempt_count: number;
  time_taken: number;
} | null;

export interface QuizWithQuestions extends quiz {
  user_quiz_attempts: quiz_attempts;
  objective_questions: objective_questions[];
}

export interface TopicWithQuizAndObjectiveQuestions extends Topics {
  quiz: QuizWithQuestions[] | null;
}

export interface QuizzesAssessment extends Topics {
  quiz: Omit<QuizWithQuestions, 'user_quiz_attempts'>[] | null;
}
