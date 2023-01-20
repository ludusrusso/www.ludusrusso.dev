import { datePlusHours } from "utils/dates";
import { z } from "zod";
import { CreateEpisodeSchema } from "./episodes.validations";
import { authMiddleware, createRouter } from "./utils";

export const GetEpisodeSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});
const middleware_3597820250 = t.middleware(authMiddleware);
const procedure_3597820250 = t.procedure.use(middleware_3597820250);
export const episodesRouter = t.router({
    getAll: procedure_3597820250.input(GetEpisodeSchema).query(async ({ input: { skip, take }, ctx: { db } }) => {
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
    getById: procedure_3597820250.input(z.object({
          id: z.string(),
        })).query(async ({ input: { id }, ctx: { db } }) => {
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
    create: procedure_3597820250.input(CreateEpisodeSchema).mutation(async ({
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
    }),
})
;

const isDefined = (item: string | undefined): item is string => {
  return !!item;
};
