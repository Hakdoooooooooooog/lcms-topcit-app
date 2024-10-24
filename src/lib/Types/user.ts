import { LoginSchema, RegisterSchema } from "../schema/UserSchema";

type users = {
  id: bigint;
  userID: bigint;
  username: string;
  email: string;
  password: string;
  created_at: Date | null;
  role: users_role;
};

type users_role = "admin" | "user";

export type UserProfile = Pick<users, "email" | "userID" | "username">;
export type UpdateProfile = Pick<users, "username">;
export type UserLogin = (typeof LoginSchema)["_input"];
export type UserRegister = (typeof RegisterSchema)["_input"];
