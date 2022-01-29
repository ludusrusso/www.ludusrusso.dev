import { PrismaClient } from "@prisma/client";
import { datePlusHours } from "utils/dates";

export const getNextEpisode = (db: PrismaClient) => {
  return db.episode.findFirst({
    where: {
      scheduledTime: {
        gte: datePlusHours(-5),
      },
    },
    orderBy: {
      scheduledTime: "asc",
    },
    include: {
      host: true,
      guests: {
        include: {
          guest: true,
        },
      },
    },
  });
};
