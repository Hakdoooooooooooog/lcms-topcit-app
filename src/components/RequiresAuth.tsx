import { ReactNode, useEffect } from "react";
import { Location, Navigate } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/User/userApi";
import { useUserStore } from "../lib/store";
import { UserProfile } from "../lib/Types/user";

const RequiresAuth = ({ children }: { children: ReactNode; location: Location }) => {
  const isAuth = useAuth();
  const { data, isLoading } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: () => getUserProfile(),
  });
  const { setUser, setIsLoaded } = useUserStore((state) => ({
    setUser: state.setUser,
    setIsLoaded: state.setIsLoaded,
    isLoaded: state.isLoaded,
  }));

  useEffect(() => {
    setIsLoaded(true);

    if (data && !isLoading) {
      setUser(data);
      setIsLoaded(false);
    }
  }, [data, isLoading, setIsLoaded]);

  if (!isAuth) {
    return <Navigate to="/landing" replace={true} state={{ from: location.pathname }} />;
  }

  return children;
};

export default RequiresAuth;
