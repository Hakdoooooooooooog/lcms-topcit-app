// Desc: Main page of the Learning Hub
import { Card, CardContent, Typography } from '@mui/material';

const Main = () => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Welcome to Learning Hub! Dive into a comprehensive and interactive
            learning experience tailored to help you prepare for the TOPCIT
            examination. Explore the structured syllabus, engage with detailed
            content materials, and take your understanding to the next level.
            Unlock chapters as you progress, and stay motivated with a
            goal-oriented approach. Let's make learning effective, engaging, and
            enjoyable!
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default Main;
