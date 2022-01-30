import { datePlusHours } from "utils/dates";
import { z } from "zod";
import { CreateEpisodeSchema } from "./episodes.validations";
import { authMiddleware, createRouter } from "./utils";

export const GetEpisodeSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});

export const episodesRouter = createRouter()
  .middleware(authMiddleware)
  .query("getAll", {
    input: GetEpisodeSchema,
    async resolve({ input: { skip, take }, ctx: { db } }) {
      const episodes = await db.episode.findMany({
        skip,
        take,
        include: {
          host: true,
          guests: {
            include: {
              guest: true,
            },
          },
        },
      });
      const total = await db.episode.count();
      return { episodes, total };
    },
  })
  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input: { id }, ctx: { db } }) {
      const episode = await db.episode.findUnique({
        where: {
          id,
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
      return episode;
    },
  })
  .mutation("create", {
    input: CreateEpisodeSchema,
    async resolve({
      input: { guestId1, guestId2, scheduledTime, ...data },
      ctx,
    }) {
      const guestIds = [guestId1, guestId2].filter(isDefined);
      return ctx.db.episode.create({
        data: {
          ...data,
          scheduledTime: new Date(scheduledTime),
          guests: {
            createMany: {
              data: guestIds.map((id) => ({
                guestId: id,
              })),
            },
          },
        },
      });
    },
  });

const isDefined = (item: string | undefined): item is string => {
  return !!item;
};
