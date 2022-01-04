import { DiscussionEmbed } from "disqus-react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import Image from "next/image";
import path from "path";
import YouTube from "react-youtube";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Footer } from "../components/footer";
import { Nav } from "../components/nav";
import { SEO } from "../components/seo";
import { Tag } from "../components/tag";
import { config } from "../utils/config";
import { getBlogData } from "../utils/getBlogData";

export default function TestPage({
  source,
  frontmatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const components = {
    img: ({ src, alt }: { src: string; alt: string }) => (
      <img alt={alt} src={path.join(frontmatter.imagePath, src)} />
    ),
    AmazonAffiliationLink: ({ src }: { src: string }) => (
      <div className="m-auto">
        <iframe
          style={{ width: "120px", height: "240px", margin: "auto" }}
          scrolling="no"
          frameBorder="0"
          src={src}
        ></iframe>
      </div>
    ),
    YouTube: ({ videoId }: { videoId: string }) => (
      <YouTube className="w-full" opts={{}} videoId={videoId} />
    ),
  };

  return (
    <>
      <SEO
        title={frontmatter.title}
        description={frontmatter.description}
        image={frontmatter.image}
        author={frontmatter.author.name}
        date={frontmatter.published}
        type="article"
      />

      <Head>
        <title>{frontmatter.title} | @ludusrusso </title>
        <meta name="description" content={frontmatter.description} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css"
          integrity="sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc"
          crossOrigin="anonymous"
        />
      </Head>
      <Nav />

      <main className="wrapper py-10">
        <h1 className="text-4xl md:text-6xl text-center py-2 sm:py-0 max-w-[900px] m-auto font-bold mt-10">
          {" "}
          {frontmatter.title}
        </h1>

        <div className="flex flex-col items-center mt-10">
          <div className="flex-shrink-0">
            <a href={"#"}>
              <span className="sr-only">{frontmatter.author.name}</span>
              <Image
                width={60}
                height={60}
                className="rounded-full"
                src={frontmatter.author.profile}
                alt=""
              />
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              <a href={"#"}>{frontmatter.author.name}</a>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={frontmatter.published.toISOString()}>
                {frontmatter.publishedReadable}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>{frontmatter.readTime} min read</span>
            </div>
          </div>
        </div>

        <div className="m-auto w-full mt-3 flex gap-2 justify-center">
          {frontmatter.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>

        <div className="prose prose-lg m-auto mt-6 px-2 md:px-0">
          <MDXRemote {...source} components={components} />
        </div>

        {process.env.PRODUCTION && (
          <div className="prose prose-lg m-auto mt-6">
            <DiscussionEmbed
              shortname={config.disqus.shortname}
              config={{
                url:
                  "https://" +
                  path.join(config.hostname, "blog", frontmatter.path),
                identifier: frontmatter.path,
                title: frontmatter.title,
                language: "it",
              }}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const blogData = await getBlogData();
  const paths = blogData.map((d) => {
    return {
      params: {
        path: d.frontMatter.path.split("/").filter((p) => !!p),
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
}: GetStaticPropsContext<{ path: string[] }>) {
  const post = getBlogData().find((p) =>
    p.frontMatter.path.includes(params!.path.join("/"))
  );

  const mdxSource = await serialize(post!.content, {
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });

  return {
    props: {
      source: mdxSource,
      frontmatter: post!.frontMatter,
    },
  };
}
