import { Topic } from "../../../../lib/Types/topics";
import { getAllTopics } from "../../../../api/User/topicsApi";
import { useQuery } from "@tanstack/react-query";
import { CardTopics } from "../../../../components/ui/PaginatedItems/CardItems";

const TopcitContents = () => {
  const { data, isLoading } = useQuery<Topic[]>({
    queryKey: ["TopcitTopics"],
    queryFn: () => getAllTopics(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return <CardTopics topic={data} />;
};

export default TopcitContents;
