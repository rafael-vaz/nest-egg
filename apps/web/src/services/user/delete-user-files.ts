import { deleteObject, getStorage, listAll, ref } from "firebase/storage";
import { toast } from "react-toastify";

async function deleteUserFilesService(userId: string): Promise<void> {
  const storage = getStorage();
  const folderRef = ref(storage, `nest-egg/users/${userId}/`);

  try {
    const result = await listAll(folderRef);
    const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));

    await Promise.all(deletePromises);

    const folderPromises = result.prefixes.map((subfolderRef) =>
      deleteUserFilesService(
        subfolderRef.fullPath.replace("nest-egg/users/", ""),
      ),
    );
    await Promise.all(folderPromises);

    console.log(`Folder successfully cleared: nest-egg/users/${userId}/`);
  } catch (error) {
    toast.error("Falha ao remover os arquivos do usuário!");
    console.error("Error removing folder:", error);
    throw error;
  }
}

export default deleteUserFilesService;
