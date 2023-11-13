import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const orgRouter = router({
  lookup: publicProcedure
    .input(
      z.object({
        domain: z
          .string()
          .toLowerCase()
          .regex(
            /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/,
            "Not a valid domain name",
          ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const domain = await ctx.prisma.domain.findUnique({
        where: { domain: input.domain },
        include: { Org: true },
      });

      if (!domain) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return domain.Org;
    }),
});
