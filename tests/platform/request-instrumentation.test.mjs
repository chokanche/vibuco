import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("request instrumentation propagates correlation and tolerates telemetry outage", () => {
  const foundationUrl = new URL(
    "../../src/platform/telemetry/foundation.ts",
    import.meta.url
  ).href;
  const instrumentationUrl = new URL(
    "../../src/platform/telemetry/request-instrumentation.ts",
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
    const { createTelemetry } = await import(${JSON.stringify(foundationUrl)});
    const { instrumentRequest } = await import(${JSON.stringify(instrumentationUrl)});
    const signals = [];
    const telemetry = createTelemetry({ export: async (signal) => signals.push(signal) });
    const response = await instrumentRequest(
      new Request("https://vibuco.example/api/health", { headers: { "x-request-id": "request-123" } }),
      { route: "/api/health", actorClass: "anonymous" }, telemetry,
      async () => new Response("ok", { status: 200 })
    );
    await new Promise((resolve) => setImmediate(resolve));
    const failing = createTelemetry({ export: async () => { throw new Error("unavailable"); } });
    const recovered = await instrumentRequest(
      new Request("https://vibuco.example/api/health"),
      { route: "/api/health", actorClass: "anonymous" }, failing,
      async () => new Response("ok")
    );
    await new Promise((resolve) => setImmediate(resolve));
    console.log(JSON.stringify({ requestId: response.headers.get("x-request-id"), traceId: response.headers.get("x-trace-id"), signalRequestId: signals[0].requestId, recovered: recovered.status, dropped: failing.droppedCount() }));
  `;
  const child = spawnSync(
    process.execPath,
    ["--conditions=react-server", "--input-type=module", "--eval", childSource],
    { encoding: "utf8" }
  );
  assert.equal(child.status, 0, child.stderr);
  const result = JSON.parse(child.stdout);
  assert.equal(result.requestId, "request-123");
  assert.equal(result.traceId, "request-123");
  assert.equal(result.signalRequestId, "request-123");
  assert.equal(result.recovered, 200);
  assert.equal(result.dropped, 1);
});
