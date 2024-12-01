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

export type UserProgress = {
  user_id: bigint;
  completed_lessons: number | null;
  completed_quizzes: number | null;
  curr_chap_id: bigint | null;
  curr_topic_id: bigint | null;
};

type users_role = 'admin' | 'user';

export type UserProfile = Pick<users, 'email' | 'userid' | 'username'>;
export type UpdateProfile = Pick<users, 'username'>;
export type UserLogin = (typeof LoginSchema)['_input'];
export type UserRegister = (typeof RegisterSchema)['_input'];
