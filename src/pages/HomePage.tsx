import { unitStats } from '../data/calculations';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

export function HomePage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const setPage = useGameStore((s) => s.setPage);
  const units = [...allUnitTemplates, ...catalog.customUnits];
  const unit = units.find((u) => u.id === pilot.unitId) ?? units.find((u) => !u.enemyOnly)!;
  const stats = unitStats(pilot, unit);
  const allScenarios = [...scenarios, ...catalog.customScenarios];
  const nextIndex = allScenarios.findIndex((scenario) => !pilot.scenarioClears.includes(scenario.id));
  const next = allScenarios[nextIndex < 0 ? allScenarios.length - 1 : nextIndex];
  const nextNo = Math.max(1, (nextIndex < 0 ? allScenarios.length - 1 : nextIndex) + 1);

  return (
    <div className="home-command">
      <section className="hero-panel">
        <img src={unit.image} alt="" />
        <div><small>ROBOT WARS FRONTIER / COMMAND CENTER</small><h1>전설은 다시 시작된다.<br/><span>당신의 선택이, 새로운 시대를 만든다.</span></h1><p>TACTICAL SYSTEM ONLINE · v0.9.0</p></div>
      </section>
      <div className="dashboard-grid">
        <section className="panel pilot-panel"><header><b>CURRENT PILOT</b><span>현재 파일럿</span></header><div className="pilot-summary"><img src={pilot.avatar} alt=""/><div><small>{pilot.affiliation} · {pilot.rank}</small><h2>{pilot.display}</h2><p>Lv.{pilot.level} · SP {pilot.sp}/{pilot.maxSp} · PP {pilot.pp}</p><div className="chip-row">{pilot.special.map((x) => <span key={x}>{x}</span>)}</div></div></div></section>
        <section className="panel unit-panel"><header><b>MAIN UNIT</b><span>주력 기체</span></header><div className="unit-summary"><img src={unit.image} alt=""/><div><small>{unit.role}</small><h2>{unit.name}</h2><dl><div><dt>HP</dt><dd>{stats.hp.toLocaleString()}</dd></div><div><dt>EN</dt><dd>{stats.en}</dd></div><div><dt>운동성</dt><dd>{stats.mobility}</dd></div><div><dt>장갑</dt><dd>{stats.armor}</dd></div></dl></div></div></section>
        <section className="panel mission-panel"><header><b>NEXT OPERATION</b><span>다음 작전</span></header><div className="mission-content"><small>MISSION {String(nextNo).padStart(2,'0')}</small><h2>{next?.title ?? '모든 작전 완료'}</h2><p>{next?.desc ?? '현재 등록된 모든 작전을 완료했습니다.'}</p>{next && <strong>{next.objective}</strong>}<div className="mission-reward">{next && <><span>적 Lv.{next.enemyLevel}</span><span>{next.enemyCount}기</span><span>{next.rewardCredit.toLocaleString()} CREDIT</span></>}</div><button className="home-sortie-btn" onClick={() => setPage('scenario')}>{nextIndex < 0 ? '작전 기록 보기' : '작전 출격'}</button></div></section>
      </div>
    </div>
  );
}
