import { createReactQueryHooks } from "@trpc/react";
import { AppRouter } from "trpc/server";

export const trpc = createReactQueryHooks<AppRouter>();
