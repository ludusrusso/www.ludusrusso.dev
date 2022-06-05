import { data } from "blog";

export const getBlogData = () => {
  return data
    .map((d) => ({
      ...d,
      frontMatter: {
        ...d.frontMatter,
        published: new Date(d.frontMatter.published),
      },
    }))
    .filter(
      (d) =>
        d.frontMatter.published <= new Date() && d.frontMatter.draft === false
    );
};

export type PostData = ReturnType<typeof getBlogData>[number];
export type PostFrontMatter = PostData["frontMatter"];
