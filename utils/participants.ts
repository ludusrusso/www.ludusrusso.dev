import { type EpisodeParticipant } from "episodes";

export const getParticipantImage = (
  participant: Pick<EpisodeParticipant, "github" | "avatar">,
  size: number = 500
) => {
  if (!participant.avatar) {
    return `https://avatars.githubusercontent.com/${participant.github}?s=${size}`;
  }
  return participant.avatar;
};
