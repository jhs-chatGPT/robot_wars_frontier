export type DailyKey = 'sortie' | 'upgrade' | 'pvp' | 'kills';
export interface DailyProgress { date: string; counts: Record<DailyKey, number>; claimed: DailyKey[] }
export const dailyMissions: { id: DailyKey; title: string; target: number; credit: number; pp: number }[] = [
  { id: 'sortie', title: '작전 3회 완료', target: 3, credit: 5000, pp: 0 },
  { id: 'upgrade', title: '기체 1회 개조', target: 1, credit: 0, pp: 100 },
  { id: 'pvp', title: 'PvP 1회 참가', target: 1, credit: 3000, pp: 0 },
  { id: 'kills', title: '적 기체 10기 격파', target: 10, credit: 0, pp: 150 },
];
// Account-wide counters reset at midnight KST, including while the home screen stays open.
export function dailyDate(now = Date.now()) { return new Date(now + 9 * 3600000).toISOString().slice(0, 10); }
export function freshDaily(): DailyProgress { return { date: dailyDate(), counts: { sortie: 0, upgrade: 0, pvp: 0, kills: 0 }, claimed: [] }; }
export function currentDaily(value?: DailyProgress): DailyProgress { return value?.date === dailyDate() ? value : freshDaily(); }
export function advanceDaily(value: DailyProgress | undefined, gains: Partial<Record<DailyKey, number>>) {
  const next = currentDaily(value);
  return { ...next, counts: Object.fromEntries(Object.entries(next.counts).map(([key, count]) => [key, count + (gains[key as DailyKey] ?? 0)])) as Record<DailyKey, number> };
}

export function claimDailyReward(value: DailyProgress | undefined, key: DailyKey) {
  const daily = currentDaily(value);
  const mission = dailyMissions.find((item) => item.id === key);
  if (!mission || daily.claimed.includes(key) || daily.counts[key] < mission.target) return null;
  return { daily: { ...daily, claimed: [...daily.claimed, key] }, credit: mission.credit, pp: mission.pp };
}
