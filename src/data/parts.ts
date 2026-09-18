import type { PartTemplate } from '../types/game';

export const partTemplates: PartTemplate[] = [
  {
    "id": "p1",
    "name": "부스터",
    "desc": "이동력 +1",
    "price": 18000,
    "mods": {
      "move": 1
    }
  },
  {
    "id": "p2",
    "name": "초합금 장갑",
    "desc": "HP +700 / 장갑 +150",
    "price": 26000,
    "mods": {
      "hp": 700,
      "armor": 150
    }
  },
  {
    "id": "p3",
    "name": "고성능 센서",
    "desc": "조준 +15",
    "price": 28000,
    "mods": {
      "aim": 15
    }
  },
  {
    "id": "p4",
    "name": "고기동 스러스터",
    "desc": "운동성 +15",
    "price": 30000,
    "mods": {
      "mobility": 15
    }
  },
  {
    "id": "p5",
    "name": "대용량 콘덴서",
    "desc": "EN +40",
    "price": 30000,
    "mods": {
      "en": 40
    }
  },
  {
    "id": "p6",
    "name": "사이코 프레임",
    "desc": "운동성 +25 / 조준 +15 / 크리티컬 +5",
    "price": 80000,
    "mods": {
      "mobility": 25,
      "aim": 15,
      "crit": 5
    }
  },
  {
    "id": "p7",
    "name": "하로",
    "desc": "이동력 +2 / 운동성 +25 / 조준 +20",
    "price": 120000,
    "mods": {
      "move": 2,
      "mobility": 25,
      "aim": 20
    }
  },
  {
    "id": "p8",
    "name": "고성능 레이더",
    "desc": "최대 사거리 +1 / 조준 +5",
    "price": 35000,
    "mods": {
      "range": 1,
      "aim": 5
    }
  },
  {
    "id": "p9",
    "name": "고성능 조준기",
    "desc": "조준 +20 / 크리티컬 +5",
    "price": 36000,
    "mods": {
      "aim": 20,
      "crit": 5
    }
  },
  {
    "id": "p10",
    "name": "스나이퍼 키트",
    "desc": "최대 사거리 +2 / 조준 +10",
    "price": 60000,
    "mods": {
      "range": 2,
      "aim": 10
    }
  },
  {
    "id": "p11",
    "name": "쵸밤 아머",
    "desc": "HP +700 / 장갑 +150",
    "price": 26000,
    "mods": {
      "hp": 700,
      "armor": 150
    }
  },
  {
    "id": "p12",
    "name": "하이브리드 아머",
    "desc": "HP +1000 / 장갑 +200",
    "price": 42000,
    "mods": {
      "hp": 1000,
      "armor": 200
    }
  },
  {
    "id": "p13",
    "name": "초합금 Z",
    "desc": "HP +1200 / 장갑 +250",
    "price": 65000,
    "mods": {
      "hp": 1200,
      "armor": 250
    }
  },
  {
    "id": "p14",
    "name": "초합금 뉴Z",
    "desc": "HP +1500 / 장갑 +300",
    "price": 90000,
    "mods": {
      "hp": 1500,
      "armor": 300
    }
  },
  {
    "id": "p15",
    "name": "건다리움 합금",
    "desc": "HP +1000 / 장갑 +300",
    "price": 70000,
    "mods": {
      "hp": 1000,
      "armor": 300
    }
  },
  {
    "id": "p16",
    "name": "대형 제네레이터",
    "desc": "EN +50",
    "price": 30000,
    "mods": {
      "en": 50
    }
  },
  {
    "id": "p17",
    "name": "메가 제네레이터",
    "desc": "EN +80",
    "price": 52000,
    "mods": {
      "en": 80
    }
  },
  {
    "id": "p18",
    "name": "EN 칩",
    "desc": "EN +30 / EN 소비 10% 감소",
    "price": 38000,
    "mods": {
      "en": 30,
      "enCostPct": -0.1
    }
  },
  {
    "id": "p19",
    "name": "고성능 EN 칩",
    "desc": "EN +50 / EN 소비 15% 감소",
    "price": 68000,
    "mods": {
      "en": 50,
      "enCostPct": -0.15
    }
  },
  {
    "id": "p20",
    "name": "솔라 패널",
    "desc": "행동 시작 시 최대 EN의 10% 회복",
    "price": 50000,
    "mods": {
      "enRegen": 0.1
    }
  },
  {
    "id": "p21",
    "name": "보조 GS 라이드",
    "desc": "행동 시작 시 최대 EN의 15% 회복",
    "price": 85000,
    "mods": {
      "enRegen": 0.15
    }
  },
  {
    "id": "p22",
    "name": "리페어 키트",
    "desc": "행동 시작 시 최대 HP의 5% 회복",
    "price": 45000,
    "mods": {
      "hpRegen": 0.05
    }
  },
  {
    "id": "p23",
    "name": "프로페런트 탱크",
    "desc": "EN +30 / 행동 시작 시 EN 5% 회복",
    "price": 42000,
    "mods": {
      "en": 30,
      "enRegen": 0.05
    }
  },
  {
    "id": "p24",
    "name": "카트리지",
    "desc": "실탄 무장 최대 잔탄 +50%",
    "price": 36000,
    "mods": {
      "ammoPct": 0.5
    }
  },
  {
    "id": "p25",
    "name": "A-어댑터",
    "desc": "모든 지형 적응을 최소 A로 보정",
    "price": 65000,
    "mods": {
      "terrainAll": "A"
    }
  },
  {
    "id": "p26",
    "name": "S-어댑터",
    "desc": "모든 지형 적응을 S로 보정",
    "price": 125000,
    "mods": {
      "terrainAll": "S"
    }
  },
  {
    "id": "p27",
    "name": "미노프스키 크래프트",
    "desc": "공중 적응 A / 이동력 +1",
    "price": 60000,
    "mods": {
      "airRank": "A",
      "move": 1
    }
  },
  {
    "id": "p28",
    "name": "테슬라 드라이브",
    "desc": "공중 적응 A / 이동력 +1 / 운동성 +10",
    "price": 78000,
    "mods": {
      "airRank": "A",
      "move": 1,
      "mobility": 10
    }
  },
  {
    "id": "p29",
    "name": "스러스터 모듈",
    "desc": "우주 적응 A / 운동성 +10",
    "price": 38000,
    "mods": {
      "spaceRank": "A",
      "mobility": 10
    }
  },
  {
    "id": "p30",
    "name": "방진장치",
    "desc": "육지 적응 A / 장갑 +80",
    "price": 28000,
    "mods": {
      "landRank": "A",
      "armor": 80
    }
  },
  {
    "id": "p31",
    "name": "스크류 모듈",
    "desc": "수중 적응 A / 운동성 +5",
    "price": 34000,
    "mods": {
      "waterRank": "A",
      "mobility": 5
    }
  },
  {
    "id": "p32",
    "name": "배리어 필드",
    "desc": "피격 시 EN 10을 소비해 피해 500 경감",
    "price": 70000,
    "mods": {
      "barrier": 500,
      "barrierCost": 10
    }
  },
  {
    "id": "p33",
    "name": "I필드 발생기",
    "desc": "빔 계열 피해 15% 감소",
    "price": 65000,
    "mods": {
      "beamReduce": 0.15
    }
  },
  {
    "id": "p34",
    "name": "대형 실드",
    "desc": "받는 피해 8% 감소 / 장갑 +80",
    "price": 52000,
    "mods": {
      "damageReduce": 0.08,
      "armor": 80
    }
  },
  {
    "id": "p35",
    "name": "고성능 전자두뇌",
    "desc": "운동성 +15 / 조준 +15",
    "price": 62000,
    "mods": {
      "mobility": 15,
      "aim": 15
    }
  },
  {
    "id": "p36",
    "name": "보조 AI",
    "desc": "조준 +10 / 크리티컬 +3",
    "price": 30000,
    "mods": {
      "aim": 10,
      "crit": 3
    }
  },
  {
    "id": "p37",
    "name": "오버 리미터",
    "desc": "운동성 +15 / 무기 공격력 +5%",
    "price": 72000,
    "mods": {
      "mobility": 15,
      "weaponPct": 0.05
    }
  },
  {
    "id": "p38",
    "name": "용자의 인장",
    "desc": "장갑 +120 / 무기 공격력 +5% / 기력 +5",
    "price": 90000,
    "mods": {
      "armor": 120,
      "weaponPct": 0.05,
      "morale": 5
    }
  },
  {
    "id": "p39",
    "name": "강철의 혼",
    "desc": "HP +1000 / EN +50 / 장갑 +150 / 운동성 +10 / 조준 +10 / 무기 공격력 +3%",
    "price": 150000,
    "mods": {
      "hp": 1000,
      "en": 50,
      "armor": 150,
      "mobility": 10,
      "aim": 10,
      "weaponPct": 0.03
    }
  },
  {
    "id": "p40",
    "name": "기적의 증표",
    "desc": "이동력 +1 / 조준 +10 / 기력 +10",
    "price": 110000,
    "mods": {
      "move": 1,
      "aim": 10,
      "morale": 10
    }
  },
  {
    "id": "p41",
    "name": "에이스의 증표",
    "desc": "운동성 +10 / 조준 +10 / 크리티컬 +5 / 기력 +5",
    "price": 80000,
    "mods": {
      "mobility": 10,
      "aim": 10,
      "crit": 5,
      "morale": 5
    }
  },
  {
    "id": "p42",
    "name": "텐션 레이저",
    "desc": "출격 시 기력 +10",
    "price": 65000,
    "mods": {
      "morale": 10
    }
  },
  {
    "id": "p43",
    "name": "플라나 컨버터",
    "desc": "시나리오 획득 크레딧 +20%",
    "price": 95000,
    "mods": {
      "creditPct": 0.2
    }
  },
  {
    "id": "p44",
    "name": "게인 미터",
    "desc": "시나리오 획득 크레딧 +10%",
    "price": 50000,
    "mods": {
      "creditPct": 0.1
    }
  },
  {
    "id": "p45",
    "name": "학습형 OS",
    "desc": "시나리오 획득 EXP +20%",
    "price": 62000,
    "mods": {
      "expPct": 0.2
    }
  },
  {
    "id": "p46",
    "name": "PP 컨버터",
    "desc": "시나리오 클리어 PP +3",
    "price": 70000,
    "mods": {
      "ppBonus": 3
    }
  },
  {
    "id": "p47",
    "name": "메가 부스터",
    "desc": "이동력 +2 / 운동성 +10",
    "price": 65000,
    "mods": {
      "move": 2,
      "mobility": 10
    }
  },
  {
    "id": "p48",
    "name": "정밀 센서 어레이",
    "desc": "조준 +15 / 최대 사거리 +1 / 크리티컬 +3",
    "price": 58000,
    "mods": {
      "aim": 15,
      "range": 1,
      "crit": 3
    }
  }
];
