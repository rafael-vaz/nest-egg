import { ListChecks, Plus, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import Button from "../button/button";
import UserCard from "../user-card/user-card";
import styles from "./topbar.module.css";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarButtons}>
        <Button
          icon={Wallet}
          color="green"
          text="Carteira"
          aria-label="Acessar Carteira"
          onClick={() => navigate("wallet")}
        />
        <Button
          icon={ListChecks}
          color="dark-gray"
          text="Ver Metas"
          aria-label="Acessar Metas"
          onClick={() => navigate("goals")}
        />
        <Button
          icon={Plus}
          color="dark-gray"
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
