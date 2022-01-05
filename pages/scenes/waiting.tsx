import styled from "@emotion/styled";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "services/db";
import { getParticipantImage } from "utils/participants";
import { trpc } from "utils/trpc";

const Scene = styled.div`
  height: 100vh;
  grid-template-rows: 1fr 100px;
  img {
    border-radius: 1000px;
  }
`;

const ImageCnt = styled.div`
  display: flex;
  gap: 20px;
`;

export default function WaitingScene() {
  const { data: episode } = trpc.useQuery(["open.getNextEpisode"]);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    setInterval(() => setTime(new Date()), 1000);
  }, []);

  if (!episode) {
    return null;
  }

  return (
    <Scene className="bg-gray-800 relative p-[100px]">
      <div className="h-full grid content-center">
        <ImageCnt className="flex gap-10">
          <div>
            <Image
              width="200"
              height="200"
              src={getParticipantImage(episode.host)}
              alt={episode.host.name}
            ></Image>
          </div>
          {episode.guests.map(({ guest }) => (
            <div key={guest.id}>
              <Image
                width="200"
                height="200"
                className="-pl-4"
                src={getParticipantImage(guest)}
                alt={guest.name}
              ></Image>
            </div>
          ))}
          <div className="flex-grow">
            <span className="text-gray-200 text-[130px] w-[200px] font-bold ml-20">
              {getWaitTime(episode.scheduledTime, time)}
            </span>
          </div>
        </ImageCnt>
        <h2 className="text-gray-200 text-8xl">{episode.category}</h2>
        <p className="text-gray-500 mt-4 text-6xl">{episode.title}</p>
        {episode.guests[0] && (
          <p className="text-gray-400 mt-4 text-3xl">
            con <strong>{episode.guests[0].guest.name}</strong>{" "}
            {episode.guests[1] && (
              <span>e {<strong>{episode.guests[1].guest.name}</strong>}</span>
            )}
          </p>
        )}
      </div>
    </Scene>
  );
}

const padString = (d: string | number) => {
  return `00${d}`.slice(-2);
};

const getWaitTime = (startTime: string | Date, time: Date) => {
  const seconds = Math.trunc(
    (new Date(startTime).getTime() - time.getTime()) / 1000
  );
  if (seconds < 0) {
    return <> Arriviamo</>;
  }
  const secs = seconds % 60;
  const mins = Math.trunc(seconds / 60) % 60;
  const hours = Math.trunc(seconds / 60 / 60);
  return (
    <>
      {hours > 0 ? padString(hours) + ":" : null}
      {padString(mins)}:{padString(secs)}
    </>
  );
};
