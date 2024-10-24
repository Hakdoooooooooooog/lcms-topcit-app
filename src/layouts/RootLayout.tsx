import { Outlet, useLocation } from "react-router-dom";
import styles from "./RootLayout.module.css";
import Header from "../components/ui/Header/Header";
import { landingPaths, rootRoutes } from "../lib/constants";
import { LoadingDataScreen } from "../components/ui/LoadingScreen/LoadingScreen";
import { Container } from "@mui/material";
import { useUserStore } from "../lib/store";
import RequiresAuth from "../components/RequiresAuth";

const RootLayout = () => {
  const location = useLocation();
  const { isLoaded } = useUserStore((state) => ({
    isLoaded: state.isLoaded,
  }));
  return (
    <>
      {landingPaths.includes(location.pathname) ? (
        <main className={styles.rootLayout}>
          <Outlet />
        </main>
      ) : (
        <main className={styles.rootLayout}>
          <Header links={rootRoutes} />
          <Container
            sx={{
              marginTop: "3.25rem",
            }}
            maxWidth={"lg"}
          >
            <RequiresAuth location={location}>
              {isLoaded ? <LoadingDataScreen /> : <Outlet />}
            </RequiresAuth>
          </Container>
        </main>
      )}
    </>
  );
};

export default RootLayout;
