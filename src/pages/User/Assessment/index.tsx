import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useSearchParams, useBlocker } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  useAuthUserStore,
  useModalStore,
  useQuizStore,
  useSliderStore,
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
  Typography,
} from '@mui/material';
import { LoadingContentScreen } from '../../../components/ui/LoadingScreen/LoadingScreen';
import {
  slickSettings,
  styledModal,
  tutorialSteps,
} from '../../../lib/constants';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Quiz from './Quiz';
import { showToast } from '../../../components/ui/Toasts';

const Assessment = () => {
  // Quizzes
  const { data: quizzes, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ['AssessmentQuizzes'],
    queryFn: getQuizzesWithQuestions,
    refetchOnWindowFocus: false,
  });

  // User
  const { userId } = useAuthUserStore((state) => ({
    userId: state.user?.userId,
  }));

  // Slider Refs
  const tutorialSlider = useRef<Slider | null>(null);

  // Slider States
  const { currentSlide, setCurrentSlide, setTotalSlides } = useSliderStore(
    (state) => ({
      currentSlide: state.currentSlide,
      setCurrentSlide: state.setCurrentSlide,
      setTotalSlides: state.setTotalSlides,
    }),
  );

  // User Quiz States
  const { setValue, isBlocked, setIsBlocked } = useQuizStore((state) => ({
    setValue: state.setValue,
    isBlocked: state.isBlocked,
    setIsBlocked: state.setIsBlocked,
  }));

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
    } else {
      setSelectedQuiz(quizContent);
      setTotalSlides(quizContent.length - 1);
      setOpenTutorialModal(true);
    }

    return () => {
      setValue({});
    };
  }, [quizContent, topicId]);

  useEffect(() => {
    if (isBlocked && blocker.state === 'blocked') {
      setOpenCancelModal(true);
    }

    if (blocker.state === 'blocked' && !isBlocked) {
      blocker.proceed();
    }
  }, [isBlocked, blocker]);

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
      <Modal open={openCancelModal} onClose={handleCloseModal}>
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
      <Modal open={openTutorialModal} onClose={handleCloseModal}>
        <Box
          sx={{
            ...styledModal,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
          }}
          className="slider-container sm:max-w-md"
        >
          <Typography variant="h5" className="self-start">
            Instructions:
          </Typography>
          <Slider
            {...slickSettings}
            className="w-full"
            ref={tutorialSlider}
            beforeChange={(_currentSlide, nextSlide) =>
              setCurrentSlide(nextSlide)
            }
          >
            {tutorialSteps.map((step, index) => (
              <Card
                key={index}
                className="sm:!flex flex-col justify-between items-center gap-5 px-4 pt-4"
              >
                <CardHeader title={step.label} />

                <CardContent>
                  <Typography variant="body1">{step.content}</Typography>
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
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </Slider>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setOpenTutorialModal(false);
              setCurrentSlide(0);
            }}
            sx={{
              mt: '1rem',
            }}
            disabled={currentSlide !== tutorialSteps.length - 1}
          >
            Got it!
          </Button>
        </Box>
      </Modal>
    ),
    [openTutorialModal, tutorialSteps, currentSlide],
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
          {!selectedQuiz &&
            quizzes.map((quiz) => (
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
            ))}

          {selectedQuiz && (
            <Quiz
              selectedQuiz={selectedQuiz}
              startTransition={startTransition}
              topicId={topicId || ''}
            />
          )}

          {renderCancelModal()}
          {tutorialModal()}
        </>
      )}
    </>
  );
};

export default Assessment;
