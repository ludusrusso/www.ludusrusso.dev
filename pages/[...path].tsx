import { Mailchimp } from "components/mailchimp";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import path from "path";
import YouTube from "react-youtube";
import { Footer } from "../components/footer";
import { Nav } from "../components/nav";
import { SEO } from "../components/seo";
import { Tag } from "../components/tag";
import { config } from "../utils/config";
import { TrackerApp } from "components/apps/tracker";
import { InfoBox } from "components/mdx/info";
import { allBlogPosts, BlogPost } from "contentlayer/generated";
import Link from "next/link";
import { authors } from "authors";
import { useMDXComponent } from "next-contentlayer/hooks";

const DiscussionEmbed = dynamic(() => import("../components/disquss"), {
  ssr: false,
});

export default function PathPage({
  post,
  similarPosts,
  author,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const components = {
    img: ({ src, alt }: { src: string; alt: string }) => {
      if (src.startsWith("http")) {
        return <img className="m-auto" alt={alt} src={src} />;
      }
      return (
        <img
          className="m-auto"
          alt={alt}
          src={path.join(post.imagePath, src!)}
        />
      );
    },
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
      <YouTube className="w-full aspect-video" videoId={videoId} />
    ),
    pre: (props: any) => <pre {...props} className="no-prose" />,
    TrackerApp: TrackerApp,
    InfoBox: InfoBox,
  };

  const MdxSection = useMDXComponent(post.body.code);

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        image={post.imageUrl}
        author={author.name}
        date={new Date(post.date)}
        type="article"
      />

      <Head>
        <title>{post.title} | @ludusrusso </title>
        <meta name="description" content={post.description} />
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
        <h1 className="text-4xl md:text-6xl text-center py-2 sm:py-0 max-w-[900px] m-auto font-bold mt-10">
          {post.title}
        </h1>

        <div className="flex flex-col items-center mt-10">
          <div className="flex-shrink-0">
            <a href={"#"}>
              <span className="sr-only">{author.name}</span>
              <Image
                width={60}
                height={60}
                className="rounded-full"
                src={author.profile}
                alt=""
              />
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900">
              <a href={"#"}>{author.name}</a>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={new Date(post.date).toISOString()}>
                {post.publishedReadable}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>lettura in {readTime(post.readTime)}</span>
            </div>
          </div>
        </div>

        <div className="m-auto w-full mt-3 flex gap-2 justify-center">
          {post.tags.map((tag) => (
            <Link href={`/blog/tags#${tag}`} key={tag}>
              <a>
                <Tag tag={tag} />
              </a>
            </Link>
          ))}
        </div>

        <div className="prose prose-lg m-auto mt-6 px-4 md:px-0">
          <MdxSection components={components} />
        </div>

        <div className="prose prose-lg m-auto px-4 md:px-0">
          {process.env.NODE_ENV === "production" && (
            <DiscussionEmbed
              shortname={config.disqus.shortname}
              config={{
                url: "https://" + path.join(config.hostname, post.postPath),
                identifier: post.path,
                title: post.title,
                language: "it",
              }}
            />
          )}
        </div>
      </main>
      <Mailchimp title="Ti è piaciuto questo post?" />

      <SimilarPosts posts={similarPosts} />
      <Footer />
    </>
  );
}

export async function getStaticPaths() {
  const paths = allBlogPosts.map((d) => {
    return {
      params: {
        path: d.postPath.split("/").filter((p) => !!p),
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
  const post = allBlogPosts.find((p) => p.postPath == params!.path.join("/"));

  if (!post) {
    throw new Error("post not found????");
  }

  const similarPosts = allBlogPosts.filter((p) => {
    for (let tag of post.tags) {
      if (p.tags.includes(tag)) {
        return p.path !== post.path;
      }
    }
  });

  return {
    props: {
      post: post,
      author: authors.find((a) => a.name === post.author) || authors[0],
      similarPosts: similarPosts,
    },
  };
}

const SimilarPosts = ({ posts }: { posts: BlogPost[] }) => {
  if (posts.length === 0) {
    return null;
  }
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 divide-y-2 divide-gray-200 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Ti potrebbe anche interessare
        </h2>
        <div className="mt-6 pt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:gap-x-8 md:gap-y-12">
            {posts.map((post) => (
              <div key={post.href}>
                <dt className="text-lg leading-6 font-medium text-gray-900">
                  <Link href={post.href}>
                    <a className="hover:text-green-800 underline">
                      {post.title}
                    </a>
                  </Link>
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  {post.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

const readTime = (rt: number) => {
  if (rt === 1) {
    return "1 minuto";
  } else {
    return `${rt} minuti`;
  }
};
