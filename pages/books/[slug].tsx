// @ts-ignore
import prism from "@mapbox/rehype-prism";
import { getBook, getBooks } from "books";
import { Mailchimp } from "components/mailchimp";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";
import YouTube from "react-youtube";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Footer } from "../../components/footer";
import { Nav } from "../../components/nav";
import { SEO } from "../../components/seo";

export default function BookPage({
  source,
  frontmatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const components: MDXRemoteProps["components"] = {
    img: ({ src, alt }) => {
      return <img alt={alt} src={path.join(frontmatter.imagePath, src!)} />;
    },
    YouTube: ({ videoId }: { videoId: string }) => (
      <YouTube className="w-full aspect-video" videoId={videoId} />
    ),
    pre: (props: any) => <pre {...props} className="no-prose" />,
  };

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.title}
        image={frontmatter.image}
        type="article"
      />

      <Nav />

      <main className="wrapper py-10">
        <h1 className="text-3xl md:text-4xl text-center py-4 px-4 sm:py-0 max-w-[900px] m-auto font-bold mt-10">
          {frontmatter.title}
        </h1>

        <div className="mt-4 m-auto grid place-content-center">
          <img
            className="object-cover w-32 shadow-lg rounded-lg"
            src={frontmatter.image}
            alt=""
          />
        </div>

        <div className="flex flex-col items-center mt-10">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              by <span>{frontmatter.author}</span>
            </p>
            <div className="flex space-x-1 text-lg text-gray-500">
              {frontmatter.links.en && (
                <a
                  href={frontmatter.links.en}
                  target="_blank"
                  className="text-gray-700 hover:text-gray-800"
                >
                  <span>Compra in Inglese 🇺🇸 </span>
                </a>
              )}
              {frontmatter.links.it && (
                <a
                  target="_blank"
                  href={frontmatter.links.it}
                  className="text-gray-700 hover:text-gray-800"
                >
                  <span>Compra in Italiano 🇮🇹 </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-lg m-auto mt-6 px-4 md:px-0">
          <MDXRemote {...source} components={components} />
        </div>
      </main>

      <Mailchimp title="Ti è piaciuto questo libro?" />

      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const blogData = getBooks();
  const paths = blogData.map((d) => {
    return {
      params: {
        slug: d.slug,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ slug: string }>) {
  const slug = params!.slug;
  const book = getBook(slug);

  if (!book) {
    throw new Error("book not found????");
  }

  const mdxSource = await serialize(book.content, {
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
      source: mdxSource,
      frontmatter: book.frontMatter,
    },
  };
}
