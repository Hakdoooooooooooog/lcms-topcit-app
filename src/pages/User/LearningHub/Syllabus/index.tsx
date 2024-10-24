// import { useEffect, useState } from "react";
// import { AccordionTopics } from "../../../../components/ui/PaginatedItems/AccordionItems";
import { getAllTopics } from "../../../../api/User/topicsApi";
import { useQuery } from "@tanstack/react-query";
import { Topic } from "../../../../lib/Types/topics";
import { CardTopics } from "../../../../components/ui/PaginatedItems/CardItems";
const Syllabus = () => {
  const { data, isLoading } = useQuery<Topic[]>({
    queryKey: ["Topics"],
    queryFn: () => getAllTopics(),
  });

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CardTopics topic={data} />
    </>
  );
};

export default Syllabus;
