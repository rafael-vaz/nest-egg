const getFileExtension = (fileName: string) => {
  const extension = fileName
    .substring(fileName.lastIndexOf(".") + 1)
    .toLowerCase();
  return extension;
};

export default getFileExtension;
