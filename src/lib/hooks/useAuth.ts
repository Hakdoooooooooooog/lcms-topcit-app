import { useLayoutEffect } from "react";
import { useAuthUserStore } from "../store";
import useIdleTimerTracker from "./useIdleTimerTracker";
import { verifyUserAccessToken } from "../../api/User/userApi";
import { showToast } from "../../components/ui/Toasts";

export const useAuth = () => {
  const { isIdle, setIsIdle, reset } = useIdleTimerTracker();
  const { isAuth, setUserAuth } = useAuthUserStore((state) => ({
    isAuth: state.user.isAuth,
    setUserAuth: state.setUserAuth,
  }));

  useLayoutEffect(() => {
    // If the user is idle, reset the idle timer and verify the user's access token
    const verify = async () => {
      if (isIdle) {
        reset();
        try {
          const res = await verifyUserAccessToken();
          if (res && res.message === "Access token valid") {
            return setUserAuth({ isAuth: true, userId: res.userId, userRole: res.role });
          }

          showToast("Session expired. Please login again.", "error");
          setUserAuth({ isAuth: false, userId: "", userRole: "" });
        } catch (error: any) {
          if (error?.message === "Refresh token expired") {
            showToast("Session expired. Please login again.", "error");
            setUserAuth({ isAuth: false, userId: "", userRole: "" });
            localStorage.removeItem("session");
          }

          showToast("Session expired. Please login again.", "error");
          setUserAuth({ isAuth: false, userId: "", userRole: "" });
          localStorage.removeItem("session");
        }
      }
    };
    verify();

    return () => {
      setIsIdle(false);
    };
  }, [isIdle]);

  return isAuth;
};
