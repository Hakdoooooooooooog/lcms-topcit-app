import { UseFormHandleSubmit } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { showToast } from '../Toasts';
import {
  forgotPassword,
  newPassword,
  userLogin,
  userRegister,
  verifyOTP,
} from '../../../api/User/userApi';
import { useAuthUserStore, useForgotPasswordStore } from '../../../lib/store';
import useProfileMutation from '../../../lib/hooks/useProfileMutation';

interface IUserFormProps {
  children: React.ReactNode;
  schema: z.ZodTypeAny;
  handleSubmit: UseFormHandleSubmit<z.infer<IUserFormProps['schema']>>;
  FormType:
    | 'Login'
    | 'Register'
    | 'Edit-Profile'
    | 'Forgot Password'
    | 'OTP Verification'
    | 'New Password';
}

const UserForm = (props: IUserFormProps) => {
  const navigate = useNavigate();
  const { children, schema, handleSubmit, FormType } = props;
  const setUserAuth = useAuthUserStore((state) => state.setUserAuth);
  const { email, setEmail } = useForgotPasswordStore((state) => ({
    email: state.email,
    setEmail: state.setEmail,
  }));

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

        showToast('An error occurred:' + error.message, 'error');
      }
    } else if (FormType === 'Edit-Profile') {
      try {
        await profileMutation.mutateAsync(data);
      } catch (error: any) {
        showToast('An error occurred', 'error');
      }
    } else if (FormType === 'Forgot Password') {
      // Handle email verification logic here
      try {
        await forgotPassword(data.email);
        setEmail(data.email);
        showToast('OTP sent successfully', 'success');
        navigate('/landing/otp-verification', { replace: true });
      } catch (error: any) {
        console.log(error);
        showToast('An error occurred: ' + error.message, 'error');
      }
    } else if (FormType === 'OTP Verification') {
      // Handle OTP verification logic here
      try {
        await verifyOTP(email, data.otp);
        showToast('OTP verified successfully', 'success');
        navigate('/landing/new-password', { replace: true });
      } catch (error: any) {
        console.log(error);
        showToast('An error occurred: ' + error.message, 'error');
      }
    } else if (FormType === 'New Password') {
      // Handle new password logic here

      try {
        await newPassword(email, data.password, data.confirmPassword);
        showToast('Password updated successfully', 'success');
        navigate('/landing', { replace: true });
      } catch (error: any) {
        console.log(error);
        showToast('An error occurred: ' + error.message, 'error');
      }
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{children}</form>;
};

export default UserForm;
