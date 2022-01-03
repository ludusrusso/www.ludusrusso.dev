import { datePlusHours } from "utils/dates";
import { createRouter } from "./utils";

export const openRouter = createRouter().query("getNextEpisode", {
  resolve({ ctx }) {
    return ctx.db.episode.findFirst({
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
  },
});
