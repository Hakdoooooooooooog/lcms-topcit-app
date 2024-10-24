import { forwardRef, useEffect, useState } from "react";
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
  ({ userData, register, isEditing, errors }: ProfileFormProps<UserProfile>, ref: any) => {
    const [formData, setFormData] = useState<UserProfile>(userData);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    useEffect(() => {
      if (!isEditing) {
        setFormData(userData);
      }
    }, [isEditing]);

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
            value={formData?.username}
            onChange={handleChange}
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
            type="text"
            value={formData?.userID}
            disabled={true}
            label="User ID"
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            autoComplete="on"
            type="email"
            value={formData?.email}
            disabled={true}
            label="Email"
          />
        </FormControl>
      </>
    );
  }
);
