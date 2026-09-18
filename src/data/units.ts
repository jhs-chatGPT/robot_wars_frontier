import type { UnitTemplate } from '../types/game';

export const allUnitTemplates: UnitTemplate[] = [
  {
    "id": "u1",
    "name": "발키리 건담",
    "hp": 6000,
    "en": 190,
    "move": 7,
    "mobility": 172,
    "armor": 1250,
    "aim": 154,
    "size": "M",
    "types": [
      "육지",
      "우주",
      "공중"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "abilities": [
      "빔 코팅",
      "고기동 프레임"
    ],
    "image": "/assets/units/valkyrie_gundam.png",
    "slots": 2,
    "cost": 320,
    "role": "범용 전술형"
  },
  {
    "id": "u2",
    "name": "세라프",
    "hp": 5200,
    "en": 210,
    "move": 8,
    "mobility": 205,
    "armor": 1050,
    "aim": 150,
    "size": "M",
    "types": [
      "육지",
      "우주",
      "공중"
    ],
    "terrain": {
      "air": "S",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "분신",
      "고기동 프레임"
    ],
    "image": "/assets/units/seraph.png",
    "slots": 2,
    "cost": 350,
    "role": "초고기동 회피형"
  },
  {
    "id": "u3",
    "name": "새도우 마스터",
    "hp": 5300,
    "en": 185,
    "move": 6,
    "mobility": 158,
    "armor": 1100,
    "aim": 180,
    "size": "M",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "스텔스 코팅",
      "정밀 사격 보정"
    ],
    "image": "/assets/units/shadow_master.png",
    "slots": 3,
    "cost": 355,
    "role": "장거리 저격형"
  },
  {
    "id": "u4",
    "name": "막시 마그나",
    "hp": 8000,
    "en": 260,
    "move": 6,
    "mobility": 108,
    "armor": 1680,
    "aim": 138,
    "size": "L",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "abilities": [
      "저력 보조",
      "배리어"
    ],
    "image": "/assets/units/maxi_magna.png",
    "slots": 2,
    "cost": 390,
    "role": "근접 화력 돌파형"
  },
  {
    "id": "u5",
    "name": "블랙 크리드",
    "hp": 7600,
    "en": 270,
    "move": 5,
    "mobility": 98,
    "armor": 1700,
    "aim": 154,
    "size": "L",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "abilities": [
      "정밀 사격 보정",
      "실탄 경감"
    ],
    "image": "/assets/units/black_creed.png",
    "slots": 2,
    "cost": 400,
    "role": "중장거리 화력형"
  },
  {
    "id": "u6",
    "name": "타이탄 브레이버",
    "hp": 8600,
    "en": 245,
    "move": 5,
    "mobility": 92,
    "armor": 1980,
    "aim": 142,
    "size": "L",
    "types": [
      "육지",
      "우주",
      "수중"
    ],
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "A",
      "space": "A"
    },
    "abilities": [
      "배리어",
      "실탄 경감"
    ],
    "image": "/assets/units/titan_braver.png",
    "slots": 3,
    "cost": 410,
    "role": "균형형 전선 유지"
  },
  {
    "id": "u7",
    "name": "브레이블루",
    "hp": 6200,
    "en": 210,
    "move": 8,
    "mobility": 192,
    "armor": 1280,
    "aim": 150,
    "size": "M",
    "types": [
      "육지",
      "우주",
      "공중"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "abilities": [
      "고기동 프레임",
      "빔 코팅"
    ],
    "image": "/assets/units/braveblue.png",
    "slots": 3,
    "cost": 365,
    "role": "고속 검격형"
  },
  {
    "id": "u8",
    "name": "아이언 콜로서스",
    "hp": 10800,
    "en": 250,
    "move": 4,
    "mobility": 70,
    "armor": 2500,
    "aim": 126,
    "size": "LL",
    "types": [
      "육지",
      "우주",
      "수중"
    ],
    "terrain": {
      "air": "C",
      "land": "S",
      "water": "A",
      "space": "A"
    },
    "abilities": [
      "중장갑",
      "배리어"
    ],
    "image": "/assets/units/iron_colossus.png",
    "slots": 2,
    "cost": 430,
    "role": "중장갑 요새형"
  },
  {
    "id": "e_g1",
    "name": "그레이 렌서",
    "hp": 4200,
    "en": 110,
    "move": 5,
    "mobility": 78,
    "armor": 1050,
    "aim": 120,
    "size": "M",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "실드 방어",
      "양산형 프레임"
    ],
    "image": "/assets/enemy_units/e_g1.png",
    "slots": 0,
    "cost": 260,
    "enemyOnly": true,
    "enemyRank": "general",
    "role": "적 전투 기체"
  },
  {
    "id": "e_g2",
    "name": "바스터 캐논",
    "hp": 4600,
    "en": 120,
    "move": 4,
    "mobility": 68,
    "armor": 1180,
    "aim": 112,
    "size": "M",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "C",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "포격 프레임",
      "지원 사격"
    ],
    "image": "/assets/enemy_units/e_g2.png",
    "slots": 0,
    "cost": 290,
    "enemyOnly": true,
    "enemyRank": "general",
    "role": "적 전투 기체"
  },
  {
    "id": "e_g3",
    "name": "롱아이",
    "hp": 3900,
    "en": 105,
    "move": 5,
    "mobility": 82,
    "armor": 920,
    "aim": 142,
    "size": "M",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "정밀 조준",
      "원거리 관측"
    ],
    "image": "/assets/enemy_units/e_g3.png",
    "slots": 0,
    "cost": 275,
    "enemyOnly": true,
    "enemyRank": "general",
    "role": "적 전투 기체"
  },
  {
    "id": "e_e1",
    "name": "판넬 스트라이커",
    "hp": 5600,
    "en": 165,
    "move": 6,
    "mobility": 98,
    "armor": 1280,
    "aim": 150,
    "size": "M",
    "types": [
      "공중",
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "판넬",
      "고기동 프레임",
      "뉴타입 대응 OS"
    ],
    "image": "/assets/enemy_units/e_e1.png",
    "slots": 0,
    "cost": 360,
    "enemyOnly": true,
    "enemyRank": "elite",
    "role": "적 전투 기체"
  },
  {
    "id": "e_e2",
    "name": "엘리트 가드",
    "hp": 6100,
    "en": 145,
    "move": 5,
    "mobility": 88,
    "armor": 1420,
    "aim": 140,
    "size": "M",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "실드 방어",
      "중장갑 프레임",
      "친위대 장갑 보정"
    ],
    "image": "/assets/enemy_units/e_e2.png",
    "slots": 0,
    "cost": 345,
    "enemyOnly": true,
    "enemyRank": "elite",
    "role": "적 전투 기체"
  },
  {
    "id": "e_e3",
    "name": "블레이드 판서",
    "hp": 5750,
    "en": 155,
    "move": 7,
    "mobility": 102,
    "armor": 1240,
    "aim": 148,
    "size": "M",
    "types": [
      "공중",
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "고기동",
      "근접전 특화",
      "돌격 보정"
    ],
    "image": "/assets/enemy_units/e_e3.png",
    "slots": 0,
    "cost": 370,
    "enemyOnly": true,
    "enemyRank": "elite",
    "role": "적 전투 기체"
  },
  {
    "id": "e_c1",
    "name": "크림슨 노바",
    "hp": 8200,
    "en": 220,
    "move": 7,
    "mobility": 118,
    "armor": 1580,
    "aim": 168,
    "size": "M",
    "types": [
      "공중",
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "판넬",
      "고기동",
      "지휘관 보정 Lv2",
      "뉴타입 대응 OS",
      "EN 회복(소)"
    ],
    "image": "/assets/enemy_units/e_c1.png",
    "slots": 0,
    "cost": 460,
    "enemyOnly": true,
    "enemyRank": "commander",
    "role": "적 전투 기체"
  },
  {
    "id": "e_c2",
    "name": "아이언 베일",
    "hp": 9500,
    "en": 190,
    "move": 5,
    "mobility": 98,
    "armor": 1820,
    "aim": 150,
    "size": "L",
    "types": [
      "육지",
      "우주"
    ],
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "abilities": [
      "실드 방어",
      "중장갑",
      "지휘관 보정 Lv2",
      "EN 회복(소)",
      "HP 회복(소)"
    ],
    "image": "/assets/enemy_units/e_c2.png",
    "slots": 0,
    "cost": 440,
    "enemyOnly": true,
    "enemyRank": "commander",
    "role": "적 전투 기체"
  }
];

export const unitTemplates = allUnitTemplates.filter((unit) => !unit.enemyOnly);
export const enemyUnitTemplates = allUnitTemplates.filter((unit) => unit.enemyOnly);

export const starterUnitIds = {
  '리얼계': ['u1', 'u2', 'u3', 'u7'],
  '슈퍼계': ['u4', 'u5', 'u6', 'u8'],
} as const;
