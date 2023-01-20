import { z } from "zod";
import { LoginSchema } from "./auth.validations";
import { createRouter } from "./utils";

const RefreshSchema = z.object({
  refreshToken: z.string(),
});

export const authRouter = t.router({
    login: t.procedure.input(LoginSchema).mutation(({ input: { email, password }, ctx: { auth } }) => {
          return auth.loginUser(email, password);
        }),
    refresh: t.procedure.input(RefreshSchema).mutation(async ({ input: { refreshToken }, ctx: { auth } }) => {
          const accessToken = await auth.verifyRefreshToken(refreshToken);
          return { accessToken };
        }),
})
;
