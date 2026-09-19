import type { PilotStats, PilotTemplate, PilotType } from '../types/game';

const realSkills = ['집중력', '정밀기동', '히트 앤 어웨이'];
const superSkills = ['저력 Lv2', '인파이트', '가드'];

const adjustments: Record<PilotType, Partial<PilotStats>> = {
  '리얼계': { melee: -20, ranged: 15, reaction: 20, control: 20, defense: -15, skill: 10 },
  '슈퍼계': { melee: 20, ranged: -15, reaction: -15, control: -10, defense: 25, skill: -5 },
};

const statKeys: Array<keyof PilotStats> = ['melee', 'ranged', 'reaction', 'control', 'defense', 'skill'];
const TARGET_TOTAL = 1020;

export function adaptPilotToType(template: PilotTemplate, type: PilotType): PilotTemplate {
  if (template.type === type) return { ...template, stats: { ...template.stats }, special: [...template.special] };

  const stats = { ...template.stats };
  const adjustment = adjustments[type];
  for (const key of statKeys) {
    stats[key] = Math.max(100, Math.min(250, stats[key] + (adjustment[key] ?? 0)));
  }

  let diff = TARGET_TOTAL - statKeys.reduce((sum, key) => sum + stats[key], 0);
  const order: Array<keyof PilotStats> = type === '리얼계'
    ? ['ranged', 'reaction', 'control', 'skill', 'melee', 'defense']
    : ['melee', 'defense', 'skill', 'reaction', 'control', 'ranged'];

  for (let i = 0; i < 600 && diff !== 0; i += 1) {
    const key = order[i % order.length];
    if (diff > 0 && stats[key] < 250) {
      stats[key] += 1;
      diff -= 1;
    } else if (diff < 0 && stats[key] > 100) {
      stats[key] -= 1;
      diff += 1;
    }
  }

  return {
    ...template,
    type,
    stats,
    special: [...(type === '리얼계' ? realSkills : superSkills)],
  };
}
