(function exposeLegacyCardsBehavior(root, factory) {
  const behavior = factory();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = behavior;
  }

  if (root) {
    root.LegacyCardsBehavior = behavior;
  }
})(typeof window !== "undefined" ? window : null, function createBehavior() {
  const getDeckTableName = (authenticated) =>
    authenticated ? "vibuco-photos" : "vibuco-photos-public";

  const getPromptForLocale = (prompt, authenticated, locale = "en") => {
    if (!authenticated || typeof prompt === "string") return prompt;
    return prompt[locale] || prompt.en;
  };

  const getCardBackSource = (card) =>
    card.width / card.height >= 1
      ? "../static/green2.jpg"
      : "../static/green1.jpg";

  const getCardNumber = (index) => index + 1;

  const shuffleWith = (cards, shuffler) => shuffler(cards);

  return {
    getCardBackSource,
    getCardNumber,
    getDeckTableName,
    getPromptForLocale,
    shuffleWith,
  };
});
