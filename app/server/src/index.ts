import express from "express";

const app = express();

app.get("/", (req, res) => res.json({ status: "Running" }));

const port = 3000;
app.listen(port, () => console.log(`Server is listening at port ${port}.`));
