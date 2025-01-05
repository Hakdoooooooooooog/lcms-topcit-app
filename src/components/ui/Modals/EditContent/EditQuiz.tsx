import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import {
  addQuizSchemaStage1,
  addQuizSchemaStage2,
} from '../../../../lib/schema/DataSchema';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  addQuizFormInputs,
  multipleChoiceOptions,
  styledModal,
} from '../../../../lib/constants';
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import { z } from 'zod';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import LoadingScreen, {
  LoadingButton,
} from '../../LoadingScreen/LoadingScreen';
import { QuizWithQuestions } from '../../../../lib/Types/quiz';
import { showToast } from '../../Toasts';
import { updateQuiz } from '../../../../api/Admin/quiz';
import useEditContentMutation from '../../../../lib/hooks/useEditContentMutation';

type FormValues = {
  numofQuestions?: number;
  [key: string]: any;
};

const EditQuizModal = (props: {
  data: { topicId: string; quiz: { quizId: string }; state: string };
  selectedQuiz: QuizWithQuestions[] | undefined;
  modalOpen: boolean;
  handleClose: () => void;
}) => {
  // States
  const [formValues, setFormValues] = useState<FormValues>({});
  const [currentStage, setCurrentStage] = useState(1);

  // React Transition
  const [isPending, startTransition] = useTransition();

  // Constants
  const numofMultipleChoiceOptions = 4;

  const stagedSchema = () => {
    if (currentStage === 1) {
      return addQuizSchemaStage1;
    } else if (currentStage === 2) {
      return addQuizSchemaStage2;
    }

    return z.object({});
  };

  const handleDefaultCorrectAnswer = useMemo(() => {
    return (questionIndex: number) => {
      const correctAnswer =
        props.selectedQuiz?.[0].objective_questions[questionIndex]
          .correct_answer;

      const correctAnswerIndex = props.selectedQuiz?.[0].objective_questions[
        questionIndex
      ].multiple_choice_options.findIndex(
        (option) => option.option_text === correctAnswer,
      );

      return correctAnswerIndex !== undefined
        ? (correctAnswerIndex + 1).toString()
        : '';
    };
  }, [props.selectedQuiz]);

  const handleQuestionType = useMemo(() => {
    return (questionIndex: number) => {
      const questionType =
        props.selectedQuiz?.[0].objective_questions[questionIndex]
          .question_type;

      return questionType !== undefined ? questionType : 'Multiple Choice';
    };
  }, [props.selectedQuiz]);

  useEffect(() => {
    if (props.data.state === 'edit' && props.selectedQuiz) {
      const selectedQuiz = props.selectedQuiz[0];
      startTransition(() => {
        setFormValues((prev) => ({
          ...prev,
          topicId: props.data.topicId,
          quizTitle: selectedQuiz.title,
          maxAttempts: selectedQuiz.max_attempts?.toString() || '3',
          numofQuestions: selectedQuiz.objective_questions.length.toString(),
          quizQuestions: selectedQuiz.objective_questions.map((question) => ({
            quizId: selectedQuiz.id.toString(),
            question: question.question,
            questionType: handleQuestionType(
              selectedQuiz.objective_questions.indexOf(question),
            ),
            multipleChoiceOptions: question.multiple_choice_options.map(
              (option) => ({
                optionText: option.option_text,
              }),
            ),
            correctAnswer: handleDefaultCorrectAnswer(
              selectedQuiz.objective_questions.indexOf(question),
            ),
          })),
        }));
      });
    }
  }, [props.data.state, props.selectedQuiz]);

  useEffect(() => {
    if (!props.modalOpen) {
      startTransition(() => {
        setCurrentStage(1);
        setFormValues({});
      });
    }
  }, [props.modalOpen]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    trigger,
    getValues,
  } = useForm<z.infer<ReturnType<typeof stagedSchema>>>({
    resolver: zodResolver(stagedSchema()),
    values: formValues,
  });

  const handleNextStage = async () => {
    const isValid = await trigger();

    if (isValid) {
      const currentValues = getValues();
      startTransition(() => {
        setCurrentStage((prev) => prev + 1);
        setFormValues((prev) => ({
          ...prev,
          ...currentValues,
        }));
      });
    }
  };

  const handlePreviousStage = () => {
    const currentValues = getValues();
    startTransition(() => {
      setCurrentStage((prev) => prev - 1);
      setFormValues((prev) => ({
        ...prev,
        ...currentValues,
      }));
    });
  };

  const questionsForm = useMemo(() => {
    return Array.from({
      length: (formValues.numofQuestions as number) || 1,
    }).map((_, index) => (
      <Box key={index} component="div" className="flex flex-col gap-3 px-14">
        <Typography variant="h6" component="h2">
          Quiz Question {index + 1}:
        </Typography>

        {addQuizFormInputs.stage2.map((input, innerIndex) => (
          <FormControl key={`question-${index}-${innerIndex}-${input.name}`}>
            {input.name !== 'question' && (
              <InputLabel
                htmlFor={
                  `quizQuestions.${index}.${input.name}-input` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
              >
                {input.label}
              </InputLabel>
            )}

            {input.name === 'question' ? (
              <Tooltip title="Enter the question here">
                <TextareaAutosize
                  id={
                    `quizQuestions.${index}.${input.name}-input` as keyof z.infer<
                      ReturnType<typeof stagedSchema>
                    >
                  }
                  {...register(
                    `quizQuestions.${index}.${input.name}` as keyof z.infer<
                      ReturnType<typeof stagedSchema>
                    >,
                  )}
                  placeholder={input.placeholder}
                  className="w-full p-2"
                  style={{ resize: 'none' }}
                />
              </Tooltip>
            ) : input.type === 'correctAnswerSelection' ? (
              <Select
                id={
                  `quizQuestions.${index}.${input.name}-input` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
                {...register(
                  `quizQuestions.${index}.${input.name}` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >,
                )}
                defaultValue={handleDefaultCorrectAnswer(index)}
                label="Correct Answer"
              >
                {Array.from({
                  length: numofMultipleChoiceOptions,
                }).map((_, innerIndex) => (
                  <MenuItem
                    key={
                      `quizQuestions.${index}.${input.name}-input-${innerIndex}` as keyof z.infer<
                        ReturnType<typeof stagedSchema>
                      >
                    }
                    value={`${innerIndex + 1}`}
                  >
                    Option {innerIndex + 1}
                  </MenuItem>
                ))}
              </Select>
            ) : input.type === 'questionTypeSelection' ? (
              <Select
                id={
                  `quizQuestions.${index}.${input.name}-input` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
                {...register(
                  `quizQuestions.${index}.${input.name}` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >,
                )}
                defaultValue={handleQuestionType(index)}
                label="Question Type"
              >
                <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
              </Select>
            ) : (
              <Input
                id={
                  `quizQuestions.${index}.${input.name}-input` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
                {...register(
                  `quizQuestions.${index}.${input.name}` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >,
                )}
                type={input.type}
                placeholder={input.placeholder}
                disabled={input.disabled}
              />
            )}

            {(errors as FieldErrors<z.infer<typeof addQuizSchemaStage2>>)
              .quizQuestions?.[index]?.[
              input.name as keyof z.infer<
                typeof addQuizSchemaStage2
              >['quizQuestions'][0]
            ] && (
              <span className="text-red-500">
                {
                  (errors as FieldErrors<z.infer<typeof addQuizSchemaStage2>>)
                    .quizQuestions?.[index]?.[
                    input.name as keyof z.infer<
                      typeof addQuizSchemaStage2
                    >['quizQuestions'][0]
                  ]?.message
                }
              </span>
            )}
          </FormControl>
        ))}

        <Typography variant="h6" component="h2">
          Options:
        </Typography>

        {Array.from({ length: numofMultipleChoiceOptions }).map(
          (_, outerIndex) =>
            multipleChoiceOptions.map((option, innerIndex) => (
              <FormControl
                key={`optionQuestion-${index}-${innerIndex}-${outerIndex}`}
              >
                <InputLabel
                  htmlFor={
                    `quizQuestions.${index}.multipleChoiceOptions.${outerIndex}.${option.name}-option` as keyof z.infer<
                      ReturnType<typeof stagedSchema>
                    >
                  }
                >
                  Option {outerIndex + 1}
                </InputLabel>
                <Input
                  id={
                    `quizQuestions.${index}.multipleChoiceOptions.${outerIndex}.${option.name}-option` as keyof z.infer<
                      ReturnType<typeof stagedSchema>
                    >
                  }
                  {...register(
                    `quizQuestions.${index}.multipleChoiceOptions.${outerIndex}.${option.name}` as keyof z.infer<
                      ReturnType<typeof stagedSchema>
                    >,
                  )}
                  type={option.type}
                  placeholder={option.placeholder}
                />

                {(errors as FieldErrors<z.infer<typeof addQuizSchemaStage2>>)
                  .quizQuestions?.[index]?.multipleChoiceOptions?.[
                  outerIndex
                ]?.[
                  option.name as keyof z.infer<
                    typeof addQuizSchemaStage2
                  >['quizQuestions'][0]['multipleChoiceOptions'][0]
                ] && (
                  <span className="text-red-500">
                    {
                      (
                        errors as FieldErrors<
                          z.infer<typeof addQuizSchemaStage2>
                        >
                      ).quizQuestions?.[index]?.multipleChoiceOptions?.[
                        outerIndex
                      ]?.[
                        option.name as keyof z.infer<
                          typeof addQuizSchemaStage2
                        >['quizQuestions'][0]['multipleChoiceOptions'][0]
                      ]?.message
                    }
                  </span>
                )}
              </FormControl>
            )),
        )}
      </Box>
    ));
  }, [errors, register]);

  const editQuizMutation = useEditContentMutation({
    fn: async (formValues: FormValues) => updateQuiz(formValues),
    QueryKey: 'TOPCITQuizzes',
  });

  const onSubmit = async (data: any) => {
    Object.assign(formValues, data);

    if (props.data.state === 'edit') {
      try {
        await editQuizMutation.mutateAsync(formValues);
        props.handleClose();
      } catch (error: any) {
        showToast(
          'There was an error updating the quiz:' + error.message,
          'error',
        );
      }
    } else {
      console.log('Delete Quiz');
    }
  };

  const renderEditQuizForm = useMemo(() => {
    if (currentStage === 1) {
      return (
        <>
          <Typography variant="h6" component="h2">
            Quiz Details:
          </Typography>
          {addQuizFormInputs.stage1.map((input) => (
            <FormControl key={input.name}>
              <InputLabel
                htmlFor={
                  `${input.name}-quiz-details` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
              >
                {input.label}
              </InputLabel>
              <Input
                id={
                  `${input.name}-quiz-details` as keyof z.infer<
                    ReturnType<typeof stagedSchema>
                  >
                }
                {...register(
                  input.name as keyof z.infer<ReturnType<typeof stagedSchema>>,
                )}
                type={input.type}
                placeholder={input.placeholder}
                disabled={input.disabled}
              />

              {errors[
                input.name as keyof z.infer<ReturnType<typeof stagedSchema>>
              ] && (
                <span className="text-red-500">
                  {
                    (
                      errors[
                        input.name as keyof z.infer<
                          ReturnType<typeof stagedSchema>
                        >
                      ] as any
                    )?.message
                  }
                </span>
              )}
            </FormControl>
          ))}
        </>
      );
    }

    if (currentStage === 2) {
      return (
        <Carousel
          autoPlay={false}
          animation="slide"
          navButtonsAlwaysVisible={true}
          indicatorIconButtonProps={{
            style: {
              color:
                errors && Object.keys(errors).length > 0 && currentStage === 2
                  ? 'red'
                  : 'gray',
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: 'black',
            },
          }}
          sx={{
            minHeight: '45rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {questionsForm}
        </Carousel>
      );
    }
  }, [currentStage, errors, register, stagedSchema, formValues]);

  const handleFormInputs = useMemo(() => {
    return props.data.state === 'edit' ? (
      <>
        {renderEditQuizForm}
        <Box className="flex gap-3 w-full justify-evenly">
          {currentStage > 1 && (
            <Button
              onClick={handlePreviousStage}
              variant="contained"
              color="secondary"
            >
              <ArrowBack />
            </Button>
          )}

          <Button onClick={props.handleClose} variant="contained" color="error">
            Cancel
          </Button>

          {currentStage < 2 && (
            <Button
              onClick={handleNextStage}
              variant="contained"
              color="primary"
            >
              <ArrowForward />
            </Button>
          )}

          {currentStage === 2 && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              endIcon={isSubmitting ? <LoadingButton /> : null}
            >
              Edit Quiz
            </Button>
          )}
        </Box>
      </>
    ) : (
      <>
        <Typography variant="h6" component="h2">
          Delete Quiz
        </Typography>
        <Typography variant="body1" component="p">
          This feature is not yet implemented.
        </Typography>
      </>
    );
  }, [props.data.state, currentStage, renderEditQuizForm, isSubmitting]);

  return (
    <Modal open={props.modalOpen} onClose={props.handleClose}>
      <Box
        component={'div'}
        sx={{
          ...styledModal,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        className="sm:max-w-3xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {isPending ? (
            <Box className="flex justify-center items-center max-h-96">
              <LoadingScreen />
            </Box>
          ) : (
            handleFormInputs
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default EditQuizModal;
