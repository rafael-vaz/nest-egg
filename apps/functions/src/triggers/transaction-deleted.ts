import {onDocumentDeleted} from "firebase-functions/v2/firestore";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

export const onTransactionDeleted = onDocumentDeleted(
  "nest-egg-users/{userId}/transactions/{transactionId}",
  async (event) => {
    const {userId, transactionId} = event.params;
    const db = getFirestore();
    const ledgerRef = db.doc(
      `nest-egg-users/${userId}/walletLedger/${transactionId}`,
    );

    try {
      await db.runTransaction(async (tx) => {
        const ledgerSnap = await tx.get(ledgerRef);
        if (!ledgerSnap.exists) return;

        const totalApplied = (ledgerSnap.data()?.totalApplied as number) ?? 0;
        if (totalApplied !== 0) {
          tx.update(db.doc(`nest-egg-users/${userId}`), {
            wallet: FieldValue.increment(-totalApplied),
            walletUpdatedAt: new Date().toISOString(),
          });
        }

        tx.delete(ledgerRef);
      });

      logger.info("wallet reverted for deleted transaction", {
        userId,
        transactionId,
      });
    } catch (error) {
      logger.error("failed to revert wallet for deleted transaction", {
        userId,
        transactionId,
        error,
      });
      throw error;
    }
  },
);
