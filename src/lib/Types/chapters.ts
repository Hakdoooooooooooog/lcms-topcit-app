export type Chapter = {
  id: bigint;
  topic_id: bigint;
  parent_chapter_id: bigint | null;
  chapter_number: string;
  title: string;
  sub_title: string;
  created_at: Date | null;
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
