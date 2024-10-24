import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";

const LinearProgressWithLabel = (
  props: LinearProgressProps & { value: number }
) => {
  let color = "primary";

  if (props.value > 0 && props.value < 100) {
    color = "warning";
  } else if (props.value === 100) {
    color = "success";
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", mr: 1, position: "absolute" }}>
        <LinearProgress
          variant="determinate"
          color={
            color as
              | "inherit"
              | "primary"
              | "secondary"
              | "error"
              | "info"
              | "success"
              | "warning"
          }
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35, position: "absolute" }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
