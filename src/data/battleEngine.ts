import { enemyPilotProfiles, enemyRankInfo } from './enemies';
import { partMods, unitStats } from './calculations';
import { allUnitTemplates, unitTemplates } from './units';
import { weaponTemplates } from './weapons';
import type {
  BattleAI,
  BattleEffects,
  BattlePilot,
  BattleState,
  Combatant,
  DuelResult,
  EnemyRank,
  PlayerPilot,
  ScenarioTemplate,
  UnitTemplate,
  WeaponTemplate,
} from '../types/game';

const terrainOrder = ['D', 'C', 'B', 'A', 'S'];
const terrainPower: Record<string, number> = { D: 0.72, C: 0.84, B: 0.93, A: 1, S: 1.1 };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const allUnits = (customUnits: UnitTemplate[] = []) => [...allUnitTemplates, ...customUnits];
export const allWeapons = (customWeapons: WeaponTemplate[] = []) => [...weaponTemplates, ...customWeapons];

function weaponAmmo(pilot: PlayerPilot | null, unitId: string, weapon: WeaponTemplate) {
  if (!weapon.ammo) return 0;
  if (!pilot || pilot.unitId !== unitId) return weapon.ammo;
  const mods = partMods(pilot, unitId);
  const ammoPct = typeof mods.ammoPct === 'number' ? mods.ammoPct : 0;
  return Math.max(1, Math.round(weapon.ammo * (1 + ammoPct)));
}

function playerMachineStats(pilot: PlayerPilot, unit: UnitTemplate) {
  const stats = unitStats(pilot, unit);
  return {
    hp: stats.hp,
    en: stats.en,
    move: stats.move,
    mobility: stats.mobility,
    armor: stats.armor,
    aim: stats.aim,
    weaponPct: stats.weaponPct,
  };
}

function enemyMachineStats(unit: UnitTemplate, level: number, rank: EnemyRank) {
  const rankBonus = rank === 'commander' ? 1.16 : rank === 'elite' ? 1.08 : 1;
  const levelScale = 1 + Math.min(0.45, level * 0.0035);
  return {
    hp: Math.round(unit.hp * rankBonus * levelScale),
    en: Math.round(unit.en * (1 + Math.min(0.2, level * 0.0018))),
    move: unit.move,
    mobility: Math.round(unit.mobility * rankBonus + level * 0.18),
    armor: Math.round(unit.armor * rankBonus + level * 2.2),
    aim: Math.round(unit.aim * rankBonus + level * 0.2),
    weaponPct: 1 + Math.min(0.38, level * 0.003),
  };
}

function pilotForPlayer(pilot: PlayerPilot): BattlePilot {
  return {
    name: pilot.display,
    level: pilot.level,
    type: pilot.type,
    stats: { ...pilot.stats },
    terrain: { ...pilot.terrain },
    special: [...pilot.special],
    avatar: pilot.avatar,
    battleAI: pilot.battleAI,
  };
}

function makeEnemyPilot(level: number, rank: EnemyRank, profileIndex: number, unitId: string): BattlePilot {
  const rankInfo = enemyRankInfo[rank];
  const profiles = enemyPilotProfiles[rank];
  const profile = profiles[profileIndex % profiles.length] ?? profiles[0];
  const base = clamp(96 + Math.round(level * 0.82) + rankInfo.statBonus, 100, 225);
  const roleBias = profile.ai === '공격형' ? 8 : profile.ai === '회피형' ? 6 : profile.ai === '방어형' ? 4 : 0;
  return {
    name: `${rankInfo.label} ${profileIndex + 1}`,
    level: level + rankInfo.levelBonus,
    type: '리얼계',
    stats: {
      melee: base + (profile.ai === '공격형' ? 12 : 2),
      ranged: base + (profile.role.includes('사격') || profile.role.includes('판넬') ? 14 : 4),
      reaction: base + (profile.ai === '회피형' ? 13 : 3),
      control: base + roleBias,
      defense: base + (profile.ai === '방어형' ? 15 : 5),
      skill: base + (rank === 'commander' ? 14 : rank === 'elite' ? 8 : 1),
    },
    terrain: { air: 'A', land: 'A', water: 'B', space: 'A' },
    special: [...rankInfo.special, ...profile.special],
    avatar: rankInfo.avatars[profileIndex % rankInfo.avatars.length] ?? rankInfo.avatars[0],
    battleAI: profile.ai,
    enemyRank: rank,
    enemyRankLabel: rankInfo.label,
    enemyRole: profile.role,
  };
}

function hasSkillName(skills: string[], fragment: string) {
  return skills.some((item) => item.includes(fragment));
}

function betterTerrainRank(base: string, bonus: string) {
  const baseIndex = terrainOrder.indexOf(base);
  const bonusIndex = terrainOrder.indexOf(bonus);
  return bonusIndex > baseIndex ? bonus : base;
}

function createCombatant(
  kind: 'player' | 'enemy',
  pilot: BattlePilot,
  unit: UnitTemplate,
  machine: ReturnType<typeof playerMachineStats>,
  weapons: WeaponTemplate[],
  playerSource: PlayerPilot | null,
  wave = 1,
  isBoss = false,
  label = '',
): Combatant {
  const mods = playerSource && kind === 'player' ? partMods(playerSource, unit.id) : {};
  const battlePilot = structuredClone(pilot);
  if (typeof mods.terrainAll === 'string') {
    battlePilot.terrain = {
      air: betterTerrainRank(battlePilot.terrain.air, mods.terrainAll),
      land: betterTerrainRank(battlePilot.terrain.land, mods.terrainAll),
      water: betterTerrainRank(battlePilot.terrain.water, mods.terrainAll),
      space: betterTerrainRank(battlePilot.terrain.space, mods.terrainAll),
    };
  }
  if (typeof mods.airRank === 'string') battlePilot.terrain.air = betterTerrainRank(battlePilot.terrain.air, mods.airRank);
  if (typeof mods.landRank === 'string') battlePilot.terrain.land = betterTerrainRank(battlePilot.terrain.land, mods.landRank);
  if (typeof mods.waterRank === 'string') battlePilot.terrain.water = betterTerrainRank(battlePilot.terrain.water, mods.waterRank);
  if (typeof mods.spaceRank === 'string') battlePilot.terrain.space = betterTerrainRank(battlePilot.terrain.space, mods.spaceRank);
  return {
    id: `${kind}-${unit.id}-${wave}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    name: pilot.name,
    unitId: unit.id,
    pilot: battlePilot,
    hp: machine.hp,
    maxHp: machine.hp,
    en: machine.en,
    maxEn: machine.en,
    morale: Math.min(hasSkillName(battlePilot.special, '기력한계돌파') ? 170 : 150, 100 + (typeof mods.morale === 'number' ? mods.morale : 0)),
    guard: false,
    alive: true,
    wave,
    isBoss,
    spawnLabel: label,
    weapons: weapons.filter((w) => w.unitId === unit.id).map((w) => ({ id: w.id, ammoLeft: weaponAmmo(playerSource, unit.id, w) })),
    mobility: machine.mobility + (unit.abilities.includes('고기동 프레임') ? 12 : 0),
    armor: machine.armor + (unit.abilities.some((ability) => ability.includes('중장갑')) ? 180 : 0),
    aim: machine.aim + (unit.abilities.includes('정밀 사격 보정') ? 12 : 0),
    move: machine.move,
    weaponPct: machine.weaponPct,
    rangeBonus: typeof mods.range === 'number' ? mods.range : 0,
    critBonus: typeof mods.crit === 'number' ? mods.crit : 0,
    enCostPct: typeof mods.enCostPct === 'number' ? mods.enCostPct : 0,
    damageReduce: typeof mods.damageReduce === 'number' ? mods.damageReduce : 0,
    beamReduce: typeof mods.beamReduce === 'number' ? mods.beamReduce : 0,
    partBarrier: typeof mods.barrier === 'number' ? mods.barrier : 0,
    partBarrierCost: typeof mods.barrierCost === 'number' ? mods.barrierCost : 10,
    abilities: [...unit.abilities],
  };
}

export function createBattle(
  scenario: ScenarioTemplate,
  pilot: PlayerPilot,
  customUnits: UnitTemplate[] = [],
  customWeapons: WeaponTemplate[] = [],
): BattleState {
  const units = allUnits(customUnits);
  const weapons = allWeapons(customWeapons);
  const unit = units.find((item) => item.id === pilot.unitId) ?? unitTemplates[0];
  const player = createCombatant('player', pilotForPlayer(pilot), unit, playerMachineStats(pilot, unit), weapons, pilot);
  const formations: import('../types/game').ScenarioEnemyFormation[] = scenario.enemyFormation.length
    ? scenario.enemyFormation
    : Array.from({ length: scenario.enemyCount }, (_, i) => ({ rank: 'general' as EnemyRank, unitId: 'e_g1', profileIndex: i, wave: 1 }));
  const enemies = formations.map((formation, index) => {
    const enemyUnit = units.find((item) => item.id === formation.unitId && item.enemyOnly) ?? units.find((item) => item.enemyOnly) ?? allUnitTemplates[8];
    const ep = makeEnemyPilot(scenario.enemyLevel, formation.rank, formation.profileIndex ?? index, enemyUnit.id);
    const machine = enemyMachineStats(enemyUnit, scenario.enemyLevel, formation.rank);
    return createCombatant('enemy', ep, enemyUnit, machine, weapons, null, formation.wave, Boolean(formation.boss), formation.label ?? '');
  });
  const maxWave = Math.max(1, ...enemies.map((enemy) => enemy.wave));
  return {
    scenarioId: scenario.id,
    terrain: scenario.terrain,
    round: 1,
    turnLimit: scenario.turnLimit,
    distance: rand(5, 8),
    player,
    enemies,
    enemyIndex: 0,
    activeWave: 1,
    maxWave,
    effects: { focus: false, sureHit: false, valor: false, wall: false, accel: false },
    log: [`[${scenario.title}] 작전 개시`, `WAVE 1/${maxWave} · 적 전력 ${enemies.filter((enemy) => enemy.wave === 1).length}기 확인.`],
    finished: false,
    result: null,
    rewardApplied: false,
    killsGained: 0,
  };
}

export function currentEnemy(battle: BattleState): Combatant | null {
  const active = battle.enemies.filter((enemy) => enemy.alive && enemy.wave === battle.activeWave);
  if (!active.length) return null;
  return active[Math.min(battle.enemyIndex, active.length - 1)] ?? active[0];
}

export function weaponState(combatant: Combatant, weaponId: string) {
  return combatant.weapons.find((state) => state.id === weaponId);
}

function effectiveEnCost(combatant: Combatant, weapon: WeaponTemplate) {
  return Math.max(0, Math.round(weapon.enCost * (1 + combatant.enCostPct)));
}

function effectiveMaxRange(combatant: Combatant, weapon: WeaponTemplate) {
  return weapon.maxRange + combatant.rangeBonus;
}

export function usableWeapons(
  combatant: Combatant,
  distance: number,
  customWeapons: WeaponTemplate[] = [],
): WeaponTemplate[] {
  return allWeapons(customWeapons).filter((weapon) => {
    if (weapon.unitId !== combatant.unitId) return false;
    const state = weaponState(combatant, weapon.id);
    return combatant.en >= effectiveEnCost(combatant, weapon) && (!weapon.ammo || (state?.ammoLeft ?? 0) > 0) && distance >= weapon.minRange && distance <= effectiveMaxRange(combatant, weapon);
  });
}

function terrainBonus(rank: string) {
  return terrainPower[rank] ?? 0.93;
}

function rankIndex(rank: string) {
  const index = terrainOrder.indexOf(rank);
  return index < 0 ? 2 : index;
}

function hasSkill(combatant: Combatant, fragment: string) {
  return hasSkillName(combatant.pilot.special, fragment);
}

function skillLevel(combatant: Combatant, name: string) {
  const prefix = `${name} Lv`;
  const entry = combatant.pilot.special.find((item) => item === name || item.startsWith(prefix));
  if (!entry) return 0;
  if (entry === name) return 1;
  const value = Number(entry.slice(prefix.length));
  return Number.isFinite(value) ? value : 1;
}

function moraleCap(combatant: Combatant) {
  return hasSkill(combatant, '기력한계돌파') ? 170 : 150;
}

function passiveCombatMods(combatant: Combatant, defending = false) {
  let hit = 0;
  let evade = 0;
  let damage = 1;
  let guard = 1;
  const ratio = combatant.hp / Math.max(1, combatant.maxHp);
  const newtypeLevel = skillLevel(combatant, '뉴타입');
  if (newtypeLevel) { hit += Math.min(16, 6 + newtypeLevel * 2); evade += Math.min(16, 6 + newtypeLevel * 2); }
  const enhancedLevel = skillLevel(combatant, '강화인간');
  if (enhancedLevel) { hit += Math.min(13, 4 + enhancedLevel); evade += Math.min(12, 3 + enhancedLevel); }
  if (hasSkill(combatant, '초감각')) { hit += 4; evade += 4; }
  if (hasSkill(combatant, '코디네이터')) { hit += 4; evade += 3; damage *= 1.03; }
  if (hasSkill(combatant, '천재')) { hit += 5; evade += 5; }
  if (hasSkill(combatant, '에이스 파일럿')) { hit += 4; evade += 4; damage *= 1.04; }
  if (hasSkill(combatant, '집중력')) { hit += 4; evade += 4; }
  if (hasSkill(combatant, '정밀기동')) evade += 6;
  if (hasSkill(combatant, '회피기동')) evade += 8;
  if (hasSkill(combatant, '전자전')) evade += 6;
  if (hasSkill(combatant, '교란')) evade += 8;
  if (hasSkill(combatant, '전술예지')) { hit += 6; evade += 6; }
  if (hasSkill(combatant, '분석지원')) { hit += 4; damage *= 1.02; }
  if (hasSkill(combatant, '리더십')) { hit += 2; damage *= 1.02; }
  if (hasSkill(combatant, '전술 지휘')) { hit += 4; evade += 2; damage *= 1.02; }
  const commanderLevel = skillLevel(combatant, '지휘관');
  if (commanderLevel) { hit += Math.min(6, 1 + commanderLevel * 2); evade += Math.min(5, commanderLevel + 1); damage *= 1 + Math.min(0.05, commanderLevel * 0.015); }
  if (hasSkill(combatant, '간파') && combatant.morale >= 120) { hit += 6; evade += 6; }
  if ((hasSkill(combatant, '저력') || combatant.abilities.includes('저력 보조')) && ratio <= 0.35) {
    const level = Math.max(1, skillLevel(combatant, '저력'));
    hit += 7 + Math.min(18, level * 2); evade += 3 + Math.min(9, level); damage *= 1.08 + Math.min(0.18, level * 0.02); guard *= Math.max(0.7, 0.94 - level * 0.025);
  }
  if (hasSkill(combatant, '가드')) guard *= 0.9;
  const supportDefenseLevel = skillLevel(combatant, '원호방어');
  if (supportDefenseLevel && defending) guard *= Math.max(0.88, 0.98 - supportDefenseLevel * 0.025);
  if (hasSkill(combatant, '투지')) damage *= 1.05;
  if (hasSkill(combatant, '브레이브하트') && ratio <= 0.5) { damage *= 1.06; guard *= 0.9; }
  if (hasSkill(combatant, '철벽')) guard *= 0.88;
  if (hasSkill(combatant, '혼')) damage *= 1.06;
  return { hit, evade, damage, guard };
}

function calcHit(attacker: Combatant, defender: Combatant, weapon: WeaponTemplate, battle: BattleState) {
  const attackStat = weapon.type === '근접' ? attacker.pilot.stats.melee : attacker.pilot.stats.ranged;
  const attackerMods = passiveCombatMods(attacker);
  const defenderMods = passiveCombatMods(defender, true);
  const pilotDelta = (attackStat - defender.pilot.stats.reaction) * 0.075
    + (attacker.pilot.stats.control - defender.pilot.stats.reaction) * 0.085
    + (attacker.pilot.stats.skill - defender.pilot.stats.skill) * 0.05;
  const machineDelta = (attacker.aim - defender.mobility) * 0.12;
  const terrainDelta = (rankIndex(attacker.pilot.terrain[battle.terrain]) - rankIndex(defender.pilot.terrain[battle.terrain])) * 3;
  let rangeMod = 0;
  if (battle.distance === effectiveMaxRange(attacker, weapon)) rangeMod -= 5;
  if (weapon.type === '원거리' && battle.distance <= 2) rangeMod -= 4;
  let hit = 55 + pilotDelta + machineDelta + weapon.accuracy + terrainDelta + rangeMod + attackerMods.hit - defenderMods.evade + (attacker.morale - 100) * 0.06;
  if (attacker.abilities.includes('정밀 사격 보정') && weapon.type === '원거리') hit += 8;
  if (hasSkill(attacker, '저격') && weapon.type === '원거리') hit += 6;
  if (hasSkill(attacker, '히트 앤 어웨이') && weapon.type === '원거리') hit += 3;
  if (hasSkill(attacker, '강습') && weapon.type === '근접') hit += 3;
  if (attacker.kind === 'player' && battle.effects.focus) hit += 20;
  if (defender.kind === 'player' && battle.effects.focus) hit -= 20;
  if (attacker.kind === 'player' && battle.effects.sureHit) hit = 100;
  return clamp(Math.round(hit), 5, 100);
}

function calcDamage(attacker: Combatant, defender: Combatant, weapon: WeaponTemplate, battle: BattleState, critical: boolean) {
  const attackStat = weapon.type === '근접' ? attacker.pilot.stats.melee : attacker.pilot.stats.ranged;
  const terrain = terrainBonus(weapon.terrain[battle.terrain] ?? 'B');
  const attackerMods = passiveCombatMods(attacker);
  const defenderMods = passiveCombatMods(defender, true);
  let damageMod = attackerMods.damage;
  const inFightLevel = skillLevel(attacker, '인파이트');
  const gunFightLevel = skillLevel(attacker, '건파이트');
  const supportAttackLevel = skillLevel(attacker, '원호공격');
  if (inFightLevel && weapon.type === '근접') damageMod *= 1 + Math.min(0.14, 0.05 + inFightLevel * 0.03);
  if (gunFightLevel && weapon.type === '원거리') damageMod *= 1 + Math.min(0.14, 0.05 + gunFightLevel * 0.03);
  if (supportAttackLevel) damageMod *= 1 + Math.min(0.07, 0.025 + supportAttackLevel * 0.012);
  if (hasSkill(attacker, '강습') && weapon.type === '근접') damageMod *= 1.06;
  const raw = weapon.power * attacker.weaponPct + attackStat * 7 + attacker.morale * 5;
  const reduction = defender.armor * 1.08 + defender.pilot.stats.defense * 5;
  let damage = Math.max(100, Math.round((raw - reduction) * terrain * damageMod * defenderMods.guard));
  if (critical) damage = Math.round(damage * 1.5);
  if (attacker.kind === 'player' && battle.effects.valor) damage *= 2;
  if (defender.kind === 'player' && battle.effects.wall) damage = Math.max(1, Math.round(damage / 4));
  if (defender.guard) damage = Math.max(1, Math.round(damage * 0.6));
  if (defender.abilities.includes('빔 코팅') && weapon.name.includes('빔')) damage = Math.round(damage * 0.85);
  if (defender.abilities.some((ability) => ability.includes('중장갑'))) damage = Math.round(damage * 0.9);
  if (defender.abilities.includes('실탄 경감') && weapon.ammo) damage = Math.round(damage * 0.8);
  if (defender.damageReduce) damage = Math.max(1, Math.round(damage * (1 - defender.damageReduce)));
  if (defender.beamReduce && weapon.name.includes('빔')) damage = Math.max(1, Math.round(damage * (1 - defender.beamReduce)));
  return damage;
}

function consumeWeapon(combatant: Combatant, weapon: WeaponTemplate) {
  combatant.en = Math.max(0, combatant.en - effectiveEnCost(combatant, weapon));
  if (weapon.ammo) {
    const state = weaponState(combatant, weapon.id);
    if (state) state.ammoLeft = Math.max(0, state.ammoLeft - 1);
  }
}

function recoverAtActionStart(combatant: Combatant, sourcePilot: PlayerPilot | null, log: string[]) {
  const mods = sourcePilot && combatant.kind === 'player' ? partMods(sourcePilot, combatant.unitId) : {};
  const unitEnRegen = combatant.abilities.includes('EN 회복(소)') ? 0.1 : 0;
  const enRegen = unitEnRegen + (typeof mods.enRegen === 'number' ? mods.enRegen : 0);
  if (enRegen) {
    const value = Math.max(1, Math.round(combatant.maxEn * enRegen));
    const before = combatant.en;
    combatant.en = Math.min(combatant.maxEn, combatant.en + value);
    if (combatant.en > before) log.push(`[회복] EN +${combatant.en - before}`);
  }
  const unitHpRegen = combatant.abilities.includes('HP 회복(소)') ? 0.1 : 0;
  const hpRegen = unitHpRegen + (typeof mods.hpRegen === 'number' ? mods.hpRegen : 0);
  if (hpRegen) {
    const value = Math.max(1, Math.round(combatant.maxHp * hpRegen));
    const before = combatant.hp;
    combatant.hp = Math.min(combatant.maxHp, combatant.hp + value);
    if (combatant.hp > before) log.push(`[회복] HP +${combatant.hp - before}`);
  }
}

function performAttack(
  battle: BattleState,
  attacker: Combatant,
  defender: Combatant,
  weapon: WeaponTemplate,
  sourcePilot: PlayerPilot | null,
) {
  recoverAtActionStart(attacker, sourcePilot, battle.log);
  consumeWeapon(attacker, weapon);
  battle.log.push(`${attacker.name} → ${defender.name} : [${weapon.name}] · 거리 ${battle.distance}`);
  if ((defender.abilities.includes('분신') || hasSkill(defender, '분신')) && rand(1, 100) <= 30) {
    battle.log.push(`[특수능력] ${defender.name} 분신 발동 · 완전 회피`);
    return;
  }
  const hit = calcHit(attacker, defender, weapon, battle);
  battle.log.push(`명중률 ${hit}% · EN ${attacker.en}/${attacker.maxEn}${weapon.ammo ? ` · 잔탄 ${weaponState(attacker, weapon.id)?.ammoLeft ?? 0}` : ''}`);
  if (rand(1, 100) > hit) {
    battle.log.push('MISS');
    if (attacker.kind === 'player') battle.effects.sureHit = false;
    return;
  }
  const critBonus = (hasSkill(attacker, '천재') ? 8 : 0) + (hasSkill(attacker, '정밀사격') ? 6 : 0) + (hasSkill(attacker, '전술예지') ? 3 : 0) + (hasSkill(attacker, '분석지원') ? 4 : 0) + (hasSkill(attacker, '투지') ? 10 : 0) + (hasSkill(attacker, '혼') ? 12 : 0) + attacker.critBonus;
  const critical = rand(1, 100) <= clamp(Math.round(weapon.crit + (attacker.pilot.stats.skill - defender.pilot.stats.skill) * 0.16 + critBonus), 0, 55);
  let damage = calcDamage(attacker, defender, weapon, battle, critical);
  if (defender.abilities.includes('빔 코팅') && weapon.name.includes('빔')) battle.log.push('[특수능력] 빔 코팅 · 피해 15% 경감');
  if (defender.abilities.some((ability) => ability.includes('중장갑'))) battle.log.push('[특수능력] 중장갑 · 피해 10% 경감');
  if (defender.abilities.includes('실탄 경감') && weapon.ammo) battle.log.push('[특수능력] 실탄 경감 · 피해 20% 경감');
  if (defender.abilities.includes('배리어') && defender.en >= 10) {
    defender.en -= 10;
    damage = Math.max(0, damage - 600);
    battle.log.push('[특수능력] 배리어 · EN 10 소모 / 600 경감');
  }
  if (defender.partBarrier > 0 && defender.en >= defender.partBarrierCost) {
    const before = damage;
    defender.en -= defender.partBarrierCost;
    damage = Math.max(0, damage - defender.partBarrier);
    battle.log.push(`[강화파츠] 배리어 필드 · ${before - damage} 경감 / EN ${defender.partBarrierCost} 소모`);
  }
  defender.hp = Math.max(0, defender.hp - damage);
  attacker.morale = Math.min(moraleCap(attacker), attacker.morale + 2);
  defender.morale = Math.min(moraleCap(defender), defender.morale + 1);
  battle.log.push(`${critical ? 'CRITICAL · ' : ''}${damage} DAMAGE · ${defender.name} HP ${defender.hp}/${defender.maxHp}`);
  if (defender.hp > 0 && hasSkill(attacker, '재공격') && attacker.pilot.stats.skill > defender.pilot.stats.skill && rand(1, 100) <= 20) {
    const extra = Math.max(100, Math.round(damage * 0.35));
    defender.hp = Math.max(0, defender.hp - extra);
    battle.log.push(`[특수능력] 재공격 · 추가 ${extra} DAMAGE · ${defender.name} HP ${defender.hp}/${defender.maxHp}`);
  }
  if (attacker.kind === 'player') {
    battle.effects.sureHit = false;
    battle.effects.valor = false;
  }
  defender.guard = false;
  if (defender.hp <= 0) {
    defender.alive = false;
    attacker.morale = Math.min(moraleCap(attacker), attacker.morale + 5);
    battle.log.push(`★ ${defender.name} 격추`);
    if (attacker.kind === 'player') battle.killsGained += 1;
  }
}

function advanceWave(battle: BattleState) {
  if (battle.enemies.some((enemy) => enemy.alive && enemy.wave === battle.activeWave)) return false;
  const nextWave = Math.min(...battle.enemies.filter((enemy) => enemy.alive).map((enemy) => enemy.wave), Infinity);
  if (!Number.isFinite(nextWave)) {
    battle.finished = true;
    battle.result = 'win';
    battle.log.push('MISSION COMPLETE · 적 전멸');
    return true;
  }
  battle.activeWave = nextWave;
  battle.enemyIndex = 0;
  battle.distance = rand(5, 9);
  const first = currentEnemy(battle);
  battle.log.push(`--- WAVE ${nextWave}/${battle.maxWave} ---`);
  if (first?.spawnLabel) battle.log.push(first.spawnLabel);
  battle.log.push(`증원 ${battle.enemies.filter((enemy) => enemy.alive && enemy.wave === nextWave).length}기 확인 · 거리 ${battle.distance}`);
  return true;
}

function chooseAutoWeapon(combatant: Combatant, battle: BattleState, customWeapons: WeaponTemplate[]) {
  const weapons = usableWeapons(combatant, battle.distance, customWeapons);
  if (!weapons.length) return null;
  const ai = combatant.pilot.battleAI ?? '균형형';
  if (ai === '공격형') return [...weapons].sort((a, b) => b.power - a.power)[0];
  if (ai === '방어형') return [...weapons].sort((a, b) => (a.enCost + (a.ammo ? 10 : 0)) - (b.enCost + (b.ammo ? 10 : 0)))[0];
  if (ai === '회피형') return [...weapons].sort((a, b) => (b.maxRange + b.accuracy / 20) - (a.maxRange + a.accuracy / 20))[0];
  return [...weapons].sort((a, b) => (b.power + b.accuracy * 12) - (a.power + a.accuracy * 12))[0];
}

function preferredRange(combatant: Combatant, customWeapons: WeaponTemplate[]) {
  const weapons = allWeapons(customWeapons).filter((weapon) => weapon.unitId === combatant.unitId);
  if (!weapons.length) return 3;
  const best = [...weapons].sort((a, b) => (b.power + effectiveMaxRange(combatant, b) * 100) - (a.power + effectiveMaxRange(combatant, a) * 100))[0];
  return clamp(Math.round((best.minRange + effectiveMaxRange(combatant, best)) / 2), 1, 16);
}

function maneuverFor(combatant: Combatant, battle: BattleState, customWeapons: WeaponTemplate[]) {
  const target = preferredRange(combatant, customWeapons);
  const delta = clamp(target - battle.distance, -Math.max(1, combatant.move), Math.max(1, combatant.move));
  if (!delta) return;
  const before = battle.distance;
  battle.distance = clamp(battle.distance + delta, 1, 16);
  battle.log.push(`${combatant.name} 기동 · 거리 ${before} → ${battle.distance}`);
}

function enemyResponse(battle: BattleState, playerSource: PlayerPilot | null, customWeapons: WeaponTemplate[]) {
  const enemy = currentEnemy(battle);
  if (!enemy || battle.finished) return;
  let weapon = chooseAutoWeapon(enemy, battle, customWeapons);
  if (!weapon) {
    maneuverFor(enemy, battle, customWeapons);
    weapon = chooseAutoWeapon(enemy, battle, customWeapons);
  }
  if (weapon) performAttack(battle, enemy, battle.player, weapon, null);
  else battle.log.push(`${enemy.name}: 사거리/EN/잔탄 조건으로 공격 불가`);
  if (!battle.player.alive || battle.player.hp <= 0) {
    battle.finished = true;
    battle.result = 'lose';
    battle.log.push('MISSION FAILED · 아군 기체 격추');
  }
  battle.round += 1;
  battle.effects.focus = false;
  battle.effects.wall = false;
  battle.player.guard = false;
  if (playerSource && battle.player.alive) recoverAtActionStart(battle.player, playerSource, battle.log);
  if (!battle.finished && battle.round > battle.turnLimit) {
    battle.finished = true;
    battle.result = 'lose';
    battle.log.push('MISSION FAILED · 교전 제한 라운드 초과');
  }
}

export function attackBattle(
  original: BattleState,
  weaponId: string,
  pilot: PlayerPilot,
  customWeapons: WeaponTemplate[] = [],
): BattleState {
  const battle = structuredClone(original);
  if (battle.finished) return battle;
  const enemy = currentEnemy(battle);
  const weapon = allWeapons(customWeapons).find((item) => item.id === weaponId && item.unitId === battle.player.unitId);
  if (!enemy || !weapon) return battle;
  if (!usableWeapons(battle.player, battle.distance, customWeapons).some((item) => item.id === weapon.id)) {
    battle.log.push(`${weapon.name}: 현재 거리/EN/잔탄 조건에서 사용 불가`);
    return battle;
  }
  battle.log.push(`--- ROUND ${battle.round} ---`);
  performAttack(battle, battle.player, enemy, weapon, pilot);
  if (!enemy.alive) advanceWave(battle);
  if (!battle.finished) enemyResponse(battle, pilot, customWeapons);
  return battle;
}

export function moveBattle(
  original: BattleState,
  delta: number,
  pilot: PlayerPilot,
  customWeapons: WeaponTemplate[] = [],
): BattleState {
  const battle = structuredClone(original);
  if (battle.finished) return battle;
  battle.log.push(`--- ROUND ${battle.round} ---`);
  const maxMove = battle.player.move + (battle.effects.accel ? 3 : 0);
  const actual = clamp(delta, -maxMove, maxMove);
  const before = battle.distance;
  battle.distance = clamp(battle.distance + actual, 1, 16);
  battle.effects.accel = false;
  battle.log.push(`${battle.player.name} 기동 · 거리 ${before} → ${battle.distance}`);
  enemyResponse(battle, pilot, customWeapons);
  return battle;
}

export function guardBattle(original: BattleState, pilot: PlayerPilot, customWeapons: WeaponTemplate[] = []) {
  const battle = structuredClone(original);
  if (battle.finished) return battle;
  battle.log.push(`--- ROUND ${battle.round} ---`);
  battle.player.guard = true;
  battle.log.push(`${battle.player.name} 방어 태세`);
  enemyResponse(battle, pilot, customWeapons);
  return battle;
}

export function autoBattle(original: BattleState, pilot: PlayerPilot, customWeapons: WeaponTemplate[] = []) {
  const battle = structuredClone(original);
  if (battle.finished) return battle;
  let weapon = chooseAutoWeapon(battle.player, battle, customWeapons);
  if (!weapon) {
    maneuverFor(battle.player, battle, customWeapons);
    weapon = chooseAutoWeapon(battle.player, battle, customWeapons);
  }
  if (!weapon) return guardBattle(battle, pilot, customWeapons);
  return attackBattle(battle, weapon.id, pilot, customWeapons);
}

export function applySpirit(original: BattleState, spirit: string) {
  const battle = structuredClone(original);
  const effects: BattleEffects = battle.effects;
  if (spirit === '집중') effects.focus = true;
  if (spirit === '필중') effects.sureHit = true;
  if (spirit === '열혈' || spirit === '혼') effects.valor = true;
  if (spirit === '철벽') effects.wall = true;
  if (spirit === '가속') effects.accel = true;
  battle.log.push(`정신기 [${spirit}] 사용`);
  return battle;
}

export const spiritCost: Record<string, number> = { 집중: 15, 필중: 20, 열혈: 30, 혼: 45, 철벽: 25, 가속: 10 };

export function simulateTextDuel(
  p1: PlayerPilot,
  p2: PlayerPilot,
  customUnits: UnitTemplate[] = [],
  customWeapons: WeaponTemplate[] = [],
  maxRounds = 24,
): DuelResult {
  const units = allUnits(customUnits);
  const weapons = allWeapons(customWeapons);
  const u1 = units.find((unit) => unit.id === p1.unitId) ?? unitTemplates[0];
  const u2 = units.find((unit) => unit.id === p2.unitId) ?? unitTemplates[0];
  const a = createCombatant('player', pilotForPlayer(p1), u1, playerMachineStats(p1, u1), weapons, p1);
  const b = createCombatant('enemy', pilotForPlayer(p2), u2, playerMachineStats(p2, u2), weapons, p2);
  const battle: BattleState = {
    scenarioId: 'duel', terrain: 'space', round: 1, turnLimit: maxRounds, distance: rand(4, 8), player: a, enemies: [b], enemyIndex: 0,
    activeWave: 1, maxWave: 1, effects: { focus: false, sureHit: false, valor: false, wall: false, accel: false },
    log: [`[TEXT DUEL] ${a.name} / ${u1.name} VS ${b.name} / ${u2.name}`], finished: false, result: null, rewardApplied: true, killsGained: 0,
  };
  for (let round = 1; round <= maxRounds && a.alive && b.alive; round += 1) {
    battle.round = round;
    battle.log.push(`--- ROUND ${round} · 거리 ${battle.distance} ---`);
    let wa = chooseAutoWeapon(a, battle, customWeapons);
    if (!wa) { maneuverFor(a, battle, customWeapons); wa = chooseAutoWeapon(a, battle, customWeapons); }
    if (wa) performAttack(battle, a, b, wa, p1); else battle.log.push(`${a.name}: 공격 불가`);
    if (!b.alive) break;
    let wb = chooseAutoWeapon(b, battle, customWeapons);
    if (!wb) { maneuverFor(b, battle, customWeapons); wb = chooseAutoWeapon(b, battle, customWeapons); }
    if (wb) performAttack(battle, b, a, wb, p2); else battle.log.push(`${b.name}: 공격 불가`);
  }
  const playerWin = a.alive && (!b.alive || a.hp >= b.hp);
  battle.log.push(`전투 종료 · ${a.name} HP ${a.hp}/${a.maxHp} · ${b.name} HP ${b.hp}/${b.maxHp}`);
  battle.log.push(playerWin ? `${a.name} 승리` : `${b.name} 승리`);
  return { playerWin, log: battle.log, player: a, opponent: b, finalDistance: battle.distance };
}

export function makeSystemOpponent(me: PlayerPilot, index = 0): PlayerPilot {
  const names = [['김', '태윤'], ['박', '서준'], ['이', '현우'], ['최', '도윤'], ['정', '하린']];
  const [family, name] = names[index % names.length];
  const unit = unitTemplates[(index + Math.max(0, me.level - 1)) % unitTemplates.length];
  const level = clamp(me.level + rand(-4, 6), 1, 200);
  const base = clamp(130 + Math.round(level * 0.45), 130, 230);
  const type = ['u4', 'u5', 'u6', 'u8'].includes(unit.id) ? '슈퍼계' : '리얼계';
  return {
    ...me,
    id: `system-${index}`,
    family,
    name,
    display: `${family}${name}`,
    title: '시스템 아레나 파일럿',
    quote: '전투 데이터를 갱신한다.',
    affiliation: '프론티어 아레나',
    rank: '도전자',
    specialty: '자동 교전',
    likes: '-', dislikes: '-', desc: 'PvP 및 대회용 시스템 상대.',
    type,
    level,
    exp: 0,
    sp: 50,
    maxSp: 50,
    stats: { melee: base + 4, ranged: base + 6, reaction: base + 3, control: base + 5, defense: base + 4, skill: base + 5 },
    special: level >= 60 ? ['에이스 파일럿', '간파'] : level >= 25 ? ['에이스 파일럿'] : ['기초 전투 훈련'],
    unitId: unit.id,
    ownedUnits: [unit.id],
    upgrades: { [unit.id]: { hp: Math.min(10, Math.floor(level / 22)), en: Math.min(10, Math.floor(level / 24)), move: 0, mobility: Math.min(10, Math.floor(level / 20)), armor: Math.min(10, Math.floor(level / 20)), aim: Math.min(10, Math.floor(level / 20)), weapon: Math.min(10, Math.floor(level / 18)) } },
    equippedParts: {},
    partsInventory: [],
    battleAI: (['공격형', '방어형', '회피형', '균형형'] as BattleAI[])[index % 4],
    credit: 0, pp: 0, kills: 0, pvpWins: 0, pvpLosses: 0, tournamentWins: 0,
    scenarioClears: [], terrainCount: { air: 0, land: 0, water: 0, space: 0 }, spirits: [], records: { scenarioWins: 0, pvpStreak: 0 },
  };
}
