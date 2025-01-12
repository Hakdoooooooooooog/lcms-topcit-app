import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import styles from './success.module.css';
import { useAuthUserStore } from '../../../../lib/store';
import axios from 'axios';

const Success = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    user: {
      studentId: '',
      role: '',
    },
  });
  const [countdown, setCountdown] = useState(5);

  const { setUserAuth } = useAuthUserStore((state) => ({
    setUserAuth: state.setUserAuth,
  }));

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios
        .get('http://localhost:3300/auth/login/success', {
          withCredentials: true,
        })
        .catch((error) => {
          console.error(error);
        });

      if (response && response.status === 200) {
        setData({
          user: response.data.user,
        });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1 && data) {
          clearInterval(timer);
          setUserAuth({
            studentId: data.user.studentId,
            userRole: data.user.role,
            isAuth: true,
          });
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, setUserAuth, data]);

  return (
    <Box className={styles.container}>
      <CheckCircleIcon className={styles.successIcon} width={64} height={64} />
      <Typography variant="h4" gutterBottom>
        Login Successful!
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        You have successfully logged in with Google.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
        <CircularProgress size={20} />
        <Typography>
          Redirecting to dashboard in {countdown} seconds...
        </Typography>
      </Box>
    </Box>
  );
};

export default Success;
