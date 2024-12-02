import { useQuery } from '@tanstack/react-query';
import { useTransition, useMemo } from 'react';

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

  const progress = useMemo(() => {
    let array = [];
    if (!userProgress || isLoading || !totalQuiz || isLoadingTotalQuiz) {
      return [];
    }

    const completedQuiz = Number(userProgress.completed_quizzes);

    for (let i = 0; i < totalQuiz.length; i++) {
      let quizId = totalQuiz[i].id;

      if (completedQuiz >= quizId) {
        array.push({
          quizId: quizId,
          quizTitle: totalQuiz[i].title,
          completed: true,
        });
      } else {
        array.push({
          quizId: quizId,
          quizTitle: totalQuiz[i].title,
          completed: false,
        });
      }
    }

    return array;
  }, [userProgress, totalQuiz]);

  const { isSearching, filteredItems } = useSearchFilter(progress, search);

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
                    key={item.quizId}
                    sx={{
                      padding: '15px',
                      position: 'relative',
                    }}
                  >
                    <CardHeader
                      title={`Topic ${item.quizId}: ${item.quizTitle}`}
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
                          {item.completed ? 'Completed' : 'Not Completed'}
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
        />
      </Stack>
    </>
  );
};

export default Assessments;
