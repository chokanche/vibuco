const PRIVATE_NAME_MARKERS = [
  "DATABASE_URL",
  "PASSWORD",
  "PRIVATE_KEY",
  "SECRET",
  "SESSION_KEY",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
] as const;

export function assertEnvironmentBoundary(
  environment: Readonly<Record<string, string | undefined>>
): void {
  const exposedPrivateName = Object.keys(environment).find(
    (name) =>
      name.startsWith("NEXT_PUBLIC_") &&
      PRIVATE_NAME_MARKERS.some((marker) => name.includes(marker))
  );

  if (exposedPrivateName) {
    throw new Error(
      `Server-only environment variable cannot be public: ${exposedPrivateName}`
    );
  }
}
