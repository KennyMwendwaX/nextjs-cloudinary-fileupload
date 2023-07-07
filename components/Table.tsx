import TableRow from "./TableRow";
import type File from "@/types/File";

interface Props {
  files: File[];
}

export default function Table({ files }: Props) {
  return (
    <>
      {files.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="rounded-t-lg bg-gray-200 text-xs uppercase text-gray-900">
              <tr>
                <th scope="col" className="px-4 py-3">
                  No.
                </th>
                <th scope="col" className="px-4 py-3">
                  Filename
                </th>
                <th scope="col" className="px-4 py-3">
                  Filesize
                </th>
                <th scope="col" className="px-4 py-3">
                  Filetype
                </th>
                <th scope="col" className="px-4 py-3">
                  Download Count
                </th>
                <th scope="col" className="px-4 py-3">
                  Download
                </th>
                <th scope="col" className="px-4 py-3">
                  Delete
                </th>
                <th scope="col" className="px-4 py-3">
                  Date Uploaded
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <TableRow key={file.id} index={index + 1} file={file} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          No files available, click the Upload File button to add a file.
        </div>
      )}
    </>
  );
}
