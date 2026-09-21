import type { BloodType, PilotType } from '../types/game';

const typeBase: Record<PilotType, string[]> = {
  '리얼계': ['집중', '열혈'],
  '슈퍼계': ['필중', '열혈'],
};

const birthdayPool: Record<PilotType, string[]> = {
  '리얼계': ['가속', '필중', '혼', '철벽'],
  '슈퍼계': ['철벽', '혼', '가속', '집중'],
};

const bloodPool: Record<BloodType, string[]> = {
  A: ['철벽', '집중', '가속', '혼'],
  B: ['가속', '혼', '철벽', '집중'],
  O: ['열혈', '필중', '혼', '가속'],
  AB: ['혼', '집중', '철벽', '가속'],
};

function uniqueSpirits(items: string[]) {
  return items.filter((item, index) => items.indexOf(item) === index);
}

export function deriveSpirits(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  bloodType: BloodType,
  type: PilotType,
) {
  const birthdayIndex = Math.abs((birthYear * 13 + birthMonth * 7 + birthDay * 3)) % birthdayPool[type].length;
  const bloodOffset = Math.abs(birthYear + birthMonth * 2 + birthDay) % bloodPool[bloodType].length;
  const result = uniqueSpirits([...typeBase[type], birthdayPool[type][birthdayIndex]]);
  const bloodCandidates = bloodPool[bloodType];

  for (let step = 0; step < bloodCandidates.length; step += 1) {
    const candidate = bloodCandidates[(bloodOffset + step) % bloodCandidates.length];
    if (!result.includes(candidate)) {
      result.push(candidate);
      break;
    }
  }

  const fallback = type === '리얼계'
    ? ['집중', '열혈', '가속', '필중', '혼', '철벽']
    : ['필중', '열혈', '철벽', '혼', '가속', '집중'];

  for (const spirit of fallback) {
    if (result.length >= 4) break;
    if (!result.includes(spirit)) result.push(spirit);
  }
  return result.slice(0, 4);
}

export function defaultPilotBirth(age: number, seed: string) {
  const now = new Date();
  const seedValue = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const month = (seedValue % 12) + 1;
  const day = (seedValue % 27) + 1;
  const birthdayPassed = month < now.getMonth() + 1 || (month === now.getMonth() + 1 && day <= now.getDate());
  const year = now.getFullYear() - age - (birthdayPassed ? 0 : 1);
  return { year, month, day };
}

export const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB'];
