import { Box, Typography } from '@mui/material';

const Assessments = () => {
  return (
    <Box
      component={'div'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
      }}
    >
      <Typography variant="h1">Assessments</Typography>

      <Typography variant="body1">
        This page is under construction. Please check back later.
      </Typography>
    </Box>
  );
};

export default Assessments;
