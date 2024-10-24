import UserForm from "../../../../components/ui/Form/UserForm";
import styles from "./register.module.css";
import { setRegisterFields } from "../../../../lib/constants";
import { RegisterSchema } from "../../../../lib/schema/UserSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInputPasswordStore } from "../../../../lib/store";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

type RegisterSchema = z.infer<typeof RegisterSchema>;
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const { passType, setPassType, confirmPassType, setConfirmPassType } = useInputPasswordStore(
    (state) => ({
      passType: state.passType,
      setPassType: state.setPassType,
      confirmPassType: state.confirmPassType,
      setConfirmPassType: state.setConfirmPassType,
    })
  );

  return (
    <>
      <div className={styles.form}>
        <UserForm handleSubmit={handleSubmit} schema={RegisterSchema} FormType="Register">
          {setRegisterFields.map((field, index) => {
            return (
              <FormControl
                key={index}
                error={errors[field.name as keyof RegisterSchema] ? true : false}
              >
                <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
                <OutlinedInput
                  id={field.name}
                  {...register(field.name as keyof RegisterSchema)}
                  autoComplete="on"
                  type={
                    field.name === "password"
                      ? passType
                      : field.name === "confirmPassword"
                      ? confirmPassType
                      : "text"
                  }
                  endAdornment={
                    field.name === "password" ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setPassType(passType === "password" ? "text" : "password")}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {passType !== "password" ? (
                            <EyeSlashIcon height={25} width={25} />
                          ) : (
                            <EyeIcon height={25} width={25} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ) : field.name === "confirmPassword" ? (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setConfirmPassType(confirmPassType === "password" ? "text" : "password")
                          }
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          {confirmPassType !== "password" ? (
                            <EyeSlashIcon height={25} width={25} />
                          ) : (
                            <EyeIcon height={25} width={25} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ) : null
                  }
                  label={field.label}
                />
                {errors && (
                  <p className="text-red-500">
                    {errors[field.name as keyof RegisterSchema]?.message}
                  </p>
                )}
              </FormControl>
            );
          })}
          <Button
            disabled={isSubmitting}
            type="submit"
            style={{
              width: "inherit",
              color: "white",
            }}
            className="!bg-green-700 hover:!bg-green-800"
          >
            Register
          </Button>
          <NavLink
            style={{
              width: "100%",
            }}
            to="/landing"
          >
            <Button
              style={{
                width: "inherit",
              }}
              variant="outlined"
              className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white"
            >
              Login
            </Button>
          </NavLink>
        </UserForm>
      </div>
    </>
  );
};

export default Register;
