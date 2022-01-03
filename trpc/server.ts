import { authRouter } from "./auth.routes";
import { participantsRouter } from "./participants.routes";
import { createRouter, createContext } from "./utils";

export const appRouter = createRouter()
  .merge("participants.", participantsRouter)
  .merge("auth.", authRouter);

export type AppRouter = typeof appRouter;
