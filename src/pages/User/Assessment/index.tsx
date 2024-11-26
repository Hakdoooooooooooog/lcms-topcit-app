import { useEffect, useMemo, useState, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { useSearchParams } from 'react-router-dom';
import { useAuthUserStore } from '../../../lib/store';
import { LoadingContentScreen } from '../../../components/ui/LoadingScreen/LoadingScreen';
import { styledModal } from '../../../lib/constants';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import { ArrowBack } from '@mui/icons-material';

const Assessment = () => {
  // User
  const { userId } = useAuthUserStore((state) => ({
    userId: state.user?.userId,
  }));

  // Quizzes
  const { data, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ['quizzes'],
    queryFn: getQuizzesWithQuestions,
  });

  // State Management for Radio Buttons
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Selected Quiz
  const [selectedQuiz, setSelectedQuiz] = useState<
    objective_questions[] | null
  >(null);

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');

  const quizContent = useMemo(() => {
    if (!data || isLoading) return [];

    const quiz = data
      .filter((value) => {
        return Number(value.topic_id) === Number(topicId);
      })
      .flatMap((quiz) => {
        return quiz.objective_questions;
      });

    return quiz;
  }, [topicId, data]);

  useEffect(() => {
    if (topicId) return setSelectedQuiz(quizContent);

    setSelectedQuiz(null);
  }, [quizContent, topicId]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: answer } = event.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: answer,
    }));
  };

  const handleCancelButtonClick = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleConfirmCancel = () => {
    startTransition(() => {
      setSearchParams({});
    });
    setOpen(false);
  };

  const renderCancelModal = () => (
    <Modal open={open} onClose={handleCloseModal}>
      <Box
        sx={{
          ...styledModal,
          display: 'flex',
          width: '100%',
          maxWidth: '450px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
        }}
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

  if (isLoading || !data) return <LoadingContentScreen />;

  return (
    <>
      {isPending ? (
        <Box className="flex justify-center items-center h-[100vh]">
          <LoadingContentScreen />
        </Box>
      ) : (
        <>
          {!selectedQuiz &&
            data.map((quiz) => (
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
                      <Box className=" flex flex-col gap-3 w-full md:w-[200px] lg:w-[300px]">
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
              <form className="mt-10">
                <Slider
                  dots={true}
                  infinite={false}
                  speed={500}
                  slidesToShow={1}
                  adaptiveHeight={true}
                  arrows={false}
                  // nextArrow={
                  //   <ArrowBack
                  //     sx={{
                  //       rotate: '180deg',
                  //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  //       color: 'white',
                  //       borderRadius: '50%',
                  //       padding: '5px',
                  //       '&:hover': {
                  //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  //         color: 'white',
                  //       },
                  //     }}
                  //   />
                  // }
                  // prevArrow={
                  //   <ArrowBack
                  //     sx={{
                  //       backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  //       color: 'white',
                  //       borderRadius: '50%',
                  //       padding: '5px',
                  //       '&:hover': {
                  //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  //         color: 'white',
                  //       },
                  //     }}
                  //   />
                  // }
                  className="mb-5"
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

                      <CardContent className="flex flex-col flex-[1_1_auto] gap-3 w-full  h-[450px] sm:max-h-fit">
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
                                    value && value[`quiz-${questions.id}`]
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
                                  onChange={handleRadioChange}
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
                <CardActions className="justify-center flex-[1_1_auto]">
                  <Button
                    sx={{
                      width: '100%',
                      maxWidth: '200px',
                      background: 'green',
                    }}
                    variant="contained"
                  >
                    Submit
                  </Button>

                  <Button
                    sx={{
                      width: '100%',
                      maxWidth: '200px',
                    }}
                    variant="contained"
                    color="inherit"
                    onClick={handleCancelButtonClick}
                  >
                    Cancel
                  </Button>
                </CardActions>
              </form>
            </>
          )}

          {renderCancelModal()}
        </>
      )}
    </>
  );
};

export default Assessment;
