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

    let currentUserChapterId = Number(userProgress.user_progress.curr_chap_id);
    let currentTopicId = Number(userProgress.user_progress.curr_topic_id);

    const totalChapterPerTopic = totalChapters.map((topic) => {
      return {
        topicId: topic.id,
        topicName: topic.topictitle,
        totalChapters: topic.chapters.length,
      };
    });

    for (let i = 0; i < totalChapterPerTopic.length; i++) {
      let topicId = totalChapterPerTopic[i].topicId;

      if (currentTopicId === Number(topicId)) {
        array.push({
          topicId: topicId,
          topicName: totalChapterPerTopic[i].topicName,
          totalChapters: totalChapterPerTopic[i].totalChapters,
          progress:
            (currentUserChapterId / totalChapterPerTopic[i].totalChapters) *
            100,
        });
      } else {
        array.push({
          topicId: topicId,
          topicName: totalChapterPerTopic[i].topicName,
          totalChapters: totalChapterPerTopic[i].totalChapters,
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
            <>
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
                          gap: 5,
                        }}
                      >
                        <LinearProgressWithLabel
                          value={item.progress}
                          sx={{
                            height: 50,
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
                            {Number(item.topicId) <=
                            Number(
                              userProgress.user_progress?.curr_topic_id,
                            ) ? (
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
                                    Current Chapter :{' '}
                                    <span>
                                      {item.progress === 100
                                        ? item.totalChapters
                                        : userProgress.user_progress?.curr_chap_id?.toString()}
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
            </>
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
        />
      </Stack>
    </>
  );
};

export default Contents;
