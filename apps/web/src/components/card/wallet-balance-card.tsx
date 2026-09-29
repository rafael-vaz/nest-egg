import { CircleDollarSign } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { setLoading } from "../../store/reducers/user/user-finances";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import formatCurrency from "../../utils/text/format-currency";
import formatCurrencyInput from "../../utils/text/format-currency-input";
import parseCurrency from "../../utils/text/parse-currency";
import InputEditField from "../input/input-edit-field";
import Card from "./card";
import cardStyles from "./card.module.css";
import styles from "./wallet-balance-card.module.css";

const WalletBalanceCard = () => {
  const [walletValue, setWalletValue] = React.useState(0);

  const { authUser } = useSelector((state: RootState) => state.userAuth);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (authUser?.wallet !== undefined) {
      setWalletValue(authUser.wallet);
    }
  }, [authUser?.wallet]);

  async function updateWalletValue(value: string) {
    if (!authUser) {
      return;
    }

    const newWalletValue = parseCurrency(value);

    if (newWalletValue === authUser.wallet) {
      return;
    }

    const user = {
      uid: authUser.uid,
      hasAlert: false,
      wallet: newWalletValue,
    };

    try {
      setLoading(true);

      await dispatch(updateUserThunk(user));

      dispatch(updateAuthUser(user));

      setWalletValue(newWalletValue);

      toast.success("Valor da carteira alterado!");
    } catch (error) {
      console.log(`Error in registering user: ${error}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card id="wallet-balance" title="Valor na carteira" icon={CircleDollarSign}>
      <div className={styles.walletBalanceCardMainContent}>
        <InputEditField
          id="wallet-value"
          className={`${cardStyles.cardEmphasisText} ${styles.walletBalanceCardTitle}`}
          placeholder="R$ 0,00"
          callback={updateWalletValue}
          onInput={formatCurrencyInput}
          value={formatCurrency(`${walletValue}`)}
        />

        <p className={styles.walletBalanceCardLastTransaction}>
          Transações recentes:{" "}
          <span
            className={styles.value}
            data-type="credit"
            aria-label="Crédito de R$ 250,00"
          >
            <span aria-hidden={true}>+ R$ 250,00</span>
          </span>
        </p>
      </div>

      <span className={styles.walletBalanceCardLastUpdate}>
        Atualizado há 2 semanas
      </span>
    </Card>
  );
};

export default WalletBalanceCard;
