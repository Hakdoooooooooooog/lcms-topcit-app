import { LoginSchema, RegisterSchema } from '../schema/UserSchema';

type users = {
  id: bigint;
  userid: bigint;
  username: string;
  email: string;
  password: string;
  created_at: Date | null;
  role: users_role;
};

export type UsersProgress = {
  completed_lessons: number;
  completed_quizzes: number;
  curr_chap_id: bigint;
  curr_topic_id: bigint;
  curr_quiz_id: bigint;
};

export type UserCompletedChapters = {
  id: bigint;
  user_id: bigint;
  chapter_id: bigint;
  topic_id: bigint;
  completion_status: string | null;
  completed_at: Date | null;
};

export type UserProgressData = {
  Topics: {
    id: bigint;
    topictitle: string | null;
    description: string | null;
    chapters: {
      id: bigint;
      title: string | null;
      sub_title: string | null;
    }[];
  }[];
  userProgress:
    | (Pick<users, 'userid' | 'username'> & {
        user_progress: UsersProgress | null;
        user_completed_chapters: UserCompletedChapters[];
      })
    | null;
};

export type UserCompletedQuizzes = {
  id: bigint;
  user_id: bigint;
  quiz_id: bigint;
  completed_at: Date | null;
} | null;

export type UserProgress = Pick<users, 'userid' | 'username'> & {
  user_progress: UsersProgress | null;
  user_completed_chapters: UserCompletedChapters[];
  user_completed_quizzes: UserCompletedQuizzes;
};

type users_role = 'admin' | 'user';

export type UserProfile = Pick<users, 'email' | 'userid' | 'username'>;
export type UpdateProfile = Pick<users, 'username'>;
export type UserLogin = (typeof LoginSchema)['_input'];
export type UserRegister = (typeof RegisterSchema)['_input'];
