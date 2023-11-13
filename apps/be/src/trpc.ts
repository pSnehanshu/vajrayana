import { z } from "zod";
import cookie from "cookie";
import superjson from "superjson";
import { prisma } from "@vajrayana/prisma";
import { type inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

enum Permissions {
  read = "read",
  write = "write",
  delete = "delete",
}

const permissionSchema = z.nativeEnum(Permissions).array();

/* Context */

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  prisma,
  req,
  res,
});

export type Context = inferAsyncReturnType<typeof createContext>;

/* Initialize tRPC */

const t = initTRPC.context<Context>().create({ transformer: superjson });

/* Middlewares */

const authMiddleware = t.middleware(async ({ ctx, next }) => {
  const cookies = cookie.parse(ctx.req.header("cookie") ?? "");

  // Check if user is logged in
  const authToken = cookies["auth-token"];

  if (!authToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const session = await ctx.prisma.session.findUnique({
    where: { id: authToken },
    include: {
      User: {
        include: {
          Memberships: true,
        },
      },
    },
  });

  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

const orgMiddleware = authMiddleware.unstable_pipe(async ({ ctx, next }) => {
  const orgId = ctx.req.header("x-org-id")?.trim();

  if (!orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "x-org-id must be defined in the headers",
    });
  }

  const orgMembership = ctx.session.User.Memberships.find(
    (m) => m.orgId === orgId,
  );

  if (!orgMembership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You aren't a member of Org #${orgId}`,
    });
  }

  const [org, role] = await Promise.all([
    ctx.prisma.organization.findUnique({
      where: { id: orgMembership.orgId },
    }),
    orgMembership.roleId
      ? ctx.prisma.role.findUnique({
          where: {
            id: orgMembership.roleId,
          },
        })
      : null,
  ]);

  if (!org) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Org #${orgMembership.orgId} not found`,
    });
  }

  if (!org.isActive) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Org ${org.name} is inactive`,
    });
  }

  // Check the available permissions
  let availablePermissions: Permissions[] = [];

  if (orgMembership.roleType === "owner") {
    // Set all permissions
    availablePermissions = Object.values(Permissions);
  } else {
    // Check what permissions are assigned to the role
    const parsedPerms = permissionSchema.safeParse(role?.permissions);
    availablePermissions = parsedPerms.success ? parsedPerms.data : [];
  }

  return next({
    ctx: {
      ...ctx,
      org,
      permissions: availablePermissions,
    },
  });
});

/* Procedures */

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(authMiddleware);
export const orgProcedure = t.procedure.use(orgMiddleware);
