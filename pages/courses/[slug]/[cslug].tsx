// @ts-ignore
import prism from "@mapbox/rehype-prism";
import { CourseToc } from "components/courses";
import { Footer } from "components/footer";
import { Mailchimp } from "components/mailchimp";
import { Nav } from "components/nav";
import { SEO } from "components/seo";
import { getCourse, getCourseChapter, getCourses } from "data/courses";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import path from "path";
import YouTube from "react-youtube";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const CoursePage = ({ course, chapter, source }: Props) => {
  const frontMatter = chapter.frontMatter;

  const components: MDXRemoteProps["components"] = {
    img: ({ src, alt }) => {
      return <img alt={alt} src={path.join(frontMatter.imagePath, src!)} />;
    },
    YouTube: ({ videoId }: { videoId: string }) => (
      <YouTube className="w-full aspect-video" videoId={videoId} />
    ),
    pre: (props: any) => <pre {...props} className="no-prose" />,
  };
  return (
    <div>
      <SEO
        title={frontMatter.title}
        description={frontMatter.description}
        type="article"
      />
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.26.0/themes/prism-dark.min.css"
        />
      </Head>
      <Nav />
      <main className="wrapper py-10">
        <h1 className="text-3xl md:text-4xl text-center py-4 px-4 sm:py-0 max-w-[900px] m-auto font-bold mt-10">
          {frontMatter.title}
        </h1>

        {/* <div className="mt-4 m-auto grid place-content-center">
          <img
            className="object-cover w-32 shadow-lg rounded-lg"
            src={frontMatter.image}
            alt=""
          />
        </div> */}

        <div className="flex flex-col items-center mt-10">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              by <span>{course.frontMatter.author}</span>
            </p>
          </div>
        </div>

        <div className="prose prose-lg m-auto mt-6 px-4 md:px-0">
          <CourseToc toc={course.frontMatter.toc} path={course.slug} />
          <MDXRemote {...source} components={components} />
          <CourseToc toc={course.frontMatter.toc} path={course.slug} />
        </div>
      </main>
      <Mailchimp title="Vuoi accedere ad uno sconto?" /> <Footer />
    </div>
  );
};

export default CoursePage;

export async function getStaticPaths() {
  const courses = getCourses();
  const paths = courses.flatMap((course) => {
    return course.frontMatter.toc
      .filter((c) => !!c.slug)
      .map((toc) => {
        return {
          params: {
            slug: course.slug,
            cslug: toc.slug,
          },
        };
      });
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ slug: string; cslug: string }>) => {
  const course = getCourse(params!.slug);
  if (!course) {
    throw new Error("course not found????");
  }
  const chapter = getCourseChapter(course.slug, params!.cslug);
  if (!chapter) {
    throw new Error("chapter not found????");
  }

  const mdxSource = await serialize(chapter.content, {
    mdxOptions: {
      remarkPlugins: [remarkMath as any],
      rehypePlugins: [
        prism,
        [rehypeKatex, { throwOnError: true, strict: true }],
      ],
    },
  });
  return {
    props: {
      course,
      chapter,
      source: mdxSource,
    },
  };
};
