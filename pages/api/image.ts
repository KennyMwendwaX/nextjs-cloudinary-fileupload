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
      let filename,
        originalName,
        fileType,
        fileSize,
        filePath = null;
      if (!Array.isArray(files.file)) {
        filename = files.file.newFilename;
        originalName = files.file.originalFilename;
        fileType = files.file.mimetype;
        fileSize = files.file.size;
        filePath = files.file.filepath;
      }

      try {
        await prisma.file.create({
          data: {
            filename: filename as string,
            originalName: originalName as string,
            fileType: fileType as string,
            fileSize: fileSize as number,
            filePath: filePath as string,
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
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }
  await readFile(req, true);

  res.status(201).json({ message: "File uploaded successfully" });
}
