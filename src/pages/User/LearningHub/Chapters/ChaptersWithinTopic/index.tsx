import { useParams } from "react-router-dom";
import { getAllChaptersWithinTopic } from "../../../../../api/User/chaptersApi";
import { useQuery } from "@tanstack/react-query";
import { ChaptersWithSubChaptersWithinTopic } from "../../../../../lib/Types/chapters";
import { AccordionChapters } from "../../../../../components/ui/PaginatedItems/AccordionItems";

const ChaptersWithinTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { data, isLoading } = useQuery<ChaptersWithSubChaptersWithinTopic>({
    queryKey: ["ChaptersWithinTopic", topicId],
    queryFn: () => getAllChaptersWithinTopic(topicId),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <AccordionChapters chapter={data.chapters} />
    </>
  );
};

export default ChaptersWithinTopic;
