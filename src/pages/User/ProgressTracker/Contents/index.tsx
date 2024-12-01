import { Box, Typography } from '@mui/material';

const Contents = () => {
  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '0 20px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: '20px' }}>
        Progress Tracker
      </Typography>

      <Typography variant="body1">
        This page is under construction. Please check back later.
      </Typography>
    </Box>
  );
};

export default Contents;
