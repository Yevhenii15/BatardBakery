import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  // Important: let formidable handle the body, not Nitro
  bodyParser: false,
};

export default defineEventHandler(async (event) => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  try {
    const result = await new Promise<{ url: string }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) return reject(err);

        // ---- delete old file if oldUrl passed ----
        const oldField = fields.oldUrl;
        if (oldField) {
          const oldUrls = Array.isArray(oldField) ? oldField : [oldField];
          for (const old of oldUrls) {
            const clean = String(old).replace(/^\//, "");
            const oldPath = path.join(process.cwd(), "public", clean);
            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        }

        // ---- get uploaded file safely ----
        let file: File | undefined;
        const filesAny = files as any;
        const fileField = filesAny.file;

        if (Array.isArray(fileField)) {
          file = fileField[0] as File;
        } else if (fileField) {
          file = fileField as File;
        }

        if (!file) {
          return reject(new Error("No file uploaded"));
        }

        const url = `/uploads/${path.basename(file.filepath)}`;
        resolve({ url });
      });
    });

    return result;
  } catch (err) {
    console.error("Upload error:", err);
    setResponseStatus(event, 500);
    return { message: "Upload failed" };
  }
});
