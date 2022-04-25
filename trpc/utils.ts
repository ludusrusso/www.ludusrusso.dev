import * as trpc from "@trpc/server";
import { inferAsyncReturnType, TRPCError } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { MiddlewareFunction } from "@trpc/server/dist/declarations/src/internals/middlewares";
import { auth } from "services/auth.service";
import { db } from "services/db";

export function createRouter() {
  return trpc.router<Context>();
}

export type Context = inferAsyncReturnType<typeof createContext>;

export async function createContext({
  req,
  res,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await auth.verifyAccessToken(
        req.headers.authorization.split(" ")[1]
      );
      return user;
    }
    return null;
  }
  const user = await getUserFromHeader();

  return {
    user,
    db: db,
    auth: auth,
  };
}

export const authMiddleware: MiddlewareFunction<
  Context,
  Context,
  any
> = async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
};
