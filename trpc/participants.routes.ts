import { z } from "zod";
import { CreateParticipantSchema } from "./participants.validations";
import { authMiddleware, createRouter } from "./utils";

export const GetParticipantsSchema = z.object({
  skip: z.number().default(0),
  take: z.number().default(100),
});
const middleware_3597820250 = t.middleware(authMiddleware);
const procedure_3597820250 = t.procedure.use(middleware_3597820250);
export const participantsRouter = t.router({
    getAll: procedure_3597820250.input(GetParticipantsSchema).query(async ({ input: { skip, take }, ctx: { db } }) => {
        const participants = await db.participant.findMany({ skip, take });
        const total = await db.participant.count();
        return { participants, total };
    }),
    create: procedure_3597820250.input(CreateParticipantSchema).mutation(async ({ input, ctx }) => {
        return ctx.db.participant.create({
        data: input,
        });
    }),
})
;
