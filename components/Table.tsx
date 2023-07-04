import TableRow from "./TableRow";

interface File {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  createdAt: number;
}

interface Props {
  files: File[];
}

export default function Table({ files }: Props) {
  return (
    <>
      {files.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
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
