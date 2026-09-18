import type { ScenarioTemplate } from '../types/game';

export const scenarios: ScenarioTemplate[] = [
  {
    "id": "s1",
    "title": "제1화 - 첫 출격",
    "desc": "전초기지 주변을 습격한 Z.E.F. 양산기 부대를 격퇴하라.",
    "objective": "적 일반 병사 부대를 전멸시켜 전초기지를 방어하라.",
    "terrain": "land",
    "enemyCount": 4,
    "enemyLevel": 5,
    "rewardCredit": 25000,
    "rewardExp": 120,
    "turnLimit": 16,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 3,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 3,
        "wave": 1
      }
    ]
  },
  {
    "id": "s2",
    "title": "제2화 - 포격선 돌파",
    "desc": "Z.E.F. 포격대가 아군 보급선을 사정권에 넣었다. 포격 진지를 무력화하라.",
    "objective": "전방 경계병을 돌파하고 포격용 기체를 격파하라.",
    "terrain": "land",
    "enemyCount": 5,
    "enemyLevel": 10,
    "rewardCredit": 45000,
    "rewardExp": 180,
    "turnLimit": 20,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 3,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 2,
        "label": "포격대 증원"
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 2
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 2
      }
    ]
  },
  {
    "id": "s3",
    "title": "제3화 - 저격망",
    "desc": "궤도 수송로에 장거리 저격기들이 배치됐다. 적 저격망을 돌파하라.",
    "objective": "장거리 저격기를 포함한 적 편대를 전멸시켜 항로를 확보하라.",
    "terrain": "space",
    "enemyCount": 5,
    "enemyLevel": 16,
    "rewardCredit": 70000,
    "rewardExp": 260,
    "turnLimit": 23,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 3,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 2,
        "label": "저격대 재배치"
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 2
      }
    ]
  },
  {
    "id": "s4",
    "title": "제4화 - 정예의 그림자",
    "desc": "일반 병력 뒤에서 Z.E.F. 친위 엘리트가 전선을 지휘하고 있다.",
    "objective": "일반 병력을 돌파하고 엘리트 가드를 격파하라.",
    "terrain": "land",
    "enemyCount": 6,
    "enemyLevel": 22,
    "rewardCredit": 100000,
    "rewardExp": 360,
    "turnLimit": 27,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 3,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2,
        "label": "친위대 출현"
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2,
        "boss": true
      }
    ]
  },
  {
    "id": "s5",
    "title": "제5화 - 강습부대",
    "desc": "고기동 엘리트 부대가 측면에서 기습을 시도한다. 강습대를 저지하라.",
    "objective": "강습 엘리트와 후속 일반 병력을 모두 격파하라.",
    "terrain": "space",
    "enemyCount": 6,
    "enemyLevel": 30,
    "rewardCredit": 140000,
    "rewardExp": 480,
    "turnLimit": 31,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2,
        "label": "강습대 돌입"
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 3,
        "boss": true,
        "label": "강습 에이스 출현"
      }
    ]
  },
  {
    "id": "s6",
    "title": "제6화 - 판넬의 위협",
    "desc": "신형 원격 무장 판넬을 사용하는 강화인간 엘리트가 전장에 투입됐다.",
    "objective": "판넬 스트라이커를 포함한 정예 시험부대를 격파하라.",
    "terrain": "space",
    "enemyCount": 7,
    "enemyLevel": 38,
    "rewardCredit": 190000,
    "rewardExp": 620,
    "turnLimit": 35,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2,
        "label": "정예대 증원"
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 0,
        "wave": 3,
        "label": "판넬 시험기 출현"
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 3,
        "wave": 3,
        "boss": true
      }
    ]
  },
  {
    "id": "s7",
    "title": "제7화 - 철벽의 지휘관",
    "desc": "Z.E.F. 전선 지휘관이 아이언 베일을 이끌고 방어선을 구축했다.",
    "objective": "3단 방어선을 돌파하고 아이언 베일을 격파하라.",
    "terrain": "land",
    "enemyCount": 8,
    "enemyLevel": 48,
    "rewardCredit": 250000,
    "rewardExp": 800,
    "turnLimit": 40,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2,
        "label": "친위대 방어선"
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 0,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 3,
        "label": "지휘관 호위대"
      },
      {
        "rank": "commander",
        "unitId": "e_c2",
        "profileIndex": 1,
        "wave": 3,
        "boss": true,
        "label": "아이언 베일 출현"
      }
    ]
  },
  {
    "id": "s8",
    "title": "제8화 - 요새 돌파",
    "desc": "적 궤도 요새 외곽에서 엘리트 부대와 방어 지휘관이 결집하고 있다.",
    "objective": "요새 외곽 방어대를 전멸시키고 지휘관기를 격파하라.",
    "terrain": "space",
    "enemyCount": 8,
    "enemyLevel": 60,
    "rewardCredit": 330000,
    "rewardExp": 1000,
    "turnLimit": 44,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2,
        "label": "요새 친위대"
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 3,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 0,
        "wave": 3,
        "label": "최종 방위선"
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 3
      },
      {
        "rank": "commander",
        "unitId": "e_c2",
        "profileIndex": 3,
        "wave": 3,
        "boss": true
      }
    ]
  },
  {
    "id": "s9",
    "title": "제9화 - 크림슨 노바",
    "desc": "적 최상위 전투 지휘관이 크림슨 노바와 함께 직접 전장에 나섰다.",
    "objective": "엘리트 호위대를 돌파하고 크림슨 노바를 격파하라.",
    "terrain": "space",
    "enemyCount": 8,
    "enemyLevel": 75,
    "rewardCredit": 430000,
    "rewardExp": 1250,
    "turnLimit": 48,
    "enemyFormation": [
      {
        "rank": "general",
        "unitId": "e_g3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2,
        "label": "에이스 편대 진입"
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 0,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 3,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 3,
        "label": "최종 호위대"
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 3
      },
      {
        "rank": "commander",
        "unitId": "e_c1",
        "profileIndex": 0,
        "wave": 3,
        "boss": true,
        "label": "크림슨 노바 출현"
      }
    ]
  },
  {
    "id": "s10",
    "title": "제10화 - 프론티어의 문",
    "desc": "Z.E.F. 지휘 핵심을 향한 최종 작전. 두 지휘관기가 최후 방어선에 집결했다.",
    "objective": "엘리트 방어선을 돌파하고 아이언 베일과 크림슨 노바를 모두 격파하라.",
    "terrain": "space",
    "enemyCount": 9,
    "enemyLevel": 90,
    "rewardCredit": 600000,
    "rewardExp": 1600,
    "turnLimit": 54,
    "enemyFormation": [
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 0,
        "wave": 1
      },
      {
        "rank": "elite",
        "unitId": "e_e1",
        "profileIndex": 3,
        "wave": 2,
        "label": "뉴타입 대응대"
      },
      {
        "rank": "elite",
        "unitId": "e_e3",
        "profileIndex": 2,
        "wave": 2
      },
      {
        "rank": "elite",
        "unitId": "e_e2",
        "profileIndex": 1,
        "wave": 2
      },
      {
        "rank": "commander",
        "unitId": "e_c2",
        "profileIndex": 3,
        "wave": 3,
        "boss": true,
        "label": "아이언 베일 출현"
      },
      {
        "rank": "commander",
        "unitId": "e_c1",
        "profileIndex": 2,
        "wave": 4,
        "boss": true,
        "label": "전투 지휘관 증원"
      },
      {
        "rank": "commander",
        "unitId": "e_c1",
        "profileIndex": 0,
        "wave": 4,
        "boss": true,
        "label": "크림슨 노바 최종 출격"
      }
    ]
  }
];
