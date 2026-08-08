import "server-only";

export type FlagSubject = Readonly<{ actorId?: string }>;
export type FlagDefinition = Readonly<{
  key: string;
  owner: string;
  purpose: string;
  expiresAt: string;
  defaultValue: boolean;
  globalValue?: boolean;
  actorIds?: readonly string[];
}>;
export type FlagAuditEvent = Readonly<{
  key: string;
  outcome: "on" | "off";
  reason: "default" | "global" | "cohort" | "expired" | "dependency_failure";
}>;
export interface FlagRepository {
  get(key: string): Promise<FlagDefinition | undefined>;
}
export type FlagEvaluator = Readonly<{
  evaluate: (key: string, subject: FlagSubject) => Promise<boolean>;
  auditEvents: () => readonly FlagAuditEvent[];
}>;

function validDefinition(flag: FlagDefinition): boolean {
  return Boolean(flag.key && flag.owner && flag.purpose && Date.parse(flag.expiresAt));
}

export function createFlagEvaluator(repository: FlagRepository): FlagEvaluator {
  const events: FlagAuditEvent[] = [];
  return Object.freeze({
    async evaluate(key, subject) {
      try {
        const flag = await repository.get(key);
        if (!flag || !validDefinition(flag)) {
          events.push({ key, outcome: "off", reason: "dependency_failure" });
          return false;
        }
        if (new Date(flag.expiresAt).getTime() <= Date.now()) {
          events.push({ key, outcome: "off", reason: "expired" });
          return false;
        }
        if (flag.actorIds?.includes(subject.actorId ?? "")) {
          events.push({ key, outcome: "on", reason: "cohort" });
          return true;
        }
        if (flag.globalValue !== undefined) {
          events.push({ key, outcome: flag.globalValue ? "on" : "off", reason: "global" });
          return flag.globalValue;
        }
        events.push({ key, outcome: flag.defaultValue ? "on" : "off", reason: "default" });
        return flag.defaultValue;
      } catch {
        events.push({ key, outcome: "off", reason: "dependency_failure" });
        return false;
      }
    },
    auditEvents: () => Object.freeze([...events]),
  });
}
