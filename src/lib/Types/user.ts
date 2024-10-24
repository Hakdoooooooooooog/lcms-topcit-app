import { users } from "../../../../lcms-app-topcit-server/src/api/services/prisma";
import { LoginSchema, RegisterSchema } from "../schema/UserSchema";

export type UserProfile = Pick<users, "email" | "userID" | "username">;
export type UpdateProfile = Pick<users, "username">;
export type UserLogin = (typeof LoginSchema)["_input"];
export type UserRegister = (typeof RegisterSchema)["_input"];
