import { useEffect, useMemo, useTransition } from 'react';
import { pdfjs } from 'react-pdf';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardHeader,
  Pagination,
  Stack,
} from '@mui/material';
import styles from './accordionItem.module.css';
import { Add } from '@mui/icons-material';
import { handlePaginatedItems } from '../../../../lib/helpers/utils';
import { NavLink } from 'react-router-dom';
import { ChapterWithSubChapter } from '../../../../lib/Types/chapters';
import PDFViewer from '../../PDFViewer';
import { LoadingContentScreen } from '../../LoadingScreen/LoadingScreen';
import { useAccordionStore } from '../../../../lib/store';
import { useQueries } from '@tanstack/react-query';
import { getChapterPDFFiles } from '../../../../api/User/chaptersApi';
import { LockClosedIcon } from '@heroicons/react/16/solid';

export const AccordionChapter = (props: {
  filteredItems: ChapterWithSubChapter[] | undefined;
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
        queryKey: [
          'PDFChapterFiles',
          chapter.id.toString(),
          chapter.topic_id.toString(),
        ],
        queryFn: () =>
          getChapterPDFFiles(
            chapter.id.toString(),
            chapter.topic_id.toString(),
          ),
        refetchOnWindowFocus: false,
      };
    }),
  });

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [currentItems]);

  const memoizedAccordion = useMemo(() => {
    return (
      <>
        {currentItems.map((chapter, index) => {
          if (props.currentChapterId >= chapter.id.toString()) {
            return (
              <Accordion
                key={chapter.id}
                expanded={expanded === `panel1a-chapterHeader-${index}`}
                onChange={handleChanges(`panel1a-chapterHeader-${index}`)}
                sx={
                  expanded === `panel1a-chapterHeader-${index}`
                    ? {
                        backgroundColor: 'rgba(0, 128, 0, 0.1)',
                        marginTop: '1rem',
                      }
                    : { marginTop: '1rem', transition: 'background-color 0.5s' }
                }
              >
                <AccordionSummary
                  aria-controls={`panel1a-content-${index}`}
                  id={`panel1a-header-${index}`}
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
                  classes={{
                    root: styles.accordionDetailStyles,
                  }}
                >
                  <PDFViewer
                    data={queries[index].data}
                    isLoading={queries[index].isLoading}
                    fileName={
                      Array.isArray(chapter.FileChapter) &&
                      chapter.FileChapter.length > 0
                        ? chapter.FileChapter[0].file_name
                        : ''
                    }
                    PDFversion={pdfjs.version}
                  />

                  {chapter.SubChapters &&
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
                    ))}
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
                    <Button variant="contained" color="primary">
                      <LockClosedIcon className="h-5 w-5" />
                    </Button>
                  }
                />
              </Card>
            );
          }
        })}
      </>
    );
  }, [currentItems, page, expanded, queries]);

  return (
    <>
      {isPending ? <LoadingContentScreen /> : memoizedAccordion}
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
  );
};
