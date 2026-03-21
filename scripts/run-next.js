#!/usr/bin/env node

const { spawnSync } = require("child_process");
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

process.exit(result.status ?? 0);
