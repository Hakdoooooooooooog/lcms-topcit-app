import { ArrowBack, ArrowForward, Cancel } from '@mui/icons-material';
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
  Tooltip,
  Typography,
} from '@mui/material';
import { styledModal } from '../../../../lib/constants';
import {
  objective_questions,
  TopicQuizAssessments,
} from '../../../../lib/Types/quiz';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useModalStore,
  useQuizStore,
  useSliderQuizStore,
} from '../../../../lib/store';
import useAssessmentMutation from '../../../../lib/hooks/useAssessmentMutation';
import {
  LoadingButton,
  LoadingContentScreen,
} from '../../../../components/ui/LoadingScreen/LoadingScreen';
import Carousel from 'react-material-ui-carousel';
import { shuffleArray } from '../../../../lib/helpers/utils';
import { getQuizAssessment } from '../../../../api/User/quizApi';
import { useQuery } from '@tanstack/react-query';

type QuizProps = {
  selectedQuizState: {
    quizId: string;
    topicId: string;
    studentId: string;
  };
  setSelectedQuizState: Dispatch<
    SetStateAction<{ quizId: string; topicId: string; studentId: string }>
  >;
  startTransition: (callback: () => void) => void;
};

const Quiz = ({
  selectedQuizState,
  startTransition,
  setSelectedQuizState,
}: QuizProps) => {
  const { quizId, topicId, studentId } = selectedQuizState;

  // Update the query to wait for quizId and add retry option
  const { data: selectedQuiz, isLoading } = useQuery<TopicQuizAssessments>({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizAssessment(quizId),
    enabled: !!quizId,
    retry: 3,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Initialize shuffleQuiz state with proper dependency tracking
  const [shuffleQuiz, setShuffleQuiz] = useState<objective_questions[]>();

  // Update useEffect to properly handle selectedQuiz updates
  useEffect(() => {
    if (
      selectedQuiz &&
      Array.isArray(selectedQuiz) &&
      selectedQuiz.length > 0
    ) {
      const shuffledQuiz = shuffleArray<objective_questions>(
        selectedQuiz.flatMap((quiz) => quiz.objective_questions),
      );
      setShuffleQuiz(shuffledQuiz);
    }
  }, [selectedQuiz]);

  // Form Validation
  const schema = useMemo(() => {
    if (!shuffleQuiz || shuffleQuiz.length === 0) {
      return z.object({});
    }

    return z.object(
      shuffleQuiz.reduce((values, quiz) => {
        values[quiz.id.toString()] = z
          .union([z.string(), z.null()])
          .refine((val): val is string => val !== null && val.trim() !== '', {
            message: 'Please select an answer',
          });

        return values;
      }, {} as { [key: string]: z.ZodType<string | null> }),
    );
  }, [shuffleQuiz]);

  // State Managements
  const { currentSliderSlide, totalSlides, setTotalSlides, setCurrentSlide } =
    useSliderQuizStore((state) => ({
      currentSliderSlide: state.currentSliderSlide,
      totalSlides: state.totalSlides,
      setCurrentSlide: state.setCurrentSlide,
      setTotalSlides: state.setTotalSlides,
    }));
  const { setOpenTutorialModal, setOpenCancelModal } = useModalStore(
    (state) => ({
      setOpenTutorialModal: state.setOpenTutorialModal,
      setOpenCancelModal: state.setOpenCancelModal,
    }),
  );

  const { value, setValue, setIsBlocked } = useQuizStore((state) => ({
    value: state.value,
    setValue: state.setValue,
    setIsBlocked: state.setIsBlocked,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm({
    values: value,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (shuffleQuiz) {
      setTotalSlides(shuffleQuiz.length);
    }
  }, [shuffleQuiz]);

  useEffect(() => {
    if (isSubmitSuccessful || !topicId) {
      startTransition(() => {
        reset();
        setValue({});
        setIsBlocked(false);
        setOpenTutorialModal(false);
        setCurrentSlide(0);
        setTotalSlides(0);
        setSelectedQuizState({ quizId: '', topicId: '', studentId: '' });
      });
    }
  }, [isSubmitSuccessful, startTransition, topicId]);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: answer } = event.target;
      setValue({ ...value, [name]: answer });
    },
    [value],
  );

  const assessmentMutation = useAssessmentMutation();

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (topicId === '' || quizId === '' || !selectedQuiz || !studentId) {
      return;
    }

    const filteredData: { [key: string]: string } = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value || '')]),
    );

    await assessmentMutation.mutateAsync({
      topicId: topicId,
      quizId: quizId,
      assessmentData: filteredData,
    });
  };

  const confirmSubmitAnswer = useCallback(() => {
    return (
      <Modal open={false} onClose={() => {}}>
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
            Are you sure you want to submit your answers?
          </Typography>

          <Typography variant="body1" className="m-5 text-red-400">
            Your answers will be submitted for review.
          </Typography>
          <Box className="flex gap-3">
            <Button variant="contained" color="error" onClick={() => {}}>
              Yes
            </Button>
            <Button variant="contained" color="info" onClick={() => {}}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }, []);

  // Add loading state handling
  if (isLoading || !selectedQuiz) {
    return <LoadingContentScreen />;
  }

  return (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={() => {
          setOpenTutorialModal(true);
        }}
        sx={{
          position: 'fixed',
          right: '1rem',
          bottom: '1rem',
        }}
      >
        Tutorial
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Carousel
          children={
            shuffleQuiz &&
            shuffleQuiz.map((questions, index) => (
              <Card
                key={index}
                className="flex flex-col sm:flex-row justify-evenly gap-5 pb-8 h-[48rem] sm:h-full"
              >
                <Box className="flex flex-[1_1_100%] ml-2 gap-[1%] items-center">
                  <Box className="flex-[1_1_55%]">
                    <CardHeader
                      subheader={`Q${index + 1}) ${questions.question}`}
                    />
                  </Box>
                </Box>

                <CardContent className="flex flex-col flex-[1_1_auto] gap-3 w-full max-h-fit">
                  <Card
                    className="flex flex-col gap-3 p-4 h-full"
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '5px',
                    }}
                  >
                    <CardHeader subheader="Choose the correct answer" />
                    <Box className="flex flex-col flex-wrap w-full max-h-fit">
                      <FormControl
                        component="fieldset"
                        error={errors[questions.id.toString()] ? true : false}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        }}
                      >
                        {questions.multiple_choice_options &&
                          questions.multiple_choice_options.map(
                            (option, optionIndex) => (
                              <RadioGroup
                                key={`${questions.question}-${optionIndex}`}
                                {...register(questions.id.toString(), {
                                  onChange: (e) => {
                                    setIsBlocked(true);
                                    handleRadioChange(e);
                                  },
                                })}
                                sx={{
                                  padding: '5px',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    borderRadius: '10px',
                                  },
                                }}
                                value={value[questions.id.toString()] || ''}
                              >
                                <FormControlLabel
                                  value={option.option_text}
                                  control={
                                    <Radio disableTouchRipple disableRipple />
                                  }
                                  label={option.option_text}
                                />
                              </RadioGroup>
                            ),
                          )}
                      </FormControl>

                      {errors && (
                        <Typography variant="body2" className="text-red-500">
                          {errors[
                            `${questions.id.toString()}`
                          ]?.message?.toString()}
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </CardContent>
              </Card>
            ))
          }
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
                position: 'absolute',
                bottom: '0.5rem',
                backgroundColor: 'green',

                ...(next
                  ? window.innerWidth < 640
                    ? {
                        right: '5rem',
                      }
                    : {
                        right: '30rem',
                        transform: 'translateX(50%)',
                      }
                  : window.innerWidth < 640
                  ? {
                      left: '5rem',
                    }
                  : {
                      left: '30rem',
                      transform: 'translateX(-50%)',
                    }),
              }}
              disableRipple={true}
              disableTouchRipple={true}
              disabled={
                next
                  ? currentSliderSlide === totalSlides - 1
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

        <CardActions className="justify-center flex-[1_1_auto] mt-5">
          {currentSliderSlide === totalSlides - 1 && (
            <Tooltip title="Submit Quiz" arrow>
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
                disabled={Object.keys(errors).length > 0 || isSubmitting}
                type="submit"
                endIcon={isSubmitting ? <LoadingButton /> : null}
              >
                Submit
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Cancel Quiz" arrow>
            <Button
              sx={{
                width: '100%',
                maxWidth: 'fit-content',
                padding: '0.5rem 1rem',
              }}
              variant="contained"
              color="error"
              onClick={() => {
                setOpenCancelModal(true);
              }}
            >
              <Cancel />
            </Button>
          </Tooltip>
        </CardActions>
      </form>

      {confirmSubmitAnswer()}
    </>
  );
};

export default Quiz;
