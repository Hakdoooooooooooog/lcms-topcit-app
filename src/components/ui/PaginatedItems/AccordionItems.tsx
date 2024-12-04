import { AccordionChapter } from './PaginatedItem/AccordionItem';
import { ChapterWithSubChapter } from '../../../lib/Types/chapters';
import useSearchFilter from '../../../lib/hooks/useSearchFilter';
import { UserCompletedChapters } from '../../../lib/Types/user';

export const AccordionChapters = ({
  chapters,
  currentChapterId,
  userCompletedChapterProgress,
  search,
}: {
  chapters: ChapterWithSubChapter[];
  userCompletedChapterProgress: UserCompletedChapters[];
  currentChapterId: string;
  search: string;
}) => {
  // Selected Chapters Within Topic
  const { isSearching, filteredItems: filteredChapters } =
    useSearchFilter<ChapterWithSubChapter>(chapters, search);
  return (
    <>
      {isSearching ? (
        <h1>Searching...</h1>
      ) : (
        <AccordionChapter
          filteredItems={filteredChapters}
          currentChapterId={currentChapterId}
          userCompletedChapterProgress={userCompletedChapterProgress}
        />
      )}
    </>
  );
};
