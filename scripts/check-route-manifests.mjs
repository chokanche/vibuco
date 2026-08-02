import { access, readFile } from "node:fs/promises";
import path from "node:path";

const nextRoot = path.resolve(".next");
await access(path.join(nextRoot, "BUILD_ID"));

const pagesManifest = JSON.parse(
  await readFile(path.join(nextRoot, "server/pages-manifest.json"), "utf8")
);
const appManifest = JSON.parse(
  await readFile(path.join(nextRoot, "server/app-paths-manifest.json"), "utf8")
);

for (const route of ["/", "/cards", "/about", "/contact", "/login"]) {
  if (!pagesManifest[route]) {
    throw new Error(`Legacy route is missing from the build manifest: ${route}`);
  }
}

const enabledTargetRoutes = Object.keys(appManifest);
if (enabledTargetRoutes.length) {
  throw new Error(
    `VIB-PLAT-001 must not emit target routes: ${enabledTargetRoutes.join(", ")}`
  );
}

console.log(
  "Built route smoke passes; legacy routes remain and target routes are disabled."
);
