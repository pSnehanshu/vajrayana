import "dotenv/config";
import express from "express";

const app = express();
const port = parseInt(process.env.PORT ?? "22280", 10);

app.listen(port, () => console.log(`Listening on port ${port}`));
