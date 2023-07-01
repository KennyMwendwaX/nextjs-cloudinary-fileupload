import { GetServerSideProps } from "next";
import fs from "fs/promises";
import path from "path";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Props {
  dirs: string[];
}

export default function Home({ dirs }: Props) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; // Guard clause
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;
      const formData = new FormData();
      formData.append("myImage", selectedFile);
      const { data } = await axios.post("/api/image", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6 p-20">
        <label>
          <input type="file" hidden onChange={handleFileChange} />
          <div className="flex aspect-video w-40 cursor-pointer items-center justify-center rounded border-2 border-dashed">
            {selectedImage ? (
              <img src={selectedImage} alt="" />
            ) : (
              <span className="text-black">Select Image</span>
            )}
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{ opacity: uploading ? ".5" : "1" }}
          className="w-32 rounded bg-red-600 p-3 text-center text-white">
          {uploading ? "Uploading.." : "Upload"}
        </button>
        <div className="mt-20 flex flex-col space-y-3">
          {dirs.map((item) => (
            <Link key={item} href={"/images/" + item}>
              <a className="text-blue-500 hover:underline">{item}</a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
    props.dirs = dirs as any;
    return { props };
  } catch (error) {
    return { props };
  }
};
