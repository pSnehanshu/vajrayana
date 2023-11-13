import { z } from "zod";
import { authProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //
    }),
  logout: authProcedure.mutation(async ({ input, ctx }) => {
    //
  }),
});
