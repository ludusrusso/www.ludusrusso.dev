import styled from "@emotion/styled";
import { Footer } from "components/scenes/footer";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React from "react";
import { db } from "services/db";

const Main = styled.div``;

const Scene = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr auto;
`;

export default function TalkScene({
  episode,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Scene className="bg-gray-300">
      <Main></Main>
      <Footer episode={episode} />
    </Scene>
  );
}

export async function getStaticPaths() {
  const episodes = await db.episode.findMany({
    select: { id: true },
  });
  const paths = episodes.map((e) => {
    return {
      params: {
        episodeId: e.id,
      },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ episodeId: string }>) {
  const episode = await db.episode.findUnique({
    where: { id: params!.episodeId },
    include: {
      host: true,
      guests: {
        include: {
          guest: true,
        },
      },
    },
  });

  return {
    props: {
      episode: episode!,
    },
  };
}
