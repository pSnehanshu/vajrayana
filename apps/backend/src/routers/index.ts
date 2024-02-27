import { router } from "../trpc";
import { authRouter } from "./auth";
import { chargingStationsRouter } from "./charging-stations";
import { membersRouter } from "./members";
import { rolesRouter } from "./roles";
import { settingsRouter } from "./settings";

export const appRouter = router({
  auth: authRouter,
  settings: settingsRouter,
  members: membersRouter,
  roles: rolesRouter,
  stations: chargingStationsRouter,
});

export type AppRouter = typeof appRouter;
