import { Topics } from './topics';

export type quiz = {
  id: number;
  topic_id: number;
  chapter_id: number;
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
  _count: {
    user_quiz_attempts: number;
    objective_questions: number;
  };
  chapterId?: string;
  chapterTitle?: string;
  chapters?: {
    title: string;
  };
  user_quiz_attempts: quiz_attempts[];
  objective_questions: objective_questions[];
}

export interface UserQuizAttempts {
  user_quiz_attempts: quiz_attempts[];
}

export interface TopicWithQuizAndObjectiveQuestions extends Topics {
  quiz: QuizWithQuestions[] | null;
}

export interface QuizzesAssessment extends Topics {
  chapters: {
    id: number;
    topic_id: number;
    title: string;
  }[];
  quiz: Omit<QuizWithQuestions, '_count'>[] | null;
}

export interface QuizAssessmentScores
  extends Pick<Topics, 'id' | 'topictitle'> {
  quiz: QuizAssessmentDetails[];
}

export interface TopicQuizAssessments {
  objective_questions: objective_questions[];
}

export interface TopicWithQuiz extends Topics {
  quiz:
    | Omit<
        QuizWithQuestions,
        'objective_questions' | 'chapterId' | 'chapterTitle'
      >[]
    | null;
}

export interface QuizAssessmentDetails {
  id: number;
  title: string;
  _count: {
    objective_questions: number;
  };
  max_attempts: number | null;
  user_quiz_attempts: quiz_attempts[];
}
