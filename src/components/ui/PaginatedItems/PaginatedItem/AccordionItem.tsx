import { useEffect, useMemo, useTransition } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Pagination,
  Stack,
} from "@mui/material";
import styles from "./accordionItem.module.css";
import { Add } from "@mui/icons-material";
import { handlePaginatedItems } from "../../../../lib/helpers/utils";
import { NavLink } from "react-router-dom";
import { ChapterWithSubChapter } from "../../../../lib/Types/chapters";
import PDFViewer from "../../PDFViewer";
import { LoadingContentScreen } from "../../LoadingScreen/LoadingScreen";
import { useAccordionStore } from "../../../../lib/store";

export const AccordionChapter = (props: { filteredItems: ChapterWithSubChapter[] }) => {
  const { expanded, handleChanges } = useAccordionStore((state) => ({
    expanded: state.expanded,
    handleChanges: state.handleChanges,
  }));

  const { page, setPage, totalPages, currentItems } = handlePaginatedItems<ChapterWithSubChapter>({
    items: props.filteredItems,
  });
  const [isPending, startTransition] = useTransition();

  // // Dynamically set the height of the bullet to match the height of the content
  // useEffect(() => {
  //   getElementHeight(styles, ".MuiAccordionDetails-root");
  // }, [currentItems]);

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
                    color: "green",
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
              {/* <Box component="span" className={styles["list__item--bullet"]}>
                <Box component={"span"} className={styles["list__item--bullet-inner"]} />
              </Box> */}

              <Box component={"div"} sx={{ flexGrow: 1, maxHeight: "600px" }}>
                <PDFViewer
                  chapterId={chapter.id.toString()}
                  topic_id={chapter.topic_id.toString()}
                  fileName={chapter.FileChapter[0].file_name}
                />

                {chapter.SubChapters &&
                  chapter.SubChapters.slice(0, 1).map((subChapter) => (
                    <Button
                      key={subChapter.id}
                      variant="contained"
                      sx={{
                        marginTop: "1rem",
                        backgroundColor: "green",
                        color: "white",
                      }}
                    >
                      <NavLink to={`${subChapter.title}`} style={{ color: "white" }}>
                        Next Chapter {subChapter.chapter_number} - {subChapter.title}
                      </NavLink>
                    </Button>
                  ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    );
  }, [currentItems, page]);

  return (
    <>
      {isPending ? <LoadingContentScreen /> : memoizedAccordion}
      <Stack spacing={2} sx={{ marginTop: "2rem" }}>
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
