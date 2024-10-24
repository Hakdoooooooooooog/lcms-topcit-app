import { UseFormHandleSubmit } from "react-hook-form";
import { z } from "zod";
import { showToast } from "../Toasts";
import { updateUserProfile, userLogin, userRegister } from "../../../api/User/userApi";
import { useAuthUserStore, useEditProfileStore } from "../../../lib/store";

interface IUserFormProps {
  children: React.ReactNode;
  schema: z.ZodTypeAny;
  handleSubmit: UseFormHandleSubmit<z.infer<IUserFormProps["schema"]>>;
  FormType: "Login" | "Register" | "Edit-Profile";
}

const UserForm = (props: IUserFormProps) => {
  const { children, schema, handleSubmit, FormType } = props;
  const setUserAuth = useAuthUserStore((state) => state.setUserAuth);
  const setIsEdit = useEditProfileStore((state) => state.setIsEdit);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (FormType === "Login") {
      try {
        const res = await userLogin(data);

        if (res.message === "Login successfully") {
          setUserAuth({ isAuth: true, userId: res.userId, userRole: res.role });
          showToast(res?.message, "success");
        } else {
          showToast(res?.message, "error");
        }
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    } else if (FormType === "Register") {
      try {
        const res = await userRegister(data);

        if (res) {
          showToast(res?.message, "success");
        }
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    } else if (FormType === "Edit-Profile") {
      try {
        const res = await updateUserProfile(data);
        if (res) {
          setIsEdit(false);
          showToast(res?.message, "success");
        }
      } catch (error: any) {
        showToast("An error occurred", "error");
      }
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

export default UserForm;
