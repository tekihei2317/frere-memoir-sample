import express from "express";
import { trpcMiddleware } from "./router";

const app = express();

app.use("/trpc", trpcMiddleware);

const port = 3000;
app.listen(port, () => console.log(`Server is listening at port ${port}.`));
