import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Pagination,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import LinearProgressWithLabel from '../../../../components/ui/ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { getUserProgress } from '../../../../api/User/userApi';
import { useMemo, useState, useTransition } from 'react';
import { getTopicsWithAllChapters } from '../../../../api/User/topicsApi';
import { ChaptersWithSubChaptersWithinTopic } from '../../../../lib/Types/chapters';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import { Info } from '@mui/icons-material';
import {
  LoadingContentScreen,
  LoadingDataScreen,
} from '../../../../components/ui/LoadingScreen/LoadingScreen';
import useSearchFilter from '../../../../lib/hooks/useSearchFilter';
import { useSearchStore } from '../../../../lib/store';

const Contents = () => {
  const { data: userProgress, isLoading } = useQuery({
    queryKey: ['userProgressAssessment'],
    queryFn: getUserProgress,
  });
  const { data: totalChapters, isLoading: isLoadingTotalChapters } = useQuery<
    ChaptersWithSubChaptersWithinTopic[]
  >({
    queryKey: ['totalQuiz'],
    queryFn: getTopicsWithAllChapters,
  });

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const search = useSearchStore((state) => state.search);

  const progress = useMemo(() => {
    const array = [];
    if (!userProgress || isLoading) {
      return [];
    }

    if (!userProgress.user_progress?.curr_chap_id || !totalChapters) {
      return [];
    }

    let currentTopicId = userProgress.user_progress.curr_topic_id;
    let currentUserChapterId = userProgress.user_completed_chapters
      .filter(
        (chapter) =>
          chapter.completion_status === 'completed' && chapter.topic_id,
      )
      .reduce((acc: { [key: number]: number }, chapter) => {
        const topicId = chapter.topic_id;
        if (!acc[topicId]) {
          acc[topicId] = 0;
        }
        acc[topicId]++;
        return acc;
      }, {});

    // Check if there are any topics that have not been completed, default to 0
    totalChapters.forEach((topic) => {
      const topicId = topic.id;
      if (!currentUserChapterId[topicId]) {
        currentUserChapterId[topicId] = 0;
      }
    });

    const totalChapterPerTopic = totalChapters.map((topic) => {
      return {
        topicId: topic.id,
        topicName: topic.topictitle,
        totalChapters: topic.chapters.filter((chapter) => chapter.topic_id)
          .length,
      };
    });

    for (let i = 0; i < totalChapterPerTopic.length; i++) {
      let topicId = totalChapterPerTopic[i].topicId;

      if (currentTopicId >= topicId && currentUserChapterId[topicId] !== 0) {
        array.push({
          topicId: topicId,
          topicName: totalChapterPerTopic[i].topicName,
          totalChapters: totalChapterPerTopic[i].totalChapters,
          currentChapter: currentUserChapterId[topicId],
          progress:
            (currentUserChapterId[topicId] /
              totalChapterPerTopic[i].totalChapters) *
            100,
        });
      } else {
        array.push({
          topicId: topicId,
          topicName: totalChapterPerTopic[i].topicName,
          totalChapters: totalChapterPerTopic[i].totalChapters,
          currentChapter: 0,
          progress: 0,
        });
      }
    }

    return array;
  }, [userProgress, isLoading, totalChapters, isLoadingTotalChapters]);

  const { isSearching, filteredItems } = useSearchFilter(progress, search);

  const { page, setPage, totalPages, currentItems } = handlePaginatedItems({
    items: filteredItems,
    itemPerPage: 1,
  });

  const handleOpen = () => {
    setOpen(!open);
  };

  if (!userProgress || isLoading || !totalChapters || isLoadingTotalChapters) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isPending ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
          }}
        >
          <LoadingContentScreen />
        </Box>
      ) : (
        <>
          {isSearching ? (
            <LoadingDataScreen />
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {currentItems &&
                currentItems.map((item) => (
                  <Card
                    key={item.topicId}
                    sx={{
                      padding: '15px',
                      position: 'relative',
                    }}
                  >
                    <CardHeader
                      title={`Topic ${item.topicId}: ${item.topicName}`}
                    />
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <LinearProgressWithLabel
                          value={item.progress}
                          sx={{
                            height: 30,
                            borderRadius: 10,
                          }}
                        />

                        <Tooltip
                          title="More Info"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                          }}
                        >
                          <CardActions>
                            <Button size="small" onClick={handleOpen}>
                              <Info />
                            </Button>
                          </CardActions>
                        </Tooltip>

                        {open && (
                          <>
                            {item.topicId <=
                            (userProgress.user_progress?.curr_topic_id || 0) ? (
                              <Card sx={{ mt: 4 }}>
                                <CardContent>
                                  <Typography variant="h6" component="h2">
                                    Status :{' '}
                                    <span>
                                      {item.progress === 100
                                        ? 'Completed'
                                        : 'Not Completed'}
                                    </span>
                                  </Typography>

                                  <Typography variant="h6" component="h2">
                                    Current Chapter :{' '}
                                    <span>
                                      {item.progress === 100
                                        ? item.totalChapters
                                        : progress.find(
                                            (chapter) =>
                                              chapter.topicId === item.topicId,
                                          )?.currentChapter}
                                    </span>
                                  </Typography>

                                  <Typography variant="h6" component="h2">
                                    Total Chapters :{' '}
                                    <span>
                                      {item.totalChapters
                                        ? item.totalChapters
                                        : 'Not Available'}
                                    </span>
                                  </Typography>
                                </CardContent>
                              </Card>
                            ) : (
                              <Card sx={{ mt: 2 }}>
                                <CardContent>
                                  <Typography variant="h6" component="h2">
                                    Status :{' '}
                                    <span>
                                      {item.progress === 100
                                        ? 'Completed'
                                        : 'Not Completed'}
                                    </span>
                                  </Typography>

                                  <Typography variant="h6" component="h2">
                                    Current Chapter : <span>0</span>
                                  </Typography>

                                  <Typography variant="h6" component="h2">
                                    Total Chapters :{' '}
                                    <span>
                                      {item.totalChapters
                                        ? item.totalChapters
                                        : 'Not Available'}
                                    </span>
                                  </Typography>
                                </CardContent>
                              </Card>
                            )}
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </>
      )}

      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Pagination
          size="large"
          shape="rounded"
          count={totalPages}
          page={page}
          onChange={(_event, value) =>
            startTransition(() => {
              setPage(value);
              setOpen(false);
            })
          }
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default Contents;
