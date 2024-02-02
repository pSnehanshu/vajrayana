import { router } from "../trpc";
import { authRouter } from "./auth";
import { chargingStationsRouter } from "./charging-stations";
import { membersRouter } from "./members";
import { orgRouter } from "./org";
import { rolesRouter } from "./roles";

export const appRouter = router({
  auth: authRouter,
  org: orgRouter,
  members: membersRouter,
  roles: rolesRouter,
  stations: chargingStationsRouter,
});

export type AppRouter = typeof appRouter;
