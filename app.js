import path from "path";
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4200;

app.use(cors());

app.listen(port, () => console.log(`CLS-node listening on port ${port}!`));
