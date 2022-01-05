import styled from "@emotion/styled";
import { Footer } from "components/scenes/footer";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React from "react";
import { db } from "services/db";
import { trpc } from "utils/trpc";

const Main = styled.div``;

const Scene = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: 1fr auto;
`;

export default function TalkScene() {
  const { data: episode } = trpc.useQuery(["open.getNextEpisode"]);
  if (!episode) {
    return null;
  }
  return (
    <Scene className="bg-gray-300">
      <Main></Main>
      <Footer episode={episode} />
    </Scene>
  );
}
