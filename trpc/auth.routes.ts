import { z } from "zod";
import { LoginSchema } from "./auth.validations";
import { createRouter } from "./utils";

const RefreshSchema = z.object({
  refreshToken: z.string(),
});

export const authRouter = createRouter()
  .mutation("login", {
    input: LoginSchema,
    resolve: ({ input: { email, password }, ctx: { auth } }) => {
      return auth.loginUser(email, password);
    },
  })
  .mutation("refresh", {
    input: RefreshSchema,
    resolve: async ({ input: { refreshToken }, ctx: { auth } }) => {
      const accessToken = await auth.verifyRefreshToken(refreshToken);
      return { accessToken };
    },
  });
