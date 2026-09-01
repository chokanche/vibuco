import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const appRoot = path.resolve("src/app");
const entries = await readdir(appRoot, { recursive: true });
const publicPages = entries.filter((entry) => /(^|\/)page\.tsx$/.test(entry));
const approvedPublicPages = new Set(["sign-in/page.tsx"]);
const unapprovedPublicPages = publicPages.filter(
  (page) => !approvedPublicPages.has(page)
);

if (unapprovedPublicPages.length) {
  throw new Error(
    `Unapproved target pages: ${unapprovedPublicPages.join(", ")}`
  );
}

const layout = await readFile(path.join(appRoot, "layout.tsx"), "utf8");
for (const marker of [
  '<html lang="en"',
  'href="#main-content"',
  '<main id="main-content" tabIndex={-1}>',
]) {
  if (!layout.includes(marker)) {
    throw new Error(`App Router shell is missing ${marker}`);
  }
}

const shellSources = await Promise.all(
  entries
    .filter((entry) => /\.(ts|tsx)$/.test(entry))
    .map((entry) => readFile(path.join(appRoot, entry), "utf8"))
);
const forbiddenClientMarkers = [
  "aws-sdk",
  "CognitoIdentityCredentials",
  "DATABASE_URL",
  "AWS_SECRET_ACCESS_KEY",
];

for (const marker of forbiddenClientMarkers) {
  if (shellSources.some((source) => source.includes(marker))) {
    throw new Error(`Target shell contains forbidden client marker: ${marker}`);
  }
}

console.log("App Router shell route and bundle-source checks pass.");
