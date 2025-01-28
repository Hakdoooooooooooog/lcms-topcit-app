import { useQuery } from '@tanstack/react-query';
import { useTransition, useState, useEffect } from 'react';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getUserProgress } from '../../../../api/User/userApi';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import { UserProgress } from '../../../../lib/Types/user';
import { getQuizAssessmentScores } from '../../../../api/User/quizApi';
import {
  QuizAssessmentDetails,
  QuizAssessmentScores,
} from '../../../../lib/Types/quiz';
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
    QuizAssessmentScores[]
  >({
    queryKey: ['totalChapters'],
    queryFn: async () => getQuizAssessmentScores({ quizID: '5' }),
  });

  useEffect(() => {
    if (totalQuiz) {
      // Initialize selectedQuizzes with 'all' for each topic
      const initialSelectedQuizzes = totalQuiz.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: 'all',
        }),
        {},
      );
      setSelectedQuizzes(initialSelectedQuizzes);
    }
  }, [totalQuiz]);

  const [isPending, startTransition] = useTransition();
  const search = useSearchStore((state) => state.search);
  const [selectedQuizzes, setSelectedQuizzes] = useState<
    Record<number, number | 'all'>
  >({});

  const { isSearching, filteredItems } = useSearchFilter<QuizAssessmentScores>(
    totalQuiz,
    search,
  );

  const { page, setPage, totalPages, currentItems } = handlePaginatedItems({
    items: filteredItems,
    itemPerPage: 3,
  });

  if (!userProgress || isLoading || !totalQuiz || isLoadingTotalQuiz) {
    return <div>Loading...</div>;
  }

  const handleAttemptQuizScore = (quiz: QuizAssessmentDetails) => {
    return quiz.user_quiz_attempts
      ?.filter((attempt) => attempt?.quiz_id === quiz.id)
      .flatMap((attempt) => attempt?.score);
  };

  const getUniqueQuizNumbers = (quizzes?: QuizAssessmentDetails[]) => {
    if (!quizzes) return [];
    return [...new Set(quizzes.map((quiz) => quiz.id))];
  };

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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                          display: 'grid',
                          gridTemplateColumns: '500px auto',
                          alignItems: 'center',
                        }}
                      >
                        {/* Left side - Topic info */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="h6" fontWeight={600}>
                            Status:{' '}
                            {item.quiz?.some((quiz) =>
                              quiz.user_quiz_attempts?.some(
                                (attempt) => attempt?.quiz_id === quiz.id,
                              ),
                            )
                              ? 'Attempted'
                              : 'Not Attempted'}
                          </Typography>

                          <FormControl
                            size="small"
                            sx={{ maxWidth: 200, mt: 2 }}
                          >
                            <InputLabel>Select Quiz</InputLabel>
                            <Select
                              value={selectedQuizzes[item.id] ?? 'all'}
                              label="Select Quiz"
                              onChange={(e) =>
                                setSelectedQuizzes((prev) => ({
                                  ...prev,
                                  [item.id]: e.target.value as number | 'all',
                                }))
                              }
                            >
                              <MenuItem value="all">All Quizzes</MenuItem>
                              {getUniqueQuizNumbers(item.quiz).map(
                                (quizId, index) => (
                                  <MenuItem key={quizId} value={quizId}>
                                    Quiz {index + 1}
                                  </MenuItem>
                                ),
                              )}
                            </Select>
                          </FormControl>
                        </Box>

                        {/* Right side - Scores */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 1,
                            minWidth: '250px',
                          }}
                        >
                          <Typography variant="h6" fontWeight={600}>
                            Scores
                          </Typography>
                          {item.quiz?.length === 0 ? (
                            <Typography variant="body1" color="text.secondary">
                              No scores available yet.
                            </Typography>
                          ) : (
                            item.quiz?.map((quiz, index) => {
                              if (
                                selectedQuizzes[item.id] !== 'all' &&
                                quiz.id !== selectedQuizzes[item.id]
                              ) {
                                return null;
                              }
                              return (
                                <Box
                                  key={`${quiz.title}-${index}`}
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    padding: 1,
                                    backgroundColor: 'white',
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                  >
                                    {quiz.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Max Attempts: {quiz.max_attempts}
                                  </Typography>
                                  {handleAttemptQuizScore(quiz)?.length ===
                                  0 ? (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      No attempts yet
                                    </Typography>
                                  ) : (
                                    handleAttemptQuizScore(quiz)?.map(
                                      (score, index) => (
                                        <Typography
                                          key={index}
                                          variant="body2"
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontWeight: 500,
                                          }}
                                        >
                                          <span>Attempt {index + 1}:</span>
                                          <span>
                                            {score} /{' '}
                                            {quiz._count.objective_questions}
                                          </span>
                                        </Typography>
                                      ),
                                    )
                                  )}
                                </Box>
                              );
                            })
                          )}
                        </Box>
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
