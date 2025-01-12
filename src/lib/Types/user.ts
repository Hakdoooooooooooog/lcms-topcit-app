import { LoginSchema, RegisterSchema } from '../schema/UserSchema';

type users = {
  id: number;
  studentId: number;
  username: string;
  email: string;
  password: string;
  created_at: Date | null;
  role: users_role;
};

export type UsersProgress = {
  completed_lessons: number;
  completed_quizzes: number;
  curr_chap_id: number;
  curr_topic_id: number;
  curr_quiz_id: number;
};

export type UserCompletedChapters = {
  id: number;
  student_id: number;
  chapter_id: number;
  topic_id: number;
  completion_status: string | null;
  completed_at: Date | null;
};

export type UserProgressData = {
  Topics: {
    id: number;
    topictitle: string | null;
    description: string | null;
    chapters: {
      id: number;
      title: string | null;
      sub_title: string | null;
    }[];
  }[];
  userProgress:
    | (Pick<users, 'studentId' | 'username'> & {
        user_progress: UsersProgress | null;
        user_completed_chapters: UserCompletedChapters[];
      })
    | null;
};

export type UserCompletedQuizzes = {
  id: number;
  student_id: number;
  quiz_id: number;
  completed_at: Date | null;
  topic_id: number;
} | null;

export type UserProgress = Pick<users, 'studentId' | 'username'> & {
  user_progress: UsersProgress | null;
  user_completed_chapters: UserCompletedChapters[];
  user_completed_quizzes: UserCompletedQuizzes[];
};

type users_role = 'admin' | 'user';

export type UserProfile = Pick<users, 'email' | 'studentId' | 'username'>;
export type UpdateProfile = Pick<users, 'username'>;
export type UserLogin = (typeof LoginSchema)['_input'];
export type UserRegister = (typeof RegisterSchema)['_input'];

export type OTPVerificationState = {
  email: string;
  otp: string;
};

export type OTPVerificationActions = {
  setEmail: (email: OTPVerificationState['email']) => void;
  setOTP: (otp: OTPVerificationState['otp']) => void;
};
