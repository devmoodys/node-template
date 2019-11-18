// Inspired by create-react-app
// https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/env.js

"use strict";

const fs = require("fs");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV || "development";
const DOTENV_PATH = path.resolve(__dirname, "..", ".env");

const envFiles = [];

if (NODE_ENV === "development") {
  envFiles.push(`${DOTENV_PATH}.local`);
  envFiles.push(`${DOTENV_PATH}.development`);
} else if (NODE_ENV === "test") {
  envFiles.push(`${DOTENV_PATH}.local.test`);
  envFiles.push(`${DOTENV_PATH}.test`);
}

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    require("dotenv").config({ path: file });
  }
});
