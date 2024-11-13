import { UseFormHandleSubmit } from "react-hook-form";
import { z } from "zod";
import { showToast } from "../Toasts";
import { userLogin, userRegister } from "../../../api/User/userApi";
import { useAuthUserStore } from "../../../lib/store";
import useProfileMutation from "../../../lib/hooks/useProfileMutation";

interface IUserFormProps {
  children: React.ReactNode;
  schema: z.ZodTypeAny;
  handleSubmit: UseFormHandleSubmit<z.infer<IUserFormProps["schema"]>>;
  FormType: "Login" | "Register" | "Edit-Profile";
}

const UserForm = (props: IUserFormProps) => {
  const { children, schema, handleSubmit, FormType } = props;
  const setUserAuth = useAuthUserStore((state) => state.setUserAuth);
  const profileMutation = useProfileMutation();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (FormType === "Login") {
      try {
        const res = await userLogin(data);

        if (res.message === "Invalid username or password") {
          return showToast(res.message, "error");
        }

        showToast(res.message, "success");
        setUserAuth({ isAuth: true, userId: res.userId, userRole: res.role });
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    } else if (FormType === "Register") {
      try {
        const res = await userRegister(data);
        if (res.errors) {
          res.errors.map((error: any) => {
            Object.entries(error).map(([key, value]) => {
              const pInput = document.querySelector(`p#${key}`);
              if (pInput) {
                if (value) {
                  pInput.innerHTML = value as string;
                } else {
                  pInput.innerHTML = "";
                }
              }
            });
          });
        } else {
          showToast(res.message, "success");
        }
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    } else if (FormType === "Edit-Profile") {
      try {
        await profileMutation.mutateAsync(data);
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

export default UserForm;
