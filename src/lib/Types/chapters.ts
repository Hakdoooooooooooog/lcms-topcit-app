import { Topics } from './topics';

export type Chapter = {
  id: bigint;
  topic_id: bigint;
  parent_chapter_id: bigint | null;
  chapter_number: string;
  title: string;
  sub_title: string;
  created_at: Date | null;
  FileChapter: FileChapter | null;
};

export type FileChapter = {
  file_name: string;
};

export type UserCompletedChapters = {
  id: bigint;
  chapter_id: bigint;
  user_id: bigint;
  completion_status: string | null;
  completed_at: Date | null;
};

export type ChapterWithSubChapter = {
  id: bigint;
  topic_id: bigint;
  parent_chapter_id: bigint | null;
  chapter_number: string;
  title: string;
  sub_title: string;
  created_at: Date | null;
  SubChapters: Chapter[];
  FileChapter: FileChapter | null;
};

export type ChaptersWithSubChaptersWithinTopic = Topics & {
  chapters: ChapterWithSubChapter[];
};
