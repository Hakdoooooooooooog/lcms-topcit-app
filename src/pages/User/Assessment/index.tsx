import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useSearchParams, useBlocker } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  useAuthUserStore,
  useModalStore,
  useQuizStore,
  useSearchStore,
  useSliderAssessmentStore,
} from '../../../lib/store';
import {
  objective_questions,
  QuizWithQuestions,
} from '../../../lib/Types/quiz';
import { getQuizzesWithQuestions, startQuiz } from '../../../api/User/quizApi';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { LoadingContentScreen } from '../../../components/ui/LoadingScreen/LoadingScreen';
import { styledModal, tutorialSteps } from '../../../lib/constants';
import Quiz from './Quiz';
import { showToast } from '../../../components/ui/Toasts';
import { handlePaginatedItems } from '../../../lib/helpers/utils';
import useSearchFilter from '../../../lib/hooks/useSearchFilter';
import Carousel from 'react-material-ui-carousel';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const Assessment = () => {
  // Quizzes
  const { data: quizzes, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ['AssessmentQuizzes'],
    queryFn: getQuizzesWithQuestions,
    refetchOnWindowFocus: false,
  });

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<QuizWithQuestions>({
      items: quizzes,
      itemPerPage: 5,
    });

  // Search Filtering
  const { search } = useSearchStore((state) => ({
    search: state.search,
  }));
  const { isSearching, filteredItems: filteredQuizzes } =
    useSearchFilter<QuizWithQuestions>(currentItems, search);

  // User
  const { userId } = useAuthUserStore((state) => ({
    userId: state.user?.userId,
  }));

  // Slider States
  const { currentSliderSlide, setCurrentSlide, setTotalSlides } =
    useSliderAssessmentStore((state) => ({
      currentSliderSlide: state.currentSliderSlide,
      setCurrentSlide: state.setCurrentSlide,
      setTotalSlides: state.setTotalSlides,
    }));

  // User Quiz States
  const { value, setValue, isBlocked, setIsBlocked } = useQuizStore(
    (state) => ({
      value: state.value,
      setValue: state.setValue,
      isBlocked: state.isBlocked,
      setIsBlocked: state.setIsBlocked,
    }),
  );

  // Modal States
  const {
    openCancelModal,
    openTutorialModal,
    setOpenCancelModal,
    setOpenTutorialModal,
  } = useModalStore((state) => ({
    openCancelModal: state.openCancelModal,
    openTutorialModal: state.openTutorialModal,
    openSubmitModal: state.openSubmitModal,
    setOpenCancelModal: state.setOpenCancelModal,
    setOpenTutorialModal: state.setOpenTutorialModal,
  }));

  // Transition
  const [isPending, startTransition] = useTransition();

  // Selected Quiz
  const [selectedQuiz, setSelectedQuiz] = useState<
    objective_questions[] | null
  >(null);

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');

  // Blocking Navigation Guard
  let blocker = useBlocker(
    useCallback(() => {
      if (isBlocked) {
        return true;
      } else {
        return false;
      }
    }, [isBlocked]),
  );

  const quizContent = useMemo(() => {
    if (!quizzes || isLoading) return [];

    const quiz = quizzes
      .filter((value) => {
        return value.topic_id === Number(topicId);
      })
      .flatMap((quiz) => {
        return quiz.objective_questions;
      });

    return quiz;
  }, [topicId, quizzes]);

  useEffect(() => {
    if (!topicId) {
      setSelectedQuiz(null);
      setOpenTutorialModal(false);
      setIsBlocked(false);
      setCurrentSlide(0);
      setValue({});
    } else {
      setSelectedQuiz(quizContent);
      setTotalSlides(quizContent.length - 1);
      setOpenTutorialModal(true);
    }
  }, [quizContent, topicId]);

  useEffect(() => {
    if (
      isBlocked &&
      blocker.state === 'blocked' &&
      Object.keys(value).length > 0
    ) {
      setOpenCancelModal(true);
    }

    if (
      !isBlocked &&
      blocker.state === 'blocked' &&
      Object.keys(value).length <= 0
    ) {
      blocker.proceed();
    }
  }, [blocker.state, isBlocked, value]);

  const handleCloseModal = useCallback(() => {
    if (isBlocked && blocker.state === 'blocked') {
      setOpenCancelModal(false);
      blocker.reset();
    } else {
      setOpenCancelModal(false);
    }
  }, [isBlocked, blocker]);

  const handleConfirmCancel = useCallback(async () => {
    if (isBlocked && blocker.state === 'blocked') {
      startTransition(() => {
        blocker.proceed();
        setIsBlocked(false);
        setOpenCancelModal(false);
      });

      showToast('Quiz cancelled successfully', 'success');
    } else {
      startTransition(() => {
        setSearchParams({}, { replace: true });
        setOpenCancelModal(false);
      });

      showToast('Quiz cancelled successfully', 'success');
    }
  }, [isBlocked, blocker]);

  const handleStartQuiz = useCallback(
    async (quiz: QuizWithQuestions) => {
      if (!quiz) {
        return;
      }

      try {
        await startQuiz(quiz.id.toString(), quiz.topic_id.toString());

        startTransition(() =>
          setSearchParams({
            topicId: quiz.topic_id.toString(),
            quizId: quiz.id.toString(),
            userId: userId?.toString() || '',
          }),
        );

        showToast('Quiz started successfully', 'success');
      } catch (error: any) {
        showToast('Error starting quiz: ' + error.error, 'error');
      }
    },
    [userId, topicId],
  );

  const renderCancelModal = useCallback(() => {
    return (
      <Modal open={openCancelModal}>
        <Box
          sx={{
            ...styledModal,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            gap: '2rem',
          }}
          className="sm:max-w-md"
        >
          <Typography variant="h5">
            Are you sure you want to cancel taking the quiz?
          </Typography>

          <Typography variant="body1" className="m-5 text-red-400">
            Your progress will not be saved.
          </Typography>
          <Box className="flex gap-3">
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmCancel}
            >
              Yes
            </Button>
            <Button variant="contained" color="info" onClick={handleCloseModal}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }, [openCancelModal]);

  const tutorialModal = useCallback(
    () => (
      <Modal open={openTutorialModal}>
        <Box
          sx={{
            ...styledModal,
          }}
          className="sm:max-w-md"
        >
          <Typography variant="h5" className="self-start">
            Instructions:
          </Typography>
          <Carousel
            className="w-full pb-12"
            index={currentSliderSlide}
            children={tutorialSteps.map((step, index) => (
              <Card
                key={index}
                className="flex flex-col justify-evenly items-center px-4 pt-4 h-[450px]"
              >
                <CardHeader title={step.label} />

                <CardContent
                  className="flex flex-col gap-3 w-full"
                  sx={{ textAlign: 'center' }}
                >
                  <Typography variant="body1">{step.content}</Typography>
                  {step.img && step.img !== null && (
                    <Box
                      component={'img'}
                      src={step.img}
                      alt={step.label}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                        maxHeight: '15rem',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
            next={(next = 0) => setCurrentSlide(next)}
            prev={(prev = 0) => setCurrentSlide(prev)}
            animation="slide"
            autoPlay={false}
            indicators={false}
            swipe={false}
            NavButton={({ onClick, next }) => (
              <Button
                onClick={() => onClick()}
                variant="contained"
                color="info"
                sx={{
                  backgroundColor: 'green',
                  position: 'absolute',
                  bottom: '0',

                  ...(next
                    ? {
                        right: '1rem',
                      }
                    : {
                        left: '1rem',
                      }),
                }}
                disabled={
                  next
                    ? currentSliderSlide === tutorialSteps.length - 1
                    : currentSliderSlide === 0
                }
              >
                {next ? (
                  <Tooltip title="Next" arrow>
                    <ArrowForward />
                  </Tooltip>
                ) : (
                  <Tooltip title="Previous" arrow>
                    <ArrowBack />
                  </Tooltip>
                )}
              </Button>
            )}
          />

          {currentSliderSlide === tutorialSteps.length - 1 && (
            <Tooltip title="Start Quiz" arrow>
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  setOpenTutorialModal(false);
                  setCurrentSlide(0);
                }}
                sx={{
                  position: 'absolute',
                  bottom: '0.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                Start Quiz
              </Button>
            </Tooltip>
          )}
        </Box>
      </Modal>
    ),
    [openTutorialModal, tutorialSteps, currentSliderSlide],
  );

  if (isLoading || !quizzes) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <>
      {isPending ? (
        <Box className="flex justify-center items-center h-[100vh]">
          <LoadingContentScreen />
        </Box>
      ) : (
        <>
          {selectedQuiz && (
            <Quiz
              selectedQuiz={selectedQuiz}
              startTransition={startTransition}
              topicId={topicId || ''}
            />
          )}

          {isSearching ? (
            <LoadingContentScreen />
          ) : (
            !selectedQuiz &&
            filteredQuizzes &&
            filteredQuizzes.map((quiz) => (
              <Box
                key={quiz.id}
                component={'section'}
                className="flex flex-col gap-y-3 mt-10"
              >
                <Card className="flex p-4">
                  <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
                    <Box className="flex-[1_1_55%]">
                      <CardHeader
                        title={`Topic ${quiz.topic_id}`}
                        subheader={quiz.title}
                      />

                      <CardActions className="flex gap-1 w-full ml-5">
                        <Typography variant="body1">Test Type:</Typography>
                        <Button variant="contained" color="info">
                          {quiz.quiz_type}
                        </Button>
                      </CardActions>
                    </Box>

                    <CardActions className="justify-end flex-[1_1_auto]">
                      <Box className=" flex flex-col gap-3 w-full lg:w-[300px]">
                        {quiz.max_attempts && (
                          <Button
                            sx={{
                              width: '100%',
                              '&:disabled': {
                                backgroundColor: 'gray',
                              },
                            }}
                            variant="contained"
                            color="info"
                            onClick={() => handleStartQuiz(quiz)}
                            disabled={
                              (quiz.user_quiz_attempts[0]?.attempt_count ??
                                0) >= (quiz.max_attempts ?? 0)
                            }
                          >
                            Attempts:{' '}
                            {quiz.user_quiz_attempts[0]?.attempt_count || 0} /{' '}
                            {quiz.max_attempts}
                          </Button>
                        )}
                        <Button
                          disableRipple={true}
                          disableTouchRipple={true}
                          sx={{
                            width: '100%',
                            cursor: 'default',
                            ...(quiz.user_quiz_attempts[0]?.score === null
                              ? {
                                  backgroundColor: '#00800030',
                                }
                              : {
                                  backgroundColor: 'rgba(0, 128, 0, 0.2)',

                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 128, 0, 0.4)',
                                  },
                                }),
                          }}
                          variant="contained"
                          color="inherit"
                        >
                          Score: {quiz.user_quiz_attempts[0]?.score ?? 'N/A'}
                        </Button>
                      </Box>
                    </CardActions>
                  </Box>
                </Card>
              </Box>
            ))
          )}

          {!selectedQuiz && (
            <Stack spacing={2} sx={{ marginTop: '2rem' }}>
              <Pagination
                size={window.innerWidth < 600 ? 'small' : 'medium'}
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
          )}

          {renderCancelModal()}
          {tutorialModal()}
        </>
      )}
    </>
  );
};

export default Assessment;
