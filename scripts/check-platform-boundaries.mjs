import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const sourceRoot = path.resolve("src");
const violations = [];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(entryPath);
      return /\.(ts|tsx)$/.test(entry.name) ? [entryPath] : [];
    })
  );
  return nested.flat();
}

for (const filePath of await sourceFiles(sourceRoot)) {
  const source = await readFile(filePath, "utf8");
  const relativePath = path.relative(process.cwd(), filePath);
  const isClient = /^\s*["']use client["'];/m.test(source);

  if (
    relativePath.startsWith(`src${path.sep}modules${path.sep}`) &&
    /from\s+["'](?:react|next\/|@\/app\/)/.test(source)
  ) {
    violations.push(`${relativePath}: domain module imports framework code`);
  }

  if (isClient && /(?:server-only|@\/platform\/[^"']*server)/.test(source)) {
    violations.push(`${relativePath}: client module imports a server boundary`);
  }

  if (
    /src[\\/]platform[\\/](?:config[\\/]server|telemetry[\\/]request-context)\.ts$/.test(
      filePath
    ) &&
    !/import\s+["']server-only["'];/.test(source)
  ) {
    violations.push(`${relativePath}: privileged platform module lacks server-only`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Platform module and server-only boundaries pass.");
