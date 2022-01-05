import styled from "@emotion/styled";
import type { Episode, EpisodeGuest, Participant } from "@prisma/client";
import dynamic from "next/dynamic";

const Chat = dynamic(() => import("./chat"), {
  ssr: false,
});

interface FooterProps {
  episode: Episode & {
    host: Participant;
    guests: (EpisodeGuest & {
      guest: Participant;
    })[];
  };
}

export const Footer = ({ episode }: FooterProps) => {
  return (
    <FooterStyled className="bg-gray-900">
      <div>
        <h2 className="text-gray-200 text-4xl">{""}</h2>
        <p className="text-gray-500 mt-4">{episode.title}</p>
        {episode.guests[0] && (
          <p className="text-gray-400 mt-4 text-xl">
            con <strong>{episode.guests[0].guest.name}</strong>{" "}
            {episode.guests[1] && (
              <span>e {<strong>{episode.guests[1].guest.name}</strong>}</span>
            )}
          </p>
        )}
      </div>
      <Chat />
    </FooterStyled>
  );
};

const FooterStyled = styled.footer`
  border-top: 10px solid #ccc;
  height: 200px;
  padding: 20px;
  font-size: 20pt;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
