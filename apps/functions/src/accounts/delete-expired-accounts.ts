import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {getStorage} from "firebase-admin/storage";
import * as logger from "firebase-functions/logger";

import {isAccountExpired} from "./is-account-expired";

const EXPIRY_DAYS = 7;

/**
 * Deletes a single user's Firestore data, Storage files, and Auth account.
 * @param {string} uid - The user's id
 * @return {Promise<void>} Resolves once everything for this user is gone
 */
async function deleteAccount(uid: string): Promise<void> {
  const db = getFirestore();
  await db.recursiveDelete(db.doc(`nest-egg-users/${uid}`));

  const [files] = await getStorage()
    .bucket()
    .getFiles({prefix: `nest-egg/users/${uid}/`});
  await Promise.all(files.map((file) => file.delete()));

  await getAuth().deleteUser(uid);
}

/**
 * Finds every account older than the trial window — except the one
 * exempted via OWNER_EMAIL — and deletes it entirely.
 * @return {Promise<void>} Resolves once every expired account is processed
 */
export async function deleteExpiredAccounts(): Promise<void> {
  const exemptEmail = process.env.OWNER_EMAIL;
  const now = new Date();

  let deletedCount = 0;
  let nextPageToken: string | undefined;

  do {
    const page = await getAuth().listUsers(1000, nextPageToken);

    for (const user of page.users) {
      const expired = isAccountExpired({
        email: user.email,
        creationTime: user.metadata.creationTime,
        now,
        exemptEmail,
        expiryDays: EXPIRY_DAYS,
      });

      if (!expired) continue;

      try {
        await deleteAccount(user.uid);
        deletedCount++;
      } catch (error) {
        logger.error("failed to delete expired account", {
          uid: user.uid,
          error,
        });
      }
    }

    nextPageToken = page.pageToken;
  } while (nextPageToken);

  logger.info("expired account cleanup complete", {deletedCount});
}
