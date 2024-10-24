import { Card, Box, CardHeader, CardContent, Pagination, Stack } from "@mui/material";
import LinearProgressWithLabel from "../../ProgressBar";
import styles from "./cardItem.module.css";
import { useEffect, useTransition } from "react";
import {
  getElementHeight,
  handlePaginatedItems,
  // handlePaginatedItems,
} from "../../../../lib/helpers/utils";
import { Topic } from "../../../../lib/Types/topics";
import { Link } from "react-router-dom";
import { LoadingContentScreen } from "../../LoadingScreen/LoadingScreen";

const CardItem = () => {
  // const { page, setPage, totalPages, currentItems } = handlePaginatedItems();
  useEffect(() => {
    getElementHeight(styles, ".MuiPaper-root");
  }, []);

  return (
    <>
      <Card
        sx={{
          padding: "1rem",
        }}
      >
        <Box component={"div"} className={styles["list__item"]}>
          <CardHeader
            title="Chapter 1"
            subheader="Software Development"
            classes={{
              root: styles["list__item--header"],
              title: styles["list__item--title"],
              subheader: styles["list__item--subheader"],
            }}
          />
          <CardContent className={styles["list__item--content"]}>
            <LinearProgressWithLabel
              value={70}
              sx={{
                height: "2.75rem",
                borderRadius: "0.875rem",
              }}
            />
          </CardContent>
          <Box component="span" className={styles["list__item--bullet"]}>
            <Box component={"span"} className={styles["list__item--bullet-inner"]} />
          </Box>
        </Box>
      </Card>

      <Stack spacing={2} sx={{ marginTop: "2rem" }}>
        <Pagination size="large" shape="rounded" count={5} page={1} onChange={() => {}} />
      </Stack>
    </>
  );
};

export const CardTopic = <T extends Topic>({ filteredItems }: { filteredItems: Array<T> }) => {
  const { page, setPage, totalPages, currentItems } = handlePaginatedItems<T>({
    items: filteredItems,
  });

  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending ? (
        <LoadingContentScreen />
      ) : (
        currentItems.map((topic) => (
          <Card key={topic.topicTitle}>
            <CardHeader
              classes={{
                action: "text-green-800 !self-center",
              }}
              title={`Topic ${topic.id}: ${topic.topicTitle}`}
              action={<Link to={`${topic.id}/${topic.topicTitle}`}>View Topic</Link>}
            />
          </Card>
        ))
      )}

      <Stack spacing={2} sx={{ marginTop: "2rem" }}>
        <Pagination
          size="large"
          shape="rounded"
          count={totalPages}
          page={page}
          onChange={(_event, value) =>
            startTransition(() => {
              setPage(value);
            })
          }
        />
      </Stack>
    </>
  );
};

export default CardItem;
