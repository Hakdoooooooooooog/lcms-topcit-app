import { useEffect, useState, memo, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Tooltip,
} from '@mui/material';
import { LoadingDataScreen } from '../LoadingScreen/LoadingScreen';
import { ArrowForward, Download } from '@mui/icons-material';
import PDFControls from './PDFControls';
import styles from './PDFViewer.module.css';
import { showToast } from '../Toasts';
import { options, styledModal } from '../../../lib/constants';
import { updateUserChapterProgress } from '../../../api/User/userApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccordionStore } from '../../../lib/store';
import { useLocation, useSearchParams } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFViewer = memo(
  ({
    data,
    isLoading,
    fileName,
    previewFile,
  }: {
    data:
      | { url: string; chapterId?: string; isCompleted?: boolean }
      | undefined;
    isLoading: boolean;
    fileName: string;
    previewFile?: File | string;
  }) => {
    const location = useLocation().pathname;
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const topicId = searchParams.get('topicId');
    const { setExpanded } = useAccordionStore((state) => ({
      setExpanded: state.setExpanded,
    }));

    const updateMutation = useMutation({
      mutationFn: ({
        chapterId,
        topicId,
      }: {
        chapterId: string;
        topicId: string;
      }) => updateUserChapterProgress(chapterId, topicId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['UserProgress'],
        });
        queryClient.invalidateQueries({
          queryKey: ['PDFChapterFiles'],
        });
        showToast(data.message, 'success');
        setExpanded(`panel1a-chapterHeader-${data.curr_chap_id}`);
      },
      onError: () => {
        showToast('An error occurred', 'error');
      },
    });
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number | undefined>(undefined);
    const [loadProgress, setLoadProgress] = useState<number>(0);
    const [file, setFile] = useState<File | string | null>(null);
    const [successChapterModal, setSuccessChapterModal] =
      useState<boolean>(true);

    useEffect(() => {
      if (data && !isLoading) {
        setFile(data.url);
      }
    }, [data, isLoading]);

    useEffect(() => {
      if (previewFile instanceof File && previewFile) {
        setFile(previewFile);
        setPageNumber(1);
      } else {
        setPageNumber(1);
        setNumPages(undefined);
      }
    }, [previewFile]);

    useEffect(() => {
      if (pageNumber === numPages && !data?.isCompleted) {
        setSuccessChapterModal(true);
      }
    }, [pageNumber, data?.isCompleted]);

    const memoiozedOptions = useMemo(() => {
      return options;
    }, []);

    const onDocumentLoadSuccess = ({
      numPages,
    }: {
      numPages: number;
    }): void => {
      setNumPages(numPages);
    };

    const onDocumentLoadError = (error: Error): void => {
      showToast('Error loading PDF: ' + error.message, 'error');
    };

    const handleDownload = () => {
      if (file) {
        const link = document.createElement('a');
        link.href = typeof file === 'string' ? file : URL.createObjectURL(file);
        link.target = '_blank'; // Open in a new tab
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof file !== 'string') {
          URL.revokeObjectURL(link.href);
        }
      }
    };

    const handleUpdateChapterUserProgress = useCallback(
      async (chapterId?: string) => {
        if (!chapterId) return;

        try {
          await updateMutation.mutateAsync({
            chapterId,
            topicId: topicId || '',
          });
        } catch (error: any) {
          showToast(
            'Error updating chapter progress: ' + error.message,
            'error',
          );
        }
      },
      [],
    );

    const handleSuccessChapterModal = useCallback(
      (path: string) => {
        return (
          path !== '/admin' &&
          numPages &&
          data &&
          numPages === pageNumber &&
          !data.isCompleted && (
            <Modal
              open={successChapterModal}
              aria-labelledby="success-chapter-modal"
              aria-describedby="success-chapter-modal"
            >
              <Box
                component={'div'}
                sx={{
                  ...styledModal,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  textAlign: 'center',
                }}
                className="sm:max-w-3xl"
              >
                <Card className="p-4 bg-green-100 text-green-800">
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <h2 className="text-lg sm:text-2xl font-bold">
                      Congratulations!
                    </h2>
                    <p className="text-sm sm:text-lg">
                      You have successfully completed the chapter. You can now
                      move on to the next chapter or download the chapter for
                      offline viewing.
                    </p>
                    <Box
                      component={'img'}
                      src="/confetti.png"
                      alt="Success"
                      sx={{
                        width: '75%',
                        height: '75%',
                        objectFit: 'cover',
                        borderRadius: '5px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e0e0e0',
                      }}
                    />
                  </CardContent>

                  <CardActions
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        setPageNumber(1);
                        handleUpdateChapterUserProgress(data.chapterId);
                        setSuccessChapterModal(false);
                      }}
                      endIcon={<ArrowForward />}
                    >
                      Next Chapter
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Modal>
          )
        );
      },
      [numPages, pageNumber, data, successChapterModal],
    );

    if (!data || isLoading) {
      return <LoadingDataScreen />;
    }

    return (
      <Box component={'div'} className="relative py-12 w-full">
        {file === 'placeholder' ? (
          <>
            <Box
              component={'div'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
              }}
            >
              <img
                src="/locked_chapter.png"
                alt="Locked Chapter"
                className="h-auto object-contain rounded-lg"
                width={
                  window.innerWidth > 768
                    ? window.innerWidth * 0.35
                    : window.innerWidth * 0.75
                }
              />
            </Box>
          </>
        ) : (
          <>
            <Document
              className={styles.pdfDocument}
              options={memoiozedOptions}
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              onLoadProgress={({ loaded, total }) =>
                setLoadProgress(Math.round((loaded / total) * 100))
              }
              loading={
                <Box component={'div'} className={styles.pdfLoading}>
                  Loading PDF... {loadProgress}%
                </Box>
              }
            >
              {file && (
                <Page
                  loading={
                    <Box component={'div'} className={styles.pdfLoading}>
                      <LoadingDataScreen />
                    </Box>
                  }
                  width={
                    typeof window !== 'undefined' && window.innerWidth > 768
                      ? window.innerWidth * 0.35
                      : window.innerWidth * 0.75
                  }
                  className="!bg-transparent"
                  pageNumber={numPages ? pageNumber : 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              )}
            </Document>

            {!isLoading ? (
              <>
                {data && data.isCompleted && (
                  <Tooltip title="Download Chapter" arrow>
                    <Button
                      variant="outlined"
                      onClick={handleDownload}
                      sx={{
                        position: 'absolute',
                        zIndex: 1,
                        top: '0',
                        right: '0',
                      }}
                    >
                      <Download />
                    </Button>
                  </Tooltip>
                )}

                {numPages && numPages > 1 && (
                  <Box component={'div'} className={styles.pdfControls}>
                    <PDFControls
                      props={{
                        pageNumber,
                        setPageNumber,
                        numPages,
                      }}
                    />
                  </Box>
                )}

                {handleSuccessChapterModal(location)}
              </>
            ) : null}
          </>
        )}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps === nextProps;
  },
);

export default PDFViewer;
