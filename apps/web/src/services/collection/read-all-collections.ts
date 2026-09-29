import { collection, getDocs } from "firebase/firestore";

import { ICollection } from "../../@types/collection";
import { db } from "../firebase";

async function readAllCollectionsService(
  userId: string
): Promise<ICollection[]> {
  try {
    const collectionsRef = collection(
      db,
      "nest-egg-users",
      userId,
      "collections"
    );
    const collectionsSnap = await getDocs(collectionsRef);
    const collections: ICollection[] = collectionsSnap.docs.map(
      (doc) => doc.data() as ICollection
    );
    return collections;
  } catch (error) {
    console.error("Error reading all collections:", error);
    throw error;
  }
}

export default readAllCollectionsService;
