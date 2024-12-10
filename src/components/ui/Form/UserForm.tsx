import { UseFormHandleSubmit } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { showToast } from '../Toasts';
import { userLogin, userRegister } from '../../../api/User/userApi';
import { useAuthUserStore } from '../../../lib/store';
import useProfileMutation from '../../../lib/hooks/useProfileMutation';

interface IUserFormProps {
  children: React.ReactNode;
  schema: z.ZodTypeAny;
  handleSubmit: UseFormHandleSubmit<z.infer<IUserFormProps['schema']>>;
  FormType: 'Login' | 'Register' | 'Edit-Profile';
}

const UserForm = (props: IUserFormProps) => {
  const navigate = useNavigate();

  const { children, schema, handleSubmit, FormType } = props;
  const setUserAuth = useAuthUserStore((state) => state.setUserAuth);
  const profileMutation = useProfileMutation();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (FormType === 'Login') {
      try {
        const res = await userLogin(data);

        showToast(res.message, 'success');
        setUserAuth({ isAuth: true, userId: res.userId, userRole: res.role });
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    } else if (FormType === 'Register') {
      try {
        const res = await userRegister(data);
        showToast(res.message, 'success');
        navigate('/landing', { replace: true });
      } catch (error: any) {
        if (Array.isArray(error.errors)) {
          error.errors.map((error: any) => {
            Object.entries(error).map(([key, value]) => {
              const pInput = document.querySelector(`p#${key}`);
              if (pInput) {
                if (value) {
                  pInput.innerHTML = value as string;
                } else {
                  pInput.innerHTML = '';
                }
              }
            });
          });

          showToast(error.message, 'error');
          return;
        }
      }
    } else if (FormType === 'Edit-Profile') {
      try {
        await profileMutation.mutateAsync(data);
      } catch (error: any) {
        showToast('An error occurred', 'error');
      }
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

export default UserForm;
