import { z } from "zod";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";
import { TRPCError } from "@trpc/server";
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
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
        include: { SensitiveInfo: true },
      });

      if (!user || !user.SensitiveInfo || !user.SensitiveInfo.password) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // Validate password
      const isPasswordOk = await bcrypt.compare(
        input.password,
        user.SensitiveInfo.password,
      );

      if (!isPasswordOk) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // All ok

      // create session
      const session = await ctx.prisma.session.create({
        data: {
          userId: user.id,
          expiresAt: addDays(new Date(), 7),
        },
      });

      // Set the cookie
      ctx.res.cookie("auth-token", session.id, {
        expires: session.expiresAt,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }),
  logout: authProcedure.mutation(async ({ ctx }) => {
    // Delete session
    await ctx.prisma.session.delete({
      where: { id: ctx.session.id },
    });

    // Expire cookie
    ctx.res.cookie("auth-token", "", {
      // Setting to a past time
      expires: subDays(new Date(), 1),
    });
  }),
  whoAmI: authProcedure.query(({ ctx }) => ctx.session.User),
});
