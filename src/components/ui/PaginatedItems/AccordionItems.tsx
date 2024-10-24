import { useEffect, useMemo } from "react";
import { usePaginationStore, useSearchStore } from "../../../lib/store";
import { useDebounce } from "@uidotdev/usehooks";
import { AccordionChapter } from "./PaginatedItem/AccordionItem";
import { ChapterWithSubChapter } from "../../../lib/Types/chapters";

export const AccordionChapters = <T extends ChapterWithSubChapter>({
  chapter,
}: {
  chapter: Array<T>;
}) => {
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);
  const { isSearching, setIsSearching } = usePaginationStore((state) => ({
    isSearching: state.isSearching,
    setIsSearching: state.setIsSearching,
  }));

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) {
      return chapter;
    }
    const data = chapter.filter((chapter) => {
      const chapterTitle = `Chapter ${chapter.chapter_number}: ${chapter.title}`;
      return chapterTitle.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
    return data;
  }, [chapter, debouncedSearch]);

  useEffect(() => {
    setIsSearching(true);

    if (filteredItems) {
      setIsSearching(false);
    }
  }, [filteredItems]);

  return (
    <>{isSearching ? <h1>Searching...</h1> : <AccordionChapter filteredItems={filteredItems} />}</>
  );
};
