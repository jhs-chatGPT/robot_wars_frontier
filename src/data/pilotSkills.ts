import type { PilotType } from '../types/game';

export type PilotTrainingSkill = {
  name: string;
  cost: number;
  upgradeCost: number;
  maxLevel: number;
  type: '공용' | PilotType;
  category: '전투' | '생존' | '기동' | '지원';
  description: string;
};

export const pilotTrainingSkills: PilotTrainingSkill[] = [
  { name: '에이스 파일럿', cost: 60, upgradeCost: 60, maxLevel: 1, type: '공용', category: '전투', description: '전투 경험을 바탕으로 명중과 공격 효율을 안정적으로 높입니다.' },
  { name: '원호공격', cost: 50, upgradeCost: 45, maxLevel: 4, type: '공용', category: '지원', description: '아군 공격에 추가 공격으로 참가할 수 있는 횟수와 효율을 높입니다.' },
  { name: '원호방어', cost: 50, upgradeCost: 45, maxLevel: 4, type: '공용', category: '지원', description: '인접 아군을 대신 방어하는 능력의 효율과 발동 횟수를 높입니다.' },
  { name: 'SP 업', cost: 60, upgradeCost: 55, maxLevel: 3, type: '공용', category: '지원', description: '정신 커맨드 운용에 필요한 SP 성장 보너스를 강화합니다.' },
  { name: '리더십', cost: 65, upgradeCost: 55, maxLevel: 3, type: '공용', category: '지원', description: '아군의 전투 흐름을 정리해 명중과 공격 효율을 보조합니다.' },
  { name: '지휘관', cost: 70, upgradeCost: 60, maxLevel: 4, type: '공용', category: '지원', description: '부대 단위의 전술 판단을 강화하는 특수능력입니다. 능력치의 지휘 항목과는 별개입니다.' },
  { name: '뉴타입', cost: 80, upgradeCost: 70, maxLevel: 9, type: '리얼계', category: '기동', description: '반응과 공간 인식이 향상되어 명중·회피 전투에서 강점을 얻습니다.' },
  { name: '천재', cost: 80, upgradeCost: 80, maxLevel: 1, type: '리얼계', category: '전투', description: '높은 전투 감각으로 명중과 회피, 공격 효율을 동시에 보정합니다.' },
  { name: '코디네이터', cost: 75, upgradeCost: 75, maxLevel: 1, type: '리얼계', category: '전투', description: '정밀한 기체 제어와 사격 능력을 강화합니다.' },
  { name: '강화인간', cost: 75, upgradeCost: 65, maxLevel: 9, type: '리얼계', category: '기동', description: '강화된 감각과 반응으로 회피와 명중 성능을 높입니다.' },
  { name: '집중력', cost: 60, upgradeCost: 60, maxLevel: 1, type: '리얼계', category: '지원', description: '정신 커맨드 운용 효율과 전투 집중도를 향상합니다.' },
  { name: '정밀기동', cost: 65, upgradeCost: 65, maxLevel: 1, type: '리얼계', category: '기동', description: '기체를 세밀하게 제어하여 회피 성능을 강화합니다.' },
  { name: '회피기동', cost: 60, upgradeCost: 50, maxLevel: 3, type: '리얼계', category: '기동', description: '적 공격을 읽고 회피하는 기동 패턴을 단계적으로 강화합니다.' },
  { name: '히트 앤 어웨이', cost: 65, upgradeCost: 65, maxLevel: 1, type: '리얼계', category: '기동', description: '원거리 공격 이후에도 유리한 위치를 유지하기 쉽습니다.' },
  { name: '전술예지', cost: 70, upgradeCost: 70, maxLevel: 1, type: '리얼계', category: '지원', description: '상대의 움직임을 읽어 명중과 회피에 보너스를 얻습니다.' },
  { name: '정밀사격', cost: 55, upgradeCost: 55, maxLevel: 1, type: '리얼계', category: '전투', description: '사격 공격의 명중 안정성을 높입니다.' },
  { name: '저격', cost: 55, upgradeCost: 55, maxLevel: 1, type: '리얼계', category: '전투', description: '원거리 무기의 명중률과 교전 효율을 높입니다.' },
  { name: '전자전', cost: 55, upgradeCost: 55, maxLevel: 1, type: '리얼계', category: '지원', description: '센서와 전자 교란을 활용해 적의 전투 효율을 낮춥니다.' },
  { name: '간파', cost: 70, upgradeCost: 70, maxLevel: 1, type: '리얼계', category: '기동', description: '기력이 오른 상태에서 명중과 회피가 크게 향상됩니다.' },
  { name: '재공격', cost: 90, upgradeCost: 90, maxLevel: 1, type: '리얼계', category: '전투', description: '높은 기량을 바탕으로 추가 공격 기회를 만듭니다.' },
  { name: '분석지원', cost: 60, upgradeCost: 60, maxLevel: 1, type: '리얼계', category: '지원', description: '적 데이터를 분석해 아군의 전투 판단을 보조합니다.' },
  { name: '교란', cost: 65, upgradeCost: 65, maxLevel: 1, type: '리얼계', category: '지원', description: '적의 명중과 행동 효율을 떨어뜨리는 전자 교란 능력입니다.' },
  { name: '건파이트', cost: 50, upgradeCost: 45, maxLevel: 3, type: '리얼계', category: '전투', description: '사격 무기의 위력과 운용 능력을 단계적으로 강화합니다.' },
  { name: '저력', cost: 50, upgradeCost: 45, maxLevel: 9, type: '슈퍼계', category: '생존', description: 'HP가 낮아질수록 명중·방어·공격 성능이 단계적으로 상승합니다.' },
  { name: '인파이트', cost: 50, upgradeCost: 45, maxLevel: 3, type: '슈퍼계', category: '전투', description: '근접 무기의 위력과 돌파 능력을 단계적으로 강화합니다.' },
  { name: '가드', cost: 70, upgradeCost: 70, maxLevel: 1, type: '슈퍼계', category: '생존', description: '받는 피해를 줄여 장기전에 강해집니다.' },
  { name: '투지', cost: 70, upgradeCost: 70, maxLevel: 1, type: '슈퍼계', category: '전투', description: '공격적인 전투 태세로 화력을 끌어올립니다.' },
  { name: '기력한계돌파', cost: 95, upgradeCost: 95, maxLevel: 1, type: '슈퍼계', category: '전투', description: '높은 기력 상태에서 전투 성능의 한계를 확장합니다.' },
  { name: '강습', cost: 65, upgradeCost: 65, maxLevel: 1, type: '슈퍼계', category: '기동', description: '근접 교전 진입 시 명중과 돌파 능력을 높입니다.' },
  { name: '브레이브하트', cost: 90, upgradeCost: 90, maxLevel: 1, type: '슈퍼계', category: '생존', description: '위기 상황에서 공격과 방어를 동시에 끌어올립니다.' },
  { name: '철벽', cost: 70, upgradeCost: 70, maxLevel: 1, type: '슈퍼계', category: '생존', description: '강력한 방어 태세로 받는 피해를 크게 줄입니다.' },
  { name: '혼', cost: 110, upgradeCost: 110, maxLevel: 1, type: '슈퍼계', category: '전투', description: '결정적인 순간의 공격력을 극대화합니다.' },
];

export function specialLevel(specials: string[], name: string) {
  const exact = specials.find((item) => item === name);
  if (exact) return 1;
  const prefix = `${name} Lv`;
  const leveled = specials.find((item) => item.startsWith(prefix));
  if (!leveled) return 0;
  const value = Number(leveled.slice(prefix.length));
  return Number.isFinite(value) ? value : 1;
}

export function specialLabel(name: string, level: number, maxLevel: number) {
  if (maxLevel <= 1) return name;
  return `${name} Lv${level}`;
}
