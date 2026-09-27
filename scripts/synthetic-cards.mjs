import { chromium } from "@playwright/test";

const targetUrl =
  process.env.VIBUCO_SYNTHETIC_URL || "https://www.vibuco.app/cards";
const startedAt = Date.now();
const requestId = `synthetic-${startedAt}-${Math.random()
  .toString(36)
  .slice(2)}`;
let browser;

const report = (outcome, syntheticStatus, reason) => {
  const event = {
    event: "cards_synthetic",
    request_id: requestId,
    trace_id: requestId,
    route: "/cards",
    outcome,
    duration_ms: Date.now() - startedAt,
    actor_classification: "anonymous_synthetic",
    synthetic_status: syntheticStatus,
  };

  if (reason) event.reason = reason;
  console.log(JSON.stringify(event));
};

try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const response = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: 20000,
  });

  if (!response || !response.ok()) {
    throw new Error("route_unavailable");
  }

  const cards = page.locator(".react-photo-gallery--gallery img");
  const cardFailure = page.locator("#cards-load-error-title");
  await page
    .locator(".react-photo-gallery--gallery img, #cards-load-error-title")
    .first()
    .waitFor({ state: "visible", timeout: 15000 })
    .catch(() => {
      throw new Error("cards_not_ready");
    });
  if (await cardFailure.isVisible()) {
    throw new Error("cards_unavailable");
  }
  await cards.first().click();

  const revealedPrompt = page.locator(".popup .text-container p");
  await revealedPrompt
    .waitFor({ state: "visible", timeout: 5000 })
    .catch(() => {
      throw new Error("reveal_unavailable");
    });

  if (!(await revealedPrompt.textContent())?.trim()) {
    throw new Error("reveal_empty");
  }

  report("success", "passing");
} catch (error) {
  const safeReasons = new Set([
    "route_unavailable",
    "cards_not_ready",
    "cards_unavailable",
    "reveal_unavailable",
    "reveal_empty",
  ]);
  const reason = safeReasons.has(error.message)
    ? error.message
    : "browser_check_failed";
  report("failure", "failing", reason);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}
