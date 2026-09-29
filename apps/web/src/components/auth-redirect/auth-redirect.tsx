import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { RootState } from "../../store/configure-store";

interface AuthRedirectProps {
  children: ReactNode;
}

const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { auth, authUser } = useSelector((state: RootState) => state.userAuth);
  if (auth === true) {
    if (authUser?.emailVerified) {
      return <Navigate to={"/home"} replace />;
    } else {
      return <Navigate to={"/confirm-email"} replace />;
    }
  }
  return children;
};

export default AuthRedirect;
