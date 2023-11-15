import { router } from "../trpc";
import { authRouter } from "./auth";
import { membersRouter } from "./members";
import { orgRouter } from "./org";

export const appRouter = router({
  auth: authRouter,
  org: orgRouter,
  members: membersRouter,
});

export type AppRouter = typeof appRouter;
