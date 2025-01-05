import { PencilSquareIcon } from '@heroicons/react/16/solid';
import {
  Add,
  ArrowBackRounded,
  ArrowForwardRounded,
} from '@mui/icons-material';
import {
  Box,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Pagination,
  PaginationItem,
  Tooltip,
} from '@mui/material';
import { ChapterWithSubChapter } from '../../../../../lib/Types/chapters';
import { SetStateAction, useMemo } from 'react';
import { useModalStore } from '../../../../../lib/store';
import { handlePaginatedItems } from '../../../../../lib/helpers/utils';

type SubChaptersProps = {
  Chapters: ChapterWithSubChapter[];
  styles: any;
  setFileData: React.Dispatch<
    SetStateAction<{
      chapterId?: string;
      topicId: string;
      fileName?: string;
      title: string;
      subtitle: string;
    }>
  >;
  topicId: string;
  setAddData: React.Dispatch<
    SetStateAction<{
      topicId?: string;
      chapterId?: string;
      chapterNum?: string;
      topicNum?: string;
      subChapterNum?: string;
      parentChapterNum?: string;
    }>
  >;
  handleButtonType: (buttonType: string) => void;
};

const SubChapters = ({
  Chapters,
  styles,
  setFileData,
  setAddData,
  topicId,
  handleButtonType,
}: SubChaptersProps) => {
  const { handleEditContentModal, handleAddContentModal } = useModalStore(
    (state) => ({
      handleAddContentModal: state.handleAddContentModal,
      handleEditContentModal: state.handleEditContentModal,
    }),
  );

  const { page, setPage, totalPages, currentItems } =
    handlePaginatedItems<ChapterWithSubChapter>({
      items: Chapters,
      itemPerPage: 5,
    });

  const MemoizedCurrentItems = useMemo(() => {
    return currentItems;
  }, [currentItems]);

  return (
    <>
      <AccordionDetails
        classes={{
          root: styles.accordionDetails,
        }}
      >
        <Box component={'div'} className="flex items-end justify-between">
          {Chapters && Chapters.length > 0 && (
            <Stack spacing={2}>
              <Pagination
                size={window.innerWidth < 768 ? 'small' : 'medium'}
                shape="circular"
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    slots={{
                      previous: ArrowBackRounded,
                      next: ArrowForwardRounded,
                    }}
                  />
                )}
                count={totalPages}
                page={page}
                onChange={(_event, value) => setPage(value)}
                showFirstButton
                showLastButton
              />
            </Stack>
          )}

          <Tooltip title="Add Chapter">
            <Button
              variant="contained"
              sx={{
                background: 'green',
              }}
              onClick={() => {
                setAddData({
                  topicId: topicId,
                  chapterNum: (Chapters.length + 1).toString(),
                }); // Add topicId to addData
                handleButtonType('add-chapter');
                handleAddContentModal();
              }}
              aria-describedby="add-chapter"
              endIcon={<Add />}
            >
              Add Chapter
            </Button>
          </Tooltip>
        </Box>
      </AccordionDetails>

      {Chapters && Chapters.length > 0
        ? MemoizedCurrentItems.map((chapter) => (
            <Box key={chapter.id}>
              <AccordionDetails
                classes={{
                  root: styles.accordionDetails,
                }}
              >
                {chapter.SubChapters && chapter.SubChapters.length > 0 && (
                  <Accordion key={chapter.id}>
                    <AccordionSummary
                      aria-controls={`panel1a-content-1`}
                      id={`panel1a-header-1`}
                      expandIcon={
                        <Add
                          sx={{
                            color: 'green',
                          }}
                        />
                      }
                    >
                      <Typography variant="h5">
                        Chapter {chapter.chapter_number.toString()}:{' '}
                        {chapter.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {chapter.SubChapters.map((subChapter) => (
                        <Card key={subChapter.title}>
                          <CardContent
                            classes={{
                              root: styles.cardContent,
                            }}
                          >
                            <Box
                              component={'section'}
                              className="grid grid-cols-2 items-center relative"
                            >
                              <Box
                                component={'div'}
                                className="col-span-1 ml-5"
                              >
                                <Typography variant="h5">
                                  Sub Chapter {subChapter.id.toString()}:{' '}
                                  {subChapter.title}
                                </Typography>
                              </Box>
                              <Box
                                component={'div'}
                                className="col-span-1 justify-self-end"
                              >
                                <Tooltip title="Edit Sub Chapter">
                                  <Button
                                    onClick={() => {
                                      setFileData({
                                        chapterId: chapter.id.toString(),
                                        topicId: topicId,
                                        fileName: Array.isArray(
                                          subChapter.FileChapter,
                                        )
                                          ? subChapter.FileChapter[0].file_name
                                          : '',
                                        title: chapter.title,
                                        subtitle: chapter.sub_title,
                                      });
                                      handleButtonType('edit-chapter');
                                      handleEditContentModal();
                                    }}
                                  >
                                    <PencilSquareIcon className="h-6 w-6 text-green-800" />
                                  </Button>
                                </Tooltip>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                )}
                <Card>
                  <CardContent
                    classes={{
                      root: styles.cardContent,
                    }}
                  >
                    <Box
                      component={'section'}
                      className="grid grid-cols-2 items-center relative"
                    >
                      <Box component={'div'} className="col-span-1 ml-5">
                        <Typography variant="h5">
                          Chapter {chapter.chapter_number.toString()}:{' '}
                          {chapter.title}
                        </Typography>
                      </Box>
                      <Box
                        component={'div'}
                        className="col-span-1 justify-self-end"
                      >
                        <Tooltip title="Edit Chapter">
                          <Button
                            onClick={() => {
                              setFileData({
                                chapterId: chapter.id.toString(),
                                topicId: topicId,
                                fileName: Array.isArray(chapter.FileChapter)
                                  ? chapter.FileChapter[0].file_name
                                  : '',
                                title: chapter.title,
                                subtitle: chapter.sub_title,
                              });
                              handleButtonType('edit-chapter');
                              handleEditContentModal();
                            }}
                          >
                            <PencilSquareIcon className="h-6 w-6 text-green-800" />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box component={'div'} className="flex justify-end mt-3">
                      <Tooltip title="Add Sub Chapter">
                        <Button
                          variant="contained"
                          sx={{
                            background: 'green',
                          }}
                          onClick={() => {
                            setAddData({
                              topicId: topicId,
                              chapterId: chapter.id.toString(),
                              subChapterNum: (
                                chapter.SubChapters.length + 1
                              ).toString(),
                              parentChapterNum: chapter.id.toString(),
                            }); // Add topicId and chapterId to addData
                            handleButtonType('add-sub-chapter');
                            handleAddContentModal();
                          }}
                          endIcon={<Add />}
                          aria-describedby="add-sub-chapter"
                          disabled={true}
                        >
                          Add Sub Chapter
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Box>
          ))
        : null}
    </>
  );
};

export default SubChapters;
