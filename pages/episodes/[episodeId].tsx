import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { db } from "services/db";

import React from "react";
import { SEO } from "components/seo";
import { Nav } from "components/nav";
import { Footer } from "components/footer";
import { serialize } from "next-mdx-remote/serialize";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
// @ts-ignore
import prism from "@mapbox/rehype-prism";

const EpisodePage = ({
  episode,
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (!episode) {
    return null;
  }
  return (
    <>
      <SEO title={episode.title} description={episode.description} />
      <Head>
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
          {episode.title}
        </h1>{" "}
        <div className="my-10 max-w-2xl m-auto">
          {episode.youtube ? (
            <a
              href={`https://youtu.be/${episode.youtube}`}
              target="_blank"
              className="block text-center no-underline bg-green-500 px-3 py-2 text-sm font-bold text-white rounded hover:bg-green-700"
              rel="noreferrer"
            >
              Guarda su YouTube
            </a>
          ) : episode.twitch ? (
            <a
              href={`https://www.twitch.tv/${episode.twitch}`}
              target="_blank"
              className="block text-center no-underline bg-green-500 px-3 py-2 text-sm font-bold text-white rounded hover:bg-green-700"
              rel="noreferrer"
            >
              Guarda su Twitch
            </a>
          ) : null}
        </div>
        <div className="prose prose-lg m-auto mt-6 px-2 md:px-0">
          <p>{episode.description}</p>
          <MDXRemote {...mdxSource} />
        </div>
      </main>
      {/* <Team
        title=""
        subtitle="Chi ha partecipato all'evento?"
        members={episode.guests}
      /> */}
      <Footer />
    </>
  );
};

export default EpisodePage;

export const getStaticPaths = async () => {
  const episodes = await db.episode.findMany();
  const paths = episodes.map((episode) => {
    return {
      params: {
        episodeId: episode.id,
      },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{
  episodeId: string;
}>) => {
  const episode = await db.episode.findUnique({
    where: { id: params!.episodeId! },
  });

  const mdxSource = await serialize(episode!.body, {
    mdxOptions: {
      remarkPlugins: [remarkMath as any],
      rehypePlugins: [prism, rehypeKatex],
    },
  });

  return {
    props: {
      episode,
      mdxSource,
    },
  };
};
