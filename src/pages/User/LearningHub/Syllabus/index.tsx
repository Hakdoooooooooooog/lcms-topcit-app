// Hooks
import { useState, useTransition, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSearchFilter from '../../../../lib/hooks/useSearchFilter';
import { useSearchStore } from '../../../../lib/store';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';

// Components & Types
import { getAllTopics } from '../../../../api/User/topicsApi';
import { Topics } from '../../../../lib/Types/topics';
import {
  Card,
  CardHeader,
  Button,
  Stack,
  Pagination,
  CardContent,
  Typography,
} from '@mui/material';
import { LoadingContentScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { EyeIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import { getUserProgress } from '../../../../api/User/userApi';
import { UserProgress } from '../../../../lib/Types/user';

const Syllabus = () => {
  const { data: userProgress, isLoading: isProgressLoading } =
    useQuery<UserProgress>({
      queryKey: ['UserProgress'],
      queryFn: () => getUserProgress(),
    });

  // Topics
  const { data, isLoading } = useQuery<Topics[]>({
    queryKey: ['Topics'],
    queryFn: () => getAllTopics(),
  });

  // Selected Topic
  const [selectedTopic, setSelectedTopic] = useState<Topics[] | null>(null);

  // Transition
  const [isPending, startTransition] = useTransition();

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams({});
  const topicId = searchParams.get('topicId');

  // Search
  const search = useSearchStore((state) => state.search);
  const { isSearching, filteredItems } = useSearchFilter<Topics>(data, search);

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<Topics>({
      items: filteredItems,
    });

  const topicContent = useMemo(() => {
    if (!filteredItems) return [];

    const topic = filteredItems
      .filter((value) => {
        return Number(value.id) === Number(topicId);
      })
      .flatMap((topic) => {
        return topic;
      });

    return topic;
  }, [topicId, filteredItems]);

  useEffect(() => {
    if (topicId) return setSelectedTopic(topicContent);

    setSelectedTopic(null);
  }, [topicContent, topicId]);

  if (isLoading || !data || isProgressLoading || !userProgress) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isPending || isSearching ? (
        <LoadingContentScreen />
      ) : (
        <>
          {!selectedTopic && (
            <>
              {currentItems.map((topic) => {
                if (
                  userProgress.user_progress?.curr_topic_id !== undefined &&
                  userProgress.user_progress.curr_topic_id >= topic.id
                ) {
                  return (
                    <Card
                      key={topic.topictitle}
                      sx={{
                        marginTop: '1rem',
                      }}
                    >
                      <CardHeader
                        classes={{
                          action: 'text-green-800 !self-center',
                        }}
                        title={`Topic ${topic.id}: ${topic.topictitle}`}
                        action={
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setSearchParams({
                                topicId: topic.id.toString(),
                              });
                            }}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Button>
                        }
                      />
                    </Card>
                  );
                } else {
                  return (
                    <Card
                      key={topic.id}
                      sx={{
                        marginTop: '1rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CardHeader
                        classes={{
                          action: 'text-green-800 !self-center',
                        }}
                        title={`Topic ${topic.id}: ${topic.topictitle}`}
                        action={
                          <Button variant="outlined" color="primary" disabled>
                            <LockClosedIcon className="h-5 w-5" />
                          </Button>
                        }
                      />
                    </Card>
                  );
                }
              })}

              <Stack spacing={2} sx={{ marginTop: '2rem' }}>
                <Pagination
                  size="large"
                  shape="rounded"
                  count={totalPages}
                  page={page}
                  onChange={(_event, value) =>
                    startTransition(() => {
                      setPage(value);
                    })
                  }
                />
              </Stack>
            </>
          )}

          {selectedTopic && selectedTopic.length > 0 && (
            <Card>
              <CardHeader
                title={`Topic ${selectedTopic[0].id}: ${selectedTopic[0].topictitle}`}
              />
              <CardContent>
                <p>{selectedTopic[0].description}</p>
              </CardContent>
            </Card>
          )}

          {selectedTopic && selectedTopic.length === 0 && (
            <Typography variant={'body1'}>No topic found</Typography>
          )}
        </>
      )}
    </>
  );
};

export default Syllabus;
