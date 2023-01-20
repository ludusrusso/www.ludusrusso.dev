import { CourseChapter } from "data/courses";
import Link from "next/link";
import { useRouter } from "next/router";

export const CourseToc = ({
  toc,
  path,
}: {
  toc: CourseChapter[];
  path: string;
}) => {
  const router = useRouter();
  return <>
    <ul className="">
      {toc.map((item) => {
        const url = `/courses/${path}/${item.slug}`;
        return (
          <li key={item.frontMatter.title}>
            {item.frontMatter.published ? (
              <div>
                <Link href={url}>
                  {item.frontMatter.title}
                </Link>
                {router.asPath === url && (
                  <span className="italic ml-4 text-gray-500">
                    (questo articolo)
                  </span>
                )}
              </div>
            ) : (
              <span>
                {item.frontMatter.title}{" "}
                <span className="italic ml-4 text-gray-500">(in arrivo)</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  </>;
};
