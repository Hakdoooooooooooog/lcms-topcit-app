import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const ProfileLayout = () => {
  return (
    <Container maxWidth={'xl'} className="mt-10">
      <h1 className="text-4xl font-semibold mb-12">
        Profile <span className="text-green-800">Management</span>
      </h1>
      <Outlet />
    </Container>
  );
};

export default ProfileLayout;
