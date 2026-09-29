import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";

async function uploadFileService(
  file: Blob | File,
  fullPath: string,
  filename: string,
): Promise<string> {
  const storage = getStorage();
  const path = `nest-egg/${fullPath}/${filename}`;
  const storageRef = ref(storage, path);

  try {
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    toast.success("Upload realizado com sucesso!");
    console.log("Uploaded successfully!");
    return downloadUrl;
  } catch (error) {
    toast.error("Falha ao realizar upload!");
    console.error("Error uploading the file:", error);
    throw error;
  }
}

export default uploadFileService;
