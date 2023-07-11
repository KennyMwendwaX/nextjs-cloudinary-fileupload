import AddFile from "@/components/AddFile";
import Table from "@/components/Table";
import Head from "next/head";
import { useEffect, useState } from "react";
import type File from "@/types/File";

export default function Upload() {
  const [files, setFiles] = useState<File[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      const data = await response.json();
      // Sort Files by createdAt in descending order
      const sortedFiles: File[] = data.sort(
        (a: File, b: File) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setFiles(sortedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <>
      <Head>
        <title>File Upload</title>
        <meta name="description" content="iNotes is notes web application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto mb-2 px-5 pt-12">
        <AddFile fetchFiles={fetchFiles} />
        <Table files={files} fetchFiles={fetchFiles} />
      </div>
    </>
  );
}
