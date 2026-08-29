export interface UsageSession {
  startedAt: string;
  durationSeconds?: number;
}
export function sumUsageSecondsForDay(sessions: UsageSession[], day: string): number {
  return sessions
    .filter((s) => s.startedAt.slice(0, 10) === day)
    .reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);
}
