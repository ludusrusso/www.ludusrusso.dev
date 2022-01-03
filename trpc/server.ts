import { authRouter } from "./auth.routes";
import { episodesRouter } from "./episodes.routes";
import { openRouter } from "./open.routes";
import { participantsRouter } from "./participants.routes";
import { createRouter } from "./utils";

export const appRouter = createRouter()
  .merge("auth.", authRouter)
  .merge("participants.", participantsRouter)
  .merge("episodes.", episodesRouter)
  .merge("open.", openRouter);

export type AppRouter = typeof appRouter;
