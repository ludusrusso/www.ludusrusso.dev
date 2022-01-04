import { glob } from "glob";
import { promises as fs } from "fs";
import matter from "gray-matter";
import { readingTime } from "./readtime";
import path from "path";

export interface Author {
  id: string;
  name: string;
  bio: string;
  profile: string;
}

const authors: Author[] = [
  {
    id: "ludusrusso",
    name: "Ludovico Russo",
    bio: "Dev Passionate",
    profile: "/imgs/authors/ludusrusso.jpg",
  },
  {
    id: "sgabello",
    name: "Gabriele Ermacora",
    bio: "Dev Passionate",
    profile: "/imgs/authors/sgabello.jpg",
  },
  {
    id: "pietrochirio",
    name: "Pietro Chiro",
    bio: "Dev Passionate",
    profile: "/imgs/authors/pietrochirio.jpg",
  },
  {
    id: "fiorellazza",
    name: "Fiorella Sibona",
    bio: "Aspiring roboticist",
    profile: "/imgs/authors/fiorellazza.jpg",
  },
  {
    id: "ruslan",
    name: "Ruslan",
    bio: "Dev Passionate",
    profile: "/imgs/authors/ruslan.jpg",
  },
];

interface Data {
  title: string;
  description: string;
  image: string;
  date: string;
  path?: string;
  tags: string[];
  [key: string]: any;
}

export type PostData = Awaited<ReturnType<typeof _getBlogData>>[number];
export type PostFrontMatter = PostData["frontMatter"];

let blogData: PostData[];

export const getBlogData = async () => {
  if (!blogData) {
    blogData = await _getBlogData();
  }
  return blogData;
};

const _getBlogData = async () => {
  const files = (await getFiles()).filter((_, idx) => idx < 20);
  return Promise.all(
    files.map(async (file) => {
      const md = await fs.readFile(file);
      const { data, content } = matter(md) as unknown as {
        data: Data;
        content: string;
      };
      const author = authors.find((a) => a.id === data.author) || authors[0];
      const readTime = readingTime(content);
      const postPath = data.path || extractPathFromFile(file);
      return {
        file,
        content,
        frontMatter: {
          path: postPath,
          author,
          readTime: readTime === 1 ? "1 min" : `${readTime} mins`,
          published: new Date(data.date),
          publishedReadable: printDate(new Date(data.date)),
          featured: Boolean(data.featured) || false,
          tags: data.tags || [],
          title: data.title,
          description: data.description,
          href: path.join("/", postPath),
          image: path.join(
            "/",
            file.replace(process.cwd() + "/public", "/"),
            "..",
            data.image
          ),
          imagePath: path.join(
            "/",
            file.replace(process.cwd() + "/public", "/"),
            ".."
          ),
        },
      };
    })
  );
};

const extractPathFromFile = (file: string) => {
  const filename = file
    .replace(/index.md[x]?$/, "")
    .split("/")
    .filter((d) => !!d)
    .pop()!
    .split(".")[0];
  return filename.replace(
    /([0-9]*)-([0-9]*)-[0-9]*-(.*)$/,
    (_, yy, mm, slug: string) => {
      return `${yy}/${mm}/${slug.toLowerCase()}`;
    }
  );
};

async function getFiles() {
  return new Promise<string[]>((resolve, reject) => {
    const contentDir = path.resolve(process.cwd(), "public/content");
    glob(contentDir + "/**/*.{md, mdx}", (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files);
    });
  });
}

const months = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

function printDate(date: Date) {
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
