import { CircleDollarSign } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import createActivityService from "../../services/activity/create-activity";
import { RootState, useAppDispatch } from "../../store/configure-store";
import { openModalState } from "../../store/reducers/modal/modal";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { setLoading } from "../../store/reducers/user/user-finances";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import formatRelativeDate from "../../utils/date/format-relative-date";
import sortByKey from "../../utils/sort-by-key";
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
  const { transactions } = useSelector(
    (state: RootState) => state.userFinances,
  );

  const lastOccurrence = React.useMemo(() => {
    const occurrences = transactions.flatMap((transaction) =>
      (transaction.occurrenceLog ?? []).map((log) => ({
        ...log,
        transactionId: transaction.id,
      })),
    );
    if (occurrences.length === 0) return null;
    return sortByKey<(typeof occurrences)[number]>(
      occurrences,
      "date",
      true,
    ).at(-1)!;
  }, [transactions]);

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
      walletUpdatedAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      await dispatch(updateUserThunk(user)).unwrap();

      dispatch(updateAuthUser(user));

      await createActivityService(
        {
          type: "wallet.updated",
          entity: { type: "wallet", id: null, name: null },
          changes: {
            value: { from: authUser.wallet ?? null, to: newWalletValue },
          },
        },
        authUser.uid,
      );

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
          {lastOccurrence ? (
            <button
              type="button"
              className={styles.value}
              data-type={lastOccurrence.type}
              aria-label={`${lastOccurrence.type === "debt" ? "Débito" : "Crédito"} de ${formatCurrency(`${lastOccurrence.value}`)}`}
              onClick={() =>
                dispatch(
                  openModalState({
                    id: "update-transaction",
                    entity: lastOccurrence.transactionId,
                  }),
                )
              }
            >
              <span aria-hidden={true}>
                {lastOccurrence.type === "debt" ? "-" : "+"}{" "}
                {formatCurrency(`${lastOccurrence.value}`)}
              </span>
            </button>
          ) : (
            formatCurrency("0")
          )}
        </p>
      </div>

      <span className={styles.walletBalanceCardLastUpdate}>
        {authUser?.walletUpdatedAt
          ? `Atualizado ${formatRelativeDate(new Date(authUser.walletUpdatedAt))}`
          : "Atualizando informações..."}
      </span>
    </Card>
  );
};

export default WalletBalanceCard;
