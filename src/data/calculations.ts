import { partTemplates } from './parts';
import type { PlayerPilot, UnitTemplate, UnitUpgrades, UpgradeKey } from '../types/game';

export const blankUpgrades = (): UnitUpgrades => ({ hp: 0, en: 0, move: 0, mobility: 0, armor: 0, aim: 0, weapon: 0 });

export function getUpgrades(pilot: PlayerPilot, unitId: string): UnitUpgrades {
  return { ...blankUpgrades(), ...(pilot.upgrades[unitId] ?? {}) };
}

export function upgradeCost(level: number, key: UpgradeKey) {
  return 5000 * (level + 1) * (key === 'weapon' ? 2 : 1);
}

export function partMods(pilot: PlayerPilot, unitId: string) {
  const mods: Record<string, number | string> = { hp: 0, en: 0, move: 0, mobility: 0, armor: 0, aim: 0, weaponPct: 0 };
  for (const id of pilot.equippedParts[unitId] ?? []) {
    const part = partTemplates.find((item) => item.id === id);
    if (!part) continue;
    for (const [key, value] of Object.entries(part.mods ?? {})) {
      if (typeof value === 'number') {
        const current = typeof mods[key] === 'number' ? mods[key] as number : 0;
        mods[key] = current + value;
      } else if (typeof value === 'string') {
        mods[key] = value;
      }
    }
  }
  return mods;
}

export function unitStats(pilot: PlayerPilot, unit: UnitTemplate) {
  const up = getUpgrades(pilot, unit.id);
  const mods = partMods(pilot, unit.id);
  return {
    hp: unit.hp + up.hp * 350 + (typeof mods.hp === 'number' ? mods.hp : 0),
    en: unit.en + up.en * 10 + (typeof mods.en === 'number' ? mods.en : 0),
    move: unit.move + (up.move >= 5 ? 1 : 0) + (typeof mods.move === 'number' ? mods.move : 0),
    mobility: unit.mobility + up.mobility * 5 + (typeof mods.mobility === 'number' ? mods.mobility : 0),
    armor: unit.armor + up.armor * 80 + (typeof mods.armor === 'number' ? mods.armor : 0),
    aim: unit.aim + up.aim * 5 + (typeof mods.aim === 'number' ? mods.aim : 0),
    weaponPct: 1 + up.weapon * 0.05 + (typeof mods.weaponPct === 'number' ? mods.weaponPct : 0),
  };
}
