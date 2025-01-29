import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Pagination,
  PaginationItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { LoadingDataScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import {
  QuizWithQuestions,
  QuizzesAssessment,
} from '../../../../lib/Types/quiz';
import { PencilSquareIcon } from '@heroicons/react/16/solid';
import {
  Add,
  ArrowBackRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import AddQuizModal from '../../../../components/ui/Modals/AddContent/AddQuiz';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccordionStore } from '../../../../lib/store';
import EditQuizModal from '../../../../components/ui/Modals/EditContent/EditQuiz';
import { getQuizAssessments } from '../../../../api/Admin/quiz';

const AdminQuiz = () => {
  // States
  const [buttonState, setButtonState] = useState<{
    topicId: string;
    quiz: {
      chapterId?: string[];
      quizId: string;
    };
    state: string;
  }>({
    topicId: '',
    quiz: {
      chapterId: [''],
      quizId: '',
    },
    state: '',
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  // Fetch all quizzes with questions
  const { data: quizzes, isLoading } = useQuery<QuizzesAssessment[]>({
    queryKey: ['TOPCITQuizzes'],
    queryFn: getQuizAssessments,
  });

  // Paginate quizzes
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<QuizzesAssessment>({
      items: quizzes,
      itemPerPage: 5,
    });

  // Get expanded state and handle changes
  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    handleChanges: state.handleChanges,
  }));

  const selectedQuiz = useMemo(() => {
    if (!quizzes) return;

    const filteredSelectedQuiz = quizzes
      ?.flatMap((topic) => topic.quiz)
      .filter(
        (quiz) => quiz !== null && quiz.id === Number(buttonState.quiz.quizId),
      ) as QuizWithQuestions[];

    const filteredChapterByQuiz = quizzes.flatMap((topic) => {
      return topic.chapters.filter((chapter) =>
        filteredSelectedQuiz?.some((quiz) => quiz.chapter_id === chapter.id),
      );
    });

    const formattedSelectedQuiz = filteredSelectedQuiz?.map((quiz, index) => {
      return {
        ...quiz,
        chapterId: filteredChapterByQuiz[index].id.toString(),
        chapterTitle: filteredChapterByQuiz[index].title,
      };
    });

    return formattedSelectedQuiz;
  }, [buttonState.quiz.quizId, quizzes]);

  const chaptersSelection = useMemo(() => {
    if (!quizzes) return;

    const filteredChapters = quizzes.flatMap((topic) => {
      return topic.chapters.map((chapter) => {
        return {
          id: chapter.id.toString(),
          topicId: chapter.topic_id.toString(),
          title: chapter.title,
        };
      });
    });

    return filteredChapters;
  }, [selectedQuiz]);

  useEffect(() => {
    if (!modalOpen) {
      setButtonState({
        topicId: '',
        quiz: {
          chapterId: [''],
          quizId: '',
        },
        state: '',
      });
    }
  }, [modalOpen]);

  const memoizedAccordionTopic = useMemo(() => {
    return (
      currentItems &&
      currentItems.map((topic) => {
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
              <Tooltip title="Add Quiz">
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: 'flex-end',
                    background: 'green',
                  }}
                  onClick={() => {
                    setButtonState({
                      ...buttonState,
                      topicId: topic.id.toString(),
                      quiz: {
                        chapterId: topic.quiz?.map((quiz) =>
                          quiz.chapter_id.toString(),
                        ) ?? [''],
                        quizId: ((topic.quiz?.length ?? 0) + 1).toString(),
                      },
                      state: 'add',
                    });
                    setModalOpen(true);
                  }}
                  aria-describedby="add-quiz"
                  endIcon={<Add />}
                >
                  Add Quiz
                </Button>
              </Tooltip>

              {topic.quiz && topic.quiz.length > 0 ? (
                topic.quiz.map((quiz) => (
                  <Box
                    key={quiz.id}
                    component={'section'}
                    sx={{ marginTop: 2 }}
                  >
                    <Card>
                      <CardHeader
                        title={quiz.title}
                        subheader={`Quiz ID: ${quiz.id} | Chapter ID: ${quiz.chapter_id}`}
                      />
                      <CardActions>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={
                            <PencilSquareIcon height={25} width={25} />
                          }
                          onClick={() => {
                            setButtonState({
                              ...buttonState,
                              topicId: topic.id.toString(),
                              quiz: {
                                quizId: quiz.id.toString(),
                              },
                              state: 'edit',
                            });
                            setModalOpen(true);
                          }}
                        >
                          Edit Quiz
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={
                            <PencilSquareIcon height={25} width={25} />
                          }
                          onClick={() => {
                            console.log('Delete Quiz');
                          }}
                        >
                          Delete Quiz
                        </Button>
                      </CardActions>
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
  }, [currentItems, expanded, handleChanges]);

  if (!quizzes || isLoading) {
    return <LoadingDataScreen />;
  }

  return (
    <>
      <Box component={'div'} className="flex flex-col gap-1">
        {memoizedAccordionTopic}

        <Stack spacing={2} sx={{ justifyContent: 'center', marginTop: '1rem' }}>
          <Pagination
            size={window.innerWidth < 768 ? 'small' : 'medium'}
            shape="circular"
            renderItem={(item) => (
              <PaginationItem
                {...item}
                slots={{
                  previous: ArrowBackRounded,
                  next: ArrowForwardRounded,
                }}
              />
            )}
            count={totalPages}
            page={page}
            onChange={(_event, value) => setPage(value)}
            showFirstButton
            showLastButton
          />
        </Stack>
      </Box>

      {modalOpen &&
        (buttonState.state === 'add' ? (
          <AddQuizModal
            data={{
              topicId: buttonState.topicId,
              chapterSelection: chaptersSelection,
              quiz: {
                chapterId: buttonState.quiz.chapterId,
                quizId: buttonState.quiz.quizId,
              },
              state: buttonState.state,
            }}
            modalOpen={modalOpen}
            handleClose={handleClose}
          />
        ) : (
          <EditQuizModal
            data={buttonState}
            modalOpen={modalOpen}
            handleClose={handleClose}
            selectedQuiz={selectedQuiz}
          />
        ))}
    </>
  );
};

export default AdminQuiz;
