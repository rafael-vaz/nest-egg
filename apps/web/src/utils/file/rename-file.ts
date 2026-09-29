function renameFile(file: File, newName: string): File {
  return new File([file], newName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

export default renameFile;
