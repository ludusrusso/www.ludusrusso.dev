import { z } from "zod";
import { CreateParticipantSchema } from "./participants.validations";
import * as t from "./trpc";

export const GetParticipantsSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});

export const participantsRouter = t.router({
  getAll: t.authProcedure
    .input(GetParticipantsSchema)
    .query(async ({ input: { skip, take }, ctx: { db } }) => {
      const participants = await db.participant.findMany({ skip, take });
      const total = await db.participant.count();
      return { participants, total };
    }),
  create: t.authProcedure
    .input(CreateParticipantSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.participant.create({
        data: input,
      });
    }),
});
