import { Card, CardContent, Typography } from '@mui/material';

const ProgressTracker = () => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Welcome to the Progress Tracker! This is your personal dashboard to
            monitor your journey toward TOPCIT readiness. Keep track of your
            completed chapters, mastered topics, and assessment scores.
            Celebrate your milestones and stay on top of your learning goals!
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default ProgressTracker;
