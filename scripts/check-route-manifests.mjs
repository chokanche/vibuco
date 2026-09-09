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

const approvedTargetRoutes = new Set([
  "/_not-found/page",
  "/auth/callback/route",
  "/auth/sign-in/route",
  "/auth/sign-out/route",
  "/sign-in/page",
]);
const enabledTargetRoutes = Object.keys(appManifest);
const unapprovedTargetRoutes = enabledTargetRoutes.filter(
  (route) => !approvedTargetRoutes.has(route)
);
const missingTargetRoutes = [...approvedTargetRoutes].filter(
  (route) => !enabledTargetRoutes.includes(route)
);
if (unapprovedTargetRoutes.length || missingTargetRoutes.length) {
  throw new Error(
    `Unexpected target route manifest. Unapproved: ${unapprovedTargetRoutes.join(", ") || "none"}; missing: ${missingTargetRoutes.join(", ") || "none"}`
  );
}

console.log(
  "Built route smoke passes; legacy routes and approved Auth 001 routes are present."
);
