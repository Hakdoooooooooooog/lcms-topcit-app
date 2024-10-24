import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getTopicWithId } from "../../../../../api/User/topicsApi";
import { Topic } from "../../../../../lib/Types/topics";

const TestRoute = () => {
  const { topicId, name } = useParams<{ topicId: string; name: string }>();
  const { data, isLoading } = useQuery<Topic>({
    queryKey: ["Topic", Number(topicId)],
    queryFn: () => getTopicWithId(Number(topicId)),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formattedName = name
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <Card>
      <CardHeader title={`Topic ${topicId}: ${formattedName}`} />

      <CardContent>
        <Typography>{data?.description}</Typography>
      </CardContent>
    </Card>
  );
};

export default TestRoute;
