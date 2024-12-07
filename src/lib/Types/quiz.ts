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
  multiple_choice_options: multiple_choice_options[];
};

export type multiple_choice_options = {
  id: number;
  objective_question_id: number;
  option_text: string;
};

export type quiz_attempt = {
  quiz_id: number;
  score: number;
  attempt_count: number;
  time_taken: number;
} | null;

export interface QuizWithQuestions extends quiz {
  objective_questions: objective_questions[];
  user_quiz_attempts: quiz_attempt;
}
