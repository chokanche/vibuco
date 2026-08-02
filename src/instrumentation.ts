import "server-only";

export async function register(): Promise<void> {
  // Provider adapters are intentionally deferred until HUMAN-DECISION-002.
  // The request wrapper is provider-neutral and remains safe when no exporter exists.
}
