import { useQuery } from '@tanstack/react-query';
import { useMemo, useTransition } from 'react';

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
import { TopicWithQuizAndObjectiveQuestions } from '../../../../lib/Types/quiz';
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
    TopicWithQuizAndObjectiveQuestions[]
  >({
    queryKey: ['totalChapters'],
    queryFn: getQuizzesWithQuestions,
  });

  const [isPending, startTransition] = useTransition();
  const search = useSearchStore((state) => state.search);

  const { isSearching, filteredItems } =
    useSearchFilter<TopicWithQuizAndObjectiveQuestions>(totalQuiz, search);

  const { page, setPage, totalPages, currentItems } = handlePaginatedItems({
    items: filteredItems,
    itemPerPage: 3,
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {currentItems &&
                currentItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      padding: '5px',
                      backgroundColor:
                        item.id ===
                        userProgress.user_completed_quizzes
                          .map((quiz) => quiz?.topic_id)
                          .find((topicId) => topicId === item.id)
                          ? '#0080002a'
                          : 'white',
                    }}
                  >
                    <CardHeader
                      title={`Topic ${item.id}: ${item.topictitle}`}
                    />
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
                          {item.id ===
                          userProgress.user_completed_quizzes
                            .map((quiz) => quiz?.topic_id)
                            .find((topicId) => topicId === item.id)
                            ? 'Completed'
                            : 'Not Completed'}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
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
