const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { createServer } = require("node:http");
const { after, before, test } = require("node:test");

let server;
let origin;

before(async () => {
  server = createServer((request, response) => {
    response.setHeader("content-type", "text/html; charset=utf-8");
    if (request.url === "/ready") {
      response.end(`<!doctype html><html><body>
        <div class="react-photo-gallery--gallery">
          <img alt="Fixture card" style="width:10px;height:10px"
            src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
            onclick="document.querySelector('.popup').hidden = false">
        </div>
        <div class="popup" hidden><div class="text-container"><p>Fixture prompt</p></div></div>
      </body></html>`);
      return;
    }
    if (request.url === "/unavailable") {
      response.end('<!doctype html><h1 id="cards-load-error-title">Cards are temporarily unavailable</h1>');
      return;
    }
    response.statusCode = 503;
    response.end("Unavailable");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function runSynthetic(path) {
  const child = spawn(process.execPath, ["scripts/synthetic-cards.mjs"], {
    cwd: process.cwd(),
    env: { ...process.env, VIBUCO_SYNTHETIC_URL: `${origin}${path}` },
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; });
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  const exitCode = await new Promise((resolve) => child.on("close", resolve));
  const event = JSON.parse(stdout.trim().split("\n").at(-1));
  assert.equal(stderr, "");
  return { event, exitCode };
}

test("synthetic passes only after an anonymous card reveal", async () => {
  const { event, exitCode } = await runSynthetic("/ready");
  assert.equal(exitCode, 0);
  assert.equal(event.outcome, "success");
  assert.equal(event.synthetic_status, "passing");
  assert.equal(event.reason, undefined);
});

test("synthetic identifies the user-visible card dependency failure", async () => {
  const { event, exitCode } = await runSynthetic("/unavailable");
  assert.equal(exitCode, 1);
  assert.equal(event.outcome, "failure");
  assert.equal(event.reason, "cards_unavailable");
});

test("synthetic identifies an unavailable route", async () => {
  const { event, exitCode } = await runSynthetic("/missing");
  assert.equal(exitCode, 1);
  assert.equal(event.reason, "route_unavailable");
});
