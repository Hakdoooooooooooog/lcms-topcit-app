import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import styles from './landing.module.css';
import { Box, Button, Container } from '@mui/material';
import { setNewPath } from '../../lib/helpers/utils';
import { useAuthUserStore } from '../../lib/store';
import TOPCITLogo from '../../components/TOPCITLogo';

const Landing = () => {
  const location = useLocation().pathname;
  const currentPath = setNewPath(location);
  const isAuth = useAuthUserStore((state) => state.user.isAuth);

  if (isAuth) {
    return <Navigate to="/" replace={true} state={{ from: location }} />;
  }

  return (
    <>
      <Box className={styles.btn_back}>
        {currentPath !== '/' && (
          <Link to={currentPath}>
            <Button
              variant="contained"
              className="!bg-gray-600 !text-white hover:!bg-gray-800 hover:!text-white"
            >
              Back
            </Button>
          </Link>
        )}
      </Box>
      <Container
        component={'section'}
        classes={{
          root: styles.container,
        }}
        maxWidth="md"
      >
        <div className={styles.logo}>
          <TOPCITLogo height="250" width="500" />
          <h1>An Online Reviewer</h1>
        </div>
        <Outlet />
      </Container>
    </>
  );
};

export default Landing;
