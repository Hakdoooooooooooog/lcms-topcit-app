import { useMemo, useEffect, useState, memo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button } from '@mui/material';
import { LoadingDataScreen } from '../LoadingScreen/LoadingScreen';
import { Download } from '@mui/icons-material';
import PDFControls from './PDFControls';
import styles from './PDFViewer.module.css';

const PDFViewer = memo(
  ({
    data,
    isLoading,
    fileName,
    previewFile,
    PDFversion,
  }: {
    data: { url: string } | undefined;
    isLoading: boolean;
    fileName: string;
    previewFile?: File | string;
    PDFversion?: string;
  }) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number | undefined>(undefined);
    const [loadProgress, setLoadProgress] = useState<number>(0);
    const [file, setFile] = useState<File | string | null>(null);

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFversion}/pdf.worker.min.js`;

    const options = useMemo(
      () => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFversion}/cmaps/`,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFversion}/standard_fonts`,
      }),
      [PDFversion],
    );

    const onDocumentLoadSuccess = ({
      numPages,
    }: {
      numPages: number;
    }): void => {
      setNumPages(numPages);
    };

    useEffect(() => {
      if (data && !isLoading) {
        setFile(data.url);
        setNumPages(undefined);
      }
    }, [data, isLoading]);

    useEffect(() => {
      if (previewFile instanceof File && previewFile) {
        setFile(previewFile);
        setPageNumber(1);
      } else {
        setPageNumber(1);
      }
    }, [previewFile]);

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

    return (
      <Box component={'div'} className="relative py-12 w-full">
        <Document
          className={styles.pdfDocument}
          options={options}
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            setLoadProgress(Math.round((loaded / total) * 100))
          }
          loading={
            <Box component={'div'} className={styles.pdfLoading}>
              Loading PDF... {loadProgress}%
            </Box>
          }
        >
          <Page
            loading={
              <Box component={'div'} className={styles.pdfLoading}>
                <LoadingDataScreen />
              </Box>
            }
            width={
              window.innerWidth > 768
                ? window.innerWidth * 0.35
                : window.innerWidth * 0.75
            }
            className="!bg-transparent"
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        {!isLoading ? (
          <>
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

            <Box component={'div'} className={styles.pdfControls}>
              <PDFControls
                props={{
                  pageNumber,
                  setPageNumber,
                  numPages: numPages ?? 1,
                }}
              />
            </Box>
          </>
        ) : null}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps === nextProps;
  },
);

export default PDFViewer;
