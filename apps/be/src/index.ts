import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./trpc";

const app = express();
const port = parseInt(process.env.PORT ?? "22281", 10);

if (process.env.NODE_ENV !== "production") {
  app.use((_req, _res, next) => {
    setTimeout(() => next(), 2000);
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

const api = express.Router();

app.use("/api", api);

api.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);
