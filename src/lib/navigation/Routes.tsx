import { Suspense } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

// Load components
import LoadingScreen from "../../components/ui/LoadingScreen/LoadingScreen";
import Error from "../../pages/Others/Error";
import { rootRoutes } from "../constants";

const Navigation = createBrowserRouter(
  createRoutesFromElements(
    <>
      {rootRoutes.map((route) => (
        <Route key={route.name} path={route.href} element={<route.component />}>
          {route.sublinks?.map((sublink) =>
            sublink.isIndex ? (
              <Route key={sublink.name} index element={<sublink.component />} />
            ) : sublink.isLayoutComponent ? (
              <Route key={sublink.name} path={sublink.href} element={<sublink.component />}>
                {sublink.deepSubLinks &&
                  sublink.deepSubLinks.map((deepSubLinks) =>
                    deepSubLinks.isIndex ? (
                      <Route key={deepSubLinks.name} index element={<deepSubLinks.component />} />
                    ) : deepSubLinks.isComponentUsesParams ? (
                      <Route
                        key={deepSubLinks.name}
                        path={deepSubLinks.href}
                        element={<deepSubLinks.component />}
                      />
                    ) : (
                      <Route
                        key={deepSubLinks.name}
                        path={deepSubLinks.href}
                        element={<deepSubLinks.component />}
                      />
                    )
                  )}
              </Route>
            ) : (
              <Route key={sublink.name} path={sublink.href} element={<sublink.component />} />
            )
          )}
        </Route>
      ))}
      <Route path="*" element={<Error />} />
    </>
  )
);

const Routes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={Navigation} />
    </Suspense>
  );
};

export default Routes;
