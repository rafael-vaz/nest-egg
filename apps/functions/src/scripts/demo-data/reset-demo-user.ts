/**
 * One-off reset for the promo-video demo account: wipes every document
 * under `nest-egg-users/{uid}/{transactions,goals,collections,
 * walletLedger}` for the single user resolved from DEMO_USER_EMAIL, and
 * resets that user's `wallet`/`walletUpdatedAt` fields to a clean
 * baseline. Every other field on the user doc (name, photoURL, etc.) is
 * left untouched.
 *
 * Refuses to run (throws, no writes) unless the email resolved from
 * Firebase Auth for the target uid is an exact match for DEMO_USER_EMAIL
 * — see assertDemoUserEmail.
 *
 * Idempotent — each subcollection is deleted by querying its live
 * contents (not a fixed id list), so running this against an
 * already-empty account is a safe no-op. Meant to be run immediately
 * before seed-demo-user.ts, as many times as a recording retake needs.
 *
 * NOT exported from `src/index.ts` and NOT deployed as a Cloud Function.
 * Run manually, once per reset, against the real project:
 *
 *   npx ts-node src/scripts/demo-data/reset-demo-user.ts
 *
 * with `GOOGLE_APPLICATION_CREDENTIALS` pointing at a service account for
 * the target Firebase project (or any other way of providing
 * firebase-admin with default credentials for that project).
 */
import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {assertDemoUserEmail} from "./assert-demo-user-email";

const DEMO_USER_EMAIL = "ferreira.vaz@live.com";
const DEMO_SUBCOLLECTIONS = [
  "transactions",
  "goals",
  "collections",
  "walletLedger",
] as const;

/**
 * Deletes every document in one subcollection of the demo user and
 * returns how many were deleted.
 * @param {FirebaseFirestore.Firestore} db - Firestore instance
 * @param {string} uid - Demo user's id
 * @param {string} subcollection - Subcollection name under the user doc
 * @return {Promise<number>} Number of documents deleted
 */
async function resetSubcollection(
  db: FirebaseFirestore.Firestore,
  uid: string,
  subcollection: string,
): Promise<number> {
  const ref = db.collection(`nest-egg-users/${uid}/${subcollection}`);
  const snapshot = await ref.get();
  const count = snapshot.size;
  await db.recursiveDelete(ref);
  return count;
}

/**
 * Resets the promo-video demo account to a clean, data-free state.
 * @return {Promise<void>} Resolves once every demo subcollection is empty
 *   and the wallet is reset
 */
async function resetDemoUser(): Promise<void> {
  initializeApp();
  const db = getFirestore();

  const user = await getAuth().getUserByEmail(DEMO_USER_EMAIL);
  assertDemoUserEmail(user.email ?? "", DEMO_USER_EMAIL);

  for (const subcollection of DEMO_SUBCOLLECTIONS) {
    const count = await resetSubcollection(db, user.uid, subcollection);
    console.log(`Deleted ${count} document(s) from ${subcollection}`);
  }

  await db.doc(`nest-egg-users/${user.uid}`).update({
    wallet: 0,
    walletUpdatedAt: new Date().toISOString(),
  });

  console.log("Demo user reset complete");
}

resetDemoUser().catch((error) => {
  console.error("Demo user reset failed:", error);
  process.exit(1);
});
