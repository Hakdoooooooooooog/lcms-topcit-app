// Hooks
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useSearchFilter from '../../../../lib/hooks/useSearchFilter';
import { useSearchStore } from '../../../../lib/store';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';

// Components & Types
import { Topic } from '../../../../lib/Types/topics';
import { getTopicsWithAllChapters } from '../../../../api/User/topicsApi';
import { EyeIcon } from '@heroicons/react/16/solid';
import { Card, CardHeader, Button, Stack, Pagination } from '@mui/material';
import {
  ChaptersWithSubChaptersWithinTopic,
  ChapterWithSubChapter,
} from '../../../../lib/Types/chapters';
import { LoadingContentScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { AccordionChapters } from '../../../../components/ui/PaginatedItems/AccordionItems';

const TopcitContents = () => {
  // Topics
  const { data, isLoading } = useQuery<ChaptersWithSubChaptersWithinTopic[]>({
    queryKey: ['TopcitTopics'],
    queryFn: () => getTopicsWithAllChapters(),
  });

  // Selected Topic
  const [selectedChaptersWithinTopicId, setSelectedChaptersWithinTopicId] =
    useState<ChapterWithSubChapter[] | undefined>();

  // Search Params
  const [searchParams, setSearchParams] = useSearchParams({});
  const topicId = searchParams.get('topicId');

  // Search
  const search = useSearchStore((state) => state.search);
  const { isSearching, filteredItems: filteredTopic } =
    useSearchFilter<ChaptersWithSubChaptersWithinTopic>(data, search);

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<Topic>({
      items: filteredTopic,
    });

  // Filtered Topic
  const chaptersContent = useMemo<ChapterWithSubChapter[] | undefined>(() => {
    if (!topicId) return filteredTopic?.flatMap((topic) => topic.chapters);

    return data?.find((topic) => Number(topic.id) === Number(topicId))
      ?.chapters;
  }, [topicId, filteredTopic]);

  useEffect(() => {
    if (topicId) return setSelectedChaptersWithinTopicId(chaptersContent);

    setSelectedChaptersWithinTopicId(undefined);
  }, [chaptersContent, topicId]);

  const renderLoadingScreen = useCallback(() => {
    if (isSearching) {
      return <LoadingContentScreen />;
    }

    return null;
  }, [isSearching]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {renderLoadingScreen()}

      {selectedChaptersWithinTopicId &&
        selectedChaptersWithinTopicId.length === 0 && (
          <h1>No chapters found</h1>
        )}

      {!selectedChaptersWithinTopicId && !topicId && (
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

      {selectedChaptersWithinTopicId && topicId && (
        <AccordionChapters
          chapters={selectedChaptersWithinTopicId}
          search={search}
        />
      )}
    </>
  );
};

export default TopcitContents;
