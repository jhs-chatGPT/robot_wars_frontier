import { useGameStore } from '../store/gameStore';

export function OptionPage() {
  const settings = useGameStore((s) => s.settings);
  const setSetting = useGameStore((s) => s.setSetting);
  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>OPTION / SYSTEM CONFIGURATION</small><h1>설정</h1></div></div>
      <section className="panel option-panel-react">
        <label><input type="checkbox" checked={settings.aiTournament} onChange={(event) => setSetting('aiTournament', event.target.checked)} /><span><b>AI 자동 대회 개최</b><small>AI 토너먼트 관련 기본 설정을 유지합니다.</small></span></label>
        <label><input type="checkbox" checked={settings.compactMode} onChange={(event) => setSetting('compactMode', event.target.checked)} /><span><b>컴팩트 UI</b><small>작은 화면에서 목록 간격을 줄이는 표시 옵션입니다.</small></span></label>
        <div className="version-panel-react"><small>ROBOT WARS FRONTIER</small><h2>v0.9.0</h2><p>Legacy save compatibility enabled</p></div>
      </section>
    </div>
  );
}
