import { useDebounce } from "@uidotdev/usehooks";
import { useMemo, useEffect } from "react";
import { useSearchStore, usePaginationStore } from "../../../lib/store";
import { Topic } from "../../../lib/Types/topics";
import CardItem, { CardTopic } from "./PaginatedItem/CardItem";

export const CardItems = () => {
  return (
    <>
      <CardItem />
    </>
  );
};

export const CardTopics = <T extends Topic>({ topic }: { topic: Array<T> }) => {
  const search = useSearchStore((state) => state.search);
  const debouncedSearch = useDebounce(search, 500);
  const { isSearching, setIsSearching } = usePaginationStore((state) => ({
    isSearching: state.isSearching,
    setIsSearching: state.setIsSearching,
  }));

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) {
      return topic;
    }
    const data = topic.filter((topic) => {
      const topicTitle = `topic ${topic.id}: ${topic.topicTitle}`;
      return topicTitle.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
    return data;
  }, [topic, debouncedSearch]);

  useEffect(() => {
    setIsSearching(true);

    if (filteredItems) {
      setIsSearching(false);
    }
  }, [filteredItems]);

  return <>{isSearching ? <h1>Searching...</h1> : <CardTopic filteredItems={filteredItems} />}</>;
};
