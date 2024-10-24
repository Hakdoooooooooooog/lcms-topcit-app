import { useMemo, useEffect, useState, memo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useQuery } from "@tanstack/react-query";
import { Box, Button } from "@mui/material";
import { LoadingWithProgress } from "../LoadingScreen/LoadingScreen";
import { getChapterPDFFiles } from "../../../api/User/chaptersApi";
import PDFControls from "./PDFControls";
import styles from "./PDFViewer.module.css";
import { Download } from "@mui/icons-material";

const PDFViewer = memo(
  ({
    topic_id,
    chapterId,
    fileName,
    previewFile,
  }: {
    topic_id: string;
    fileName: string;
    chapterId: string;
    previewFile?: File | string;
  }) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number | undefined>(undefined);
    const [loadProgress, setLoadProgress] = useState<number>(0);

    const [file, setFile] = useState<File | string | null>(null);

    const { data, isLoading } = useQuery<{ url: string }>({
      queryKey: ["ChapterPDFFile", chapterId, topic_id],
      queryFn: () => getChapterPDFFiles(chapterId, topic_id),
      refetchOnWindowFocus: false,
    });

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
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

    useEffect(() => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }, [pdfjs.version]);

    const options = useMemo(
      () => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
      }),
      [pdfjs.version]
    );

    const handleDownload = () => {
      if (file) {
        const link = document.createElement("a");
        link.href = typeof file === "string" ? file : URL.createObjectURL(file);
        link.target = "_blank"; // Open in a new tab
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof file !== "string") {
          URL.revokeObjectURL(link.href);
        }
      }
    };

    return (
      <Box component={"div"} className="relative">
        <Document
          className={styles.pdfDocument}
          options={options}
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) =>
            setLoadProgress(Math.round((loaded / total) * 100))
          }
          loading={
            <Box component={"div"} className={styles.pdfLoading}>
              <LoadingWithProgress value={loadProgress} />
            </Box>
          }
        >
          <Page
            loading={
              <Box component={"div"} className={styles.pdfLoading}>
                <LoadingWithProgress value={loadProgress} />
              </Box>
            }
            key={fileName}
            width={600}
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>

        {!isLoading ? (
          <>
            <Button
              variant="outlined"
              sx={{
                position: "absolute",
                top: "0",
                right: "0",
              }}
              className=" opacity-10 hover:opacity-100 transition-opacity duration-300"
              onClick={handleDownload}
            >
              <Download />
            </Button>

            <Box component={"div"} className={styles.pdfControls}>
              <PDFControls
                props={{
                  pageNumber,
                  setPageNumber,
                  numPages: numPages ?? 1,
                  chapterId,
                }}
              />
            </Box>
          </>
        ) : null}
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.topic_id === nextProps.topic_id &&
      prevProps.chapterId === nextProps.chapterId &&
      prevProps.fileName === nextProps.fileName &&
      prevProps.previewFile === nextProps.previewFile
    );
  }
);

export default PDFViewer;
