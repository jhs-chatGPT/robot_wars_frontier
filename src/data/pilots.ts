import type { PilotTemplate } from '../types/game';

export const pilotTemplates: PilotTemplate[] = [
  {
    "family": "김",
    "name": "수호",
    "display": "김수호",
    "title": "냉철한 전략가",
    "quote": "싸울 이유가 있는 한, 나는 조종석에 앉는다.",
    "age": 25,
    "gender": "남",
    "type": "리얼계",
    "personality": "냉정",
    "affiliation": "지구연방군",
    "rank": "중위",
    "specialty": "전술 지휘 · 상황 분석",
    "likes": "커피, 정비, 조용한 시간",
    "dislikes": "무의미한 희생, 독단적 행동",
    "desc": "전황 전체를 빠르게 읽고 아군의 손실을 줄이는 지휘형 파일럿. 반응과 조종, 지휘가 높아 리얼계 기체에서 특히 안정적인 성능을 보인다.",
    "fullbody": "/assets/pilots/fullbody/male_1.webp",
    "stats": {
      "melee": 155,
      "ranged": 175,
      "reaction": 175,
      "control": 185,
      "defense": 150,
      "skill": 170
    },
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "special": [
      "뉴타입 Lv1",
      "전술예지",
      "리더십"
    ],
    "id": "male-1",
    "avatar": "/assets/pilots/male_1.webp"
  },
  {
    "family": "",
    "name": "렉스",
    "display": "렉스",
    "title": "열혈의 에이스",
    "quote": "돌파구가 필요하면 내가 연다. 뒤는 맡겨!",
    "age": 22,
    "gender": "남",
    "type": "슈퍼계",
    "personality": "열혈",
    "affiliation": "프론티어 강습대",
    "rank": "대위",
    "specialty": "돌격전 · 근접전",
    "likes": "실전 모의전, 동료와의 승부",
    "dislikes": "비겁한 전술",
    "desc": "거침없는 돌격으로 전선을 무너뜨리는 강습형 에이스. 위기일수록 전투력이 상승하며 근접전과 생존력이 뛰어나다.",
    "fullbody": "/assets/pilots/fullbody/male_2.webp",
    "stats": {
      "melee": 195,
      "ranged": 130,
      "reaction": 165,
      "control": 160,
      "defense": 190,
      "skill": 170
    },
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "special": [
      "천재",
      "저력 Lv3",
      "인파이트"
    ],
    "id": "male-2",
    "avatar": "/assets/pilots/male_2.webp"
  },
  {
    "family": "",
    "name": "제이드",
    "display": "제이드",
    "title": "고독한 해결사",
    "quote": "오차 없는 한 발이면 충분하다.",
    "age": 24,
    "gender": "남",
    "type": "리얼계",
    "personality": "냉정",
    "affiliation": "연방 특무사격대",
    "rank": "소령",
    "specialty": "정밀 사격 · 탄도 계산",
    "likes": "데이터 분석, 정밀 사격",
    "dislikes": "무모한 돌격",
    "desc": "전투 데이터를 실시간으로 해석해 최적의 사격 해답을 찾아내는 저격형 파일럿. 사격과 기량이 특히 높다.",
    "fullbody": "/assets/pilots/fullbody/male_3.webp",
    "stats": {
      "melee": 125,
      "ranged": 200,
      "reaction": 180,
      "control": 185,
      "defense": 135,
      "skill": 200
    },
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "special": [
      "코디네이터",
      "정밀사격",
      "재공격"
    ],
    "id": "male-3",
    "avatar": "/assets/pilots/male_3.webp"
  },
  {
    "family": "",
    "name": "시온",
    "display": "시온",
    "title": "이상을 좇는 기사",
    "quote": "진입 경로만 열리면 나머지는 내가 끝낸다.",
    "age": 27,
    "gender": "남",
    "type": "슈퍼계",
    "personality": "유연",
    "affiliation": "프론티어 독립부대",
    "rank": "소령",
    "specialty": "강습 작전 · 소부대 지휘",
    "likes": "야전 지휘, 근접전",
    "dislikes": "지루한 대기",
    "desc": "수많은 강습전을 살아남은 베테랑. 공격적인 움직임 속에서도 아군 위치를 챙기는 실전 지휘관이다.",
    "fullbody": "/assets/pilots/fullbody/male_4.webp",
    "stats": {
      "melee": 185,
      "ranged": 145,
      "reaction": 165,
      "control": 160,
      "defense": 185,
      "skill": 165
    },
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "special": [
      "에이스 파일럿",
      "강습",
      "지휘관 Lv2"
    ],
    "id": "male-4",
    "avatar": "/assets/pilots/male_4.webp"
  },
  {
    "family": "",
    "name": "하루토",
    "display": "하루토",
    "title": "지식의 탐구자",
    "quote": "보이지 않는 곳에서 승패는 이미 갈린다.",
    "age": 21,
    "gender": "남",
    "type": "리얼계",
    "personality": "냉정",
    "affiliation": "정보전 연구단",
    "rank": "소위",
    "specialty": "전자전 · 센서 교란",
    "likes": "암호 해독, 신형 장비",
    "dislikes": "낡은 장비, 노이즈",
    "desc": "센서와 전자전을 극한까지 활용하는 분석형 파일럿. 높은 반응과 조종으로 적의 명중을 무너뜨린다.",
    "fullbody": "/assets/pilots/fullbody/male_5.webp",
    "stats": {
      "melee": 120,
      "ranged": 185,
      "reaction": 190,
      "control": 200,
      "defense": 130,
      "skill": 190
    },
    "terrain": {
      "air": "A",
      "land": "B",
      "water": "C",
      "space": "A"
    },
    "special": [
      "강화인간",
      "전자전",
      "교란"
    ],
    "id": "male-5",
    "avatar": "/assets/pilots/male_5.webp"
  },
  {
    "family": "",
    "name": "유키",
    "display": "유키",
    "title": "냉정한 지휘관",
    "quote": "전장은 감정이 아니라 결과로 말한다.",
    "age": 23,
    "gender": "여",
    "type": "리얼계",
    "personality": "냉정",
    "affiliation": "지구연방 전략사령부",
    "rank": "중위",
    "specialty": "지휘 통제 · 전황 정리",
    "likes": "정리된 브리핑, 홍차",
    "dislikes": "무질서한 행동",
    "desc": "전황을 빠르게 정리하고 아군의 행동 순서를 조율하는 지휘형 파일럿. 안정적인 지휘 보정이 강점이다.",
    "fullbody": "/assets/pilots/fullbody/female_1.webp",
    "stats": {
      "melee": 145,
      "ranged": 175,
      "reaction": 170,
      "control": 185,
      "defense": 150,
      "skill": 175
    },
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "special": [
      "뉴타입 Lv1",
      "지휘관 Lv2",
      "전술예지"
    ],
    "id": "female-1",
    "avatar": "/assets/pilots/female_1.webp"
  },
  {
    "family": "",
    "name": "미레이아",
    "display": "미레이아",
    "title": "희망의 아이돌",
    "quote": "잡을 수 있다면 이미 늦은 거야!",
    "age": 19,
    "gender": "여",
    "type": "리얼계",
    "personality": "유연",
    "affiliation": "우주기동대",
    "rank": "소위",
    "specialty": "고속 기동 · 측면 침투",
    "likes": "고기동전, 음악 감상",
    "dislikes": "답답한 중장갑전",
    "desc": "속도와 위치 선점을 통해 적을 무너뜨리는 고기동 에이스. 반응과 조종이 최상급이다.",
    "fullbody": "/assets/pilots/fullbody/female_2.webp",
    "stats": {
      "melee": 135,
      "ranged": 170,
      "reaction": 200,
      "control": 200,
      "defense": 120,
      "skill": 190
    },
    "terrain": {
      "air": "S",
      "land": "B",
      "water": "C",
      "space": "A"
    },
    "special": [
      "코디네이터",
      "가속",
      "회피기동"
    ],
    "id": "female-2",
    "avatar": "/assets/pilots/female_2.webp"
  },
  {
    "family": "",
    "name": "세라",
    "display": "세라",
    "title": "침묵의 저격수",
    "quote": "한 발이면 충분해. 그게 내 방식이야.",
    "age": 22,
    "gender": "여",
    "type": "리얼계",
    "personality": "보통",
    "affiliation": "특수정찰저격대",
    "rank": "중사",
    "specialty": "장거리 저격 · 정찰",
    "likes": "고요함, 별 관측",
    "dislikes": "시끄러운 전장",
    "desc": "긴 사거리에서 정확하게 급소를 꿰뚫는 정찰 저격수. 사격과 기량이 높아 치명타에 강하다.",
    "fullbody": "/assets/pilots/fullbody/female_3.webp",
    "stats": {
      "melee": 120,
      "ranged": 200,
      "reaction": 180,
      "control": 185,
      "defense": 165,
      "skill": 190
    },
    "terrain": {
      "air": "A",
      "land": "A",
      "water": "C",
      "space": "A"
    },
    "special": [
      "천재",
      "저격",
      "간파"
    ],
    "id": "female-3",
    "avatar": "/assets/pilots/female_3.webp"
  },
  {
    "family": "",
    "name": "나나",
    "display": "나나",
    "title": "천진한 격투가",
    "quote": "가까이 가면 더 잘 보이잖아? 그러니까 간다!",
    "age": 18,
    "gender": "여",
    "type": "슈퍼계",
    "personality": "열혈",
    "affiliation": "프론티어 훈련대",
    "rank": "소위",
    "specialty": "격투전 · 파워 돌파",
    "likes": "체력 훈련, 디저트",
    "dislikes": "비겁한 후퇴",
    "desc": "밝고 거침없는 근접전 특화 파일럿. 격투와 방어가 높고 기세가 붙으면 빠르게 적을 몰아붙인다.",
    "fullbody": "/assets/pilots/fullbody/female_4.webp",
    "stats": {
      "melee": 200,
      "ranged": 130,
      "reaction": 175,
      "control": 165,
      "defense": 200,
      "skill": 150
    },
    "terrain": {
      "air": "B",
      "land": "A",
      "water": "B",
      "space": "A"
    },
    "special": [
      "저력 Lv2",
      "인파이트",
      "기력한계돌파"
    ],
    "id": "female-4",
    "avatar": "/assets/pilots/female_4.webp"
  },
  {
    "family": "",
    "name": "아이리스",
    "display": "아이리스",
    "title": "전자전 분석관",
    "quote": "신호의 흐름을 읽으면 적의 의도도 보인다.",
    "age": 21,
    "gender": "여",
    "type": "리얼계",
    "personality": "냉정",
    "affiliation": "통합정보분석국",
    "rank": "준위",
    "specialty": "신호 분석 · 지원 사격",
    "likes": "센서 관측, 퍼즐",
    "dislikes": "노이즈 가득한 전장",
    "desc": "통신과 센서 분석을 통해 아군에게 유리한 전장을 만드는 지원형 파일럿. 전자전 계열 능력이 강력하다.",
    "fullbody": "/assets/pilots/fullbody/female_5.webp",
    "stats": {
      "melee": 125,
      "ranged": 190,
      "reaction": 180,
      "control": 195,
      "defense": 140,
      "skill": 185
    },
    "terrain": {
      "air": "A",
      "land": "B",
      "water": "C",
      "space": "A"
    },
    "special": [
      "강화인간",
      "전자전",
      "분석지원"
    ],
    "id": "female-5",
    "avatar": "/assets/pilots/female_5.webp"
  }
];
