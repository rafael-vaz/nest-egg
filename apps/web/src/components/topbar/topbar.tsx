import { ListChecks, Plus, Wallet } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import formatCurrency from "../../utils/text/format-currency";
import Button from "../button/button";
import UserCard from "../user-card/user-card";
import styles from "./topbar.module.css";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authUser } = useSelector((state: RootState) => state.userAuth);

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarButtons}>
        <Button
          id="topbar-wallet-button"
          icon={Wallet}
          color="green"
          text={
            authUser?.wallet !== undefined
              ? formatCurrency(`${authUser.wallet}`)
              : "Carteira"
          }
          title="Carteira"
          aria-label="Acessar Carteira"
          onClick={() => navigate("wallet")}
        />
        <Button
          id="topbar-goals-button"
          icon={ListChecks}
          color="dark-gray"
          text="Ver Metas"
          title="Metas"
          aria-label="Acessar Metas"
          onClick={() => navigate("goals")}
        />
        <Button
          id="topbar-create-button"
          icon={Plus}
          color="dark-gray"
          title="Criar"
          aria-label="Acessar Menu de Criação"
          onClick={() => dispatch(openModalState({ id: "create" }))}
          size="small"
        />
      </div>
      <UserCard />
    </div>
  );
};

export default Topbar;
