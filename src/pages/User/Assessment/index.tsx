import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { useBlocker } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  useAccordionStore,
  useAuthUserStore,
  useModalStore,
  useQuizStore,
  useSearchStore,
  useSliderAssessmentStore,
} from '../../../lib/store';
import { TopicWithQuiz, UserQuizAttempts } from '../../../lib/Types/quiz';
import { getQuizzesWithQuestions, startQuiz } from '../../../api/User/quizApi';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { Add, ArrowBack, ArrowForward } from '@mui/icons-material';

const Assessment = () => {
  // State
  const [selectedQuizState, setSelectedQuizState] = useState({
    quizId: '',
    topicId: '',
    studentId: '',
  });

  // Quizzes
  const { data: quizzes, isLoading } = useQuery<TopicWithQuiz[]>({
    queryKey: ['AssessmentQuizzes'],
    queryFn: getQuizzesWithQuestions,
    refetchOnWindowFocus: false,
  });

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<TopicWithQuiz>({
      items: quizzes,
      itemPerPage: 5,
    });

  // Search Filtering
  const { search } = useSearchStore((state) => ({
    search: state.search,
  }));
  const { isSearching, filteredItems: filteredQuizzes } =
    useSearchFilter<TopicWithQuiz>(currentItems, search);

  // User
  const { studentId } = useAuthUserStore((state) => ({
    studentId: state.user?.studentId,
  }));

  // Slider States
  const { currentSliderSlide, setCurrentSlide } = useSliderAssessmentStore(
    (state) => ({
      currentSliderSlide: state.currentSliderSlide,
      setCurrentSlide: state.setCurrentSlide,
    }),
  );

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

  // Accordion States
  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    handleChanges: state.handleChanges,
  }));

  // Transition
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    if (!selectedQuizState.quizId && !selectedQuizState.topicId) {
      setOpenTutorialModal(false);
      setIsBlocked(false);
      setCurrentSlide(0);
      setValue({});
      setSelectedQuizState({
        quizId: '',
        topicId: '',
        studentId: '',
      });
    } else {
      setOpenTutorialModal(true);
    }
  }, [selectedQuizState.quizId, selectedQuizState.topicId]);

  // Fix dependency array for useEffect with blocker
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
  }, [blocker, isBlocked, value]);

  // Memoize handler functions
  const handleCloseModal = useCallback(() => {
    if (isBlocked && blocker.state === 'blocked') {
      setOpenCancelModal(false);
      blocker.reset();
    } else {
      setOpenCancelModal(false);
    }
  }, [isBlocked, blocker]);

  const handleConfirmCancel = useCallback(() => {
    if (isBlocked && blocker.state === 'blocked') {
      startTransition(() => {
        blocker.proceed();
        setIsBlocked(false);
        setOpenCancelModal(false);
      });
      showToast('Quiz cancelled successfully', 'success');
    } else {
      startTransition(() => {
        setSelectedQuizState({
          quizId: '',
          topicId: '',
          studentId: '',
        });
        setOpenCancelModal(false);
      });
      showToast('Quiz cancelled successfully', 'success');
    }
  }, [isBlocked, blocker]);

  const handleStartQuiz = useCallback(
    async (selectedQuizState: { quizId: string; topicId: string }) => {
      try {
        await startQuiz(selectedQuizState.quizId, selectedQuizState.topicId);

        startTransition(() =>
          setSelectedQuizState({
            quizId: selectedQuizState.quizId,
            topicId: selectedQuizState.topicId,
            studentId: studentId ?? '',
          }),
        );

        showToast('Quiz started successfully.', 'success');
      } catch (error: any) {
        showToast('Error starting quiz: ' + error.error, 'error');
      }
    },
    [selectedQuizState.quizId, selectedQuizState.topicId],
  );

  // Memoize modal render functions
  const renderCancelModal = useMemo(
    () => (
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
    ),
    [openCancelModal, handleConfirmCancel, handleCloseModal],
  );

  const tutorialModal = useMemo(
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
    [
      openTutorialModal,
      currentSliderSlide,
      setCurrentSlide,
      setOpenTutorialModal,
      tutorialSteps,
    ],
  );

  // Memoize handleAttemptQuizScore
  const handleAttemptQuizScore = useCallback((quiz: UserQuizAttempts) => {
    return quiz.user_quiz_attempts?.flatMap((attempt) => attempt?.score);
  }, []);

  const memoizedAccordionTopic = useMemo(() => {
    return (
      !selectedQuizState.quizId &&
      !selectedQuizState.topicId &&
      filteredQuizzes &&
      filteredQuizzes.map((topic) => {
        return (
          <Accordion
            key={topic.id}
            expanded={expanded === `panel1a-topicHeader-${topic.id}`}
            onChange={handleChanges(`panel1a-topicHeader-${topic.id}`)}
            sx={
              expanded === `panel1a-topicHeader-${topic.id}`
                ? {
                    backgroundColor: 'rgba(0, 128, 0, 0.1)',
                    marginTop: '1rem',
                  }
                : { marginTop: '1rem', transition: 'background-color 0.5s' }
            }
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary
              aria-controls={`panel1a-content-${topic.id}-${topic.topictitle}`}
              id={`panel1a-header-${topic.id}-${topic.topictitle}`}
              expandIcon={
                <Add
                  sx={{
                    color: 'green',
                  }}
                />
              }
              className="!bg-[#0080001a] hover:bg-[#0080001a]"
            >
              Topic {topic.id}: {topic.topictitle}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {topic.quiz && topic.quiz.length > 0 ? (
                topic.quiz.map((quiz, index) => (
                  <Box
                    key={quiz.id}
                    component={'section'}
                    className="flex flex-col gap-y-3 mt-10"
                  >
                    <Card className="flex p-4">
                      <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
                        <Box className="flex-[1_1_55%]">
                          <CardHeader
                            title={`Quiz ${index + 1}: ${quiz.title}`}
                            subheader={`Chapter: ${quiz.chapters?.title}`}
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
                                onClick={() =>
                                  handleStartQuiz({
                                    quizId: quiz.id.toString(),
                                    topicId: topic.id.toString(),
                                  })
                                }
                                disabled={
                                  quiz._count.user_quiz_attempts >=
                                    quiz.max_attempts ||
                                  ((handleAttemptQuizScore(quiz)[0] ?? 0) /
                                    quiz._count.objective_questions) *
                                    100 >=
                                    70
                                }
                              >
                                Attempts: {quiz._count.user_quiz_attempts ?? 0}{' '}
                                / {quiz.max_attempts}
                              </Button>
                            )}
                            <Tooltip title="Score" arrow>
                              <Button
                                disableRipple={true}
                                disableTouchRipple={true}
                                sx={{
                                  width: '100%',
                                  cursor: 'default',
                                  ...(handleAttemptQuizScore(quiz) &&
                                  handleAttemptQuizScore(quiz)[0] ===
                                    quiz._count.objective_questions
                                    ? {
                                        backgroundColor: '#00800030',
                                      }
                                    : {
                                        backgroundColor: 'rgba(0, 128, 0, 0.2)',

                                        '&:hover': {
                                          backgroundColor:
                                            'rgba(0, 128, 0, 0.4)',
                                        },
                                      }),
                                }}
                                variant="contained"
                                color="inherit"
                              >
                                Score:{' '}
                                {handleAttemptQuizScore(quiz) &&
                                  (handleAttemptQuizScore(quiz)[0] ?? 0)}{' '}
                                / {quiz._count.objective_questions}
                              </Button>
                            </Tooltip>

                            <Typography
                              variant="caption"
                              sx={{ fontSize: '0.75rem', color: 'red' }}
                            >
                              Caution: The score will be overwritten on retake,
                              and the recent score will be considered.
                            </Typography>
                          </Box>
                        </CardActions>
                      </Box>
                    </Card>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">
                  No quizzes available for this topic
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })
    );
  }, [
    currentItems,
    page,
    expanded,
    handleChanges,
    selectedQuizState,
    filteredQuizzes,
  ]);

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
          {selectedQuizState.quizId && selectedQuizState.topicId && (
            <Quiz
              selectedQuizState={selectedQuizState}
              setSelectedQuizState={setSelectedQuizState}
              startTransition={startTransition}
            />
          )}

          {isSearching ? <LoadingContentScreen /> : memoizedAccordionTopic}

          {!selectedQuizState.quizId &&
            !selectedQuizState.topicId &&
            !selectedQuizState.studentId && (
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

          {filteredQuizzes && filteredQuizzes.length <= 0 && (
            <Typography variant="h5" className="mt-5">
              No quizzes found
            </Typography>
          )}

          {renderCancelModal}
          {tutorialModal}
        </>
      )}
    </>
  );
};

export default Assessment;
