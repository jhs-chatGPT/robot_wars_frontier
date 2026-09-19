# ROBOT WARS FRONTIER — React v0.9.9

기존 **v0.8 P15.6.23 안정화판**을 기준으로 React로 이전한 ROBOT WARS FRONTIER 프로젝트입니다. v0.9.9에서는 최근 확정한 메탈릭/네온 블루 계열의 로봇대전풍 HUD 시안을 실제 UI에 적용하기 시작했습니다.

## v0.9.9 핵심 변경
- TOP HUD 신형 디자인 적용
- 좌측 메뉴 신형 디자인 적용
- 홈 화면을 지휘 커맨드 대시보드 구조로 개편
- 파일럿 관리 화면을 동일한 HUD 디자인으로 개편
- 파일럿 능력치에서 `지휘` 삭제
- 현재 능력치: `격투 / 사격 / 반응 / 조종 / 방어 / 기량`
- `특수스킬` 표현을 `특수능력`으로 정리
- 특수능력은 `습득 / 강화` 모달 방식으로 변경
- 특수능력 Lv 데이터를 실제 전투 보정에서 읽도록 개선
- 기존 저장 데이터의 `command` 항목은 로드 시 자동 제거/정규화

## 기술 구성
- React 19
- Vite 7
- TypeScript
- Zustand + localStorage 자동 저장
- Netlify 정적 배포

## 주요 화면 / 기능
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
- 관리자 데이터 추가
- JSON 저장 백업 / 복원
- 설정 / 타이틀 복귀

## 저장 데이터 호환
React판은 `rwf-react-v0.9-save` 키로 자동 저장됩니다.
기존 P15.6.23 저장 데이터가 있고 React 저장 데이터가 없다면 다음 레거시 키를 자동 감지합니다.

- `robot_wars_proto_v8_ui_match`
- `robot_wars_proto_v8`
- `robot_wars_proto_v2`
- `robot_wars_proto_v1`

v0.9.9부터 예전 저장 데이터에 `stats.command`가 남아 있어도 로드 시 현재 6능력 구조로 자동 정규화합니다.

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
`netlify.toml` 설정:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA fallback: `/* -> /index.html`

GitHub 저장소 루트에 프로젝트 파일을 그대로 업로드하면 Netlify Git 배포에 사용할 수 있습니다.

## 검증
현재 런타임에는 `node_modules`가 없어 실제 Vite production build는 실행하지 못했습니다. 대신 전체 TypeScript 소스 구문 검사, 임시 React/Zustand 타입 선언을 이용한 전체 `src` 의미 검사, CSS 괄호 검사, `/assets` 참조 누락 검사를 수행했고 v0.9.9 변경으로 인한 코드 오류는 발견되지 않았습니다.

자세한 내용은 `FINAL_VALIDATION.md`를 참고하세요.
