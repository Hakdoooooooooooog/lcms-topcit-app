import { chapters } from "../../../../server/src/api/services/prisma";
import { EditPDFSchema } from "../schema/DataSchema";
import { z } from "zod";

export type Chapter = chapters;

export type ChapterWithSubChapter = {
  id: bigint;
  topic_id: bigint;
  parent_chapter_id: bigint | null;
  chapter_number: string;
  title: string;
  sub_title: string;
  created_at: Date | null;
  SubChapters: chapters[];
  FileChapter: {
    file_name: string;
  }[];
};

export type ChaptersWithSubChaptersWithinTopic = {
  id: bigint;
  topicTitle: string | null;
  description: string | null;
  chapters: ChapterWithSubChapter[];
};

export type EditPDF = z.infer<typeof EditPDFSchema>;
