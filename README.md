# ROBOT WARS FRONTIER — React v0.9.0

기존 **v0.8 P15.6.23 안정화판**을 기준으로 전체 게임 구조를 React로 이전한 버전입니다.
겉으로 보이는 게임 자산과 핵심 밸런스 데이터는 유지하면서, 단일 `index.html`에 섞여 있던 화면/상태/전투 로직을 React 컴포넌트와 TypeScript 모듈로 분리했습니다.

## 기술 구성
- React 19
- Vite 7
- TypeScript
- Zustand + localStorage 자동 저장
- Netlify 정적 배포

## 이전 완료 화면 / 기능
- 타이틀 / 이어하기
- 파일럿 선택 → 리얼/슈퍼 → 초기 기체 선택 → 홈
- 홈 / 다음 작전
- 파일럿 관리 / PP 능력치·지형·특수능력 육성
- 파일럿 영입 / 주력 파일럿 교체
- 기체 개발 / 10단 개조
- 기체 목록
- 강화파츠 독립 화면 / 슬롯 장착·해제
- 상점 / 강화파츠 구매
- 도감 / 기체·무장 데이터
- 10개 시나리오 / 다중 웨이브 / 텍스트 전투
- 정신기 / 거리 이동 / 방어 / 자동 행동
- PvP 자동 텍스트 교전
- AI 대회 / 직접 개최 / 수비 편성 / 상품 / 결과 로그
- 관리자: 기체·무기·시나리오·파일럿 능력 추가
- JSON 저장 백업 / 복원
- 설정 / 타이틀 복귀

## 저장 데이터 호환
React판은 `rwf-react-v0.9-save` 키로 자동 저장됩니다.
같은 도메인에 기존 P15.6.23 저장 데이터가 있고 React 저장 데이터가 아직 없다면 다음 레거시 키를 자동 감지해 현재 파일럿/로스터/커스텀 데이터를 인계합니다.

- `robot_wars_proto_v8_ui_match`
- `robot_wars_proto_v8`
- `robot_wars_proto_v2`
- `robot_wars_proto_v1`

관리자 → 데이터에서 기존 P15.6.23 JSON 백업 파일을 직접 가져오는 것도 지원합니다.

## 실행
```bash
npm install
npm run dev
```

## 프로덕션 빌드
```bash
npm run build
```

빌드 결과는 `dist/`에 생성됩니다.

## Netlify
`netlify.toml`에 다음이 설정되어 있습니다.
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `/* -> /index.html`

GitHub 저장소 루트에 이 프로젝트의 파일들이 바로 위치하도록 업로드하면 Netlify Git 배포에 사용할 수 있습니다.

## 검증 메모
현재 작업 환경에서는 npm 패키지 다운로드가 시간 초과되어 실제 Vite production build는 실행하지 못했습니다. 대신 글로벌 TypeScript와 전투 엔진 단독 컴파일/실행으로 다음 검사를 수행했습니다.
- React/Zustand 임시 타입 선언을 사용한 전체 `src` strict TypeScript 검사 통과
- 데이터/전투 엔진 strict TypeScript 컴파일
- 시나리오 1 런타임 전투 완료
- 시나리오 2 다중 웨이브 런타임 전투 완료
- PvP 자동전투 런타임 완료
- 강화파츠 지형 보정/배리어 검증
- 상대 import 누락 검사
- `/assets` 참조 파일 누락 검사

자세한 이전 범위는 `MIGRATION_STATUS.md`를 참고하세요.
