import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "trpc/server";
import { createContext } from "trpc/utils";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});
