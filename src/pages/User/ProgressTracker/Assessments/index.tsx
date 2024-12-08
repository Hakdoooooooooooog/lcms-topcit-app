import { useQuery } from '@tanstack/react-query';
import { useTransition } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { getUserProgress } from '../../../../api/User/userApi';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import { UserProgress } from '../../../../lib/Types/user';
import { getQuizzesWithQuestions } from '../../../../api/User/quizApi';
import { QuizWithQuestions } from '../../../../lib/Types/quiz';
import {
  LoadingContentScreen,
  LoadingDataScreen,
} from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { useSearchStore } from '../../../../lib/store';
import useSearchFilter from '../../../../lib/hooks/useSearchFilter';

const Assessments = () => {
  const { data: userProgress, isLoading } = useQuery<UserProgress>({
    queryKey: ['userProgressContent'],
    queryFn: getUserProgress,
  });
  const { data: totalQuiz, isLoading: isLoadingTotalQuiz } = useQuery<
    QuizWithQuestions[]
  >({
    queryKey: ['totalChapters'],
    queryFn: getQuizzesWithQuestions,
  });

  const [isPending, startTransition] = useTransition();
  const search = useSearchStore((state) => state.search);

  const { isSearching, filteredItems } = useSearchFilter<QuizWithQuestions>(
    totalQuiz,
    search,
  );

  const { page, setPage, totalPages, currentItems } = handlePaginatedItems({
    items: filteredItems,
    itemPerPage: 1,
  });

  if (!userProgress || isLoading || !totalQuiz || isLoadingTotalQuiz) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isPending ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <LoadingContentScreen />
        </Box>
      ) : (
        <>
          {isSearching ? (
            <LoadingDataScreen />
          ) : (
            <>
              {currentItems &&
                currentItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      padding: '15px',
                      position: 'relative',
                    }}
                  >
                    <CardHeader title={`Topic ${item.id}: ${item.title}`} />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 5,
                        }}
                      >
                        <Typography variant="body1">
                          Status:{' '}
                          {userProgress.user_completed_quizzes &&
                          Number(userProgress.user_completed_quizzes?.id) ===
                            item.id
                            ? 'Completed'
                            : 'Not Completed'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </>
          )}
        </>
      )}

      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Pagination
          size="large"
          shape="rounded"
          count={totalPages}
          page={page}
          onChange={(_event, value) =>
            startTransition(() => {
              setPage(value);
            })
          }
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default Assessments;
