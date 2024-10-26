import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormControl, Input, InputLabel, Modal, OutlinedInput } from "@mui/material";
import {
  addChapterFormInputs,
  addSubChapterFormInputs,
  addTopicFormInputs,
  styledModal,
  Textarea,
} from "../../../../lib/constants";
import { z } from "zod";
import {
  addChapterSchema,
  addSubChapterSchema,
  addTopicSchema,
} from "../../../../lib/schema/DataSchema";
import { LoadingButton } from "../../LoadingScreen/LoadingScreen";
import { createTopic } from "../../../../api/Admin/topics";
import { showToast } from "../../Toasts";
import { createChapter } from "../../../../api/Admin/chapter";
import useAddContentMutation from "../../../../lib/hooks/useAddContentMutation";

const AddContentModal = ({
  open,
  handleClose,
  buttonType,
  addData,
}: {
  open: boolean;
  handleClose: () => void;
  buttonType: string;
  addData: {
    topicId?: string;
    chapterId?: string;
    chapterNum?: string;
    topicNum?: string;
    subChapterNum?: string;
    parentChapterNum?: string;
  };
}) => {
  const handleType = (buttonType: string) => {
    switch (buttonType) {
      case "add-chapter":
        return addChapterSchema;
      case "add-topic":
        return addTopicSchema;
      case "add-sub-chapter":
        return addSubChapterSchema;
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
    values: addData,
  });

  const addMutation = useAddContentMutation<z.infer<typeof schema>>({
    fn: (data: z.infer<typeof schema>) => {
      const formData = new FormData();
      if (buttonType === "add-topic") {
        // API Call for Add Topic
        for (const key in data as z.infer<typeof addTopicSchema>) {
          formData.append(key, (data as any)[key]);
        }
        return createTopic(formData);
      } else if (buttonType === "add-chapter") {
        for (const key in data as z.infer<typeof addChapterSchema>) {
          if (key === "chapterFile") {
            formData.append("chapterFile", (data as any)[key][0]);
          } else {
            formData.append(key, (data as any)[key]);
          }
        }
        return createChapter(formData);
      } else {
        // API Call for Add Sub-Chapter
        // return createSubChapter(formData);
        return Promise.resolve({});
      }
    },
    QueryKey: "AllTopicsWithChapters",
    handleClose,
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (buttonType === "add-topic") {
      // API Call for Add Topic
      try {
        await addMutation.mutateAsync({ ...data });
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }

    if (buttonType === "add-chapter") {
      // API Call for Add Chapter
      try {
        await addMutation.mutateAsync({ ...data });
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }

    if (buttonType === "add-sub-chapter") {
      // API Call for Add Sub-Chapter
    }
  };

  const formInputs = useMemo(() => {
    return (
      <>
        {buttonType === "add-chapter"
          ? // Add Chapter
            addChapterFormInputs.map((input) => (
              <FormControl key={input.id}>
                {input.name === "chapterDescription" ? (
                  <>
                    <label htmlFor={input.name}>{input.label}</label>
                    <Textarea
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                    />
                  </>
                ) : input.name === "chapterFile" ? (
                  <Input
                    {...register(input.name as keyof z.infer<typeof schema>)}
                    id={input.id}
                    type={input.type}
                  />
                ) : (
                  <>
                    <InputLabel htmlFor={input.id}>{input.label}</InputLabel>
                    <OutlinedInput
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                      type={input.type}
                      label={input.label}
                      disabled={input.name === "chapterNum" || input.name === "topicId"}
                    />
                  </>
                )}
                {errors[input.name as keyof z.infer<typeof schema>] && (
                  <p className="text-red-500">
                    {(errors[input.name as keyof z.infer<typeof schema>] as any)?.message}
                  </p>
                )}
              </FormControl>
            ))
          : // Add Topic
          buttonType === "add-topic"
          ? addTopicFormInputs.map((input) => (
              <FormControl key={input.id}>
                {input.name === "topicDescription" ? (
                  <>
                    <label htmlFor={input.name}>{input.label}</label>
                    <Textarea
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                    />
                  </>
                ) : (
                  <>
                    <InputLabel htmlFor={input.id}>{input.label}</InputLabel>
                    <OutlinedInput
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                      type={input.type}
                      label={input.label}
                      disabled={input.name === "topicNum"}
                    />
                  </>
                )}
                {errors[input.name as keyof z.infer<typeof schema>] && (
                  <p className="text-red-500">
                    {(errors[input.name as keyof z.infer<typeof schema>] as any)?.message}
                  </p>
                )}
              </FormControl>
            ))
          : // Add Sub-Chapter
            addSubChapterFormInputs.map((input) => (
              <FormControl key={input.id}>
                {input.name === "subChapterDescription" ? (
                  <>
                    <label htmlFor={input.name}>{input.label}</label>
                    <Textarea
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                    />
                  </>
                ) : input.name === "subChapterFile" ? (
                  <Input
                    {...register(input.name as keyof z.infer<typeof schema>)}
                    id={input.id}
                    type={input.type}
                  />
                ) : (
                  <>
                    <InputLabel htmlFor={input.id}>{input.label}</InputLabel>
                    <OutlinedInput
                      {...register(input.name as keyof z.infer<typeof schema>)}
                      id={input.id}
                      type={input.type}
                      label={input.label}
                      disabled={input.name === "subChapterNum" || input.name === "parentChapterNum"}
                    />
                  </>
                )}
                {errors[input.name as keyof z.infer<typeof schema>] && (
                  <p className="text-red-500">
                    {(errors[input.name as keyof z.infer<typeof schema>] as any)?.message}
                  </p>
                )}
              </FormControl>
            ))}
      </>
    );
  }, [buttonType, errors, register, schema]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={buttonType}
      aria-describedby={buttonType}
    >
      <Box sx={styledModal}>
        <form
          encType="multipart/form-data"
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          {formInputs}

          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "green",
            }}
            disabled={isSubmitting}
            className={isSubmitting ? "cursor-not-allowed" : ""}
            endIcon={isSubmitting ? <LoadingButton /> : null}
          >
            {buttonType.split("-").join(" ")}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddContentModal;
