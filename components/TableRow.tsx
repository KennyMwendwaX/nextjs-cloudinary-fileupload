import formatBytes from "@/utils/formatBytes";
import { formatDateTime } from "@/utils/formatDateTime";
import { HiDownload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import type File from "@/types/File";
import { useRouter } from "next/router";

interface Props {
  file: File;
  index: number;
  fetchFiles: () => void;
}

export default function TableRow({ file, index, fetchFiles }: Props) {
  const router = useRouter();

  const handleDelete = async (fileId: string) => {
    await fetch(`/api/delete/${fileId}`, {
      method: "DELETE",
    });
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await fetch(`/api/download/${fileId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "file";

      // Create a temporary link and simulate a click to trigger the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // Clean up the temporary link and revoke the URL
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }

    fetchFiles();
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await fetch(`/api/delete/${id}`, {
        method: "DELETE",
      });
      // fetchFiles(); // Fetch the updated list of files after deletion
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <>
      <tr className="border-b border-gray-300">
        <td className="px-4 py-3">{index}</td>
        <td className="px-4 py-3">{file.filename}</td>
        <td className="px-4 py-3">{formatBytes(file.fileSize)}</td>
        <td className="px-4 py-3">{file.fileType}</td>
        <td className="px-4 py-3">{file.downloadCount}</td>
        <td className="px-4 py-3">
          <button onClick={() => handleDownload(file.id)}>
            <HiDownload className="h-5 w-5 cursor-pointer" />
          </button>
        </td>
        <td className="px-4 py-3">
          <button onClick={() => handleDelete(file.id)}>
            <FaTrash className="h-4 w-4 cursor-pointer" />
          </button>
        </td>
        <td className="px-4 py-3">{formatDateTime(file.createdAt)}</td>
      </tr>
    </>
  );
}
