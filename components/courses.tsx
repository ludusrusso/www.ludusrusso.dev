import { CourseChapter } from "data/courses";
import Link from "next/link";

export const CourseToc = ({
  toc,
  path,
}: {
  toc: CourseChapter[];
  path: string;
}) => {
  return (
    <ul className="">
      {toc.map((item) => (
        <li key={item.frontMatter.title}>
          {item.frontMatter.published ? (
            <Link href={`/courses/${path}/${item.slug}`}>
              <a>{item.frontMatter.title}</a>
            </Link>
          ) : (
            <span>
              {item.frontMatter.title}{" "}
              <span className="italic ml-4 text-gray-500">(in arrivo)</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};
