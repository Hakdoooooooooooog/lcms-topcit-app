import { z } from "zod";

export const EditPDFSchema = z.object({
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .refine((file) => file instanceof FileList && file.length > 0, "Please upload a file")
    .refine((file) => {
      if (file instanceof FileList) {
        return (
          file.length !== 0 && file[0].type === "application/pdf" && file[0].name.match(/\.(pdf)$/)
        );
      }
      return false;
    }, "File must be a PDF"),
  title: z
    .union([
      z
        .string()
        .min(4, "Title must contains minimum of 4 characters.")
        .max(100, "Title only permits 100 characters"),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e)),
  subtitle: z.union([
    z
      .string()
      .min(4, "Subtitle must contains minimum of 4 characters.")
      .max(100, "Subtitle only permits 100 characters"),
    z.string().length(0),
  ]),
});

export const addChapterSchema = z.object({
  topicId: z.string().min(1, "Please enter a topic id"),
  chapterNum: z.string().min(1, "Please enter a chapter number"),
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .refine((file) => file instanceof FileList && file.length > 0, "Please upload a file")
    .refine((file) => {
      if (file instanceof FileList) {
        return (
          file.length !== 0 && file[0].type === "application/pdf" && file[0].name.match(/\.(pdf)$/)
        );
      }
      return false;
    }, "File must be a PDF"),
  chapterTitle: z.string().min(1, "Please enter a chapter title"),
  chapterDescription: z.string().min(1, "Please enter a chapter description"),
});

export const addTopicSchema = z.object({
  topicNum: z.string().min(1, "Please enter a topic number"),
  topicName: z.string().min(1, "Please enter a topic title").optional(),
  topicDescription: z.string().min(1, "Please enter a topic description").optional(),
});

export const addSubChapterSchema = z.object({
  parentChapterNum: z.string().min(1, "Please enter a parent chapter number"),
  subChapterNum: z.string().min(1, "Please enter a subchapter number"),
  subChapterTitle: z.string().min(1, "Please enter a subchapter title").optional(),
  subChapterDescription: z.string().min(1, "Please enter a subchapter description").optional(),
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .refine((file) => file instanceof FileList && file.length > 0, "Please upload a file")
    .refine((file) => {
      if (file instanceof FileList) {
        return (
          file.length !== 0 && file[0].type === "application/pdf" && file[0].name.match(/\.(pdf)$/)
        );
      }
      return false;
    }, "File must be a PDF"),
});
