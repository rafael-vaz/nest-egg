import { Calculator, Download } from "lucide-react";

import { useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import Button from "../button/button";
import styles from "./resource-menu.module.css";

const ResourceMenu = () => {
  const dispatch = useAppDispatch();
  return (
    <ul className={styles.resourceMenu}>
      <li>
        <Button
          title="Baixar relatório"
          aria-label="Baixar relatório"
          size="small"
          icon={Download}
        />
      </li>
      <li>
        <Button
          title="Calculadora"
          aria-label="Acessar calculadora"
          size="small"
          color="purple"
          icon={Calculator}
          onClick={() => dispatch(openModalState({ id: "calculator" }))}
        />
      </li>
    </ul>
  );
};

export default ResourceMenu;
