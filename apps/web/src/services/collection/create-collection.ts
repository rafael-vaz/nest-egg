import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { ICollection } from "../../@types/collection";
import { db } from "../firebase";

async function createCollectionService(
  collection: ICollection,
  userId: string,
) {
  try {
    const collectionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "collections",
      collection.id,
    );
    await setDoc(collectionRef, collection);
    console.log("Successfully created collection!");
    toast.success("Coleção criada com sucesso!");
  } catch (error) {
    console.error("Error when creating collection:", error);
    toast.error("Falha ao criar coleção!");
    throw error;
  }
}

export default createCollectionService;
