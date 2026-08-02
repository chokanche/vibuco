import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("telemetry uses an allowlisted schema and records exporter loss safely", () => {
  const moduleUrl = new URL(
    "../../src/platform/telemetry/foundation.ts",
    import.meta.url
  ).href;
  const childSource = `
    import { registerHooks } from "node:module";
    registerHooks({ resolve(specifier, context, nextResolve) {
      if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
        return { shortCircuit: true, url: new URL(specifier + ".ts", context.parentURL).href };
      }
      return nextResolve(specifier, context);
    }});
    const { createTelemetry } = await import(${JSON.stringify(moduleUrl)});
    const signals = [];
    const telemetry = createTelemetry({ export: async (signal) => signals.push(signal) });
    await telemetry.recordRequestCompletion(
      { requestId: "req-123", traceId: "trace-456" },
      { route: "/api/health", method: "GET", status: 200, durationMs: 12.4, actorClass: "anonymous" }
    );
    let rejected = false;
    try {
      await telemetry.recordRequestCompletion(
        { requestId: "req-123", traceId: "trace-456" },
        { route: "/api/health?token=secret", method: "GET", status: 500, durationMs: 1, actorClass: "system", errorCode: "database password leaked" }
      );
    } catch { rejected = true; }
    const failing = createTelemetry({ export: async () => { throw new Error("unavailable"); } });
    await failing.recordRequestCompletion(
      { requestId: "req-123", traceId: "trace-456" },
      { route: "/api/health", method: "GET", status: 503, durationMs: 1, actorClass: "system", errorCode: "DEPENDENCY_UNAVAILABLE" }
    );
    console.log(JSON.stringify({ signal: signals[0], rejected, dropped: failing.droppedCount() }));
  `;
  const child = spawnSync(
    process.execPath,
    ["--conditions=react-server", "--input-type=module", "--eval", childSource],
    { encoding: "utf8" }
  );
  assert.equal(child.status, 0, child.stderr);
  const { signal, rejected, dropped } = JSON.parse(child.stdout);
  assert.deepEqual(Object.keys(signal).sort(), [
    "actorClass", "durationMs", "environment", "kind", "method", "outcome", "requestId", "route", "service", "severity", "statusClass", "timestamp", "traceId",
  ]);
  assert.equal(signal.outcome, "success");
  assert.equal(signal.statusClass, "2xx");
  assert.equal(rejected, true);
  assert.equal(dropped, 1);
});
