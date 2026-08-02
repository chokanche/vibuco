import { test, expect } from "@playwright/test";
import path from "node:path";

const anonymousCards = require("./fixtures/anonymous-cards.json");
const fullCards = require("./fixtures/full-cards.json");
const behaviorPath = path.resolve(__dirname, "../../lib/legacyCardsBehavior.js");

async function mountLegacyFixture(page) {
  await page.setContent(`
    <main>
      <p id="deck-kind"></p>
      <button id="anonymous">Anonymous deck</button>
      <button id="full">Full deck</button>
      <button id="flip">Flip cards</button>
      <button id="shuffle">Shuffle cards</button>
      <label>
        <input id="show-prompt" type="checkbox" checked />
        Show prompt
      </label>
      <label>
        Locale
        <select id="locale">
          <option value="en">English</option>
          <option value="srb">Srpski</option>
          <option value="hu">Magyar</option>
        </select>
      </label>
      <section id="cards" aria-label="Synthetic legacy cards"></section>
      <section id="reveal" aria-live="polite"></section>
    </main>
  `);
  await page.addScriptTag({ path: behaviorPath });
  await page.evaluate(
    ({ anonymousFixture, fullFixture }) => {
      const behavior = (window as any).LegacyCardsBehavior;
      let authenticated = false;
      let flipped = false;
      let cards = anonymousFixture;
      let selectedCard = null;

      const renderReveal = () => {
        const reveal = document.querySelector("#reveal") as HTMLElement;
        const showPrompt = (document.querySelector("#show-prompt") as HTMLInputElement)
          .checked;
        const locale = (document.querySelector("#locale") as HTMLSelectElement).value;
        reveal.textContent =
          selectedCard && showPrompt
            ? behavior.getPromptForLocale(
                selectedCard.txt,
                authenticated,
                locale
              )
            : "";
      };

      const render = () => {
        const deckKind = document.querySelector("#deck-kind") as HTMLElement;
        deckKind.textContent = behavior.getDeckTableName(authenticated);
        const container = document.querySelector("#cards") as HTMLElement;
        container.replaceChildren(
          ...cards.map((card) => {
            const button = document.createElement("button");
            button.dataset.cardId = card.id;
            button.dataset.source = flipped
              ? behavior.getCardBackSource(card)
              : `synthetic-front-${card.id}`;
            button.dataset.number = flipped
              ? String(behavior.getCardNumber(cards.indexOf(card)))
              : "";
            button.textContent = card.id;
            button.addEventListener("click", () => {
              selectedCard = card;
              renderReveal();
            });
            return button;
          })
        );
        renderReveal();
      };

      document.querySelector("#anonymous")?.addEventListener("click", () => {
        authenticated = false;
        cards = anonymousFixture;
        selectedCard = null;
        render();
      });
      document.querySelector("#full")?.addEventListener("click", () => {
        authenticated = true;
        cards = fullFixture;
        selectedCard = null;
        render();
      });
      document.querySelector("#flip")?.addEventListener("click", () => {
        flipped = !flipped;
        render();
      });
      document.querySelector("#shuffle")?.addEventListener("click", () => {
        cards = behavior.shuffleWith(cards, (items) => items.slice().reverse());
        render();
      });
      document.querySelector("#show-prompt")?.addEventListener("change", renderReveal);
      document.querySelector("#locale")?.addEventListener("change", renderReveal);
      render();
    },
    { anonymousFixture: anonymousCards, fullFixture: fullCards }
  );
}

test("anonymous deck loads, reveals, flips, hides prompts, and shuffles", async ({
  page,
}) => {
  await mountLegacyFixture(page);

  await expect(page.locator("#deck-kind")).toHaveText("vibuco-photos-public");
  await expect(page.locator("#cards button")).toHaveCount(3);
  await page.locator("#cards button").first().click();
  await expect(page.locator("#reveal")).toHaveText(
    "synthetic-anonymous-prompt-a"
  );

  await page.locator("#show-prompt").uncheck();
  await expect(page.locator("#reveal")).toBeEmpty();
  await page.locator("#flip").click();
  await expect(page.locator("#cards button").first()).toHaveAttribute(
    "data-source",
    "../static/green2.jpg"
  );
  await expect(page.locator("#cards button").first()).toHaveAttribute(
    "data-number",
    "1"
  );

  await page.locator("#shuffle").click();
  await expect(page.locator("#cards button").first()).toHaveAttribute(
    "data-card-id",
    "anonymous-card-c"
  );
});

test("full deck exposes English, Serbian, and Hungarian prompts", async ({
  page,
}) => {
  await mountLegacyFixture(page);
  await page.locator("#full").click();

  await expect(page.locator("#deck-kind")).toHaveText("vibuco-photos");
  await expect(page.locator("#cards button")).toHaveCount(4);
  await page.locator("#cards button").first().click();
  await expect(page.locator("#reveal")).toHaveText("synthetic-en-a");

  await page.locator("#locale").selectOption("srb");
  await expect(page.locator("#reveal")).toHaveText("synthetic-srb-a");
  await page.locator("#locale").selectOption("hu");
  await expect(page.locator("#reveal")).toHaveText("synthetic-hu-a");
});
