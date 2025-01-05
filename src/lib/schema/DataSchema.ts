import { z } from 'zod';

export const addChapterSchema = z.object({
  topicId: z.string().min(1, 'Please enter a topic id'),
  chapterNum: z.string().min(1, 'Please enter a chapter number'),
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .refine(
      (file) => file instanceof FileList && file.length > 0,
      'Please upload a file',
    )
    .refine((file) => {
      if (file instanceof FileList) {
        return (
          file.length !== 0 &&
          file[0].type === 'application/pdf' &&
          file[0].name.match(/\.(pdf)$/)
        );
      }
      return false;
    }, 'File must be a PDF'),
  chapterTitle: z.string().min(1, 'Please enter a chapter title'),
  chapterDescription: z.string().min(1, 'Please enter a chapter description'),
});

export const EditChapterSchema = z.object({
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (file instanceof FileList) {
        return (
          file.length === 0 ||
          (file[0].type === 'application/pdf' && file[0].name.match(/\.(pdf)$/))
        );
      }
      return false;
    }, 'File must be a PDF'),
  chapterTitle: z
    .union([
      z
        .string()
        .min(4, 'Title must contains minimum of 4 characters.')
        .max(300, 'Title only permits 300 characters'),
      z.string().length(0),
    ])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  chapterDescription: z.union([
    z
      .string()
      .min(4, 'Subtitle must contains minimum of 4 characters.')
      .max(300, 'Subtitle only permits 300 characters'),
    z.string().length(0),
  ]),
});

export const addTopicSchema = z.object({
  topicNum: z.string().min(1, 'Please enter a topic number'),
  topicName: z.string().min(1, 'Please enter a topic title').optional(),
  topicDescription: z
    .string()
    .min(1, 'Please enter a topic description')
    .optional(),
});

export const editTopicSchema = z.object({
  topicTitle: z.string().min(1, 'Please enter a topic title').optional(),
  description: z.string().min(1, 'Please enter a topic description').optional(),
});

export const addSubChapterSchema = z.object({
  parentChapterNum: z.string().min(1, 'Please enter a parent chapter number.'),
  subChapterNum: z.string().min(1, 'Please enter a subchapter number.'),
  subChapterTitle: z
    .string()
    .min(1, 'Please enter a subchapter title.')
    .optional(),
  subChapterDescription: z
    .string()
    .min(1, 'Please enter a subchapter description.')
    .optional(),
  chapterFile: z
    .union([z.instanceof(FileList), z.string()])
    .refine(
      (file) => file instanceof FileList && file.length > 0,
      'Please upload a file',
    )
    .refine((file) => {
      if (file instanceof FileList) {
        return (
          file.length !== 0 &&
          file[0].type === 'application/pdf' &&
          file[0].name.match(/\.(pdf)$/)
        );
      }
      return false;
    }, 'File must be a PDF'),
});

export const addQuizSchemaStage1 = z.object({
  topicId: z.string().min(1, 'Please enter a topic id.'),
  quizTitle: z.string().min(1, 'Please enter a quiz title.'),
  maxAttempts: z
    .string()
    .min(1, 'Please enter a number of attempts.')
    .default('1'),
  numofQuestions: z
    .string()
    .min(1, 'Please enter a number of questions.')
    .default('1'),
});

export const addQuizSchemaStage2 = z.object({
  quizQuestions: z.array(
    z.object({
      quizId: z.string().min(1, 'Please enter a quiz id.'),
      question: z.string().min(1, 'Please enter a question text.'),
      questionType: z.string().min(1, 'Please select a question type.'),
      correctAnswer: z.string().min(1, 'Please enter a correct answer.'),
      multipleChoiceOptions: z.array(
        z.object({
          optionText: z
            .string()
            .min(1, 'Please enter an option.')
            .refine(
              (text) => /^[A-Z]\)\s/.test(text),
              'Options must start with "X) e.g., "A) lorem ipsum".',
            ),
        }),
      ),
    }),
  ),
});
