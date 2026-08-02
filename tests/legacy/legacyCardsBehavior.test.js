const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  getCardBackSource,
  getCardNumber,
  getDeckTableName,
  getPromptForLocale,
  shuffleWith,
} = require("../../lib/legacyCardsBehavior");

const anonymousCards = require("./fixtures/anonymous-cards.json");
const fullCards = require("./fixtures/full-cards.json");

test("selects the anonymous and authenticated legacy deck tables", () => {
  assert.equal(getDeckTableName(false), "vibuco-photos-public");
  assert.equal(getDeckTableName(true), "vibuco-photos");
});

test("preserves anonymous prompt strings and full-deck locale lookup", () => {
  assert.equal(
    getPromptForLocale(anonymousCards[0].txt, false, "hu"),
    "synthetic-anonymous-prompt-a"
  );
  assert.equal(
    getPromptForLocale(fullCards[0].txt, true, "en"),
    "synthetic-en-a"
  );
  assert.equal(
    getPromptForLocale(fullCards[0].txt, true, "srb"),
    "synthetic-srb-a"
  );
  assert.equal(
    getPromptForLocale(fullCards[0].txt, true, "hu"),
    "synthetic-hu-a"
  );
});

test("falls back to approved English when a full-deck locale is absent", () => {
  assert.equal(
    getPromptForLocale({ en: "synthetic-en" }, true, "hu"),
    "synthetic-en"
  );
});

test("maps landscape and portrait cards to the current card backs", () => {
  assert.equal(getCardBackSource({ width: 4, height: 3 }), "../static/green2.jpg");
  assert.equal(getCardBackSource({ width: 3, height: 4 }), "../static/green1.jpg");
});

test("numbers flipped cards from one in their current order", () => {
  assert.equal(getCardNumber(0), 1);
  assert.equal(getCardNumber(2), 3);
});

test("delegates shuffle and preserves the input card membership", () => {
  const shuffled = shuffleWith(anonymousCards, (cards) => cards.slice().reverse());
  assert.deepEqual(
    shuffled.map((card) => card.id),
    ["anonymous-card-c", "anonymous-card-b", "anonymous-card-a"]
  );
  assert.deepEqual(
    [...shuffled].map((card) => card.id).sort(),
    [...anonymousCards].map((card) => card.id).sort()
  );
});

test("keeps the current public route files available without target redirects", () => {
  for (const route of ["index", "cards", "about", "contact", "login"]) {
    const routePath = path.resolve(__dirname, `../../pages/${route}.js`);
    assert.equal(fs.existsSync(routePath), true, `${route}.js should exist`);
  }
});
