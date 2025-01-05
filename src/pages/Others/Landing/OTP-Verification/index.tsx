import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import styles from './otp-verification.module.css';
import UserForm from '../../../../components/ui/Form/UserForm';
import { NavLink } from 'react-router-dom';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { OTPSchema } from '../../../../lib/schema/UserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPasswordStore } from '../../../../lib/store';
import { showToast } from '../../../../components/ui/Toasts';
import { retryOTP } from '../../../../api/User/userApi';

type OTPSchema = z.infer<typeof OTPSchema>;

const OTPVerification = () => {
  const { email } = useForgotPasswordStore((state) => ({
    email: state.email,
  }));

  const [timeLeft, setTimeLeft] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPSchema>({
    resolver: zodResolver(OTPSchema),
  });

  const handleResendOTP = async ({ email }: { email: string }) => {
    try {
      await retryOTP(email);
      showToast('OTP sent successfully', 'success');
      setTimeLeft(300); // 5 minutes in seconds
      setIsResendDisabled(true);
    } catch (error: any) {
      showToast('Error sending OTP: ' + error.message, 'error');
    }
  };

  return (
    <div className={styles.form}>
      <Box sx={{ textAlign: 'center', maxWidth: '450px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          OTP Verification
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please enter the 6-digit code sent to your email address:{' '}
          <span
            style={{
              fontWeight: 'bold',
            }}
          >
            {email}
          </span>
        </Typography>
      </Box>

      <UserForm
        handleSubmit={handleSubmit}
        FormType="OTP Verification"
        schema={OTPSchema}
      >
        <FormControl error={!!errors.otp} sx={{ width: '100%' }}>
          <InputLabel htmlFor="otp">OTP Code</InputLabel>
          <OutlinedInput
            id="otp"
            type="text"
            {...register('otp')}
            label="OTP Code"
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*',
            }}
          />
          {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
        </FormControl>

        <Button
          type="submit"
          style={{
            color: 'white',
            margin: '1rem 0',
            width: '100%',
          }}
          disabled={isSubmitting}
          className={
            isSubmitting
              ? 'cursor-not-allowed'
              : '!bg-green-700 hover:!bg-green-800'
          }
          endIcon={isSubmitting ? <LoadingButton /> : null}
        >
          Verify OTP
        </Button>

        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Button
            variant="text"
            sx={{
              color: 'black',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
            onClick={() => handleResendOTP({ email })}
            disabled={isResendDisabled}
          >
            {isResendDisabled
              ? `Resend OTP (${Math.floor(timeLeft / 60)}:${(timeLeft % 60)
                  .toString()
                  .padStart(2, '0')})`
              : 'Resend OTP'}
          </Button>
        </Box>

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
            className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white w-full"
          >
            Back to Login
          </Button>
        </NavLink>
      </UserForm>
    </div>
  );
};

export default OTPVerification;
