import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { ICollection } from "../../@types/collection";
import { db } from "../firebase";

async function updateCollectionService(
  collection: Partial<ICollection> & { id: string },
  userId: string,
  hasAlert: boolean = true,
) {
  try {
    const collectionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "collections",
      collection.id,
    );
    await setDoc(collectionRef, collection, { merge: true });
    console.log("Collection updated successfully!");
    if (hasAlert) {
      toast.success("Coleção atualizado com sucesso!");
    }
  } catch (error) {
    console.error("Error updating collection:", error);
    toast.error("Falha ao atualizar coleção!");
    throw error;
  }
}

export default updateCollectionService;
