import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import styles from './forgot-password.module.css';
import UserForm from '../../../../components/ui/Form/UserForm';
import { NavLink } from 'react-router-dom';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { ForgotPasswordSchema } from '../../../../lib/schema/UserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  return (
    <div className={styles.form}>
      <Box sx={{ textAlign: 'center', maxWidth: '450px', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Forgot Password
        </Typography>
      </Box>
      <UserForm
        handleSubmit={handleSubmit}
        FormType="Forgot Password"
        schema={ForgotPasswordSchema}
      >
        <FormControl error={!!errors.email} sx={{ width: '100%' }}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            label="Email"
            autoComplete="on"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
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
          Send Email Verification
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
            className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white w-full"
          >
            Back to Login
          </Button>
        </NavLink>
      </UserForm>
    </div>
  );
};

export default ForgotPassword;
