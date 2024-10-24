import { PermMedia, MenuBook } from "@mui/icons-material";
import { Container } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSearchStore } from "../../lib/store";
import { SelectionItems } from "../../lib/Types/types";
import Selections from "../../components/ui/Selections";
import { LoadingContentScreen } from "../../components/ui/LoadingScreen/LoadingScreen";
import Breadcrumbs from "../../components/ui/Breadcrumbs";

const ProgressTrackerLayout = () => {
  const setSearch = useSearchStore((state) => state.setSearch);
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("contents");
  const path = useLocation().pathname;

  const CardActionItems: SelectionItems = [
    {
      label: "Contents",
      icon: (
        <MenuBook
          classes={{
            root: "fill-current text-green-800",
          }}
        />
      ),
      to: "/progress-tracker/contents",
    },
    {
      label: "Assessments",
      icon: (
        <PermMedia
          classes={{
            root: "fill-current text-green-800",
          }}
        />
      ),
      to: "/progress-tracker/assessments",
    },
  ];

  useEffect(() => {
    setSearch("");

    if (path === "/progress-tracker") {
      setTab("progress-tracker");
    }
  }, [path]);

  return (
    <Container maxWidth="xl" className="mt-10">
      <h1 className="text-4xl font-semibold mb-12">
        Progress <span className="text-green-800">Tracker</span>
      </h1>

      <Breadcrumbs path={path} />

      <Selections props={{ CardActionItems, path, startTransition, tab, setTab }} />

      {isPending ? <LoadingContentScreen /> : <Outlet />}
    </Container>
  );
};

export default ProgressTrackerLayout;
