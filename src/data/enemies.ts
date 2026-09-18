import type { EnemyPilotProfile, EnemyRank, EnemyRankInfo } from '../types/game';

export const enemyRankInfo: Record<EnemyRank, EnemyRankInfo> = {
  "general": {
    "label": "일반 병사",
    "levelBonus": 0,
    "statBonus": 0,
    "special": [
      "기초 전투 훈련"
    ],
    "avatars": [
      "/assets/enemy_pilots/general_1.png",
      "/assets/enemy_pilots/general_2.png",
      "/assets/enemy_pilots/general_3.png",
      "/assets/enemy_pilots/general_4.png"
    ]
  },
  "elite": {
    "label": "엘리트 병사",
    "levelBonus": 4,
    "statBonus": 10,
    "special": [
      "정예 전투 훈련",
      "집중력"
    ],
    "avatars": [
      "/assets/enemy_pilots/elite_1.png",
      "/assets/enemy_pilots/elite_2.png",
      "/assets/enemy_pilots/elite_3.png",
      "/assets/enemy_pilots/elite_4.png"
    ]
  },
  "commander": {
    "label": "지휘관",
    "levelBonus": 8,
    "statBonus": 18,
    "special": [
      "전술 지휘",
      "리더십"
    ],
    "avatars": [
      "/assets/enemy_pilots/commander_1.png",
      "/assets/enemy_pilots/commander_2.png",
      "/assets/enemy_pilots/commander_3.png",
      "/assets/enemy_pilots/commander_4.png"
    ]
  }
};

export const enemyPilotProfiles: Record<EnemyRank, EnemyPilotProfile[]> = {
  "general": [
    {
      "unitId": "e_g1",
      "role": "범용 전선병",
      "ai": "균형형",
      "special": [
        "기초 전투 훈련"
      ]
    },
    {
      "unitId": "e_g2",
      "role": "포격 지원병",
      "ai": "공격형",
      "special": [
        "기초 전투 훈련",
        "건파이트"
      ]
    },
    {
      "unitId": "e_g3",
      "role": "장거리 사격병",
      "ai": "회피형",
      "special": [
        "기초 전투 훈련",
        "정밀사격",
        "히트 앤 어웨이"
      ]
    },
    {
      "unitId": "e_g1",
      "role": "방어 전선병",
      "ai": "방어형",
      "special": [
        "기초 전투 훈련",
        "가드"
      ]
    }
  ],
  "elite": [
    {
      "unitId": "e_e1",
      "role": "강화인간 판넬 요격수",
      "ai": "회피형",
      "special": [
        "정예 전투 훈련",
        "강화인간",
        "집중력",
        "건파이트"
      ]
    },
    {
      "unitId": "e_e2",
      "role": "친위대 중장갑병",
      "ai": "방어형",
      "special": [
        "정예 전투 훈련",
        "에이스 파일럿",
        "가드",
        "저력 Lv2"
      ]
    },
    {
      "unitId": "e_e3",
      "role": "강습 에이스",
      "ai": "공격형",
      "special": [
        "정예 전투 훈련",
        "에이스 파일럿",
        "인파이트",
        "강습"
      ]
    },
    {
      "unitId": "e_e1",
      "role": "뉴타입 판넬 요격수",
      "ai": "균형형",
      "special": [
        "정예 전투 훈련",
        "뉴타입 Lv1",
        "집중력",
        "간파"
      ]
    }
  ],
  "commander": [
    {
      "unitId": "e_c1",
      "role": "공격형 함대 지휘관",
      "ai": "공격형",
      "special": [
        "전술 지휘",
        "리더십",
        "뉴타입 Lv2",
        "지휘관 Lv2",
        "간파"
      ]
    },
    {
      "unitId": "e_c2",
      "role": "방어형 전선 지휘관",
      "ai": "방어형",
      "special": [
        "전술 지휘",
        "리더십",
        "지휘관 Lv2",
        "가드",
        "저력 Lv3"
      ]
    },
    {
      "unitId": "e_c1",
      "role": "강화인간 전투 지휘관",
      "ai": "균형형",
      "special": [
        "전술 지휘",
        "리더십",
        "강화인간",
        "지휘관 Lv2",
        "건파이트"
      ]
    },
    {
      "unitId": "e_c2",
      "role": "요새 방어 지휘관",
      "ai": "방어형",
      "special": [
        "전술 지휘",
        "리더십",
        "지휘관 Lv2",
        "가드"
      ]
    }
  ]
};
