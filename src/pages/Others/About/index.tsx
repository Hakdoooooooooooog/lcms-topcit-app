import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  List,
  Box,
} from '@mui/material';

import styles from './about.module.css';
import { useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';
import { testimonies } from '../../../lib/constants';

const About = () => {
  // Dynamically set the height of the bullet point to match the height of the list item
  useEffect(() => {
    const getElementHeight = () => {
      let liEl = document.querySelectorAll('li');

      liEl.forEach((el) => {
        let span = el.getElementsByClassName(
          styles['list__item--bullet'],
        )[0] as HTMLElement;

        if (span) {
          let itemHeight = el.clientHeight;
          span.style.height = `${itemHeight}px`;
        }
      });
    };

    getElementHeight();
    window.addEventListener('resize', getElementHeight);

    return () => {
      window.removeEventListener('resize', getElementHeight);
    };
  }, []);

  return (
    <Box component={'section'} className={styles.about_wrapper}>
      <Box className={styles.topcit}>
        <Typography className={styles.title}>
          About <span>TOPCIT</span>
        </Typography>

        <Card className={styles.card}>
          <Typography className={styles.card__title}>
            <span>TOPCIT</span>
          </Typography>
          <CardContent component={'div'} className={styles.card__content}>
            <List className={styles.card__lists}>
              <Typography
                className={styles['card__lists--item']}
                variant="body1"
                component="li"
              >
                <Box component="span" className={styles['list__item--bullet']}>
                  <Box
                    component={'span'}
                    className={styles['list__item--bullet-inner']}
                  />
                </Box>
                TOPCIT stands for Test Of Practical Competency in IT.
              </Typography>
              <Typography
                className={styles['card__lists--item']}
                variant="body1"
                component="li"
              >
                <Box component="span" className={styles['list__item--bullet']}>
                  <Box
                    component={'span'}
                    className={styles['list__item--bullet-inner']}
                  />
                </Box>
                TOPCIT is a performance-evaluation-centered test designed to
                diagnose and assess the basic competencies of IT specialists and
                software developers working the IT industry. TOPCIT’s mission is
                to establish a standardized set of competencies required in the
                IT industry for students to follow in order to be better
                prepared before graduation.
              </Typography>
              <Typography
                className={styles['card__lists--item']}
                variant="body1"
                component="li"
              >
                <Box component="span" className={styles['list__item--bullet']}>
                  <Box
                    component={'span'}
                    className={styles['list__item--bullet-inner']}
                  />
                </Box>
                Visit TOPCIT’s official website to know more!
              </Typography>
            </List>
          </CardContent>

          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'green',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#388E3C',
                },
                padding: '10px 20px',
              }}
              href="https://topcit.or.kr"
              size="small"
            >
              Visit TOPCIT
            </Button>
          </CardActions>
        </Card>
      </Box>

      <Box className={styles.topcit}>
        <Typography className={styles.title}>
          Testimonies from <span>Students</span>
        </Typography>
        <Carousel
          fullHeightHover
          className="w-full"
          animation="slide"
          indicators={true}
          autoPlay={true}
          duration={500}
          interval={5000}
          navButtonsAlwaysInvisible={true}
          children={testimonies.map((testimony, index) => (
            <Card key={index} className={styles.testimony__card}>
              <Typography className={styles.card__title}>
                <span>{testimony.name}</span>
              </Typography>
              <CardContent component={'div'} className={styles.card__content}>
                <Typography
                  className={styles.card__content__text}
                  variant="body1"
                  component="p"
                >
                  {testimony.testimonyText}
                </Typography>
              </CardContent>
            </Card>
          ))}
        />
      </Box>
    </Box>
  );
};

export default About;
