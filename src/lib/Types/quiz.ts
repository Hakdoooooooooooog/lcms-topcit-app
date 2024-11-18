export type quiz = {
  id: bigint;
  topic_id: bigint;
  title: string;
  quiz_type: string;
  max_attempts: number | null;
  created_at: Date | null;
};

export type objective_questions = {
  id: bigint;
  quiz_id: bigint;
  question: string;
  question_type: string;
  multiple_choice_options: multiple_choice_options[];
};

export type multiple_choice_options = {
  id: bigint;
  objective_question_id: bigint;
  option_text: string;
};

export interface QuizWithQuestions extends quiz {
  objective_questions: objective_questions[];
}
