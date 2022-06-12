import path from "path";
import { promises as fs } from "fs";
import { glob } from "glob";

async function copyCoursesImages() {
  const src = path.resolve(__dirname, "..", "content");
  const dst = path.resolve(__dirname, "..", "public", ".content");
  try {
    await fs.rm(dst, { recursive: true });
  } catch {}
  await fs.mkdir(dst, { recursive: true });

  const imgs = await getFiles(src + "/**/*.{jpg,jpeg,png}");
  imgs.forEach(async (img) => {
    const imgDst = img.replace(src, dst);
    const fldDst = path.dirname(imgDst);
    try {
      await fs.mkdir(fldDst, { recursive: true });
    } catch {}
    await fs.copyFile(img, imgDst);
  });
}

const getFiles = (p: string) => {
  return new Promise<string[]>((resolve, reject) => {
    glob(p, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
};

copyCoursesImages().then(() => console.log("ok"));
