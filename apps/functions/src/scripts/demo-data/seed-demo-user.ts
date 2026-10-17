/**
 * One-off seed for the promo-video demo account: writes the fixed dataset
 * from buildDemoDataset() — collections, goals, and transactions — for
 * the single user resolved from DEMO_USER_EMAIL, then reconciles the
 * wallet via the same reconcileWallet() function the app's own Cloud
 * Function triggers call, so the resulting balance is produced by
 * production logic rather than hand-set.
 *
 * Refuses to run (throws, no writes) unless the email resolved from
 * Firebase Auth for the target uid is an exact match for DEMO_USER_EMAIL
 * — see assertDemoUserEmail.
 *
 * Expected to run immediately after reset-demo-user.ts, against an
 * account with empty demo subcollections. Logs the final wallet value so
 * the operator can compare it against the documented baseline (425000
 * centavos) before opening the app.
 *
 * NOT exported from `src/index.ts` and NOT deployed as a Cloud Function.
 * Run manually, once per seed, against the real project:
 *
 *   npx ts-node src/scripts/demo-data/seed-demo-user.ts
 *
 * with `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service account for
 * the target Firebase project (or any other way of providing
 * firebase-admin with default credentials for that project).
 */
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {assertDemoUserEmail} from "./assert-demo-user-email";
import {buildDemoDataset} from "./dataset";
import {reconcileWallet} from "../../wallet/reconcile-wallet";

const DEMO_USER_EMAIL = "ferreira.vaz@live.com";

/**
 * Seeds the promo-video demo account with the fixed demo dataset.
 * @return {Promise<void>} Resolves once every document is written and the
 *   wallet is reconciled
 */
async function seedDemoUser(): Promise<void> {
  initializeApp();
  const db = getFirestore();

  const user = await getAuth().getUserByEmail(DEMO_USER_EMAIL);
  assertDemoUserEmail(user.email ?? "", DEMO_USER_EMAIL);

  const dataset = buildDemoDataset(new Date());

  for (const collection of dataset.collections) {
    await db
      .doc(`nest-egg-users/${user.uid}/collections/${collection.id}`)
      .set(collection);
  }
  console.log(`Wrote ${dataset.collections.length} collection(s)`);

  for (const goal of dataset.goals) {
    await db
      .doc(`nest-egg-users/${user.uid}/goals/${goal.id}`)
      .set(goal);
  }
  console.log(`Wrote ${dataset.goals.length} goal(s)`);

  for (const transaction of dataset.transactions) {
    await db
      .doc(`nest-egg-users/${user.uid}/transactions/${transaction.id}`)
      .set(transaction);
  }
  console.log(`Wrote ${dataset.transactions.length} transaction(s)`);

  for (const transaction of dataset.transactions) {
    await reconcileWallet(user.uid, transaction.id, transaction.occurrenceLog);
  }
  console.log("Wallet reconciled for every seeded transaction");

  const userSnap = await db.doc(`nest-egg-users/${user.uid}`).get();
  console.log(`Final wallet value: ${userSnap.data()?.wallet}`);

  console.log("Demo user seed complete");
}

seedDemoUser().catch((error) => {
  console.error("Demo user seed failed:", error);
  process.exit(1);
});
