import { useState } from 'react';
import { unitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { BattleAI } from '../types/game';

const aiTypes: BattleAI[] = ['균형형','공격형','방어형','회피형','지원형'];

export function PvpPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const pvpResults = useGameStore((s) => s.pvpResults);
  const setBattleAI = useGameStore((s) => s.setBattleAI);
  const runPvp = useGameStore((s) => s.runPvp);
  const [selected, setSelected] = useState<BattleAI>(pilot.battleAI);
  const [log, setLog] = useState<string[]>(pvpResults[0]?.log ?? []);

  const fight = () => {
    const result = runPvp();
    if (result) setLog(result.log);
  };

  return (
    <div className="screen-scroll pvp-screen-react">
      <div className="screen-heading"><div><small>ARENA / AUTO TEXT DUEL</small><h1>PvP 아레나</h1></div><div className="resource-badge">W/L <b>{pilot.pvpWins}/{pilot.pvpLosses}</b></div></div>
      <div className="pvp-grid-react">
        <section className="panel pvp-control-card">
          <header><b>BATTLE AI</b><span>자동 교전 성향</span></header>
          <div className="pvp-control-body">
            <p>시나리오와 같은 전투 엔진을 사용해 자동 교전을 진행한다. 무기, EN, 잔탄, 명중, 피해 계산이 동일하게 적용된다.</p>
            <div className="ai-selector">{aiTypes.map((ai) => <button className={selected === ai ? 'active' : ''} key={ai} onClick={() => setSelected(ai)}>{ai}</button>)}</div>
            <button className="primary-action" onClick={() => { setBattleAI(selected); fight(); }}>AI 저장 · 상대 검색 및 대전</button>
            <div className="arena-record"><div><small>연승</small><b>{pilot.records.pvpStreak}</b></div><div><small>승리</small><b>{pilot.pvpWins}</b></div><div><small>패배</small><b>{pilot.pvpLosses}</b></div></div>
          </div>
        </section>
        <section className="panel pvp-history-card">
          <header><b>RECENT MATCHES</b><span>최근 20전</span></header>
          <div className="pvp-history-list">{pvpResults.length ? pvpResults.map((result) => {
            const unit = unitTemplates.find((item) => item.id === result.opponentUnitId);
            return <button key={result.id} onClick={() => setLog(result.log)}><span className={result.won ? 'win' : 'lose'}>{result.won ? 'WIN' : 'LOSE'}</span><div><b>{result.opponentName}</b><small>Lv.{result.opponentLevel} · {unit?.name ?? result.opponentUnitId}</small></div><strong>+{result.credit.toLocaleString()}C</strong></button>;
          }) : <p className="empty-copy">아직 대전 기록이 없습니다.</p>}</div>
        </section>
        <section className="panel pvp-log-card"><header><b>DUEL LOG</b><span>TEXT BATTLE</span></header><pre>{log.length ? log.join('\n') : '대전을 시작하면 전투 로그가 여기에 표시됩니다.'}</pre></section>
      </div>
    </div>
  );
}
