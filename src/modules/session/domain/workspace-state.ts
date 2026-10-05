import { seededShuffle, validateSeed } from "./shuffle";

export type Orientation = "face_up" | "face_down";
export type PromptVisibility = "shown" | "hidden";
export type Locale = "en" | "sr-Latn" | "hu";
export type Preset = "resonant_question" | "surprise_question" | "surprise_image" |
  "open_reflection" | "facilitator_choice";

export const PRESETS: Readonly<Record<Preset, Readonly<{
  orientation: Orientation; promptVisibility: PromptVisibility;
}>>> = Object.freeze({
  resonant_question: Object.freeze({ orientation: "face_up", promptVisibility: "shown" }),
  surprise_question: Object.freeze({ orientation: "face_down", promptVisibility: "shown" }),
  surprise_image: Object.freeze({ orientation: "face_down", promptVisibility: "hidden" }),
  open_reflection: Object.freeze({ orientation: "face_up", promptVisibility: "hidden" }),
  facilitator_choice: Object.freeze({ orientation: "face_up", promptVisibility: "hidden" }),
});

export interface WorkspaceState {
  readonly canonicalCardIds: readonly string[];
  readonly cardIds: readonly string[];
  readonly seed: string;
  readonly orientation: Orientation;
  readonly promptVisibility: PromptVisibility;
  readonly locale: Locale;
  readonly preset: Preset;
  readonly selectedCardId: string | null;
  readonly presentation: boolean;
  readonly initial: Readonly<{ seed: string; preset: Preset }>;
}

export type WorkspaceAction =
  | { type: "preset"; preset: Preset }
  | { type: "orientation"; orientation: Orientation }
  | { type: "prompts"; promptVisibility: PromptVisibility }
  | { type: "locale"; locale: Locale }
  | { type: "select"; cardId: string }
  | { type: "close" }
  | { type: "presentation"; enabled: boolean }
  | { type: "shuffle"; seed: string }
  | { type: "reset"; confirmed: boolean };

/** Local intents only; the future session adapter owns transport, sequence and telemetry. */
export type WorkspaceIntent =
  | { type: "preset_selected"; preset: Preset }
  | { type: "card_revealed"; cardId: string }
  | { type: "shuffled" }
  | { type: "reset" };
export interface Transition {
  readonly state: WorkspaceState;
  readonly intents: readonly WorkspaceIntent[];
}

function validPreset(value: Preset): void {
  if (!Object.hasOwn(PRESETS, value)) throw new Error("WORKSPACE_INVALID_PRESET");
}
function validLocale(value: Locale): void {
  if (!["en", "sr-Latn", "hu"].includes(value)) throw new Error("WORKSPACE_INVALID_LOCALE");
}
function freezeState(state: WorkspaceState): WorkspaceState {
  return Object.freeze({ ...state, canonicalCardIds: Object.freeze([...state.canonicalCardIds]),
    cardIds: Object.freeze([...state.cardIds]), initial: Object.freeze({ ...state.initial }) });
}

export function createWorkspace(input: {
  cardIds: readonly string[]; seed: string; locale?: Locale; preset?: Preset;
}): WorkspaceState {
  const { cardIds, seed, locale = "en", preset = "resonant_question" } = input;
  validLocale(locale);
  validPreset(preset);
  validateSeed(seed);
  if (!Array.isArray(cardIds) || cardIds.length > 100 ||
      cardIds.some((id) => typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) ||
      new Set(cardIds).size !== cardIds.length) {
    throw new Error("WORKSPACE_INVALID_DECK");
  }
  return freezeState({ canonicalCardIds: cardIds, cardIds: seededShuffle(cardIds, seed),
    seed, locale, preset, ...PRESETS[preset], selectedCardId: null, presentation: false,
    initial: { seed, preset } });
}

export function transitionWorkspace(state: WorkspaceState, action: WorkspaceAction): Transition {
  let next: WorkspaceState = state;
  const intents: WorkspaceIntent[] = [];
  // Reject arbitrary payloads, especially free-text coaching content.
  const fields: Record<WorkspaceAction["type"], readonly string[]> = {
    preset: ["type", "preset"], orientation: ["type", "orientation"],
    prompts: ["type", "promptVisibility"], locale: ["type", "locale"],
    select: ["type", "cardId"], close: ["type"], presentation: ["type", "enabled"],
    shuffle: ["type", "seed"], reset: ["type", "confirmed"],
  };
  if (!action || !Object.hasOwn(fields, action.type) ||
      Object.keys(action).some((key) => !fields[action.type].includes(key))) {
    throw new Error("WORKSPACE_INVALID_ACTION");
  }
  switch (action.type) {
    case "preset":
      validPreset(action.preset);
      next = { ...state, preset: action.preset, ...PRESETS[action.preset] };
      intents.push({ type: "preset_selected", preset: action.preset });
      break;
    case "orientation":
      if (!["face_up", "face_down"].includes(action.orientation)) throw new Error("WORKSPACE_INVALID_ORIENTATION");
      next = { ...state, orientation: action.orientation };
      break;
    case "prompts":
      if (!["shown", "hidden"].includes(action.promptVisibility)) throw new Error("WORKSPACE_INVALID_PROMPTS");
      next = { ...state, promptVisibility: action.promptVisibility };
      break;
    case "locale":
      validLocale(action.locale);
      next = { ...state, locale: action.locale };
      break;
    case "select":
      if (!state.cardIds.includes(action.cardId)) throw new Error("WORKSPACE_UNKNOWN_CARD");
      next = { ...state, selectedCardId: action.cardId };
      intents.push({ type: "card_revealed", cardId: action.cardId });
      break;
    case "close":
      next = { ...state, selectedCardId: null, presentation: false };
      break;
    case "presentation":
      if (typeof action.enabled !== "boolean") throw new Error("WORKSPACE_INVALID_PRESENTATION");
      if (action.enabled && state.selectedCardId === null) throw new Error("WORKSPACE_NO_SELECTED_CARD");
      next = { ...state, presentation: action.enabled };
      break;
    case "shuffle":
      next = { ...state, seed: action.seed, cardIds: seededShuffle(state.canonicalCardIds, action.seed) };
      intents.push({ type: "shuffled" });
      break;
    case "reset":
      if (typeof action.confirmed !== "boolean") throw new Error("WORKSPACE_INVALID_CONFIRMATION");
      if (action.confirmed) {
        next = { ...state, ...PRESETS[state.initial.preset], preset: state.initial.preset,
          seed: state.initial.seed, cardIds: seededShuffle(state.canonicalCardIds, state.initial.seed),
          selectedCardId: null, presentation: false };
        intents.push({ type: "reset" });
      }
      break;
  }
  return Object.freeze({ state: next === state ? state : freezeState(next),
    intents: Object.freeze(intents.map((intent) => Object.freeze(intent))) });
}

/** No image/prompt text in grid names, including while cards are face down. */
export function cardLabel(state: WorkspaceState, cardId: string): string {
  const index = state.cardIds.indexOf(cardId);
  if (index < 0) throw new Error("WORKSPACE_UNKNOWN_CARD");
  return `Card ${index + 1} of ${state.cardIds.length}, ${state.orientation === "face_up" ? "image shown" : "image hidden"}`;
}
export function controlLabels(state: WorkspaceState): Readonly<{
  images: string; prompts: string; imageState: string; promptState: string;
}> {
  return Object.freeze({ images: state.orientation === "face_up" ? "Hide images" : "Show images",
    prompts: state.promptVisibility === "shown" ? "Hide prompts" : "Show prompts",
    imageState: state.orientation === "face_up" ? "Images shown" : "Images hidden",
    promptState: state.promptVisibility === "shown" ? "Prompts shown" : "Prompts hidden" });
}
/** Face-down grids hide prompts; the selected focused view reveals them independently. */
export function cardVisibility(state: WorkspaceState, cardId: string, focused = false): Readonly<{
  image: boolean; prompt: boolean;
}> {
  if (!state.cardIds.includes(cardId)) throw new Error("WORKSPACE_UNKNOWN_CARD");
  const revealed = focused && state.selectedCardId === cardId;
  const image = state.orientation === "face_up" || revealed;
  return Object.freeze({ image, prompt: image && state.promptVisibility === "shown" });
}
export function announcement(intent: WorkspaceIntent): string | null {
  if (intent.type === "shuffled") return "Cards shuffled";
  if (intent.type === "reset") return "Session reset";
  return null;
}
