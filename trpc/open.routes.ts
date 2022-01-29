import { PrismaClient } from "@prisma/client";
import { datePlusHours } from "utils/dates";
import { createRouter } from "./utils";

export const getNextEpisode = (db: PrismaClient) => {
  return db.episode.findFirst({
    where: {
      scheduledTime: {
        gte: datePlusHours(-1.5),
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

export const openRouter = createRouter().query("getNextEpisode", {
  resolve({ ctx }) {
    return getNextEpisode(ctx.db);
  },
});
