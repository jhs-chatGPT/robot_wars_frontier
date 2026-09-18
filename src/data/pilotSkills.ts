import type { PilotType } from '../types/game';

export type PilotTrainingSkill = {
  name: string;
  cost: number;
  type: '공용' | PilotType;
};

export const pilotTrainingSkills: PilotTrainingSkill[] = [
  { name: '에이스 파일럿', cost: 60, type: '공용' },
  { name: '지휘관 Lv1', cost: 60, type: '공용' },
  { name: '지휘관 Lv2', cost: 100, type: '공용' },
  { name: '원호공격 Lv1', cost: 50, type: '공용' },
  { name: '원호방어 Lv1', cost: 50, type: '공용' },
  { name: 'SP 업', cost: 60, type: '공용' },
  { name: '뉴타입 Lv1', cost: 80, type: '리얼계' },
  { name: '천재', cost: 80, type: '리얼계' },
  { name: '코디네이터', cost: 75, type: '리얼계' },
  { name: '강화인간', cost: 75, type: '리얼계' },
  { name: '집중력', cost: 60, type: '리얼계' },
  { name: '정밀기동', cost: 65, type: '리얼계' },
  { name: '히트 앤 어웨이', cost: 65, type: '리얼계' },
  { name: '전술예지', cost: 70, type: '리얼계' },
  { name: '정밀사격', cost: 55, type: '리얼계' },
  { name: '저격', cost: 55, type: '리얼계' },
  { name: '전자전', cost: 55, type: '리얼계' },
  { name: '간파', cost: 70, type: '리얼계' },
  { name: '재공격', cost: 90, type: '리얼계' },
  { name: '분석지원', cost: 60, type: '리얼계' },
  { name: '교란', cost: 65, type: '리얼계' },
  { name: '건파이트', cost: 50, type: '리얼계' },
  { name: '저력 Lv1', cost: 50, type: '슈퍼계' },
  { name: '저력 Lv2', cost: 80, type: '슈퍼계' },
  { name: '저력 Lv3', cost: 110, type: '슈퍼계' },
  { name: '인파이트', cost: 50, type: '슈퍼계' },
  { name: '가드', cost: 70, type: '슈퍼계' },
  { name: '투지', cost: 70, type: '슈퍼계' },
  { name: '기력한계돌파', cost: 95, type: '슈퍼계' },
  { name: '강습', cost: 65, type: '슈퍼계' },
  { name: '브레이브하트', cost: 90, type: '슈퍼계' },
  { name: '철벽', cost: 70, type: '슈퍼계' },
  { name: '혼', cost: 110, type: '슈퍼계' },
];
