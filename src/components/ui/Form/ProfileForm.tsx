import { forwardRef } from "react";
import { UserProfile } from "../../../lib/Types/user";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ProfileSchema } from "../../../lib/schema/UserSchema";
import { z } from "zod";

type ProfileFormProps<T> = {
  userData: T;
  isEditing: boolean;
  register: UseFormRegister<z.infer<typeof ProfileSchema>>;
  errors: FieldErrors<z.infer<typeof ProfileSchema>>;
};

export const ProfileForm = forwardRef(
  ({ register, isEditing, errors }: ProfileFormProps<UserProfile>, ref) => {
    return (
      <>
        <FormControl variant="outlined" error={errors.username ? true : false}>
          <InputLabel htmlFor="Username">Username</InputLabel>
          <OutlinedInput
            autoComplete="on"
            {...register("username")}
            id="Username"
            type="text"
            inputRef={ref}
            disabled={!isEditing}
            label="Username"
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel htmlFor="userID">User ID</InputLabel>
          <OutlinedInput
            id="userID"
            autoComplete="on"
            {...register("userid")}
            type="text"
            disabled={true}
            label="User ID"
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            {...register("email")}
            autoComplete="on"
            type="email"
            disabled={true}
            label="Email"
          />
        </FormControl>
      </>
    );
  }
);
