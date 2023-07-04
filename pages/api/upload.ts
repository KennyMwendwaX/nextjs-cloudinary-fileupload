import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/utils/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = async (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);
      // The name "uploadedFile" comes from formData.append("uploadedFile", selectedFile)
      const myFiles = files.uploadedFile as formidable.File[];
      const file = myFiles[0];

      try {
        await prisma.file.create({
          data: {
            filename: file.newFilename,
            originalName: file.originalFilename as string,
            fileType: file.mimetype as string,
            fileSize: file.size,
            filePath: file.filepath,
          },
        });
        resolve({ fields, files });
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);

  res.status(201).json({ message: "File uploaded successfully" });
}
