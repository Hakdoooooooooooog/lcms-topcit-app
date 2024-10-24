import { Box, Button, Card, CardActions, CardHeader, Typography } from "@mui/material";
import { useLayoutEffect } from "react";
import styles from "./Assessment.module.css";
import { getElementHeight } from "../../../lib/helpers/utils";

const Assessment = () => {
  // Dynamically set the height of the bullet to match the height of the content
  useLayoutEffect(() => {
    getElementHeight(styles, ".MuiPaper-root");
  }, []);

  return (
    <>
      <Box component={"section"} className="flex flex-col gap-y-3 mt-10">
        <Card className="flex p-4">
          <Box component="span" className={styles["list__item--bullet"]}>
            <Box component={"span"} className={styles["list__item--bullet-inner"]} />
          </Box>

          <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
            <Box className="flex-[1_1_55%]">
              <CardHeader title="CHAPTER 1" subheader="Software" />

              <CardActions className="flex gap-1 w-full ml-5">
                <Typography variant="body1">Test Type:</Typography>
                <Button variant="contained" color="info">
                  Objective
                </Button>
              </CardActions>
            </Box>

            <CardActions className="justify-end flex-[1_1_auto]">
              <Box className="flex flex-col gap-3 items-end w-full md:w-[200px] lg:w-[300px]">
                <Button
                  sx={{
                    width: "100%",
                  }}
                  variant="contained"
                  color="warning"
                >
                  Retake? (3 Attempts Left)
                </Button>
                <Button
                  sx={{
                    width: "100%",
                    background: "green",
                  }}
                  variant="contained"
                >
                  Score: 80% / 100%
                </Button>
              </Box>
            </CardActions>
          </Box>
        </Card>

        <Card className="flex p-4">
          <Box component="span" className={styles["list__item--bullet"]}>
            <Box component={"span"} className={styles["list__item--bullet-inner"]} />
          </Box>

          <Box className="flex flex-wrap w-full ml-2 gap-[1%]">
            <Box className=" flex-[1_1_55%]">
              <CardHeader title="CHAPTER 2" subheader="Data" />

              <CardActions className="flex gap-1 w-full ml-5">
                <Typography variant="body1">Test Type:</Typography>
                <Button variant="contained" color="info">
                  Objective
                </Button>
              </CardActions>
            </Box>

            <CardActions className="justify-end flex-[1_1_auto]">
              <Box className=" flex flex-col gap-3 w-full md:w-[200px] lg:w-[300px]">
                <Button
                  sx={{
                    width: "100%",
                    background: "green",
                  }}
                  variant="contained"
                >
                  Start Assessment
                </Button>
                <Button
                  sx={{
                    width: "100%",
                  }}
                  variant="contained"
                  color="inherit"
                >
                  Pending
                </Button>
              </Box>
            </CardActions>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default Assessment;
