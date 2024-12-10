import { Box, Button, Container } from '@mui/material';

import styles from './home.module.css';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../../lib/store';
import { ArrowForward } from '@mui/icons-material';

const Home = () => {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  return (
    <Container
      component={'section'}
      classes={{
        root: styles.hero_section,
      }}
      maxWidth="xl"
    >
      <div className={styles.hero_content}>
        <div className={styles.hero_content_left}>
          <h1 className={styles.hero_title}>Welcome, {user.username}</h1>
          <p className={styles.hero_description}>
            This is your one-stop online learning content management system in
            preparing for your TOPCIT examination.
          </p>

          <Button
            component={Link}
            to="/learning-hub"
            variant="contained"
            sx={{
              backgroundColor: 'green',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
              padding: '10px 20px',
            }}
            className={styles.hero_link}
          >
            Start Learning{' '}
            <ArrowForward
              sx={{
                marginLeft: '5px',
                fontSize: '1.2rem',
              }}
            />
          </Button>

          <Button
            component={Link}
            to="/about"
            variant="contained"
            sx={{
              backgroundColor: 'green',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#388E3C',
              },
              padding: '10px 20px',
            }}
            className={styles.hero_link}
          >
            Learn more about TOPCIT{' '}
            <ArrowForward
              sx={{
                marginLeft: '5px',
                fontSize: '1.2rem',
              }}
            />
          </Button>
        </div>
        <Box component={'div'} className="flex items-center justify-center">
          <img src="hero-img.webp" alt="Hero" className="h-auto max-w-full" />
        </Box>
      </div>
    </Container>
  );
};

export default Home;
