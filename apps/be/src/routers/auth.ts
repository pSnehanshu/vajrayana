import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({}))
    .mutation(async ({ input, ctx }) => {
      //
    }),
});
