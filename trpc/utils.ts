import * as trpc from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NextApiRequest } from "next";
import { auth } from "services/auth.service";
import { db } from "services/db";

export function createRouter() {
  return trpc.router<Context>();
}

export type Context = inferAsyncReturnType<typeof createContext>;

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const user = await getUserFromHeader(req);

  return {
    user,
    db: db,
    auth: auth,
  };
}

async function getUserFromHeader(req: NextApiRequest) {
  if (req.headers.authorization) {
    const user = await auth.verifyAccessToken(
      req.headers.authorization.split(" ")[1]
    );
    return user;
  }
  return null;
}
