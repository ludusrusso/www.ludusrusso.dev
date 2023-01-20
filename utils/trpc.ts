import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";
import { type AppRouter } from "trpc/server";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
        }),
      ],
    };
  },
  ssr: false,
});

export const reactApi = createTRPCReact<AppRouter>();
