import "dotenv/config";
import express from "express";
import { api } from "./api";
import { CreateWebsocketServer } from "./websocket";

const app = express();
const port = parseInt(process.env.PORT ?? "22281", 10);

if (process.env.NODE_ENV !== "production") {
  app.use((_req, _res, next) => {
    setTimeout(() => next(), 2000);
  });
}

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

app.use("/api", api);

//////////////
CreateWebsocketServer(server);
