import { doc, getDoc } from "firebase/firestore";

import { ICollection } from "../../@types/collection";
import { db } from "../firebase";

async function readCollectionService(
  collectionId: string,
  userId: string
): Promise<ICollection | null> {
  try {
    const collectionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "collections",
      collectionId
    );
    const userSnap = await getDoc(collectionRef);

    if (userSnap.exists()) {
      return userSnap.data() as ICollection;
    } else {
      console.warn("Collection not found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading collection:", error);
    throw error;
  }
}

export default readCollectionService;
