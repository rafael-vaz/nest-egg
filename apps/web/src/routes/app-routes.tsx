import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import AuthRedirect from "../components/auth-redirect/auth-redirect";
import DefaultLayout from "../components/default-layout/default-layout";
import NotFound from "../components/not-found/not-found";
import ProtectedRoutes from "../components/protected-routes/protected-routes";
import Collections from "../pages/collections";
import ConfirmEmail from "../pages/confirm-email";
import Goals from "../pages/goals";
import Home from "../pages/home";
import Login from "../pages/login";
import RecoveryPassword from "../pages/recovery-password";
import Register from "../pages/register";
import Search from "../pages/search";
import Transactions from "../pages/transactions";
import Wallet from "../pages/wallet";
import { RootState } from "../store/configure-store";

interface IRoutes {
  path: string;
  component: React.ReactNode;
}

const AuthRedirectRoutesMap: IRoutes[] = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
];

const ProtectedRoutesMap: IRoutes[] = [
  { path: "/home", component: <Home /> },
  { path: "/goals", component: <Goals /> },
  { path: "/collections", component: <Collections /> },
  { path: "/transactions", component: <Transactions /> },
  { path: "/wallet", component: <Wallet /> },
  { path: "/search", component: <Search /> },
];

const AppRoutes = () => {
  const modal = useSelector((state: RootState) => state.modal);
  const confirmationModal = useSelector(
    (state: RootState) => state.confirmationModal,
  );
  const toolMenu = useSelector((state: RootState) => state.toolMenu);
  const mainContentRef = React.useRef(null);
  const hiddenStatus =
    modal.isOpen || confirmationModal.isOpen || toolMenu.isOpen;

  React.useEffect(() => {
    if (!mainContentRef.current) return;
    const mainContentElement = mainContentRef.current as HTMLElement;
    if (!hiddenStatus) {
      mainContentElement.removeAttribute("inert");
      mainContentElement.focus();
    } else {
      mainContentElement.setAttribute("inert", "");
    }
    return () => {
      mainContentElement.removeAttribute("inert");
    };
  }, [hiddenStatus]);

  return (
    <div id="app-wrapper" ref={mainContentRef} className="noVisualFocus">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/recovery-password" element={<RecoveryPassword />} />
        <Route path="*" element={<NotFound />} />
        {AuthRedirectRoutesMap.map(({ path, component }) => (
          <Route
            key={path}
            path={path}
            element={<AuthRedirect>{component}</AuthRedirect>}
          />
        ))}

        <Route element={<DefaultLayout />}>
          {ProtectedRoutesMap.map(({ path, component }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoutes>{component}</ProtectedRoutes>}
            />
          ))}
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
