import { useEffect } from "react";

import { ITransaction } from "../../@types/transaction";
import subscribeToTransactions from "../../services/transaction/subscribe-transactions";
import { useAppDispatch } from "../../store/configure-store";
import { setTransactions } from "../../store/reducers/user/user-finances";

export function useTransactionsListener(userId: string | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToTransactions(
      userId,
      (transactions: ITransaction[]) => {
        dispatch(setTransactions(transactions));
      },
    );

    return () => {
      unsubscribe();
    };
  }, [userId, dispatch]);
}
