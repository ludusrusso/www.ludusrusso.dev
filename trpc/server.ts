import { episodesRouter } from "./episodes.routes";
import { participantsRouter } from "./participants.routes";
import * as t from "./trpc";

export const appRouter = t.router({
  participants: participantsRouter,
  episodes: episodesRouter,
});

export type AppRouter = typeof appRouter;
