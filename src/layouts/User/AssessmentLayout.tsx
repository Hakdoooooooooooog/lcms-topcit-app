import { useTransition } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import SearchInput from '../../components/ui/SearchInput/SearchInput';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';

const AssessmentLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const topicId = searchParams.get('topicId');

  return (
    <>
      {isPending ? (
        <LoadingScreen />
      ) : (
        <>
          {!topicId ? (
            <Box
              component={'section'}
              className="flex flex-wrap sm:justify-between justify-center gap-4"
            >
              <span className="text-4xl font-semibold">
                Assessment <span className="text-green-800 font-bold">Hub</span>
              </span>

              <SearchInput />
            </Box>
          ) : (
            <Box
              component={'section'}
              className="flex flex-wrap sm:justify-between justify-center gap-4"
            >
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  startTransition(() => {
                    setSearchParams({});
                  });
                }}
              >
                Back to Assessment Hub
              </Button>
            </Box>
          )}

          <Outlet />
        </>
      )}
    </>
  );
};

export default AssessmentLayout;
