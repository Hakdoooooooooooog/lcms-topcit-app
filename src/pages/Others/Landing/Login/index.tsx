// Date: 07/08/2024
import styles from './login.module.css';
import UserForm from '../../../../components/ui/Form/UserForm';
import { LoginSchema } from '../../../../lib/schema/UserSchema';
import { z } from 'zod';
import { setLoginFields } from '../../../../lib/constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useInputPasswordStore } from '../../../../lib/store';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';

type LoginSchema = z.infer<typeof LoginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const { passType, setPassType } = useInputPasswordStore((state) => ({
    passType: state.passType,
    setPassType: state.setPassType,
  }));

  const handleGoogleSignIn = () => {
    const googleAuthUrl = `${
      import.meta.env.VITE_APP_BASE_API_URL
    }/auth/google`;
    const successUrl = `${window.location.origin}/landing/success`;

    window.open(
      `${googleAuthUrl}?success_redirect=${encodeURIComponent(successUrl)}`,
      '_self',
    );
  };

  return (
    <div className={styles.form}>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleSignIn}
        sx={{
          marginBottom: 2,
          borderColor: '#4285f4',
          color: '#4285f4',
          '&:hover': {
            borderColor: '#4285f4',
            backgroundColor: 'rgba(66, 133, 244, 0.04)',
          },
        }}
        startIcon={
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            style={{ width: 20, height: 20 }}
          />
        }
        disabled={true}
      >
        Continue with Google
      </Button>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '1rem 0',
        }}
      >
        <Box sx={{ flex: 1, borderBottom: '1px solid #e0e0e0' }} />
        <Box sx={{ margin: '0 1rem', color: '#666' }}>or</Box>
        <Box sx={{ flex: 1, borderBottom: '1px solid #e0e0e0' }} />
      </Box>

      <UserForm
        handleSubmit={handleSubmit}
        schema={LoginSchema}
        FormType="Login"
      >
        {setLoginFields.map((field, index) => {
          return (
            <FormControl
              key={index}
              error={errors[field.name as keyof LoginSchema] ? true : false}
            >
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <OutlinedInput
                {...register(field.name as keyof LoginSchema)}
                id={field.name}
                autoComplete="on"
                type={field.name === 'password' ? passType : 'text'}
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
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                          e.preventDefault()
                        }
                        edge="end"
                      >
                        {passType !== 'text' ? (
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
                  {errors[field.name as keyof LoginSchema]?.message}
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
          Login
        </Button>
        <NavLink
          style={{
            width: '100%',
          }}
          to="register"
        >
          <Button
            style={{
              width: 'inherit',
            }}
            variant="outlined"
            className="!border-gray-700 !text-gray-700 hover:!bg-gray-700 hover:!text-white"
          >
            Register
          </Button>
        </NavLink>
      </UserForm>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '1rem',
        }}
      >
        <Button
          component={NavLink}
          to="/landing/forgot-password"
          variant="text"
          sx={{
            color: 'black',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'black',
              textDecoration: 'underline',
            },
          }}
        >
          Forgot Password ?
        </Button>
      </Box>
    </div>
  );
};

export default Login;
