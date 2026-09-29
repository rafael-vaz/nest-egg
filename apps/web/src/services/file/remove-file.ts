import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast } from "react-toastify";

async function deleteFileService(
  fullPath: string,
  filename: string,
): Promise<void> {
  const storage = getStorage();
  const path = `nest-egg/${fullPath}/${filename}`;
  const storageRef = ref(storage, path);

  try {
    await deleteObject(storageRef);
    toast.success("Arquivo removido com sucesso!");
    console.log("File successfully removed:", path);
  } catch (error) {
    toast.error("Falha ao remover arquivo!");
    console.error("Error when removing the file:", error);
    throw error;
  }
}

export default deleteFileService;
