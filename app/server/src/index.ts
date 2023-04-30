import express from "express";
import cors from "cors";
import { trpcMiddleware } from "./router";

const app = express();

app.use(cors({ origin: ["http://localhost:5174"] }));
app.use("/trpc", trpcMiddleware);

const port = 3000;
app.listen(port, () => console.log(`Server is listening at port ${port}.`));
