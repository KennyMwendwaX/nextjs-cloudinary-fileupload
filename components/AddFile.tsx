import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import axios from "axios";

export default function AddFile() {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Guard clause
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("uploadedFile", selectedFile);
      const { data } = await axios.post("/api/upload", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  return (
    <>
      <button
        onClick={handleModalToggle}
        className="mb-4 flex items-center rounded-lg border border-gray-400 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-800 hover:bg-gray-800 hover:text-gray-100 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200">
        <HiPlus className="mr-1 h-5 w-5" />
        Add File
      </button>

      {/* Modal */}
      {showModal && (
        <div
          id="defaultModal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed left-0 right-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
          {/* Modal content */}
          <div className="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow sm:p-5">
            {/* Modal header */}
            <div className="mb-4 flex items-center justify-between rounded-t border-b pb-4 sm:mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload File
              </h3>
              <button
                type="button"
                onClick={handleModalToggle}
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                data-modal-toggle="defaultModal">
                <MdClose className="h-6 w-6" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div>
              <div>
                <div className="mb-1 text-sm font-medium">Upload File</div>
                <input
                  type="file"
                  className="text-grey-500 w-full cursor-pointer rounded-lg border-2 border-gray-900 bg-gray-50 pr-20 text-sm file:mr-5 file:border-0 file:bg-gray-900
             file:px-6 file:py-2 file:text-sm file:font-medium file:text-white hover:file:cursor-pointer"
                  onChange={handleFileChange}
                />
                <p className="mt-1 text-xs text-gray-500">
                  IMG, DOCX, PDF or mp3 (MAX. 800x800px).
                </p>
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading}
                style={{ opacity: uploading ? ".5" : "1" }}
                className="mt-4 w-32 rounded bg-red-600 py-2 text-center text-white">
                {uploading ? "Uploading.." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
