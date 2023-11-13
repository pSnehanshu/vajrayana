import { router } from "../trpc";
import { authRouter } from "./auth";
import { orgRouter } from "./org";

export const appRouter = router({
  auth: authRouter,
  org: orgRouter,
});

export type AppRouter = typeof appRouter;
