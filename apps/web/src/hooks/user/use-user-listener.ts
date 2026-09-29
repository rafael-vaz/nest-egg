import { useEffect } from "react";

import subscribeToUser from "../../services/user/subscribe-user";
import { useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";

export function useUserListener(userId: string | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUser(userId, (user) => {
      dispatch(updateAuthUser(user));
    });

    return () => {
      unsubscribe();
    };
  }, [userId, dispatch]);
}
