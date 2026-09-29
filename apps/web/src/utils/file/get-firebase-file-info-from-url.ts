function getFirebaseFileInfoFromURL(url: string): {
  fileName: string;
  folderPath: string;
  extension: string | null;
} | null {
  try {
    const regex = /\/o\/(.+?)\?/;
    const match = url.match(regex);

    if (!match || match.length < 2) return null;

    const encodedPath = match[1];
    const decodedPath = decodeURIComponent(encodedPath);
    const parts = decodedPath.split("/");

    const fileName = parts.pop()!;
    const folderPath = parts.join("/");

    const dotIndex = fileName.lastIndexOf(".");
    const extension =
      dotIndex !== -1 ? fileName.slice(dotIndex + 1).toLowerCase() : null;

    return { fileName, folderPath, extension };
  } catch (error) {
    console.error("Erro ao extrair informações do URL do Firebase:", error);
    return null;
  }
}
export default getFirebaseFileInfoFromURL;
