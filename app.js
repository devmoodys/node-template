import path from "path";
import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import flash from "connect-flash";
import compression from "compression";

const app = express();
const port = process.env.PORT || 4200;

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(compression());

app.use(require("./middleware/health").default);

app.listen(port, () => console.log(`CLS-node listening on port ${port}!`));
