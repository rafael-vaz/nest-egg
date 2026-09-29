function convertFileSize(size: number): string {
  const KB = 1024;
  const MB = KB * 1024;

  if (size < MB) {
    const KBsize = size / KB;
    return `${KBsize.toFixed(2)} kB`;
  } else {
    const MBsize = size / MB;
    return `${MBsize.toFixed(2)} MB`;
  }
}

export default convertFileSize;
