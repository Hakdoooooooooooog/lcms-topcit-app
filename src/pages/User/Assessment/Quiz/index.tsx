import { ArrowBack, ArrowForward, Cancel } from '@mui/icons-material';
import Slider from 'react-slick';
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
import { slickSettings, styledModal } from '../../../../lib/constants';
import { objective_questions } from '../../../../lib/Types/quiz';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import {
  useModalStore,
  useQuizStore,
  useSliderStore,
} from '../../../../lib/store';
import useAssessmentMutation from '../../../../lib/hooks/useAssessmentMutation';
import styles from './Quiz.module.css';
import { LoadingButton } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { showToast } from '../../../../components/ui/Toasts';

type QuizProps = {
  selectedQuiz: objective_questions[];
  startTransition: (callback: () => void) => void;
  topicId: string;
};

const Quiz = ({ selectedQuiz, startTransition, topicId }: QuizProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const assessmentMutation = useAssessmentMutation();

  // Form Validation
  const schema = useMemo(() => {
    return z.object(
      selectedQuiz.reduce((values, quiz) => {
        values[quiz.id.toString()] = z
          .string()
          .min(1, 'Please select an answer');

        return values;
      }, {} as { [key: string]: z.ZodType<string> }),
    );
  }, [selectedQuiz]);

  // References Values
  const sliderRef = useRef<Slider>(null);

  // State Managements
  const { currentSlide, totalSlides, setTotalSlides, setCurrentSlide } =
    useSliderStore((state) => ({
      currentSlide: state.currentSlide,
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
    values: selectedQuiz.reduce((values, quiz) => {
      values[quiz.id.toString()] = '';

      return values;
    }, {} as { [key: string]: string }),
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (selectedQuiz.length > 0) {
      setCurrentSlide(0);
      setTotalSlides(selectedQuiz.length - 1);
    }
  }, [selectedQuiz]);

  useEffect(() => {
    if (isSubmitSuccessful || !topicId) {
      startTransition(() => {
        reset();
        setValue({});
        setIsBlocked(false);
        setOpenTutorialModal(false);
        setCurrentSlide(0);
        setTotalSlides(0);
        setSearchParams({}, { replace: true });
      });
    }
  }, [isSubmitSuccessful, startTransition, topicId]);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value: answer } = event.target;
      setValue({ ...value, [name]: answer });
    },
    [setValue, value],
  );

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (
      !searchParams.get('topicId') ||
      !searchParams.get('userId') ||
      !searchParams.get('quizId')
    ) {
      return;
    }

    try {
      await assessmentMutation.mutateAsync({
        assessmentData: data,
      });
    } catch (error: any) {
      showToast('An error occurred' + error.message, 'error');
    }
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
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

      <form onSubmit={handleSubmit(onSubmit)} className="slider-container">
        <Slider
          {...slickSettings}
          ref={sliderRef}
          afterChange={(index) => {
            setCurrentSlide(index);
          }}
          dotsClass={`slick-dots ${styles.dots}`}
        >
          {selectedQuiz.map((questions, index) => (
            <Card key={index} className="sm:!flex justify-between gap-5 p-4">
              <Box className="flex flex-[1_1_100%] ml-2 gap-[1%] items-center">
                <Box className="flex-[1_1_55%]">
                  <CardHeader subheader={questions.question} />
                </Box>
              </Box>

              <CardContent className="flex flex-col flex-[1_1_auto] gap-3 w-full sm:max-h-fit">
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
                      {questions.multiple_choice_options.map((option) => (
                        <RadioGroup
                          key={option.id}
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
                            control={<Radio disableTouchRipple disableRipple />}
                            label={option.option_text}
                          />
                        </RadioGroup>
                      ))}
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
                disabled={currentSlide <= 0 || currentSlide > totalSlides}
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
                disabled={currentSlide <= 0 || currentSlide > totalSlides}
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
            onClick={() => {
              setOpenCancelModal(true);
            }}
          >
            <Cancel />
          </Button>
        </CardActions>
      </form>

      {confirmSubmitAnswer()}
    </>
  );
};

export default Quiz;
