import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useSearchParams, useBlocker } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthUserStore } from '../../../lib/store';
import {
  objective_questions,
  QuizWithQuestions,
} from '../../../lib/Types/quiz';
import { getQuizzesWithQuestions } from '../../../api/User/quizApi';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
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
import { ArrowBack, ArrowForward, Cancel } from '@mui/icons-material';
const Assessment = () => {
  // Quizzes
  const { data: quizzes, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ['quizzes'],
    queryFn: getQuizzesWithQuestions,
  });

  // User
  const { userId } = useAuthUserStore((state) => ({
    userId: state.user?.userId,
  }));

  // References Values
  let sliderRef = useRef<Slider>(null);
  let sliderTutorialRef = useRef<Slider>(null);

  // State Managements
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

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
  let [isBlocking, setBlocking] = useState(false);
  let blocker = useBlocker(
    useCallback(() => {
      if (isBlocking) {
        return true;
      } else {
        return false;
      }
    }, [isBlocking]),
  );

  const quizContent = useMemo(() => {
    if (!quizzes || isLoading) return [];

    const quiz = quizzes
      .filter((value) => {
        return Number(value.topic_id) === Number(topicId);
      })
      .flatMap((quiz) => {
        return quiz.objective_questions;
      });

    return quiz;
  }, [topicId, quizzes]);

  useEffect(() => {
    if (!topicId) {
      setSelectedQuiz(null);
      setTutorialOpen(false);
      setCurrentSlide(0);
      setValue({});
    } else {
      setSelectedQuiz(quizContent);
      setTotalSlides(quizContent.length - 1);
      setTutorialOpen(true);
    }
  }, [quizContent, topicId]);

  useEffect(() => {
    if (isBlocking && blocker.state === 'blocked' && !open) {
      setOpen(true);
    }
  }, [isBlocking, blocker, open]);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: answer } = event.target;
      setValue((prevValue) => ({
        ...prevValue,
        [name]: answer,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(value);
    },
    [value],
  );

  const handleCancelButtonClick = () => {
    setOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    if (isBlocking && blocker.state === 'blocked') {
      setOpen(false);
      blocker.reset();
    } else {
      setOpen(false);
    }
  }, [isBlocking, blocker]);

  const handleConfirmCancel = useCallback(() => {
    if (isBlocking && blocker.state === 'blocked') {
      blocker.proceed();
      setBlocking(false);
      setOpen(false);
    } else {
      startTransition(() => {
        setSearchParams({}, { replace: true });
        setOpen(false);
      });
    }
  }, [isBlocking, blocker]);

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }

    if (sliderTutorialRef.current) {
      sliderTutorialRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }

    if (sliderTutorialRef.current) {
      sliderTutorialRef.current.slickPrev();
    }
  };

  const renderCancelModal = useCallback(() => {
    return (
      <Modal open={open} onClose={handleCloseModal}>
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
  }, [open]);

  const tutorialModal = useCallback(
    () => (
      <Modal open={tutorialOpen} onClose={handleCloseModal}>
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
          <Slider {...slickSettings} className="w-full" ref={sliderTutorialRef}>
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
              setTutorialOpen(false);
            }}
            sx={{
              mt: '1rem',
            }}
          >
            Got it!
          </Button>
        </Box>
      </Modal>
    ),
    [tutorialOpen, tutorialSteps],
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
                      <Box className=" flex flex-col gap-3 w-full md:w-[] lg:w-[300px]">
                        <Button
                          sx={{
                            width: '100%',
                            background: 'green',
                          }}
                          variant="contained"
                          onClick={() => {
                            startTransition(() =>
                              setSearchParams({
                                topicId: quiz.topic_id.toString(),
                                quizId: quiz.id.toString(),
                                userId: userId?.toString() || '',
                              }),
                            );
                          }}
                        >
                          Start Assessment
                        </Button>
                        <Button
                          sx={{
                            width: '100%',
                          }}
                          variant="contained"
                          color="inherit"
                        >
                          Score: Pending
                        </Button>
                      </Box>
                    </CardActions>
                  </Box>
                </Card>
              </Box>
            ))}

          {selectedQuiz && (
            <>
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  setTutorialOpen(true);
                }}
                sx={{
                  position: 'fixed',
                  right: '1rem',
                  bottom: '1rem',
                }}
              >
                Tutorial
              </Button>

              <form onSubmit={handleSubmit} className="slider-container">
                <Slider
                  {...slickSettings}
                  ref={sliderRef}
                  afterChange={(index) => {
                    setCurrentSlide(index);
                  }}
                >
                  {selectedQuiz.map((questions, index) => (
                    <Card
                      key={index}
                      className="sm:!flex justify-between gap-5 p-4"
                    >
                      <Box className="flex flex-[1_1_100%] ml-2 gap-[1%] items-center">
                        <Box className="flex-[1_1_55%]">
                          <CardHeader subheader={questions.question} />
                        </Box>
                      </Box>

                      <CardContent className="flex flex-col flex-[1_1_auto] gap-3 w-full h-[450px] sm:max-h-fit">
                        <Card
                          className="flex flex-col gap-3 p-4 h-full"
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '5px',
                          }}
                        >
                          <CardHeader subheader="Choose the correct answer" />
                          <Box className="flex flex-col flex-wrap w-full max-h-fit">
                            {questions.multiple_choice_options.map((option) => (
                              <FormControl key={option.id} component="fieldset">
                                <RadioGroup
                                  aria-label={`quiz-${questions.id}`}
                                  name={`quiz-${questions.id}`}
                                  value={
                                    value[`quiz-${questions.id}`]
                                      ? value[`quiz-${questions.id}`]
                                      : ''
                                  }
                                  sx={{
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                  }}
                                  onChange={(e) => {
                                    handleRadioChange(e);
                                    setBlocking(e.target.checked);
                                  }}
                                >
                                  <FormControlLabel
                                    value={option.option_text}
                                    control={<Radio />}
                                    label={option.option_text}
                                  />
                                </RadioGroup>
                              </FormControl>
                            ))}
                          </Box>
                        </Card>
                      </CardContent>
                    </Card>
                  ))}
                </Slider>
                <CardActions className="justify-center flex-[1_1_auto] mt-10">
                  {currentSlide === totalSlides ? (
                    <>
                      <Button
                        sx={{
                          width: '100%',
                          maxWidth: 'fit-content',
                          padding: '0.5rem 1rem',
                          background: 'green',
                        }}
                        variant="contained"
                        type="submit"
                      >
                        Submit
                      </Button>

                      <Button
                        sx={{
                          width: '100%',
                          maxWidth: 'fit-content',
                          padding: '0.5rem 1rem',
                          '&:disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                        variant="contained"
                        onClick={handlePrev}
                        disabled={
                          currentSlide <= 0 || currentSlide > totalSlides
                        }
                        endIcon={<ArrowBack />}
                      >
                        Prev
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        sx={{
                          width: '100%',
                          maxWidth: 'fit-content',
                          padding: '0.5rem 1rem',
                          background: 'green',
                          '&:disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                        variant="contained"
                        onClick={handleNext}
                        disabled={currentSlide === totalSlides}
                        endIcon={<ArrowForward />}
                      >
                        Next
                      </Button>

                      <Button
                        sx={{
                          width: '100%',
                          maxWidth: 'fit-content',
                          padding: '0.5rem 1rem',
                          '&:disabled': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                          },
                        }}
                        variant="contained"
                        onClick={handlePrev}
                        disabled={
                          currentSlide <= 0 || currentSlide > totalSlides
                        }
                        endIcon={<ArrowBack />}
                      >
                        Prev
                      </Button>
                    </>
                  )}

                  <Button
                    sx={{
                      width: '100%',
                      maxWidth: 'fit-content',
                      padding: '0.5rem 1rem',
                    }}
                    variant="contained"
                    color="error"
                    onClick={handleCancelButtonClick}
                  >
                    <Cancel />
                  </Button>
                </CardActions>
              </form>
            </>
          )}

          {renderCancelModal()}
          {tutorialModal()}
        </>
      )}
    </>
  );
};

export default Assessment;
