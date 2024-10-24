import {
  Modal,
  Box,
  Typography,
  Button,
  Input,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import PDFViewer from "../../PDFViewer";
import { styledModal } from "../../../../lib/constants";
import { useForm } from "react-hook-form";
import { EditPDFSchema } from "../../../../lib/schema/DataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "../../Toasts";
import { updateChapter } from "../../../../api/Admin/chapter";
import { EditPDF } from "../../../../lib/Types/chapters";

const EditContentModal = ({
  open,
  handleClose,
  editData: { topicId, chapterId, fileName, title, subtitle },
  buttonType,
}: {
  open: boolean;
  handleClose: () => void;
  editData: {
    topicId: string;
    chapterId?: string;
    fileName?: string;
    title: string;
    subtitle: string;
  };
  buttonType: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditPDF>({
    resolver: zodResolver(EditPDFSchema),
    values: { title, subtitle, chapterFile: "" },
  });
  const [fileData, setfileData] = useState<File | null>(null);

  const onSubmit = (buttonType: string) => async (data: any) => {
    if (buttonType === "edit-chapter") {
      const formData = new FormData();
      const editChapter = data as EditPDF;

      formData.append("chapterFile", editChapter.chapterFile[0]);
      formData.append("title", editChapter.title || "");
      formData.append("subtitle", editChapter.subtitle || "");

      try {
        if (chapterId !== undefined) {
          const res = await updateChapter(formData, chapterId, topicId);
          if (res.message === "Chapter updated") {
            showToast("Chapter Updated Successfully", "success");
            handleClose();
          } else {
            showToast(res.message, "error");
          }
        }
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file?.length === 1) {
      setfileData(file[0]);
    }
  };

  useEffect(() => {
    setfileData(null);
  }, [open]);

  const formInputs = useMemo(() => {
    return (
      <>
        {buttonType === "edit-chapter" && (
          <>
            <Box component={"div"} className="flex-1">
              <Typography id="Edit PDF" sx={{ mb: 2 }}>
                Edit PDF:
              </Typography>
              <form onSubmit={handleSubmit(onSubmit(buttonType))} encType="multipart/form-data">
                <Box component={"div"} className="flex flex-col gap-y-5">
                  <FormControl>
                    <Input
                      type="file"
                      {...register("chapterFile")}
                      id="chapterFile"
                      onChange={handleFileChange}
                    />
                    {errors.chapterFile && (
                      <p className="text-red-500">{errors.chapterFile?.message?.toString()}</p>
                    )}
                  </FormControl>

                  <FormControl>
                    <InputLabel htmlFor="title">Title:</InputLabel>
                    <OutlinedInput {...register("title")} id="title" label={"Title:"} />
                    {errors.title && <p className="text-red-500">{errors.title?.message}</p>}
                  </FormControl>

                  <FormControl>
                    <InputLabel htmlFor="subtitle">Sub Title:</InputLabel>
                    <OutlinedInput {...register("subtitle")} id="subtitle" label={"Sub Title:"} />
                    {errors.subtitle && <p className="text-red-500">{errors.subtitle?.message}</p>}
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: "green",
                    }}
                    className={isSubmitting ? "cursor-not-allowed" : ""}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Box>

            <Box component={"div"} className="flex gap-x-5">
              <Box component={"div"} className="flex-1">
                <Typography id="Preview" sx={{ mt: 2 }}>
                  Preview:
                </Typography>
                <PDFViewer
                  topic_id={topicId}
                  chapterId={chapterId || ""}
                  fileName={fileData ? fileData.name : fileName || ""}
                  previewFile={fileData || undefined}
                />
              </Box>
            </Box>
          </>
        )}
      </>
    );
  }, [buttonType, fileData, errors, isSubmitting, handleSubmit, onSubmit, title, subtitle]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-pdf-content"
      aria-describedby="edit-pdf-content"
    >
      <Box sx={styledModal}>{formInputs}</Box>
    </Modal>
  );
};

export default EditContentModal;
