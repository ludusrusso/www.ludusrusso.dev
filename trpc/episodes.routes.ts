import { z } from "zod";
import { CreateEpisodeSchema } from "./episodes.validations";
import * as t from "./trpc";

export const GetEpisodeSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});

export const episodesRouter = t.router({
  getAll: t.authProcedure
    .input(GetEpisodeSchema)
    .query(async ({ input: { skip, take }, ctx: { db } }) => {
      const episodes = await db.episode.findMany({
        skip,
        take,
        orderBy: {
          scheduledTime: "desc",
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
      const total = await db.episode.count();
      return { episodes, total };
    }),
  getById: t.authProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input: { id }, ctx: { db } }) => {
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
    }),
  create: t.authProcedure
    .input(CreateEpisodeSchema)
    .mutation(
      async ({
        input: { guestId1, guestId2, scheduledTime, ...data },
        ctx,
      }) => {
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
      }
    ),
});

const isDefined = (item: string | undefined): item is string => {
  return !!item;
};
