const formatFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w.-]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

export default formatFileName;
