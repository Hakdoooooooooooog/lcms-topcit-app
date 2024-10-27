export type Chapter = {
  id: bigint;
  topic_id: bigint;
  parent_chapter_id: bigint | null;
  chapter_number: string;
  title: string;
  sub_title: string;
  created_at: Date | null;
  FileChapter:
    | {
        id: bigint;
        chapter_id: bigint;
        file_name: string;
        file_type: string;
      }
    | { file_name: string }
    | null;
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
  FileChapter:
    | {
        id: bigint;
        chapter_id: bigint;
        file_name: string;
        file_type: string;
      }
    | { file_name: string }
    | null;
};

export type ChaptersWithSubChaptersWithinTopic = {
  id: bigint;
  topictitle: string | null;
  description: string | null;
  chapters: ChapterWithSubChapter[];
};
