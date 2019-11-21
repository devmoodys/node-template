import fs from "fs";
import path from "path";

const jsManifest = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "build/manifest.json"))
);

export default jsManifest;
