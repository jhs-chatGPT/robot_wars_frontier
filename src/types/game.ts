export type PilotType = '리얼계' | '슈퍼계';
export type Gender = '남' | '여';
export type BattleAI = '균형형' | '공격형' | '방어형' | '회피형' | '지원형';
export type PageId =
  | 'home' | 'scenario' | 'battle' | 'pilot' | 'hangar' | 'unitlist' | 'parts'
  | 'recruit' | 'shop' | 'encyclopedia' | 'pvp' | 'tourney' | 'admin' | 'option' | 'titlepage';
export type UpgradeKey = 'hp' | 'en' | 'move' | 'mobility' | 'armor' | 'aim' | 'weapon';
export type TerrainKey = 'air' | 'land' | 'water' | 'space';
export type EnemyRank = 'general' | 'elite' | 'commander';
export type BattleResult = 'win' | 'lose' | null;
export type WeaponType = '근접' | '원거리' | '특수';
export type BattleActionResult = { ok: boolean; message?: string };

export type PilotStats = {
  melee: number;
  ranged: number;
  reaction: number;
  control: number;
  defense: number;
  skill: number;
};

export type Terrain = Record<TerrainKey, string>;
export type UnitUpgrades = Record<UpgradeKey, number>;

export type PilotTemplate = {
  id: string;
  family: string;
  name: string;
  display: string;
  title: string;
  quote: string;
  age: number;
  gender: Gender;
  type: PilotType;
  personality: string;
  affiliation: string;
  rank: string;
  specialty: string;
  likes: string;
  dislikes: string;
  desc: string;
  avatar: string;
  fullbody: string;
  stats: PilotStats;
  terrain: Terrain;
  special: string[];
};

export type UnitTemplate = {
  id: string;
  name: string;
  role: string;
  image: string;
  hp: number;
  en: number;
  move: number;
  mobility: number;
  armor: number;
  aim: number;
  size: string;
  slots: number;
  cost: number;
  terrain: Terrain;
  types: string[];
  abilities: string[];
  enemyOnly?: boolean;
  enemyRank?: EnemyRank;
};

export type WeaponTemplate = {
  id: string;
  unitId: string;
  name: string;
  type: WeaponType;
  power: number;
  minRange: number;
  maxRange: number;
  accuracy: number;
  crit: number;
  enCost: number;
  ammo: number;
  terrain: Terrain;
};

export type ScenarioEnemyFormation = {
  rank: EnemyRank;
  unitId: string;
  profileIndex: number;
  wave: number;
  label?: string;
  boss?: boolean;
};

export type ScenarioTemplate = {
  id: string;
  title: string;
  desc: string;
  objective: string;
  terrain: TerrainKey;
  enemyCount: number;
  enemyLevel: number;
  rewardCredit: number;
  rewardExp: number;
  turnLimit: number;
  enemyFormation: ScenarioEnemyFormation[];
};

export type EnemyRankInfo = {
  label: string;
  levelBonus: number;
  statBonus: number;
  special: string[];
  avatars: string[];
};

export type EnemyPilotProfile = {
  unitId: string;
  role: string;
  ai: BattleAI;
  special: string[];
};

export type PartTemplate = {
  id: string;
  name: string;
  desc: string;
  price: number;
  mods: Record<string, number | string>;
};

export type PlayerPilot = PilotTemplate & {
  level: number;
  exp: number;
  sp: number;
  maxSp: number;
  credit: number;
  pp: number;
  kills: number;
  pvpWins: number;
  pvpLosses: number;
  tournamentWins: number;
  battleAI: BattleAI;
  unitId: string;
  ownedUnits: string[];
  upgrades: Record<string, UnitUpgrades>;
  partsInventory: string[];
  equippedParts: Record<string, string[]>;
  scenarioClears: string[];
  terrainCount: Record<TerrainKey, number>;
  spirits: string[];
  records: {
    scenarioWins: number;
    pvpStreak: number;
  };
};

export type BattlePilot = {
  name: string;
  level: number;
  type: PilotType;
  stats: PilotStats;
  terrain: Terrain;
  special: string[];
  avatar: string;
  battleAI: BattleAI;
  enemyRank?: EnemyRank;
  enemyRankLabel?: string;
  enemyRole?: string;
};

export type BattleWeaponState = { id: string; ammoLeft: number };

export type Combatant = {
  id: string;
  kind: 'player' | 'enemy';
  name: string;
  unitId: string;
  pilot: BattlePilot;
  hp: number;
  maxHp: number;
  en: number;
  maxEn: number;
  morale: number;
  guard: boolean;
  alive: boolean;
  wave: number;
  isBoss: boolean;
  spawnLabel: string;
  weapons: BattleWeaponState[];
  mobility: number;
  armor: number;
  aim: number;
  move: number;
  weaponPct: number;
  rangeBonus: number;
  critBonus: number;
  enCostPct: number;
  damageReduce: number;
  beamReduce: number;
  partBarrier: number;
  partBarrierCost: number;
  abilities: string[];
};

export type BattleEffects = {
  focus: boolean;
  sureHit: boolean;
  valor: boolean;
  wall: boolean;
  accel: boolean;
};

export type BattleState = {
  scenarioId: string;
  terrain: TerrainKey;
  round: number;
  turnLimit: number;
  distance: number;
  player: Combatant;
  enemies: Combatant[];
  enemyIndex: number;
  activeWave: number;
  maxWave: number;
  effects: BattleEffects;
  log: string[];
  finished: boolean;
  result: BattleResult;
  rewardApplied: boolean;
  killsGained: number;
};

export type DuelResult = {
  playerWin: boolean;
  log: string[];
  player: Combatant;
  opponent: Combatant;
  finalDistance: number;
};

export type PvpResult = {
  id: string;
  opponentName: string;
  opponentUnitId: string;
  opponentLevel: number;
  won: boolean;
  credit: number;
  exp: number;
  createdAt: string;
  log: string[];
};

export type TournamentDefenseSlot = { unitId: string; ai: BattleAI };
export type TournamentStatus = 'active' | 'completed' | 'cancelled';

export type Tournament = {
  id: string;
  name: string;
  format: string;
  rounds: number;
  minLv: number;
  maxCost: number | null;
  entry: number;
  prize: number;
  prizeCredit?: number;
  prizePP?: number;
  prizeUnitId?: string | null;
  isCustom: boolean;
  defenseLineup: TournamentDefenseSlot[];
  status: TournamentStatus;
  escrowLocked?: boolean;
  createdAt: string;
  completedAt?: string;
  winnerName?: string;
  winnerUserId?: string;
  creatorUserId?: string;
  battleLog?: string[];
};


export type TournamentDraft = {
  name: string;
  rounds: number;
  minLv: number;
  maxCost: number;
  prizeCredit: number;
  prizePP: number;
  prizeUnitId: string | null;
  defenseLineup: TournamentDefenseSlot[];
};

export type CatalogState = {
  customUnits: UnitTemplate[];
  customWeapons: WeaponTemplate[];
  customScenarios: ScenarioTemplate[];
};

export type GameSettings = {
  aiTournament: boolean;
  compactMode: boolean;
};
