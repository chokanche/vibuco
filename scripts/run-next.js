#!/usr/bin/env node

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const nextPackageJson = require.resolve("next/package.json");
const nextBin = path.join(path.dirname(nextPackageJson), "dist/bin/next");
const nextArgs = process.argv.slice(2);
const [major] = process.versions.node.split(".").map(Number);

const env = { ...process.env };

if (major >= 17) {
  const legacyProvider = "--openssl-legacy-provider";
  env.NODE_OPTIONS = env.NODE_OPTIONS
    ? `${env.NODE_OPTIONS} ${legacyProvider}`
    : legacyProvider;
}

const result = spawnSync(process.execPath, [nextBin, ...nextArgs], {
  stdio: "inherit",
  env,
});

if (result.error) {
  throw result.error;
}

if (result.signal) {
  console.error(`Next.js exited from signal ${result.signal}.`);
  process.exit(1);
}

if (result.status === null) {
  console.error("Next.js exited without a status code.");
  process.exit(1);
}

if (
  nextArgs[0] === "build" &&
  result.status === 0 &&
  !fs.existsSync(path.resolve(".next", "BUILD_ID"))
) {
  console.error("Next.js exited without producing a complete build artifact.");
  process.exit(1);
}

process.exit(result.status ?? 0);
