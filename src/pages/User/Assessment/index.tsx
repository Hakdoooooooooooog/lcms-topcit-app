import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getElementHeight } from "../../../lib/helpers/utils";
import { objective_questions, QuizWithQuestions } from "../../../lib/Types/quiz";
import { getQuizzesWithQuestions } from "../../../api/User/quizApi";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from "@mui/material";
import styles from "./Assessment.module.css";
import { useSearchParams } from "react-router-dom";

const Assessment = () => {
  const { data, isLoading } = useQuery<QuizWithQuestions[]>({
    queryKey: ["quizzes"],
    queryFn: getQuizzesWithQuestions,
  });
  const [selectedQuiz, setSelectedQuiz] = useState<objective_questions[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const topicId = searchParams.get("topicId");

  // Dynamically set the height of the bullet to match the height of the content
  useLayoutEffect(() => {
    getElementHeight(styles, ".MuiPaper-root");

    return () => {
      getElementHeight(styles, ".MuiPaper-root");
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
    if (topicId) setSelectedQuiz(quizContent);
    else setSelectedQuiz(null);
  }, [quizContent, topicId]);

  if (!data || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!selectedQuiz &&
        data.map((quiz) => (
          <Box key={quiz.id} component={"section"} className="flex flex-col gap-y-3 mt-10">
            <Card className="flex p-4">
              <Box component="span" className={styles["list__item--bullet"]}>
                <Box component={"span"} className={styles["list__item--bullet-inner"]} />
              </Box>

              <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
                <Box className="flex-[1_1_55%]">
                  <CardHeader title={`Topic ${quiz.topic_id}`} subheader={quiz.title} />

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
                        width: "100%",
                        background: "green",
                      }}
                      variant="contained"
                      onClick={() => {
                        setSearchParams({ topicId: quiz.topic_id.toString() });
                      }}
                    >
                      Start Assessment
                    </Button>
                    <Button
                      sx={{
                        width: "100%",
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
        selectedQuiz.flatMap((questions) => (
          <Box key={questions.id} component={"section"} className="flex flex-col gap-y-3 mt-10">
            <Card className="flex p-4">
              <Box component="span" className={styles["list__item--bullet"]}>
                <Box component={"span"} className={styles["list__item--bullet-inner"]} />
              </Box>

              <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
                <Box className="flex-[1_1_55%]">
                  <CardHeader subheader={questions.question} />
                </Box>
              </Box>

              <CardContent className="flex flex-col gap-3 w-full">
                <Box component={"ul"} className="flex flex-col gap-y-2">
                  {questions.multiple_choice_options.map((option) => (
                    <Box key={option.id} component={"li"} className="flex gap-1">
                      <input type="radio" name="option" id={option.id.toString()} />
                      <label htmlFor={option.id.toString()}>{option.option_text}</label>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
    </>
  );
};

export default Assessment;
