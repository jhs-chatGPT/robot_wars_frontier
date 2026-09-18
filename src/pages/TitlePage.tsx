import { useGameStore } from '../store/gameStore';

export function TitlePage() {
  const goTitle = useGameStore((s) => s.goTitle);
  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>TITLE / SESSION</small><h1>타이틀로</h1></div></div>
      <section className="panel title-return-react"><h2>자동 저장 활성화</h2><p>진행 데이터는 브라우저에 자동 저장됩니다. 타이틀 화면으로 돌아가도 「이어서하기」로 복귀할 수 있습니다.</p><button onClick={goTitle}>타이틀 화면으로 이동</button></section>
    </div>
  );
}
