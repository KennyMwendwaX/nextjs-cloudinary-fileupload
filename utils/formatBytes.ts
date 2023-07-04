export default function formatBytes(size: number) {
  if (size < 1024) return size + " bytes";
  else if (size < 1048576) return (size / 1024).toFixed(1) + " KB";
  else if (size < 1073741824) return (size / 1048576).toFixed(1) + " MB";
  else return (size / 1073741824).toFixed(1) + " GB";
}
