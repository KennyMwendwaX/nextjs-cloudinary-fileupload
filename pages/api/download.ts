import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { prisma } from "@/utils/db";

const statAsync = promisify(fs.stat);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const fileId = req.query.id as string;

    try {
      const file = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file) {
        res.status(404).json({ message: "File not found" });
        return;
      }

      const filePath = path.join(
        process.cwd(),
        "public",
        "images",
        file.filename
      );

      const fileStats = await statAsync(filePath);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`
      );
      res.setHeader("Content-Length", fileStats.size.toString());
      res.setHeader("Content-Type", file.fileType);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error retrieving file:", error);
      res.status(500).json({ message: "Failed to retrieve file" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
