import { PDFChapterChunkUpload } from "../../api/Admin/chapter";
import { showToast } from "../../components/ui/Toasts";

interface FileChunk extends File {
  chunk: ArrayBuffer;
  index: number;
  totalChunks: number;
  fileName: string;
  mimeType: string;
  originalFileName?: string;
}

export const handleUpload = async (file: File) => {
  if (!file) return;

  const chunkSize = 1024 * 1024; // 1 MB chunk size
  const fileReader = new FileReader();
  const chunks: FileChunk[] = [];

  const readBlob = (start: number) => {
    const blobSlice = file.slice(start, start + chunkSize);
    fileReader.readAsArrayBuffer(blobSlice);

    fileReader.onload = async (event) => {
      chunks.push({
        chunk: event.target?.result as ArrayBuffer,
        index: chunks.length,
        totalChunks: Math.ceil(file.size / chunkSize),
        fileName: file.name,
        mimeType: file.type,
        originalFileName: file.name,
        lastModified: file.lastModified,
        name: file.name,
        webkitRelativePath: file.webkitRelativePath,
        size: file.size,
        type: file.type,
        arrayBuffer: function (): Promise<ArrayBuffer> {
          throw new Error("Function not implemented.");
        },
        slice: function (_start?: number, _end?: number, _contentType?: string): Blob {
          throw new Error("Function not implemented.");
        },
        stream: function (): ReadableStream<Uint8Array> {
          throw new Error("Function not implemented.");
        },
        text: function (): Promise<string> {
          throw new Error("Function not implemented.");
        },
      });

      const nextStart = start + chunkSize;
      if (nextStart < file.size) {
        readBlob(nextStart);
      } else {
        // Upload chunks to server
        for (const chunk of chunks) {
          const formData = new FormData();
          const chunkFile = new File([chunk.chunk], chunk.fileName, { type: chunk.mimeType });
          formData.append("chapterFile", chunkFile);
          formData.append("chunkIndex", chunk.index.toString());
          formData.append("totalChunks", chunk.totalChunks.toString());

          try {
            const res = await PDFChapterChunkUpload(formData);

            if (res.message === "File uploaded and merged successfully") {
              showToast(res.message, "success");
            }
          } catch (error: any) {
            showToast(error.message, "error");
          }
        }
      }
    };
  };

  readBlob(0);
};
