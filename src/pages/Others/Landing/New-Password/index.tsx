import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import styles from './new-password.module.css';
import UserForm from '../../../../components/ui/Form/UserForm';
import { NavLink } from 'react-router-dom';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { NewPasswordSchema } from '../../../../lib/schema/UserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInputPasswordStore } from '../../../../lib/store';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

type NewPasswordSchema = z.infer<typeof NewPasswordSchema>;

const NewPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordSchema>({
    resolver: zodResolver(NewPasswordSchema),
  });

  const { passType, setPassType, confirmPassType, setConfirmPassType } =
    useInputPasswordStore((state) => ({
      passType: state.passType,
      setPassType: state.setPassType,
      confirmPassType: state.confirmPassType,
      setConfirmPassType: state.setConfirmPassType,
    }));

  return (
    <Box className={styles.form}>
      <Box sx={{ textAlign: 'center', width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          New Password
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Please enter your new password
        </Typography>
      </Box>

      <UserForm
        handleSubmit={handleSubmit}
        FormType="New Password"
        schema={NewPasswordSchema}
      >
        <FormControl
          error={!!errors.password}
          sx={{ width: '100%', margin: '1rem 0' }}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            type={passType}
            {...register('password')}
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setPassType(passType === 'password' ? 'text' : 'password')
                  }
                  edge="end"
                >
                  {passType === 'password' ? (
                    <EyeIcon height={25} width={25} />
                  ) : (
                    <EyeSlashIcon height={25} width={25} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </FormControl>

        <FormControl error={!!errors.confirmPassword} sx={{ width: '100%' }}>
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <OutlinedInput
            id="confirmPassword"
            type={confirmPassType}
            {...register('confirmPassword')}
            label="Confirm Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setConfirmPassType(
                      confirmPassType === 'password' ? 'text' : 'password',
                    )
                  }
                  edge="end"
                >
                  {confirmPassType === 'password' ? (
                    <EyeIcon height={25} width={25} />
                  ) : (
                    <EyeSlashIcon height={25} width={25} />
                  )}
                </IconButton>
              </InputAdornment>
            }
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
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
          Reset Password
        </Button>

        <NavLink style={{ width: '100%' }} to="/landing">
          <Button
            style={{ width: 'inherit' }}
            variant="outlined"
            className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white w-full"
          >
            Back to Login
          </Button>
        </NavLink>
      </UserForm>
    </Box>
  );
};

export default NewPassword;
