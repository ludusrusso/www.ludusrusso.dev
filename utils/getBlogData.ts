import { data } from "blog";

export const getBlogData = () => {
  return data.map((d) => ({
    ...d,
    frontMatter: {
      ...d.frontMatter,
      published: new Date(d.frontMatter.published),
    },
  }));
};

export type PostData = ReturnType<typeof getBlogData>[number];
export type PostFrontMatter = PostData["frontMatter"];
