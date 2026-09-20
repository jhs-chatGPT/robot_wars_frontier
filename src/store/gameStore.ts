import { advanceDaily, currentDaily, claimDailyReward, freshDaily, type DailyKey, type DailyProgress } from '../data/dailyMissions';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adaptPilotToType } from '../data/pilotAdjust';
import { blankUpgrades, partMods, upgradeCost } from '../data/calculations';
import { partTemplates } from '../data/parts';
import { pilotTemplates } from '../data/pilots';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates, unitTemplates } from '../data/units';
import { weaponTemplates } from '../data/weapons';
import {
  applySpirit,
  attackBattle,
  autoBattle,
  createBattle,
  guardBattle,
  makeSystemOpponent,
  moveBattle,
  simulateTextDuel,
  spiritCost,
} from '../data/battleEngine';
import type {
  BattleAI,
  BattleState,
  CatalogState,
  GameSettings,
  PageId,
  PilotTemplate,
  PilotType,
  PlayerPilot,
  PvpResult,
  ScenarioTemplate,
  TerrainKey,
  Tournament,
  TournamentDraft,
  UnitTemplate,
  UpgradeKey,
  WeaponTemplate,
} from '../types/game';

const terrainOrder = ['D', 'C', 'B', 'A', 'S'];
const terrainCost: Record<string, number> = { D: 10, C: 20, B: 30, A: 40 };
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;


function normalizePilot(pilot: PlayerPilot): PlayerPilot {
  const legacyStats = pilot.stats as PlayerPilot['stats'] & { command?: number };
  const stats = {
    melee: legacyStats.melee ?? 150,
    ranged: legacyStats.ranged ?? 150,
    reaction: legacyStats.reaction ?? 150,
    control: legacyStats.control ?? 150,
    defense: legacyStats.defense ?? 150,
    skill: legacyStats.skill ?? 150,
  };
  return {
    ...pilot,
    stats,
    kills: pilot.kills ?? 0,
    pvpWins: pilot.pvpWins ?? 0,
    pvpLosses: pilot.pvpLosses ?? 0,
    tournamentWins: pilot.tournamentWins ?? 0,
    battleAI: pilot.battleAI ?? '균형형',
    ownedUnits: pilot.ownedUnits ?? (pilot.unitId ? [pilot.unitId] : []),
    upgrades: pilot.upgrades ?? {},
    partsInventory: pilot.partsInventory ?? [],
    equippedParts: pilot.equippedParts ?? {},
    scenarioClears: pilot.scenarioClears ?? [],
    terrainCount: pilot.terrainCount ?? { air: 0, land: 0, water: 0, space: 0 },
    spirits: pilot.spirits ?? (pilot.type === '리얼계' ? ['집중', '열혈', '가속'] : ['필중', '철벽', '열혈']),
    records: {
      scenarioWins: pilot.records?.scenarioWins ?? 0,
      pvpStreak: pilot.records?.pvpStreak ?? 0,
    },
    maxSp: pilot.maxSp ?? Math.max(50, pilot.sp ?? 50),
    sp: pilot.sp ?? pilot.maxSp ?? 50,
    exp: pilot.exp ?? 0,
    level: pilot.level ?? 1,
    credit: pilot.credit ?? 0,
    pp: pilot.pp ?? 0,
  };
}

function expNeed(level: number) {
  return 100 + level * 20;
}

function addExp(pilot: PlayerPilot, amount: number) {
  const next = structuredClone(pilot);
  next.exp += amount;
  const logs: string[] = [];
  while (next.level < 200 && next.exp >= expNeed(next.level)) {
    next.exp -= expNeed(next.level);
    next.level += 1;
    const spGain = 3 + Math.floor(Math.random() * 8);
    next.maxSp += spGain;
    next.sp = Math.min(next.maxSp, next.sp + spGain);
    const statKeys = Object.keys(next.stats) as Array<keyof typeof next.stats>;
    const growthCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < growthCount; i += 1) {
      const key = statKeys[Math.floor(Math.random() * statKeys.length)];
      next.stats[key] += 1 + Math.floor(Math.random() * 3);
    }
    logs.push(`Lv.${next.level} 상승 · 최대 SP +${spGain}`);
  }
  return { pilot: next, logs };
}

function allScenarios(catalog: CatalogState) {
  return [...scenarios, ...catalog.customScenarios];
}

function allUnits(catalog: CatalogState) {
  return [...allUnitTemplates, ...catalog.customUnits];
}

function applyBattleResult(pilot: PlayerPilot, battle: BattleState, catalog: CatalogState) {
  const nextPilot = structuredClone(pilot);
  const nextBattle = structuredClone(battle);
  if (!nextBattle.finished || nextBattle.rewardApplied) return { pilot: nextPilot, battle: nextBattle };
  nextPilot.kills += nextBattle.killsGained;
  const scenario = allScenarios(catalog).find((item) => item.id === nextBattle.scenarioId);
  if (nextBattle.result === 'win' && scenario) {
    const mods = partMods(nextPilot, nextPilot.unitId);
    const creditGain = Math.round(scenario.rewardCredit * (1 + (typeof mods.creditPct === 'number' ? mods.creditPct : 0)));
    const expGain = Math.round(scenario.rewardExp * (1 + (typeof mods.expPct === 'number' ? mods.expPct : 0)));
    const ppGain = Math.max(15, Math.round(scenario.rewardExp / 4)) + (typeof mods.ppBonus === 'number' ? mods.ppBonus : 0);
    nextPilot.credit += creditGain;
    nextPilot.pp += ppGain;
    const leveled = addExp(nextPilot, expGain);
    Object.assign(nextPilot, leveled.pilot);
    nextPilot.records.scenarioWins += 1;
    if (!nextPilot.scenarioClears.includes(scenario.id)) nextPilot.scenarioClears.push(scenario.id);
    nextPilot.terrainCount[scenario.terrain] = (nextPilot.terrainCount[scenario.terrain] ?? 0) + 1;
    const rank = nextPilot.terrain[scenario.terrain];
    const rankIndex = terrainOrder.indexOf(rank);
    const need = rank === 'B' ? 3 : rank === 'A' ? 8 : Number.POSITIVE_INFINITY;
    if (nextPilot.terrainCount[scenario.terrain] >= need && rankIndex >= 0 && rankIndex < terrainOrder.length - 1) {
      nextPilot.terrain[scenario.terrain] = terrainOrder[rankIndex + 1];
      nextBattle.log.push(`지형적응 ${scenario.terrain} ${rank} → ${nextPilot.terrain[scenario.terrain]} 상승`);
    }
    if (Math.random() < 0.22) {
      const candidates = partTemplates.filter((part) => !nextPilot.partsInventory.includes(part.id));
      if (candidates.length) {
        const drop = candidates[Math.floor(Math.random() * candidates.length)];
        nextPilot.partsInventory.push(drop.id);
        nextBattle.log.push(`강화파츠 획득 · ${drop.name}`);
      }
    }
    nextBattle.log.push(`보상 +${creditGain.toLocaleString()}C / EXP +${expGain} / PP +${ppGain}`);
    nextBattle.log.push(...leveled.logs);
  }
  nextPilot.sp = nextPilot.maxSp;
  nextBattle.log.push(`SP 전량 회복 · ${nextPilot.sp}/${nextPilot.maxSp}`);
  nextBattle.rewardApplied = true;
  return { pilot: nextPilot, battle: nextBattle };
}

interface GameState {
  daily: DailyProgress;
  claimDaily: (key: DailyKey) => boolean;
  page: PageId;
  hasEnteredGame: boolean;
  draftPilotId: string | null;
  draftType: PilotType | null;
  pilot: PlayerPilot | null;
  pilotRoster: PlayerPilot[];
  battle: BattleState | null;
  pvpResults: PvpResult[];
  tournaments: Tournament[];
  catalog: CatalogState;
  settings: GameSettings;
  setPage: (page: PageId) => void;
  selectPilot: (id: string) => void;
  selectType: (type: PilotType) => void;
  enterGame: () => void;
  completeRegistration: (template: PilotTemplate, unitId: string) => void;
  trainStat: (key: keyof PlayerPilot['stats']) => boolean;
  trainTerrain: (key: TerrainKey) => boolean;
  buyPilotSpecial: (name: string, cost: number) => boolean;
  trainPilotSpecial: (name: string, cost: number, maxLevel: number) => boolean;
  recruitPilot: (templateId: string) => { ok: boolean; message: string };
  setActivePilot: (templateId: string) => boolean;
  boardUnit: (unitId: string) => void;
  upgradeUnit: (unitId: string, key: UpgradeKey) => boolean;
  togglePart: (unitId: string, partId: string) => 'equipped' | 'removed' | 'full' | 'missing';
  buyPart: (partId: string) => boolean;
  startScenario: (scenarioId: string) => boolean;
  battleMove: (delta: number) => void;
  battleAttack: (weaponId: string) => void;
  battleGuard: () => void;
  battleAuto: () => void;
  useSpirit: (spirit: string) => boolean;
  leaveBattle: () => void;
  setBattleAI: (ai: BattleAI) => void;
  runPvp: () => PvpResult | null;
  createAiTournament: () => void;
  createCustomTournament: (draft: TournamentDraft) => { ok: boolean; message: string };
  deleteTournament: (id: string) => boolean;
  testTournamentDefense: (id: string) => string[];
  enterTournament: (id: string) => string[];
  addCustomUnit: (unit: UnitTemplate) => void;
  addCustomWeapon: (weapon: WeaponTemplate) => void;
  addCustomScenario: (scenario: ScenarioTemplate) => void;
  grantUnit: (unitId: string) => void;
  addPilotSkill: (skill: string) => void;
  setSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => void;
  goTitle: () => void;
  importState: (data: Partial<GameState>) => boolean;
  resetGame: () => void;
}

const emptyCatalog: CatalogState = { customUnits: [], customWeapons: [], customScenarios: [] };

const coreUnitIds = new Set(allUnitTemplates.map((unit) => unit.id));
const coreScenarioIds = new Set(scenarios.map((scenario) => scenario.id));
const coreWeaponIds = new Set(weaponTemplates.map((weapon) => weapon.id));

function newRosterPilot(template: PilotTemplate): PlayerPilot {
  return normalizePilot({
    ...structuredClone(template),
    level: 1,
    exp: 0,
    sp: 50,
    maxSp: 50,
    credit: 0,
    pp: 120,
    kills: 0,
    pvpWins: 0,
    pvpLosses: 0,
    tournamentWins: 0,
    battleAI: '균형형',
    unitId: '',
    ownedUnits: [],
    upgrades: {},
    partsInventory: [],
    equippedParts: {},
    scenarioClears: [],
    terrainCount: { air: 0, land: 0, water: 0, space: 0 },
    spirits: template.type === '리얼계' ? ['집중', '열혈', '가속'] : ['필중', '철벽', '열혈'],
    records: { scenarioWins: 0, pvpStreak: 0 },
  });
}

function syncSharedAccountState(from: PlayerPilot, to: PlayerPilot): PlayerPilot {
  return {
    ...to,
    credit: from.credit,
    unitId: to.unitId || from.unitId,
    ownedUnits: structuredClone(from.ownedUnits),
    upgrades: structuredClone(from.upgrades),
    partsInventory: structuredClone(from.partsInventory),
    equippedParts: structuredClone(from.equippedParts),
    scenarioClears: structuredClone(from.scenarioClears),
    records: structuredClone(from.records),
  };
}

function legacyPilotFromRaw(raw: any): PlayerPilot | null {
  if (!raw) return null;
  const template = pilotTemplates.find((item) => item.avatar.endsWith(String(raw.avatar ?? '').split('/').pop() ?? ''))
    ?? pilotTemplates.find((item) => item.display === String(raw.display ?? `${raw.family ?? ''}${raw.name ?? ''}`));
  if (!template) return null;
  const avatar = typeof raw.avatar === 'string' && raw.avatar.startsWith('assets/') ? `/${raw.avatar}` : (raw.avatar ?? template.avatar);
  const fullbody = typeof raw.fullbody === 'string' && raw.fullbody.startsWith('assets/') ? `/${raw.fullbody}` : (raw.fullbody ?? template.fullbody);
  return normalizePilot({ ...structuredClone(template), ...structuredClone(raw), display: raw.display ?? template.display, avatar, fullbody } as PlayerPilot);
}

function snapshotFromLegacyData(data: any): { pilot: PlayerPilot; pilotRoster: PlayerPilot[]; catalog: CatalogState; settings: GameSettings } | null {
  const users = Array.isArray(data?.users) ? data.users : [];
  const user = users.find((item: any) => item.id === data.currentUserId) ?? users[0];
  const pilot = legacyPilotFromRaw(user?.pilot);
  if (!pilot) return null;
  const roster = (Array.isArray(user?.pilotRoster) ? user.pilotRoster : []).map(legacyPilotFromRaw).filter(Boolean) as PlayerPilot[];
  const customUnits = (Array.isArray(data.units) ? data.units : []).filter((unit: UnitTemplate) => !coreUnitIds.has(unit.id));
  const customWeapons = (Array.isArray(data.weapons) ? data.weapons : []).filter((weapon: WeaponTemplate) => !coreWeaponIds.has(weapon.id));
  const customScenarios = (Array.isArray(data.scenarios) ? data.scenarios : []).filter((scenario: ScenarioTemplate) => !coreScenarioIds.has(scenario.id));
  return {
    pilot,
    pilotRoster: roster,
    catalog: { customUnits, customWeapons, customScenarios },
    settings: { aiTournament: data.settings?.aiTournament ?? true, compactMode: false },
  };
}

function loadLegacySnapshot(): { pilot: PlayerPilot; pilotRoster: PlayerPilot[]; catalog: CatalogState; settings: GameSettings } | null {
  if (typeof localStorage === 'undefined') return null;
  for (const key of ['robot_wars_proto_v8_ui_match', 'robot_wars_proto_v8', 'robot_wars_proto_v2', 'robot_wars_proto_v1']) {
    try {
      const value = localStorage.getItem(key);
      if (!value) continue;
      const converted = snapshotFromLegacyData(JSON.parse(value));
      if (converted) return converted;
    } catch {
      // Ignore malformed legacy entries and try the next historical key.
    }
  }
  return null;
}

const legacyInitial = loadLegacySnapshot();

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      daily: freshDaily(),
      page: 'home',
      hasEnteredGame: false,
      draftPilotId: null,
      draftType: null,
      pilot: legacyInitial?.pilot ?? null,
      pilotRoster: legacyInitial?.pilotRoster ?? [],
      battle: null,
      pvpResults: [],
      tournaments: [],
      catalog: legacyInitial?.catalog ?? emptyCatalog,
      settings: legacyInitial?.settings ?? { aiTournament: true, compactMode: false },
      setPage: (page) => {
        if (page === 'battle' && !get().battle) return set({ page: 'scenario' });
        set({ page });
      },
      selectPilot: (id) => set({ draftPilotId: id }),
      selectType: (type) => set({ draftType: type }),
      enterGame: () => set({ hasEnteredGame: true, page: 'home' }),
      completeRegistration: (template, unitId) => {
        const selectedType = get().draftType ?? template.type;
        const adjusted = adaptPilotToType(template, selectedType);
        set({
          pilot: {
            ...adjusted,
            level: 1,
            exp: 0,
            sp: 50,
            maxSp: 50,
            credit: 100000,
            pp: 320,
            kills: 0,
            pvpWins: 0,
            pvpLosses: 0,
            tournamentWins: 0,
            battleAI: '균형형',
            unitId,
            ownedUnits: [unitId],
            upgrades: { [unitId]: blankUpgrades() },
            partsInventory: ['p1', 'p3'],
            equippedParts: {},
            scenarioClears: [],
            terrainCount: { air: 0, land: 0, water: 0, space: 0 },
            spirits: selectedType === '리얼계' ? ['집중', '열혈', '가속'] : ['필중', '철벽', '열혈'],
            records: { scenarioWins: 0, pvpStreak: 0 },
          },
          daily: freshDaily(),
          pilotRoster: [],
          battle: null,
          page: 'home',
          hasEnteredGame: true,
          draftPilotId: null,
          draftType: null,
        });
      },
      claimDaily: (key) => {
        const state = get();
        const reward = claimDailyReward(state.daily, key);
        if (!state.pilot || !reward) return false;
        set({ daily: reward.daily, pilot: { ...state.pilot, credit: state.pilot.credit + reward.credit, pp: state.pilot.pp + reward.pp } });
        return true;
      },
      trainStat: (key) => {
        const pilot = get().pilot;
        if (!pilot || pilot.pp < 20 || pilot.stats[key] >= 250) return false;
        set({ pilot: { ...pilot, pp: pilot.pp - 20, stats: { ...pilot.stats, [key]: Math.min(250, pilot.stats[key] + 5) } } });
        return true;
      },
      trainTerrain: (key) => {
        const pilot = get().pilot;
        if (!pilot) return false;
        const current = pilot.terrain[key];
        const index = terrainOrder.indexOf(current);
        if (index < 0 || index >= terrainOrder.length - 1) return false;
        const cost = terrainCost[current] ?? 0;
        if (pilot.pp < cost) return false;
        set({ pilot: { ...pilot, pp: pilot.pp - cost, terrain: { ...pilot.terrain, [key]: terrainOrder[index + 1] } } });
        return true;
      },
      buyPilotSpecial: (name, cost) => {
        const pilot = get().pilot;
        if (!pilot || pilot.pp < cost || pilot.special.includes(name)) return false;
        const next = { ...pilot, pp: pilot.pp - cost, special: [...pilot.special, name] };
        if (name === 'SP 업') {
          next.maxSp += 10;
          next.sp = Math.min(next.maxSp, next.sp + 10);
        }
        set({ pilot: next });
        return true;
      },
      trainPilotSpecial: (name, cost, maxLevel) => {
        const pilot = get().pilot;
        if (!pilot || pilot.pp < cost) return false;
        const prefix = `${name} Lv`;
        const index = pilot.special.findIndex((item) => item === name || item.startsWith(prefix));
        let currentLevel = 0;
        if (index >= 0) {
          const current = pilot.special[index];
          currentLevel = current === name ? 1 : Number(current.slice(prefix.length)) || 1;
        }
        if (currentLevel >= maxLevel) return false;
        const nextLevel = currentLevel + 1;
        const nextLabel = maxLevel > 1 ? `${name} Lv${nextLevel}` : name;
        const special = [...pilot.special];
        if (index >= 0) special[index] = nextLabel;
        else special.push(nextLabel);
        const next = { ...pilot, pp: pilot.pp - cost, special };
        if (name === 'SP 업') {
          next.maxSp += 10;
          next.sp = Math.min(next.maxSp, next.sp + 10);
        }
        set({ pilot: next });
        return true;
      },
      recruitPilot: (templateId) => {
        const state = get();
        const pilot = state.pilot;
        const template = pilotTemplates.find((item) => item.id === templateId);
        if (!pilot || !template) return { ok: false, message: '파일럿 정보를 찾을 수 없습니다.' };
        if (pilot.id === templateId || state.pilotRoster.some((item) => item.id === templateId)) return { ok: false, message: '이미 영입한 파일럿입니다.' };
        const index = pilotTemplates.findIndex((item) => item.id === templateId);
        const cost = 60000 + (index % 5) * 10000 + (template.gender === '여' ? 5000 : 0);
        if (pilot.credit < cost) return { ok: false, message: '크레딧이 부족합니다.' };
        const recruited = newRosterPilot(template);
        set({ pilot: { ...pilot, credit: pilot.credit - cost }, pilotRoster: [...state.pilotRoster, recruited] });
        return { ok: true, message: `${template.display} 영입 완료 · ${cost.toLocaleString()}C` };
      },
      setActivePilot: (templateId) => {
        const state = get();
        const pilot = state.pilot;
        if (!pilot || pilot.id === templateId) return false;
        const index = state.pilotRoster.findIndex((item) => item.id === templateId);
        if (index < 0) return false;
        const target = syncSharedAccountState(pilot, state.pilotRoster[index]);
        const roster = [...state.pilotRoster];
        roster[index] = pilot;
        set({ pilot: target, pilotRoster: roster, page: 'pilot' });
        return true;
      },
      boardUnit: (unitId) => {
        const pilot = get().pilot;
        if (!pilot || !pilot.ownedUnits.includes(unitId)) return;
        set({ pilot: { ...pilot, unitId } });
      },
      upgradeUnit: (unitId, key) => {
        const pilot = get().pilot;
        if (!pilot || !pilot.ownedUnits.includes(unitId)) return false;
        const upgrades = { ...blankUpgrades(), ...(pilot.upgrades[unitId] ?? {}) };
        if (upgrades[key] >= 10) return false;
        const cost = upgradeCost(upgrades[key], key);
        if (pilot.credit < cost) return false;
        const next = { ...upgrades, [key]: upgrades[key] + 1 };
        set({ daily: advanceDaily(get().daily, { upgrade: 1 }), pilot: { ...pilot, credit: pilot.credit - cost, upgrades: { ...pilot.upgrades, [unitId]: next } } });
        return true;
      },
      togglePart: (unitId, partId) => {
        const pilot = get().pilot;
        const unit = allUnits(get().catalog).find((item) => item.id === unitId);
        if (!pilot || !unit || !pilot.partsInventory.includes(partId)) return 'missing';
        const equippedParts = Object.fromEntries((Object.entries(pilot.equippedParts) as Array<[string, string[]]>).map(([id, list]) => [id, list.filter((part) => part !== partId)]));
        const current = [...(equippedParts[unitId] ?? [])];
        if ((pilot.equippedParts[unitId] ?? []).includes(partId)) {
          set({ pilot: { ...pilot, equippedParts } });
          return 'removed';
        }
        if (current.length >= unit.slots) return 'full';
        current.push(partId);
        equippedParts[unitId] = current;
        set({ pilot: { ...pilot, equippedParts } });
        return 'equipped';
      },
      buyPart: (partId) => {
        const pilot = get().pilot;
        const part = partTemplates.find((item) => item.id === partId);
        if (!pilot || !part || pilot.credit < part.price) return false;
        const partsInventory = pilot.partsInventory.includes(partId) ? pilot.partsInventory : [...pilot.partsInventory, partId];
        set({ pilot: { ...pilot, credit: pilot.credit - part.price, partsInventory } });
        return true;
      },
      startScenario: (scenarioId) => {
        const state = get();
        const pilot = state.pilot;
        if (!pilot) return false;
        const list = allScenarios(state.catalog);
        const scenarioIndex = list.findIndex((item) => item.id === scenarioId);
        if (scenarioIndex < 0) return false;
        if (scenarioIndex > 0 && !pilot.scenarioClears.includes(list[scenarioIndex - 1].id)) return false;
        const battle = createBattle(list[scenarioIndex], { ...pilot, sp: pilot.maxSp }, state.catalog.customUnits, state.catalog.customWeapons);
        set({ pilot: { ...pilot, sp: pilot.maxSp }, battle, page: 'battle' });
        return true;
      },
      battleMove: (delta) => {
        const state = get();
        if (!state.battle || !state.pilot) return;
        const battle = moveBattle(state.battle, delta, state.pilot, state.catalog.customWeapons);
        const finalized = applyBattleResult(state.pilot, battle, state.catalog);
        set({ battle: finalized.battle, pilot: finalized.pilot, daily: advanceDaily(state.daily, {
          kills: finalized.pilot.kills - state.pilot.kills,
          sortie: finalized.pilot.records.scenarioWins - state.pilot.records.scenarioWins,
        }) });
      },
      battleAttack: (weaponId) => {
        const state = get();
        if (!state.battle || !state.pilot) return;
        const battle = attackBattle(state.battle, weaponId, state.pilot, state.catalog.customWeapons);
        const finalized = applyBattleResult(state.pilot, battle, state.catalog);
        set({ battle: finalized.battle, pilot: finalized.pilot, daily: advanceDaily(state.daily, {
          kills: finalized.pilot.kills - state.pilot.kills,
          sortie: finalized.pilot.records.scenarioWins - state.pilot.records.scenarioWins,
        }) });
      },
      battleGuard: () => {
        const state = get();
        if (!state.battle || !state.pilot) return;
        const battle = guardBattle(state.battle, state.pilot, state.catalog.customWeapons);
        const finalized = applyBattleResult(state.pilot, battle, state.catalog);
        set({ battle: finalized.battle, pilot: finalized.pilot, daily: advanceDaily(state.daily, {
          kills: finalized.pilot.kills - state.pilot.kills,
          sortie: finalized.pilot.records.scenarioWins - state.pilot.records.scenarioWins,
        }) });
      },
      battleAuto: () => {
        const state = get();
        if (!state.battle || !state.pilot) return;
        const battle = autoBattle(state.battle, state.pilot, state.catalog.customWeapons);
        const finalized = applyBattleResult(state.pilot, battle, state.catalog);
        set({ battle: finalized.battle, pilot: finalized.pilot, daily: advanceDaily(state.daily, {
          kills: finalized.pilot.kills - state.pilot.kills,
          sortie: finalized.pilot.records.scenarioWins - state.pilot.records.scenarioWins,
        }) });
      },
      useSpirit: (spirit) => {
        const state = get();
        if (!state.battle || !state.pilot || state.battle.finished || !state.pilot.spirits.includes(spirit)) return false;
        const cost = spiritCost[spirit] ?? 999;
        if (state.pilot.sp < cost) return false;
        set({ pilot: { ...state.pilot, sp: state.pilot.sp - cost }, battle: applySpirit(state.battle, spirit) });
        return true;
      },
      leaveBattle: () => set({ battle: null, page: 'scenario' }),
      setBattleAI: (ai) => {
        const pilot = get().pilot;
        if (pilot) set({ pilot: { ...pilot, battleAI: ai } });
      },
      runPvp: () => {
        const state = get();
        if (!state.pilot) return null;
        const opponent = makeSystemOpponent(state.pilot, state.pvpResults.length + state.pilot.pvpWins + state.pilot.pvpLosses);
        const duel = simulateTextDuel(state.pilot, opponent, state.catalog.customUnits, state.catalog.customWeapons, 24);
        const credit = duel.playerWin ? 15000 : 3000;
        const exp = duel.playerWin ? 55 : 20;
        const leveled = addExp({
          ...state.pilot,
          credit: state.pilot.credit + credit,
          pvpWins: state.pilot.pvpWins + (duel.playerWin ? 1 : 0),
          pvpLosses: state.pilot.pvpLosses + (duel.playerWin ? 0 : 1),
          records: { ...state.pilot.records, pvpStreak: duel.playerWin ? state.pilot.records.pvpStreak + 1 : 0 },
        }, exp);
        const result: PvpResult = {
          id: uid('pvp'), opponentName: opponent.display, opponentUnitId: opponent.unitId, opponentLevel: opponent.level,
          won: duel.playerWin, credit, exp, createdAt: new Date().toISOString(), log: [...duel.log, '', duel.playerWin ? `승리 · +${credit.toLocaleString()}C / EXP +${exp}` : `패배 · 참가보상 +${credit.toLocaleString()}C / EXP +${exp}`],
        };
        set({ daily: advanceDaily(state.daily, { pvp: 1 }), pilot: leveled.pilot, pvpResults: [result, ...state.pvpResults].slice(0, 20) });
        return result;
      },
      createAiTournament: () => {
        const state = get();
        const pilot = state.pilot;
        if (!pilot) return;
        const rounds = pilot.level < 80 ? 4 : 5;
        const prizeUnits = unitTemplates.filter((unit) => !unit.enemyOnly);
        const prizeUnitId = Math.random() < 0.3 ? prizeUnits[Math.floor(Math.random() * prizeUnits.length)]?.id ?? null : null;
        const tournament: Tournament = {
          id: uid('t'), name: `AI ${pilot.level < 50 ? '신인' : pilot.level < 120 ? '중견' : '최상위'} 챔피언십 #${state.tournaments.length + 1}`,
          format: `${2 ** rounds}강 싱글 엘리미네이션`, rounds, minLv: Math.max(1, pilot.level - 15), maxCost: null,
          entry: (1 + Math.floor(Math.random() * 5)) * 5000, prize: (25 + Math.floor(Math.random() * 66)) * 10000,
          prizeUnitId, isCustom: false, defenseLineup: [], status: 'active', createdAt: new Date().toISOString(),
        };
        set({ tournaments: [...state.tournaments, tournament] });
      },
      createCustomTournament: (draft) => {
        const state = get();
        const pilot = state.pilot;
        if (!pilot) return { ok: false, message: '파일럿이 없습니다.' };
        const ids = draft.defenseLineup.map((slot) => slot.unitId);
        if (!ids.length) return { ok: false, message: '수비 기체를 1기 이상 배치하세요.' };
        if (new Set(ids).size !== ids.length) return { ok: false, message: '같은 기체를 중복 배치할 수 없습니다.' };
        if (ids.some((id) => !pilot.ownedUnits.includes(id))) return { ok: false, message: '보유하지 않은 기체가 포함되어 있습니다.' };
        if (draft.prizeCredit > pilot.credit || draft.prizePP > pilot.pp) return { ok: false, message: '상품 재화가 보유량을 초과했습니다.' };
        if (draft.prizeUnitId && (!pilot.ownedUnits.includes(draft.prizeUnitId) || ids.includes(draft.prizeUnitId) || pilot.unitId === draft.prizeUnitId)) return { ok: false, message: '상품 기체를 확인하세요. 주력/수비 기체는 상품으로 걸 수 없습니다.' };
        const nextPilot = { ...pilot, credit: pilot.credit - draft.prizeCredit, pp: pilot.pp - draft.prizePP, ownedUnits: draft.prizeUnitId ? pilot.ownedUnits.filter((id) => id !== draft.prizeUnitId) : pilot.ownedUnits };
        const tournament: Tournament = {
          id: uid('t'), name: draft.name || `프론티어 방어전 #${state.tournaments.filter((item) => item.isCustom).length + 1}`,
          format: `${2 ** draft.rounds}강 싱글 엘리미네이션`, rounds: draft.rounds, minLv: draft.minLv, maxCost: draft.maxCost,
          entry: 0, prize: draft.prizeCredit, prizeCredit: draft.prizeCredit, prizePP: draft.prizePP, prizeUnitId: draft.prizeUnitId,
          isCustom: true, creatorUserId: 'local', defenseLineup: draft.defenseLineup, status: 'active', escrowLocked: true, createdAt: new Date().toISOString(),
        };
        set({ pilot: nextPilot, tournaments: [...state.tournaments, tournament] });
        return { ok: true, message: '직접 토너먼트를 개최했습니다.' };
      },
      deleteTournament: (id) => {
        const state = get();
        const tournament = state.tournaments.find((item) => item.id === id);
        if (!tournament || tournament.status === 'completed') return false;
        let pilot = state.pilot;
        if (pilot && tournament.isCustom && tournament.escrowLocked) {
          pilot = {
            ...pilot,
            credit: pilot.credit + (tournament.prizeCredit ?? tournament.prize ?? 0),
            pp: pilot.pp + (tournament.prizePP ?? 0),
            ownedUnits: tournament.prizeUnitId && !pilot.ownedUnits.includes(tournament.prizeUnitId) ? [...pilot.ownedUnits, tournament.prizeUnitId] : pilot.ownedUnits,
          };
        }
        set({ pilot, tournaments: state.tournaments.filter((item) => item.id !== id) });
        return true;
      },
      testTournamentDefense: (id) => {
        const state = get();
        const tournament = state.tournaments.find((item) => item.id === id);
        const pilot = state.pilot;
        if (!tournament || !pilot || !tournament.isCustom) return ['대회 정보를 찾을 수 없습니다.'];
        const challenger = makeSystemOpponent(pilot, tournament.defenseLineup.length + 3);
        const log = [`[수비 테스트] ${tournament.name}`, `도전자 ${challenger.display}`];
        let cleared = 0;
        for (let i = 0; i < tournament.defenseLineup.length; i += 1) {
          const slot = tournament.defenseLineup[i];
          const defender: PlayerPilot = { ...structuredClone(pilot), unitId: slot.unitId, ownedUnits: [slot.unitId], battleAI: slot.ai };
          const duel = simulateTextDuel(challenger, defender, state.catalog.customUnits, state.catalog.customWeapons, 20);
          log.push('', `===== 수비 ${i + 1} =====`, ...duel.log.slice(0, 50));
          if (!duel.playerWin) { log.push('수비 성공 · 도전자 격퇴'); break; }
          cleared += 1;
          log.push('도전자가 수비선 돌파');
        }
        log.push('', cleared === tournament.defenseLineup.length ? '수비 테스트 결과 · 전 수비선 돌파 허용' : '수비 테스트 결과 · 방어 성공');
        return log;
      },
      enterTournament: (id) => {
        const state = get();
        const tournament = state.tournaments.find((item) => item.id === id);
        const pilot = state.pilot;
        if (!tournament || !pilot) return ['대회 정보를 찾을 수 없습니다.'];
        if (tournament.status !== 'active') return ['이미 종료되었거나 취소된 대회입니다.'];
        if (tournament.isCustom && tournament.creatorUserId === 'local') return ['자신이 개최한 대회에는 참가할 수 없습니다. 수비 테스트를 이용하세요.'];
        if (pilot.level < tournament.minLv) return ['레벨 조건이 부족합니다.'];
        const unit = allUnits(state.catalog).find((item) => item.id === pilot.unitId);
        if (tournament.maxCost != null && (unit?.cost ?? 300) > tournament.maxCost) return [`기체 코스트가 제한 ${tournament.maxCost}을 초과합니다.`];
        if (pilot.credit < tournament.entry) return ['참가비가 부족합니다.'];
        let nextPilot = { ...pilot, credit: pilot.credit - tournament.entry };
        const log = [`[${tournament.name}]`, `${pilot.display} 참가`];
        let wins = 0;
        for (let round = 1; round <= tournament.rounds; round += 1) {
          const opponent = makeSystemOpponent(nextPilot, round + state.tournaments.length);
          const duel = simulateTextDuel(nextPilot, opponent, state.catalog.customUnits, state.catalog.customWeapons, 18);
          log.push('', `===== ${round}회전 vs ${opponent.display} =====`, ...duel.log.slice(0, 45));
          if (!duel.playerWin) { log.push(`${round}회전 패배 · 탈락`); break; }
          wins += 1;
          log.push(`${round}회전 승리`);
        }
        const nextTournaments = state.tournaments.map((item) => ({ ...item }));
        const target = nextTournaments.find((item) => item.id === id)!;
        if (wins === tournament.rounds) {
          nextPilot = { ...nextPilot, tournamentWins: nextPilot.tournamentWins + 1, credit: nextPilot.credit + tournament.prize };
          log.push('', `우승 · +${tournament.prize.toLocaleString()}C`);
          if (tournament.prizeUnitId && !nextPilot.ownedUnits.includes(tournament.prizeUnitId)) {
            nextPilot.ownedUnits = [...nextPilot.ownedUnits, tournament.prizeUnitId];
            log.push(`우승 기체 획득 · ${allUnits(state.catalog).find((item) => item.id === tournament.prizeUnitId)?.name ?? '기체'}`);
          }
          target.status = 'completed'; target.winnerName = nextPilot.display; target.winnerUserId = 'local'; target.completedAt = new Date().toISOString(); target.battleLog = [...log];
        } else {
          const roundReward = wins * 4000;
          nextPilot = { ...nextPilot, credit: nextPilot.credit + roundReward };
          log.push('', `라운드 보상 +${roundReward.toLocaleString()}C`);
        }
        nextPilot = addExp(nextPilot, wins * 25 + 20).pilot;
        set({ pilot: nextPilot, tournaments: nextTournaments });
        return log;
      },
      addCustomUnit: (unit) => {
        const state = get();
        set({ catalog: { ...state.catalog, customUnits: [...state.catalog.customUnits, { ...unit, id: unit.id || uid('u') }] } });
      },
      addCustomWeapon: (weapon) => {
        const state = get();
        set({ catalog: { ...state.catalog, customWeapons: [...state.catalog.customWeapons, { ...weapon, id: weapon.id || uid('w') }] } });
      },
      addCustomScenario: (scenario) => {
        const state = get();
        set({ catalog: { ...state.catalog, customScenarios: [...state.catalog.customScenarios, { ...scenario, id: scenario.id || uid('s') }] } });
      },
      grantUnit: (unitId) => {
        const pilot = get().pilot;
        if (!pilot || pilot.ownedUnits.includes(unitId)) return;
        set({ pilot: { ...pilot, ownedUnits: [...pilot.ownedUnits, unitId], upgrades: { ...pilot.upgrades, [unitId]: blankUpgrades() } } });
      },
      addPilotSkill: (skill) => {
        const pilot = get().pilot;
        if (!pilot || !skill.trim() || pilot.special.includes(skill.trim())) return;
        set({ pilot: { ...pilot, special: [...pilot.special, skill.trim()] } });
      },
      setSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),
      goTitle: () => set({ hasEnteredGame: false, page: 'home', battle: null }),
      importState: (data) => {
        try {
          const raw = data as any;
          if (!raw.pilot && Array.isArray(raw.users)) {
            const legacy = snapshotFromLegacyData(raw);
            if (!legacy) return false;
            set({ daily: freshDaily(), pilot: legacy.pilot, pilotRoster: legacy.pilotRoster, catalog: legacy.catalog, settings: legacy.settings, battle: null, pvpResults: [], tournaments: [], page: 'home', hasEnteredGame: true });
            return true;
          }
          const incomingPilot = data.pilot as PlayerPilot | null | undefined;
          if (!incomingPilot) return false;
          const normalizedPilot = normalizePilot(incomingPilot);
          set({
            daily: currentDaily(data.daily),
            pilot: normalizedPilot,
            pilotRoster: Array.isArray(data.pilotRoster) ? data.pilotRoster.map(normalizePilot) : [],
            battle: null,
            pvpResults: Array.isArray(data.pvpResults) ? data.pvpResults : [],
            tournaments: Array.isArray(data.tournaments) ? data.tournaments : [],
            catalog: data.catalog ?? emptyCatalog,
            settings: data.settings ?? { aiTournament: true, compactMode: false },
            page: 'home', hasEnteredGame: true,
          });
          return true;
        } catch {
          return false;
        }
      },
      resetGame: () => set({ daily: freshDaily(), page: 'home', hasEnteredGame: false, draftPilotId: null, draftType: null, pilot: null, pilotRoster: [], battle: null, pvpResults: [], tournaments: [], catalog: emptyCatalog }),
    }),
    {
      name: 'rwf-react-v0.9-save',
      partialize: (state) => ({ daily: state.daily, pilot: state.pilot, pilotRoster: state.pilotRoster, page: state.page, pvpResults: state.pvpResults, tournaments: state.tournaments, catalog: state.catalog, settings: state.settings }),
      merge: (persisted, current) => {
        const incoming = persisted as Partial<GameState>;
        return { ...current, ...incoming, daily: currentDaily(incoming.daily), pilot: Object.prototype.hasOwnProperty.call(incoming, 'pilot') ? (incoming.pilot ? normalizePilot(incoming.pilot) : null) : current.pilot, pilotRoster: Object.prototype.hasOwnProperty.call(incoming, 'pilotRoster') ? (incoming.pilotRoster?.map(normalizePilot) ?? []) : current.pilotRoster, catalog: Object.prototype.hasOwnProperty.call(incoming, 'catalog') ? (incoming.catalog ?? emptyCatalog) : current.catalog, pvpResults: incoming.pvpResults ?? [], tournaments: incoming.tournaments ?? [], settings: incoming.settings ?? current.settings, battle: null, hasEnteredGame: false };
      },
    },
  ),
);
