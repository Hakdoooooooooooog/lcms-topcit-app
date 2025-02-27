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
import { Topics } from '../../../../lib/Types/topics';
import { getTopicsWithAllChapters } from '../../../../api/User/topicsApi';
import { EyeIcon, LockClosedIcon } from '@heroicons/react/16/solid';
import {
  Card,
  CardHeader,
  Button,
  Stack,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  ChaptersWithSubChaptersWithinTopic,
  ChapterWithSubChapter,
} from '../../../../lib/Types/chapters';
import { LoadingContentScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { AccordionChapters } from '../../../../components/ui/PaginatedItems/AccordionItems';
import { UserProgress } from '../../../../lib/Types/user';
import { getUserProgress } from '../../../../api/User/userApi';

const TopcitContents = () => {
  const { data: userProgress, isLoading: isProgressLoading } =
    useQuery<UserProgress>({
      queryKey: ['UserProgress'],
      queryFn: () => getUserProgress(),
    });

  // Topics
  const { data: topicContents, isLoading } = useQuery<
    ChaptersWithSubChaptersWithinTopic[]
  >({
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
    useSearchFilter<ChaptersWithSubChaptersWithinTopic>(topicContents, search);

  // Pagination
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<Topics>({
      items: filteredTopic,
    });

  // Filtered Topic
  const chaptersContent = useMemo<ChapterWithSubChapter[] | undefined>(() => {
    if (!topicId) return filteredTopic?.flatMap((topic) => topic.chapters);

    return topicContents?.find((topic) => topic.id === Number(topicId))
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

  if (isLoading || !topicContents) {
    return <LoadingContentScreen />;
  }

  if (isProgressLoading || !userProgress) {
    return <LoadingContentScreen />;
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
          {currentItems.map((topic) => {
            if (
              userProgress.user_progress?.curr_topic_id !== undefined &&
              userProgress.user_progress?.curr_topic_id >= topic.id
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
                      <Tooltip
                        title="You need to complete all chapters and have 70% passing score in the quiz on the previous topic to unlock this topic"
                        arrow
                      >
                        <LockClosedIcon
                          className="h-5 w-5 mr-5
                          text-red-500"
                        />
                      </Tooltip>
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
              showFirstButton
              showLastButton
            />
          </Stack>
        </>
      )}

      {selectedChaptersWithinTopicId && userProgress.user_progress && (
        <AccordionChapters
          chapters={selectedChaptersWithinTopicId}
          currentChapterId={
            userProgress.user_progress.curr_chap_id?.toString() || ''
          }
          userCompletedChapterProgress={userProgress.user_completed_chapters}
          search={search}
        />
      )}
    </>
  );
};

export default TopcitContents;
