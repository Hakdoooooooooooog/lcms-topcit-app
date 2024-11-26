import { useEffect, useMemo, useTransition } from 'react';
import { pdfjs } from 'react-pdf';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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

export const AccordionChapter = (props: {
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
        {currentItems.map((chapter, index) => (
          <Accordion
            key={chapter.id}
            expanded={expanded === `panel1a-chapterHeader-${index}`}
            onChange={handleChanges(`panel1a-chapterHeader-${index}`)}
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
              <Box component={'div'} sx={{ flexGrow: 1, maxHeight: '600px' }}>
                <PDFViewer
                  data={queries[index].data}
                  isLoading={queries[index].isLoading}
                  chapterId={chapter.id.toString()}
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
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
    // }, [currentItems, expanded, page]);
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
