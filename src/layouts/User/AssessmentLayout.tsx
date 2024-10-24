import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SearchInput from "../../components/ui/SearchInput/SearchInput";

const AssessmentLayout = () => {
  return (
    <>
      <Box component={"section"} className="flex flex-wrap sm:justify-between justify-center gap-4">
        <span className="text-4xl font-semibold">
          Assessment <span className="text-green-800 font-bold">Hub</span>
        </span>
        <SearchInput />
      </Box>

      <Outlet />
    </>
  );
};

export default AssessmentLayout;
