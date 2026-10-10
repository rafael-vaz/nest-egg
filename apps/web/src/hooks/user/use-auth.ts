import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useDispatch } from "react-redux";

import { IUser } from "../../@types/user";
import { auth } from "../../services/firebase";
import readUserService from "../../services/user/read-user";
import {
  clearAuthUser,
  updateAuthUser,
} from "../../store/reducers/user/user-auth";

const useAuth = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const savedUser = await readUserService(user.uid);
          if (savedUser) {
            const userData: IUser = {
              ...savedUser,
              emailVerified: user.emailVerified,
            };
            dispatch(updateAuthUser(userData));
          } else {
            console.warn("Authenticated user, it was not found in the bank.");
            dispatch(clearAuthUser());
          }
        } catch (error) {
          console.error("Error ao carregar dados do usuário:", error);
          dispatch(clearAuthUser());
        }
      } else {
        dispatch(clearAuthUser());
      }
      return () => unsubscribe();
    });
  }, [dispatch]);
};

export default useAuth;
