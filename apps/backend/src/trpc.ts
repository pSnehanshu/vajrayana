import { ZodError } from "zod";
import cookie from "cookie";
import superjson from "superjson";
import { prisma } from "@zigbolt/prisma";
import { type inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import {
  AllPermissions,
  UserPermissions,
  permissionSchema,
} from "@zigbolt/shared";

/* Context */

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  prisma,
  req,
  res,
});

export type Context = inferAsyncReturnType<typeof createContext>;

/* Initialize tRPC */

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;

    let customErrorMessage = shape.message;

    if (error.code === "BAD_REQUEST" && error.cause instanceof ZodError) {
      customErrorMessage = error.cause.errors
        .map((e) => e.message)
        .join("; \n");
    }

    return {
      ...shape,
      message: customErrorMessage,
    };
  },
});

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
          Memberships: {
            include: { Role: true },
          },
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

  const role = orgMembership.Role;
  const org = await ctx.prisma.organization.findUnique({
    where: { id: orgMembership.orgId },
  });

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
  let availablePermissions: UserPermissions[] = [];

  if (orgMembership.roleType === "owner") {
    // Set all permissions
    availablePermissions = AllPermissions;
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
      membership: orgMembership,
    },
  });
});

const permissionMiddleware = (
  permissions: UserPermissions[] = [],
  mode: "every" | "some" = "every",
) =>
  orgMiddleware.unstable_pipe(({ ctx, next }) => {
    const hasPermission = permissions[mode]((p) => ctx.permissions.includes(p));

    if (hasPermission) {
      return next({ ctx });
    }

    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Not enough permission",
    });
  });

/* Procedures */

export const router = t.router;

/** No restrictions */
export const publicProcedure = t.procedure;

/** Requires user to be logged in */
export const authProcedure = t.procedure.use(authMiddleware);

/** Requires x-org-id to be mentioned */
export const orgProcedure = t.procedure.use(orgMiddleware);

/** Requires user to have the specified permissions to proceed */
export const permissionProcedure = (
  permissions: UserPermissions[] = [],
  mode: "every" | "some" = "every",
) => t.procedure.use(permissionMiddleware(permissions, mode));
