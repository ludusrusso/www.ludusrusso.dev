import { Participant } from "@prisma/client";

export const getParticipantImage = (
  participant: Pick<Participant, "github">,
  size: number = 500
) => {
  return `https://avatars.githubusercontent.com/${participant.github}?s=${size}`;
};
