import { pdfjs } from 'react-pdf';
import {
  Modal,
  Box,
  Typography,
  Button,
  Input,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import PDFViewer from '../../PDFViewer';
import {
  editChapterFormInputs,
  editTopicFormInputs,
  styledModal,
} from '../../../../lib/constants';
import { useForm } from 'react-hook-form';
import {
  EditChapterSchema,
  editTopicSchema,
} from '../../../../lib/schema/DataSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { showToast } from '../../Toasts';
import { updateChapter } from '../../../../api/Admin/chapter';
import { useQuery } from '@tanstack/react-query';
import { getChapterPDFFiles } from '../../../../api/User/chaptersApi';
import { editTopic } from '../../../../api/Admin/topics';
import { z } from 'zod';
import useEditContentMutation from '../../../../lib/hooks/useEditContentMutation';
import { LoadingButton } from '../../LoadingScreen/LoadingScreen';
// import { handleUpload } from "../../../../lib/helpers/handleUpload";

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
  const handleType = (buttonType: string) => {
    switch (buttonType) {
      case 'edit-chapter':
        return EditChapterSchema;
      case 'edit-topic':
        return editTopicSchema;
      default:
        return z.object({});
    }
  };

  const schema = handleType(buttonType);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    values: {
      topicTitle: title,
      description: subtitle,
      chapterTitle: title,
      chapterDescription: subtitle,
    },
  });
  const [fileData, setfileData] = useState<File | string | null>(null);

  const { data, isLoading } = useQuery<{ url: string }>({
    queryKey: ['ChapterContentFile'],
    queryFn: () => {
      return getChapterPDFFiles(chapterId, topicId);
    },
    enabled: chapterId !== undefined && topicId !== undefined,
    refetchOnWindowFocus: false,
  });

  const editMutation = useEditContentMutation<z.infer<typeof schema>>({
    fn: async (data: z.infer<typeof schema>) => {
      const formData = new FormData();
      if (buttonType === 'edit-chapter' && chapterId !== undefined) {
        for (const key in data as z.infer<typeof EditChapterSchema>) {
          if (key === 'chapterFile') {
            formData.append('chapterFile', fileData as File);
          } else {
            formData.append(key, (data as any)[key]);
          }
        }

        if (formData.get('chapterFile') === null) {
          showToast('Invalid file', 'error');
        }

        formData.forEach((value, key) => {
          console.log(key, value);
        });
        return updateChapter(formData, chapterId, topicId);
      } else if (buttonType === 'edit-topic' && topicId !== undefined) {
        return editTopic(data, topicId);
      }
      return Promise.reject(new Error('Invalid button type'));
    },
    QueryKey: ['ChapterContentFile', 'AllTopicsWithChapters'],
    handleClose,
  });

  const onSubmit = (buttonType: string) => async (data: any) => {
    if (buttonType === 'edit-chapter') {
      try {
        await editMutation.mutateAsync({ ...data });
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    }

    if (buttonType === 'edit-topic') {
      try {
        await editMutation.mutateAsync({ ...data });
      } catch (error: any) {
        showToast(error.message, 'error');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file?.length === 1) {
      setfileData(file[0]);
    } else {
      setfileData(data?.url ? data.url : null);
    }
  };

  useEffect(() => {
    setfileData(null);
  }, [open]);

  const formInputs = useMemo(() => {
    return (
      <>
        {buttonType === 'edit-chapter' ? (
          <>
            <Box component={'div'} className="flex-1">
              <Typography id="Edit PDF" sx={{ mb: 2 }}>
                Edit PDF:
              </Typography>
              <form
                onSubmit={handleSubmit(onSubmit(buttonType))}
                encType="multipart/form-data"
              >
                <Box component={'div'} className="flex flex-col gap-y-5">
                  {editChapterFormInputs.map((input) => (
                    <FormControl key={input.id}>
                      {input.type === 'file' ? (
                        <Input
                          {...register(
                            input.name as keyof z.infer<typeof schema>,
                          )}
                          id={input.id}
                          type={input.type}
                          onChange={handleFileChange}
                        />
                      ) : (
                        <>
                          <InputLabel htmlFor={input.name}>
                            {input.label}
                          </InputLabel>
                          <OutlinedInput
                            {...register(
                              input.name as keyof z.infer<typeof schema>,
                            )}
                            id={input.id}
                            label={input.label}
                            type={input.type}
                          />
                        </>
                      )}
                      {errors[input.name as keyof z.infer<typeof schema>] && (
                        <p className="text-red-500">
                          {
                            (
                              errors[
                                input.name as keyof z.infer<typeof schema>
                              ] as any
                            )?.message
                          }
                        </p>
                      )}
                    </FormControl>
                  ))}

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: 'green',
                    }}
                    className={isSubmitting ? 'cursor-not-allowed' : ''}
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <LoadingButton /> : null}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Box>

            <Box component={'div'} className="flex gap-x-5">
              <Box component={'div'} className="flex-1">
                <Typography id="Preview" sx={{ mt: 2 }}>
                  Preview:
                </Typography>
                <PDFViewer
                  data={data || undefined}
                  isLoading={isLoading}
                  fileName={fileName || ''}
                  previewFile={fileData ? fileData : undefined}
                  PDFversion={pdfjs.version}
                />
              </Box>
            </Box>
          </>
        ) : buttonType === 'edit-topic' ? (
          <>
            <Box component={'div'} className="flex-1">
              <Typography id="Edit PDF" sx={{ mb: 2 }}>
                Edit Topic:
              </Typography>
              <form
                onSubmit={handleSubmit(onSubmit(buttonType))}
                encType="multipart/form-data"
              >
                <Box component={'div'} className="flex flex-col gap-y-5">
                  {editTopicFormInputs.map((input) => (
                    <FormControl key={input.id}>
                      <InputLabel htmlFor={input.name}>
                        {input.label}
                      </InputLabel>
                      <OutlinedInput
                        {...register(
                          input.name as keyof z.infer<typeof schema>,
                        )}
                        id={input.id}
                        label={input.label}
                        type={input.type}
                      />
                      {errors[input.name as keyof z.infer<typeof schema>] && (
                        <p className="text-red-500">
                          {
                            (
                              errors[
                                input.name as keyof z.infer<typeof schema>
                              ] as any
                            )?.message
                          }
                        </p>
                      )}
                    </FormControl>
                  ))}

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      background: 'green',
                    }}
                    className={isSubmitting ? 'cursor-not-allowed' : ''}
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <LoadingButton /> : null}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Box>
          </>
        ) : null}
      </>
    );
  }, [
    buttonType,
    fileData,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    title,
    subtitle,
  ]);

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
