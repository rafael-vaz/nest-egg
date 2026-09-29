import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";

async function deleteCollectionService(collectionId: string, userId: string) {
  try {
    const collectionRef = doc(
      db,
      "nest-egg-users",
      userId,
      "collections",
      collectionId,
    );
    await deleteDoc(collectionRef);
    console.log("Collection deleted successfully!");
    toast.success("Coleção removida com sucesso!");
  } catch (error) {
    console.error("Error deleting collection:", error);
    toast.error("Falha ao remover coleção!");
    throw error;
  }
}

export default deleteCollectionService;
