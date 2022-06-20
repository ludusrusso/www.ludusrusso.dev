import { defineDocumentType, makeSource } from "contentlayer/source-files";
import path from "path";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
// @ts-ignore
import prism from "@mapbox/rehype-prism";

export const Book = defineDocumentType(() => ({
  name: "Book",
  filePathPattern: `books/**/*.(md|mdx)`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    slug: {
      type: "string",
      description: "the book slug",
      required: true,
    },
    author: {
      type: "string",
      required: true,
      description: "Book author",
    },
    image: {
      type: "string",
      required: true,
      description: "Book cover image",
    },
    links: {
      type: "json",
    },
  },
  computedFields: {
    imagePath: {
      type: "string",
      resolve: (book) => path.join("/.content", book._raw.sourceFileDir),
    },
    imageUrl: {
      type: "string",
      resolve: (book) =>
        path.join("/.content", book._raw.sourceFileDir, book.image),
    },
  },
}));

export const BlogPost = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `blog/**/*.(md|mdx)`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the post",
      required: true,
    },
    category: {
      type: "string",
      description: "The category of the post",
      default: "blog",
    },
    tags: {
      type: "list",
      description: "The tags of the post",
      of: {
        type: "string",
      },
      default: [],
    },
    date: {
      type: "date",
      description: "published date",
      required: true,
    },
    author: {
      type: "string",
      required: true,
      description: "User author",
      default: "ludusrusso",
    },
    image: {
      type: "string",
      required: true,
      description: "featured image",
    },
    headerImage: {
      type: "boolean",
      default: false,
      description: "show image in post",
    },
    path: {
      type: "string",
      description: "path of the post",
      required: false,
    },
    lang: {
      type: "string",
      default: "it",
      description: "language of the post",
    },
    slug: {
      type: "string",
    },
    draft: {
      type: "boolean",
      default: false,
    },
  },
  computedFields: {
    imagePath: {
      type: "string",
      resolve: (book) => path.join("/.content", book._raw.sourceFileDir),
    },
    imageUrl: {
      type: "string",
      resolve: (book) =>
        path.join("/.content", book._raw.sourceFileDir, book.image),
    },
    readTime: {
      type: "number",
      resolve: (post) => {
        const readTime = readingTime(post.body.raw);
        return readTime;
      },
    },
    publishedReadable: {
      type: "string",
      resolve: (post) => {
        return printDate(new Date(post.date));
      },
    },
    postPath: {
      type: "string",
      resolve: (post) => {
        return getPath(post.path, post._raw.sourceFilePath);
      },
    },
    href: {
      type: "string",
      resolve: (post) => {
        const postPath = getPath(post.path, post._raw.sourceFilePath);
        return path.join("/", postPath);
      },
    },
  },
}));

export const Course = defineDocumentType(() => ({
  name: "BlogPost",
  filePathPattern: `courses/**/*.(md|mdx)`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the post",
      required: true,
    },
    category: {
      type: "string",
      description: "The category of the post",
      default: "blog",
    },
    tags: {
      type: "list",
      description: "The tags of the post",
      of: {
        type: "string",
      },
      default: [],
    },
    date: {
      type: "date",
      description: "published date",
      required: true,
    },
    author: {
      type: "string",
      required: true,
      description: "User author",
      default: "ludusrusso",
    },
    image: {
      type: "string",
      required: true,
      description: "featured image",
    },
    headerImage: {
      type: "boolean",
      default: false,
      description: "show image in post",
    },
    path: {
      type: "string",
      description: "path of the post",
      required: false,
    },
    lang: {
      type: "string",
      default: "it",
      description: "language of the post",
    },
    slug: {
      type: "string",
    },
    draft: {
      type: "boolean",
      default: false,
    },
  },
  computedFields: {
    imagePath: {
      type: "string",
      resolve: (book) => path.join("/.content", book._raw.sourceFileDir),
    },
    imageUrl: {
      type: "string",
      resolve: (book) =>
        path.join("/.content", book._raw.sourceFileDir, book.image),
    },
    readTime: {
      type: "number",
      resolve: (post) => {
        const readTime = readingTime(post.body.raw);
        return readTime;
      },
    },
    publishedReadable: {
      type: "string",
      resolve: (post) => {
        return printDate(new Date(post.date));
      },
    },
    postPath: {
      type: "string",
      resolve: (post) => {
        return getPath(post.path, post._raw.sourceFilePath);
      },
    },
    href: {
      type: "string",
      resolve: (post) => {
        const postPath = getPath(post.path, post._raw.sourceFilePath);
        return path.join("/", postPath);
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Book, BlogPost],
  mdx: {
    remarkPlugins: [remarkMath as any],
    rehypePlugins: [prism, [rehypeKatex, { throwOnError: true, strict: true }]],
  },
});

const wpm = 225;
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wpm);
  return time;
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

const getPath = (path: string | undefined, file: string) => {
  if (!path) {
    return extractPathFromFile(file);
  }
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
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
