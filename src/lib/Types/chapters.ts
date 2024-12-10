import { Topics } from './topics';

export type Chapter = {
  id: number;
  topic_id: number;
  parent_chapter_id: number | null;
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
  id: number;
  chapter_id: number;
  user_id: number;
  topic_id: number;
  completion_status: string | null;
  completed_at: Date | null;
};

export type ChapterWithSubChapter = {
  id: number;
  topic_id: number;
  parent_chapter_id: number | null;
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
