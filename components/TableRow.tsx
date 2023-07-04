import formatBytes from "@/utils/formatBytes";
import { formatDateTime } from "@/utils/formatDateTime";
import { HiDownload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";

interface File {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  createdAt: number;
}

interface Props {
  file: File;
  index: number;
}

export default function TableRow({ file, index }: Props) {
  return (
    <>
      <tr className="border-b">
        <td className="px-4 py-3">{index}</td>
        <td className="px-4 py-3">{file.filename}</td>
        <td className="px-4 py-3">{formatBytes(file.fileSize)}</td>
        <td className="px-4 py-3">
          {/* onClick={() => handleDownload(file.id)}  */}
          <button>
            <HiDownload className="h-6 w-6 cursor-pointer" />
          </button>
        </td>
        <td className="px-4 py-3">
          {/* onClick={() => handleDelete(file.id)} */}
          <button>
            <FaTrash className="h-6 w-6 cursor-pointer" />
          </button>
        </td>
        <td className="px-4 py-3">{formatDateTime(file.createdAt)}</td>
      </tr>
    </>
  );
}
