import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getElementHeight } from '../../../lib/helpers/utils';
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
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import styles from './Assessment.module.css';
import { useSearchParams } from 'react-router-dom';
import { useAuthUserStore } from '../../../lib/store';

const Assessment = () => {
  const { userId } = useAuthUserStore((state) => ({
    userId: state.user?.userId,
  }));
  const { data, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ['quizzes'],
    queryFn: getQuizzesWithQuestions,
  });
  const [value, setValue] = useState<{ [key: string]: string }>({});
  const [selectedQuiz, setSelectedQuiz] = useState<
    objective_questions[] | null
  >(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get('topicId');

  // Dynamically set the height of the bullet to match the height of the content
  useLayoutEffect(() => {
    getElementHeight(styles, '.MuiPaper-root');

    return () => {
      getElementHeight(styles, '.MuiPaper-root');
    };
  }, [data]);

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

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: answer } = event.target;
    setValue((prevValue) => ({
      ...prevValue,
      [name]: answer,
    }));
  };

  return (
    <>
      {!selectedQuiz &&
        data.map((quiz) => (
          <Box
            key={quiz.id}
            component={'section'}
            className="flex flex-col gap-y-3 mt-10"
          >
            <Card className="flex p-4">
              <Box component="span" className={styles['list__item--bullet']}>
                <Box
                  component={'span'}
                  className={styles['list__item--bullet-inner']}
                />
              </Box>

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
                        setSearchParams({
                          topicId: quiz.topic_id.toString(),
                          userId: userId?.toString() || '',
                        });
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

      {selectedQuiz &&
        selectedQuiz.map((questions) => (
          <form key={questions.id} className="flex flex-col gap-y-3 mt-10">
            <Card className="flex flex-wrap md:flex-nowrap p-4">
              <Box component="span" className={styles['list__item--bullet']}>
                <Box
                  component={'span'}
                  className={styles['list__item--bullet-inner']}
                />
              </Box>

              <Box className="flex flex-wrap w-full ml-2 gap-[1%] items-center">
                <Box className="flex-[1_1_55%]">
                  <CardHeader subheader={questions.question} />
                </Box>
              </Box>

              <CardContent className="flex flex-col gap-3 w-full">
                <Card
                  className="flex flex-col gap-3 p-4"
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '5px',
                  }}
                >
                  <CardHeader subheader="Choose the correct answer" />
                  <Box className="flex flex-col items-start gap-1">
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

            {questions.id === selectedQuiz[selectedQuiz.length - 1].id && (
              <CardActions className="justify-end flex-[1_1_auto]">
                <Button
                  sx={{
                    width: '100%',
                    background: 'green',
                  }}
                  variant="contained"
                >
                  Submit
                </Button>
              </CardActions>
            )}
          </form>
        ))}
    </>
  );
};

export default Assessment;
