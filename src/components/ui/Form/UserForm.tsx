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

        if (res.error) {
          showToast(res.message, "error");
          return;
        }

        setUserAuth({ isAuth: true, userId: res.userId, userRole: res.role });
        showToast(res.message, "success");
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    } else if (FormType === "Register") {
      try {
        const res = await userRegister(data);
        showToast(res.message, "success");
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
