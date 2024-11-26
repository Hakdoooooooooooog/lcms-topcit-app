// Hooks
import { useState, useTransition, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSearchFilter from '../../../../lib/hooks/useSearchFilter';
import { useSearchStore } from '../../../../lib/store';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';

// Components & Types
import { getAllTopics } from '../../../../api/User/topicsApi';
import { Topic } from '../../../../lib/Types/topics';
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
import { EyeIcon } from '@heroicons/react/16/solid';

const Syllabus = () => {
  // Topics
  const { data, isLoading } = useQuery<Topic[]>({
    queryKey: ['Topics'],
    queryFn: () => getAllTopics(),
  });

  // Selected Topic
  const [selectedTopic, setSelectedTopic] = useState<Topic[] | null>(null);

  // Transition
  const [isPending, startTransition] = useTransition();

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams({});
  const topicId = searchParams.get('topicId');

  // Search
  const search = useSearchStore((state) => state.search);
  const { isSearching, filteredItems } = useSearchFilter<Topic>(data, search);

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<Topic>({
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

  if (isLoading || !data) {
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
              {currentItems.map((topic) => (
                <Card key={topic.topictitle}>
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
              ))}

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
