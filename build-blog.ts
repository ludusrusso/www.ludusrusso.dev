import { glob } from "glob";
import { promises as fs } from "fs";
import matter from "gray-matter";
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
  draft?: boolean;
  tags: string[];
  [key: string]: any;
}

const getBlogData = async () => {
  const files = await getFiles();
  const datas = await Promise.all(
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
        frontMatter: {
          path: postPath,
          author,
          draft: data.draft || false,
          readTime: readTime === 1 ? "1 min" : `${readTime} mins`,
          published: new Date(data.date),
          publishedReadable: printDate(new Date(data.date)),
          featured: Boolean(data.featured) || false,
          tags: data.tags?.map((t) => t.toLowerCase()) || [],
          title: data.title,
          description: data.description,
          lang: data.lang || "it",
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
  return datas.filter((d) => !d.frontMatter.draft);
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
    const contentDir = path.resolve(__dirname, "public/content");
    glob(contentDir + "/**/*.{md,mdx}", (err, files) => {
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

const wpm = 225;
function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
}

async function build() {
  const data = (await getBlogData()).sort(
    (a, b) =>
      b.frontMatter.published.getTime() - a.frontMatter.published.getTime()
  );

  await fs.writeFile(
    __dirname + "/blog.ts",
    "export const data = " + JSON.stringify(data)
  );

  console.log("blog created!");
}

build();
