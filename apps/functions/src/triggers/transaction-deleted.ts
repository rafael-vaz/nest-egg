import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {reconcileWallet} from "../wallet/reconcile-wallet";

export const onTransactionDeleted = onDocumentDeleted(
  "nest-egg-users/{userId}/transactions/{transactionId}",
  async (event) => {
    const {userId, transactionId} = event.params;

    try {
      // reconcileWallet(..., null) already reverses everything previously
      // applied for this transaction and removes its ledger entry.
      await reconcileWallet(userId, transactionId, null);
    } catch (error) {
      logger.error("failed to reconcile wallet for deleted transaction", {
        userId,
        transactionId,
        error,
      });
      throw error;
    }
  },
);
