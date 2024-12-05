import { useEffect, useMemo, useTransition } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardHeader,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import styles from './accordionItem.module.css';
import { Add, CheckCircle } from '@mui/icons-material';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import { ChapterWithSubChapter } from '../../../../lib/Types/chapters';
import PDFViewer from '../../PDFViewer';
import { LoadingContentScreen } from '../../LoadingScreen/LoadingScreen';
import { useAccordionStore } from '../../../../lib/store';
import { useQueries } from '@tanstack/react-query';
import { getChapterPDFFiles } from '../../../../api/User/chaptersApi';
import { LockClosedIcon } from '@heroicons/react/16/solid';
import { UserCompletedChapters } from '../../../../lib/Types/user';

export const AccordionChapter = (props: {
  filteredItems: ChapterWithSubChapter[] | undefined;
  userCompletedChapterProgress: UserCompletedChapters[];
  currentChapterId: string;
}) => {
  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    handleChanges: state.handleChanges,
  }));
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<ChapterWithSubChapter>({
      items: props.filteredItems,
    });
  const [isPending, startTransition] = useTransition();

  const queries = useQueries({
    queries: currentItems.map((chapter) => {
      return {
        queryKey: ['PDFChapterFiles', chapter.id, chapter.topic_id],
        queryFn: () =>
          getChapterPDFFiles(
            chapter.id.toString(),
            chapter.topic_id.toString(),
          ),
        refetchOnWindowFocus: false,
        enabled: props.currentChapterId >= chapter.id.toString(),
      };
    }),
  });

  const isCompleted = (chapterId: bigint) => {
    return props.userCompletedChapterProgress.some(
      (chapterProgress) =>
        Number(chapterProgress.chapter_id) === Number(chapterId),
    );
  };

  const isUnlocked = (chapterId: bigint) => {
    return Number(props.currentChapterId) >= Number(chapterId);
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [currentItems]);

  // useEffect(() => {
  //   if (
  //     typeof expanded === 'string' &&
  //     parseInt(expanded.split('-').pop() || '0') >= 5 &&
  //     parseInt(expanded.split('-').pop() || '0') % 5 === 0
  //   ) {
  //     startTransition(() => {
  //       setPage((prevPage) => prevPage + 1);
  //     });
  //   }
  // }, [expanded]);

  const memoizedAccordion = useMemo(() => {
    return (
      currentItems &&
      currentItems.map((chapter, index) => {
        if (isUnlocked(chapter.id)) {
          return (
            <Accordion
              key={chapter.id}
              expanded={expanded === `panel1a-chapterHeader-${chapter.id}`}
              onChange={handleChanges(`panel1a-chapterHeader-${chapter.id}`)}
              sx={
                expanded === `panel1a-chapterHeader-${chapter.id}`
                  ? {
                      backgroundColor: 'rgba(0, 128, 0, 0.1)',
                      marginTop: '1rem',
                    }
                  : { marginTop: '1rem', transition: 'background-color 0.5s' }
              }
              slotProps={{ transition: { unmountOnExit: true } }}
            >
              <AccordionSummary
                aria-controls={`panel1a-content-${chapter.id}-${chapter.title}`}
                id={`panel1a-header-${chapter.id}-${chapter.title}`}
                expandIcon={
                  <Add
                    sx={{
                      color: 'green',
                    }}
                  />
                }
                className={`${
                  isCompleted(chapter.id)
                    ? '!bg-[#0080001a] hover:bg-[#0080001a]'
                    : ''
                }`}
              >
                Chapter {chapter.chapter_number}: {chapter.title}{' '}
                {isCompleted(chapter.id) ? (
                  <CheckCircle className="h-5 w-5 self-center ml-2 text-green-900" />
                ) : null}
              </AccordionSummary>
              <AccordionDetails
                classes={{
                  root: styles.accordionDetailStyles,
                }}
              >
                <PDFViewer
                  data={{
                    url: queries[index].data?.url || '',
                    chapterId: chapter.id.toString(),
                    isCompleted: isCompleted(chapter.id),
                  }}
                  isLoading={queries[index].isLoading}
                  fileName={
                    Array.isArray(chapter.FileChapter) &&
                    chapter.FileChapter.length > 0
                      ? chapter.FileChapter[0].file_name
                      : ''
                  }
                />

                {/* {chapter.SubChapters &&
                    chapter.SubChapters.slice(0, 1).map((subChapter) => (
                      <Button
                        key={subChapter.id}
                        variant="contained"
                        sx={{
                          marginTop: '1rem',
                          backgroundColor: 'green',
                          color: 'white',
                        }}
                      >
                        <NavLink
                          to={`${subChapter.title}`}
                          style={{ color: 'white' }}
                        >
                          Next Chapter {subChapter.chapter_number} -{' '}
                          {subChapter.title}
                        </NavLink>
                      </Button>
                    ))} */}
              </AccordionDetails>
            </Accordion>
          );
        } else {
          return (
            <Card
              key={chapter.id}
              sx={{
                marginTop: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardHeader
                classes={{
                  action: 'text-green-800 !self-center',
                }}
                title={`Chapter ${chapter.chapter_number}: ${chapter.title}`}
                action={
                  <Button variant="outlined" color="primary" disabled>
                    <LockClosedIcon className="h-5 w-5" />
                  </Button>
                }
              />
            </Card>
          );
        }
      })
    );
  }, [currentItems, page, expanded, queries]);

  return (
    <>
      {isPending ? <LoadingContentScreen /> : memoizedAccordion}
      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Pagination
          size={window.innerWidth < 600 ? 'small' : 'medium'}
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
  );
};

export const AccordionTopic = (props: {
  filteredItems: ChapterWithSubChapter[] | undefined;
}) => {
  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    handleChanges: state.handleChanges,
  }));
  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<ChapterWithSubChapter>({
      items: props.filteredItems,
    });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [currentItems]);

  const memoizedAccordion = useMemo(() => {
    return (
      currentItems &&
      currentItems.map((chapter) => {
        return (
          <Accordion
            key={chapter.id}
            expanded={expanded === `panel1a-chapterHeader-${chapter.id}`}
            onChange={handleChanges(`panel1a-chapterHeader-${chapter.id}`)}
            sx={
              expanded === `panel1a-chapterHeader-${chapter.id}`
                ? {
                    backgroundColor: 'rgba(0, 128, 0, 0.1)',
                    marginTop: '1rem',
                  }
                : { marginTop: '1rem', transition: 'background-color 0.5s' }
            }
            slotProps={{ transition: { unmountOnExit: true } }}
          >
            <AccordionSummary
              aria-controls={`panel1a-content-${chapter.id}-${chapter.title}`}
              id={`panel1a-header-${chapter.id}-${chapter.title}`}
              expandIcon={
                <Add
                  sx={{
                    color: 'green',
                  }}
                />
              }
            >
              Chapter {chapter.chapter_number}: {chapter.title}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              {chapter.sub_title && (
                <Typography variant={'body1'} gutterBottom>
                  {chapter.sub_title}
                </Typography>
              )}

              {/* {chapter.SubChapters &&
                    chapter.SubChapters.slice(0, 1).map((subChapter) => (
                      <Button
                        key={subChapter.id}
                        variant="contained"
                        sx={{
                          marginTop: '1rem',
                          backgroundColor: 'green',
                          color: 'white',
                        }}
                      >
                        <NavLink
                          to={`${subChapter.title}`}
                          style={{ color: 'white' }}
                        >
                          Next Chapter {subChapter.chapter_number} -{' '}
                          {subChapter.title}
                        </NavLink>
                      </Button>
                    ))} */}
            </AccordionDetails>
          </Accordion>
        );
      })
    );
  }, [currentItems, page, expanded]);

  return (
    <>
      {isPending ? <LoadingContentScreen /> : memoizedAccordion}
      <Stack spacing={2} sx={{ marginTop: '2rem' }}>
        <Pagination
          size={window.innerWidth < 600 ? 'small' : 'medium'}
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
  );
};
