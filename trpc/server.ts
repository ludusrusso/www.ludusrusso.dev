import { authRouter } from "./auth.routes";
import { episodesRouter } from "./episodes.routes";
import { openRouter } from "./open.routes";
import { participantsRouter } from "./participants.routes";
import * as t from "./trpc";

export const appRouter = t.router({
  auth: authRouter,
  participants: participantsRouter,
  episodes: episodesRouter,
  open: openRouter,
});

export type AppRouter = typeof appRouter;
