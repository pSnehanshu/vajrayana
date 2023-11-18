import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { permissionProcedure, publicProcedure, router } from "../trpc";
import { UserPermissions } from "@zigbolt/shared";

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
  update: permissionProcedure([UserPermissions["ORG:UPDATE"]])
    .input(
      z.object({
        name: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.organization.update({
        where: { id: ctx.org.id },
        data: input,
      });
    }),
});
