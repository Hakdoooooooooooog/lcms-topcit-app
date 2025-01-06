import { useState, useEffect } from 'react';
import UserForm from '../../../../components/ui/Form/UserForm';
import styles from './register.module.css';
import { setRegisterFields } from '../../../../lib/constants';
import { RegisterSchema } from '../../../../lib/schema/UserSchema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInputPasswordStore } from '../../../../lib/store';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { showToast } from '../../../../components/ui/Toasts';
import { verifyUserEmailRegistration } from '../../../../api/User/userApi';

type RegisterSchema = z.infer<typeof RegisterSchema>;

const Register = () => {
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const email = watch('email');

  const handleSendOTP = async () => {
    if (!email) {
      showToast('Please enter an email first', 'error');
      return;
    }

    try {
      setIsOtpLoading(true);
      await verifyUserEmailRegistration(email);
      showToast('OTP sent successfully', 'success');
      setTimeLeft(300); // 5 minutes
    } catch (error: any) {
      showToast('Error sending OTP: ' + error.message, 'error');
    } finally {
      setIsOtpLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const { passType, setPassType, confirmPassType, setConfirmPassType } =
    useInputPasswordStore((state) => ({
      passType: state.passType,
      setPassType: state.setPassType,
      confirmPassType: state.confirmPassType,
      setConfirmPassType: state.setConfirmPassType,
    }));

  return (
    <div className={styles.form}>
      <UserForm
        handleSubmit={handleSubmit}
        schema={RegisterSchema}
        FormType="Register"
      >
        {setRegisterFields.map((field, index) => {
          return (
            <FormControl
              key={index}
              error={errors[field.name as keyof RegisterSchema] ? true : false}
              sx={{ width: '100%' }}
            >
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <OutlinedInput
                id={field.name}
                {...register(field.name as keyof RegisterSchema)}
                autoComplete="on"
                type={
                  field.name === 'password'
                    ? passType
                    : field.name === 'confirmPassword'
                    ? confirmPassType
                    : 'text'
                }
                endAdornment={
                  field.name === 'password' ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setPassType(
                            passType === 'password' ? 'text' : 'password',
                          )
                        }
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {passType !== 'password' ? (
                          <EyeSlashIcon height={25} width={25} />
                        ) : (
                          <EyeIcon height={25} width={25} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : field.name === 'confirmPassword' ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setConfirmPassType(
                            confirmPassType === 'password'
                              ? 'text'
                              : 'password',
                          )
                        }
                        onMouseDown={(event) => event.preventDefault()}
                      >
                        {confirmPassType !== 'password' ? (
                          <EyeSlashIcon height={25} width={25} />
                        ) : (
                          <EyeIcon height={25} width={25} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ) : field.name === 'otp' ? (
                    <InputAdornment position="end">
                      <Button
                        onClick={handleSendOTP}
                        disabled={isOtpLoading || timeLeft > 0}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        {timeLeft > 0
                          ? `Resend in ${Math.floor(timeLeft / 60)}:${(
                              timeLeft % 60
                            )
                              .toString()
                              .padStart(2, '0')}`
                          : isOtpLoading
                          ? 'Sending...'
                          : 'Send OTP'}
                      </Button>
                    </InputAdornment>
                  ) : null
                }
                label={field.label}
              />
              {errors && (
                <p className="text-red-500" id={field.name}>
                  {errors[field.name as keyof RegisterSchema]?.message}
                </p>
              )}
            </FormControl>
          );
        })}
        <Button
          type="submit"
          style={{
            width: 'inherit',
            color: 'white',
          }}
          disabled={isSubmitting}
          className={
            isSubmitting
              ? 'cursor-not-allowed'
              : '!bg-green-700 hover:!bg-green-800'
          }
          endIcon={isSubmitting ? <LoadingButton /> : null}
        >
          Register
        </Button>
        <NavLink
          style={{
            width: '100%',
          }}
          to="/landing"
        >
          <Button
            style={{
              width: 'inherit',
            }}
            variant="outlined"
            className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white"
          >
            Login
          </Button>
        </NavLink>
      </UserForm>
    </div>
  );
};

export default Register;
