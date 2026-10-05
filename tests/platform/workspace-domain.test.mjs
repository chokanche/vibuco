import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
    return { shortCircuit: true, url: new URL(`${specifier}.ts`, context.parentURL).href };
  }
  return next(specifier, context);
} });
const { seededShuffle, uniformIndex } = await import("../../src/modules/session/domain/shuffle.ts");
const { PRESETS, createWorkspace, transitionWorkspace, cardLabel, cardVisibility,
  controlLabels, announcement } = await import("../../src/modules/session/domain/workspace-state.ts");
const seed = "1a2b3c4d5566778899aabbccddeeff01";
const other = "9876543210abcdefabcd1234fedc5678";
const ids = Object.freeze(Array.from({ length: 10 }, (_, i) => `card_${i}`));
const create = (extra = {}) => createWorkspace({ cardIds: ids, seed, ...extra });
const apply = (state, action) => transitionWorkspace(state, action).state;

test("all five presets match the approved matrix atomically", () => {
  const expected = [
    ["resonant_question", "face_up", "shown"], ["surprise_question", "face_down", "shown"],
    ["surprise_image", "face_down", "hidden"], ["open_reflection", "face_up", "hidden"],
    ["facilitator_choice", "face_up", "hidden"],
  ];
  assert.equal(Object.keys(PRESETS).length, 5);
  for (const [preset, orientation, promptVisibility] of expected) {
    const before = create();
    const result = transitionWorkspace(before, { type: "preset", preset });
    assert.equal(result.state.orientation, orientation);
    assert.equal(result.state.promptVisibility, promptVisibility);
    assert.deepEqual(result.state.cardIds, before.cardIds);
    assert.deepEqual(result.intents, [{ type: "preset_selected", preset }]);
    assert.equal(before.preset, "resonant_question");
    assert.equal(create({ preset }).orientation, orientation);
  }
});

test("orientation and prompt controls stay independent across every combination", () => {
  for (const orientation of ["face_up", "face_down"]) {
    for (const promptVisibility of ["shown", "hidden"]) {
      const state = apply(apply(create(), { type: "orientation", orientation }),
        { type: "prompts", promptVisibility });
      assert.equal(state.orientation, orientation);
      assert.equal(state.promptVisibility, promptVisibility);
      const labels = controlLabels(state);
      assert.equal(labels.images, orientation === "face_up" ? "Hide images" : "Show images");
      assert.equal(labels.prompts, promptVisibility === "shown" ? "Hide prompts" : "Show prompts");
      assert.equal(labels.imageState, orientation === "face_up" ? "Images shown" : "Images hidden");
      assert.equal(labels.promptState, promptVisibility === "shown" ? "Prompts shown" : "Prompts hidden");
      const reverse = apply(state, { type: "orientation", orientation: orientation === "face_up" ? "face_down" : "face_up" });
      assert.equal(reverse.promptVisibility, promptVisibility);
    }
  }
});

test("surprise question hides grid content and reveals only the selected focused card", () => {
  const state = create({ preset: "surprise_question" });
  const id = state.cardIds[0];
  assert.deepEqual(cardVisibility(state, id), { image: false, prompt: false });
  assert.equal(cardLabel(state, id), "Card 1 of 10, image hidden");
  assert.deepEqual(cardVisibility(state, id, true), { image: false, prompt: false });
  const result = transitionWorkspace(state, { type: "select", cardId: id });
  assert.deepEqual(result.intents, [{ type: "card_revealed", cardId: id }]);
  assert.deepEqual(cardVisibility(result.state, id, true), { image: true, prompt: true });
  assert.deepEqual(cardVisibility(result.state, result.state.cardIds[1], true), { image: false, prompt: false });
  assert.deepEqual(cardVisibility(apply(result.state, { type: "prompts", promptVisibility: "hidden" }), id, true),
    { image: true, prompt: false });
  assert.equal(cardLabel(create(), id).includes("image shown"), true);
  assert.deepEqual(cardVisibility(create(), id), { image: true, prompt: true });
});

test("presentation requires selection and close clears presentation without changing controls", () => {
  assert.throws(() => apply(create(), { type: "presentation", enabled: true }), /NO_SELECTED_CARD/);
  let state = apply(create(), { type: "select", cardId: ids[0] });
  state = apply(state, { type: "presentation", enabled: true });
  assert.equal(state.presentation, true);
  assert.equal(apply(state, { type: "presentation", enabled: false }).presentation, false);
  const closed = apply(state, { type: "close" });
  assert.equal(closed.selectedCardId, null);
  assert.equal(closed.presentation, false);
  assert.deepEqual(closed.cardIds, state.cardIds);
});

test("shuffle always uses canonical input and reset restores initial preset/order with current locale", () => {
  const initial = create({ preset: "surprise_image" });
  let state = apply(initial, { type: "select", cardId: ids[0] });
  state = apply(state, { type: "presentation", enabled: true });
  state = apply(state, { type: "preset", preset: "resonant_question" });
  for (const locale of ["en", "sr-Latn", "hu"]) state = apply(state, { type: "locale", locale });
  const shuffled = transitionWorkspace(state, { type: "shuffle", seed: other });
  assert.deepEqual(shuffled.state.cardIds, seededShuffle(ids, other));
  assert.deepEqual(apply(shuffled.state, { type: "shuffle", seed: other }).cardIds, shuffled.state.cardIds);
  assert.deepEqual(shuffled.intents, [{ type: "shuffled" }]);
  const cancelled = transitionWorkspace(shuffled.state, { type: "reset", confirmed: false });
  assert.equal(cancelled.state, shuffled.state);
  assert.deepEqual(cancelled.intents, []);
  const reset = transitionWorkspace(shuffled.state, { type: "reset", confirmed: true });
  assert.deepEqual(reset.state.cardIds, initial.cardIds);
  assert.equal(reset.state.preset, initial.preset);
  assert.equal(reset.state.seed, seed);
  assert.equal(reset.state.orientation, "face_down");
  assert.equal(reset.state.promptVisibility, "hidden");
  assert.equal(reset.state.locale, "hu");
  assert.equal(reset.state.selectedCardId, null);
  assert.equal(reset.state.presentation, false);
  assert.deepEqual(reset.intents, [{ type: "reset" }]);
  assert.equal(announcement(reset.intents[0]), "Session reset");
  assert.equal(announcement(shuffled.intents[0]), "Cards shuffled");
  assert.equal(announcement({ type: "preset_selected", preset: "surprise_image" }), null);
});

test("shuffle is immutable, reproducible, and a permutation for empty through 100-card decks", () => {
  for (let size = 0; size <= 100; size++) {
    const cards = Object.freeze(Array.from({ length: size }, (_, i) => Object.freeze({ id: i })));
    const result = seededShuffle(cards, seed);
    assert.notEqual(result, cards);
    assert.deepEqual(result, seededShuffle(cards, seed));
    assert.deepEqual([...result].sort((a, b) => a.id - b.id), cards);
    result.forEach((card) => assert.equal(card, cards[card.id]));
  }
  assert.notDeepEqual(seededShuffle(ids, seed), seededShuffle(ids, other));
  assert.deepEqual(createWorkspace({ cardIds: [], seed }).cardIds, []);
  const state = create();
  assert.throws(() => state.cardIds.push("extra"), TypeError);
  assert.throws(() => { state.locale = "hu"; }, TypeError);
});

test("bounded random selection rejects the biased tail and validates random input", () => {
  const words = [0xffffffff, 4];
  assert.equal(uniformIndex(() => words.shift(), 3), 1);
  assert.equal(words.length, 0);
  assert.equal(uniformIndex(() => 0xffffffff, 0x100000000), 0xffffffff);
  for (const bound of [0, -1, 1.5, NaN, 0x100000001]) {
    assert.throws(() => uniformIndex(() => 0, bound), /INVALID_RANDOM_BOUND/);
  }
  for (const word of [-1, 0x100000000, NaN, 0.5]) {
    assert.throws(() => uniformIndex(() => word, 3), /INVALID_RANDOM_WORD/);
  }
});

test("fixed statistical corpus covers all permutations and positional balance", () => {
  // Deterministic synthetic seeds, never used by application sessions.
  let word = 0xabcdef01;
  const next = () => { word ^= word << 13; word ^= word >>> 17; word ^= word << 5; return word >>> 0; };
  const positions = Array.from({ length: 5 }, () => Array(5).fill(0));
  const permutations = new Set();
  const samples = 24000;
  for (let i = 0; i < samples; i++) {
    const sampleSeed = Array.from({ length: 4 }, () => next().toString(16).padStart(8, "0")).join("");
    const result = seededShuffle([0, 1, 2, 3, 4], sampleSeed);
    permutations.add(result.join(""));
    result.forEach((card, position) => positions[card][position]++);
  }
  assert.equal(permutations.size, 120);
  for (const counts of positions) {
    const chiSquared = counts.reduce((sum, n) => sum + (n - samples / 5) ** 2 / (samples / 5), 0);
    assert.ok(chiSquared < 25, `positional chi-square ${chiSquared}`);
  }
});

test("invalid seeds, IDs, controls and arbitrary metadata fail with bounded errors", () => {
  for (const bad of ["", "user@example.com", "0".repeat(32), "a".repeat(33), 42]) {
    assert.throws(() => seededShuffle(ids, bad), /INVALID_SEED/);
  }
  for (const cardIds of [["duplicate", "duplicate"], [""], ["x".repeat(129)], ["https://asset"], [42],
    Array.from({ length: 101 }, (_, i) => `id_${i}`), null]) {
    assert.throws(() => createWorkspace({ cardIds, seed }), /INVALID_DECK/);
  }
  assert.throws(() => create({ locale: "de" }), /INVALID_LOCALE/);
  assert.throws(() => create({ preset: "toString" }), /INVALID_PRESET/);
  const state = create();
  const badActions = [null, { type: "toString" }, { type: "unknown" },
    { type: "close", notes: "private" }, { type: "locale", locale: "de" },
    { type: "preset", preset: "bad" }, { type: "orientation", orientation: "bad" },
    { type: "prompts", promptVisibility: "bad" }, { type: "select", cardId: "missing" },
    { type: "presentation", enabled: "yes" }, { type: "reset", confirmed: "yes" },
    { type: "shuffle", seed: "bad" }];
  for (const action of badActions) assert.throws(() => transitionWorkspace(state, action), /WORKSPACE_/);
  assert.throws(() => cardVisibility(state, "missing"), /UNKNOWN_CARD/);
  assert.throws(() => cardLabel(state, "missing"), /UNKNOWN_CARD/);
});
