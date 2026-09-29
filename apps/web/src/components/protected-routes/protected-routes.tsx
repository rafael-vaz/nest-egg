import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { useTransactionsListener } from "../../hooks/transaction/use-transactions-listener";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { setLoading } from "../../store/reducers/user/user-finances";
import { readAllCollectionsThunk } from "../../store/thunks/collection/collection-data";
import { readAllGoalsThunk } from "../../store/thunks/goal/goal-data";
import { readAllTransactionsThunk } from "../../store/thunks/transaction/transaction-data";
import LoaderBox from "../loader/loader-box";
import ModalBackground from "../modal/modal-background";
import SearchParamsRouter from "../search-params-router/search-params-router";

interface IProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes = ({ children }: IProtectedRoutesProps) => {
  const dispatch = useAppDispatch();
  const { auth, authUser } = useSelector((state: RootState) => state.userAuth);
  const { loading } = useSelector((state: RootState) => state.userFinances);
  useTransactionsListener(authUser?.uid);

  React.useEffect(() => {
    if (auth && authUser?.uid) {
      Promise.all([
        dispatch(readAllCollectionsThunk({ userId: authUser.uid })),
        dispatch(readAllGoalsThunk({ userId: authUser.uid })),
        dispatch(readAllTransactionsThunk({ userId: authUser.uid })),
      ]).finally(() => {
        dispatch(setLoading(false));
      });
    }
  }, [auth, authUser?.uid, dispatch]);

  if (auth === false) {
    return <Navigate to="/login" replace />;
  }
  if (auth === true && !authUser?.emailVerified) {
    return <Navigate to="/confirm-email" replace />;
  }

  return (
    <>
      {children}
      {auth !== undefined && <SearchParamsRouter />}
      {loading && (
        <ModalBackground id="authenticating-user">
          <LoaderBox text="Carregando dados do usuário..." />
        </ModalBackground>
      )}
    </>
  );
};

export default ProtectedRoutes;
