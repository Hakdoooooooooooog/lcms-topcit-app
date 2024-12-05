// Hooks
import { useQuery } from '@tanstack/react-query';
import { useSearchStore } from '../../../../lib/store';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';

// Components & Types
import { getTopicsWithAllChapters } from '../../../../api/User/topicsApi';
import { ChaptersWithSubChaptersWithinTopic } from '../../../../lib/Types/chapters';
import { AccordionTopics } from '../../../../components/ui/PaginatedItems/AccordionItems';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Stack,
} from '@mui/material';
import { LoadingContentScreen } from '../../../../components/ui/LoadingScreen/LoadingScreen';
import { Add } from '@mui/icons-material';

const Syllabus = () => {
  const { data, isLoading } = useQuery<ChaptersWithSubChaptersWithinTopic[]>({
    queryKey: ['AllTopicsWithChapters'],
    queryFn: () => getTopicsWithAllChapters(),
  });

  const { search } = useSearchStore((state) => ({
    search: state.search,
  }));

  const {
    page: topicPage,
    setPage: setTopicPage,
    totalPages: totalTopicPages,
    currentItems: currentTopics,
  } = handlePaginatedItems<ChaptersWithSubChaptersWithinTopic>({
    items: data || [],
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLoading ? (
        <LoadingContentScreen />
      ) : (
        currentTopics &&
        currentTopics.map((topic: ChaptersWithSubChaptersWithinTopic) => (
          <Accordion
            key={topic.id}
            defaultExpanded={topic.id.toString() === '1'}
            sx={
              topic.id.toString() === '1'
                ? {
                    backgroundColor: 'rgba(0, 128, 0, 0.1)',
                    marginTop: '1rem',
                  }
                : { marginTop: '1rem', transition: 'background-color 0.5s' }
            }
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary
              expandIcon={
                <Add
                  sx={{
                    color: 'green',
                  }}
                />
              }
              className="!bg-[#0080001a] hover:bg-[#0080001a]"
            >
              Topic {topic.id.toString()} : {topic.topictitle}
            </AccordionSummary>

            <AccordionDetails
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <AccordionTopics topics={topic.chapters} search={search} />
            </AccordionDetails>
          </Accordion>
        ))
      )}
      <Stack
        spacing={2}
        sx={{
          marginTop: '1rem',
        }}
      >
        <Pagination
          count={totalTopicPages}
          page={topicPage}
          onChange={(_, page) => setTopicPage(page)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default Syllabus;
