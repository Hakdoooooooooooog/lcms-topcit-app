import { useDebounce } from '@uidotdev/usehooks';
import { useEffect, useMemo } from 'react';
import { usePaginationStore } from '../store';

const useSearchFilter = <T extends Record<string, any>>(
  data: T[] | undefined,
  searchKey: string,
) => {
  const debouncedSearch = useDebounce(searchKey, 500);
  const { isSearching, setIsSearching } = usePaginationStore((state) => ({
    isSearching: state.isSearching,
    setIsSearching: state.setIsSearching,
  }));

  const filteredItems = useMemo(() => {
    if (!debouncedSearch) {
      return data;
    }

    if (!data) {
      return [];
    }

    return data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (typeof value === 'string' && key === 'topictitle') {
          return value.toLowerCase().includes(debouncedSearch.toLowerCase());
        }

        if (typeof value === 'string' && key === 'title') {
          return value.toLowerCase().includes(debouncedSearch.toLowerCase());
        }

        if (typeof value === 'string' && key === 'topicName') {
          return value.toLowerCase().includes(debouncedSearch.toLowerCase());
        }

        if (typeof value === 'string' && key === 'quizTitle') {
          return value.toLowerCase().includes(debouncedSearch.toLowerCase());
        }

        return false;
      }),
    );
  }, [data, debouncedSearch]);

  useEffect(() => {
    setIsSearching(true);

    if (filteredItems) {
      setIsSearching(false);
    }
  }, [filteredItems]);

  return { isSearching, filteredItems };
};

export default useSearchFilter;
