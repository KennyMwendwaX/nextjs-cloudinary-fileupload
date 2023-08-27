import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
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
    options.uploadDir = path.join(process.cwd(), "/public/files");
    options.filename = (name, ext, path, form) => {
      return path.originalFilename as string;
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
        const uploaded_file = await prisma.file.create({
          data: {
            filename: file.newFilename,
            fileType: file.mimetype as string,
            fileSize: file.size,
            filePath: file.filepath,
          },
        });

        if (uploaded_file) {
          resolve({ fields, files });
        } else {
          reject(new Error("Failed to save file details to the database."));
        }
      } catch (error) {
        reject(error);
      }
    });
  });
};

const getFormData = async (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          // Access the fields under the "product" key
          const productFields = JSON.parse(fields.product[0]);
          resolve({ fields: productFields, files });
        }
      });
    }
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { fields, files } = await getFormData(req);

    const myFiles = files.picture as formidable.File[];
    const file = myFiles[0];

    const uploadedImage = await cloudinary.uploader.upload(file.filepath, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });

    if (!uploadedImage)
      return res.status(500).json({ message: "Image upload failed" });

    const file_uploaded = await prisma.file.create({
      data: {
        filename: file.newFilename,
        fileType: file.mimetype as string,
        fileSize: file.size,
        filePath: file.filepath,
      },
    });

    if (!file_uploaded) {
      return res.status(500).json({ message: "File upload failed" });
    } else {
      return res.status(201).json({ message: "File uploaded successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
