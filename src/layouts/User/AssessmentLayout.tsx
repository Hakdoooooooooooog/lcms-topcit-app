import { Outlet, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import SearchInput from '../../components/ui/SearchInput/SearchInput';

const AssessmentLayout = () => {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');

  return (
    <>
      {!topicId && (
        <Box
          component={'section'}
          className="flex flex-wrap sm:justify-between justify-center gap-4"
        >
          <span className="text-4xl font-semibold">
            Assessment <span className="text-green-800 font-bold">Hub</span>
          </span>

          <SearchInput />
        </Box>
      )}

      <Box component={'section'} className="mt-4 max-w-[80rem] mx-auto">
        <Outlet />
      </Box>
    </>
  );
};

export default AssessmentLayout;
