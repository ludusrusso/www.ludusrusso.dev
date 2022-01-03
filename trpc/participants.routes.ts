import { z } from "zod";
import { CreateParticipantSchema } from "./participants.validations";
import { authMiddleware, createRouter } from "./utils";

export const GetParticipantsSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});

export const participantsRouter = createRouter()
  .middleware(authMiddleware)
  .query("getAll", {
    input: GetParticipantsSchema,
    async resolve({ input: { skip, take }, ctx: { db } }) {
      const participants = await db.participant.findMany({ skip, take });
      const total = await db.participant.count();
      return { participants, total };
    },
  })
  .mutation("create", {
    input: CreateParticipantSchema,
    async resolve({ input, ctx }) {
      return ctx.db.participant.create({
        data: input,
      });
    },
  });
