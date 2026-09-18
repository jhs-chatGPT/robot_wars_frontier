import type { CSSProperties } from 'react';
import { unitStats } from '../data/calculations';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

const terrainName = { air: '공', land: '지', water: '수', space: '우' } as const;

export function HomePage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const setPage = useGameStore((s) => s.setPage);
  const units = [...allUnitTemplates, ...catalog.customUnits];
  const unit = units.find((u) => u.id === pilot.unitId) ?? units.find((u) => !u.enemyOnly)!;
  const stats = unitStats(pilot, unit);
  const allScenarios = [...scenarios, ...catalog.customScenarios];
  const nextIndex = allScenarios.findIndex((scenario) => !pilot.scenarioClears.includes(scenario.id));
  const next = nextIndex >= 0 ? allScenarios[nextIndex] : null;
  const expNeed = 100 + pilot.level * 20;
  const expPct = Math.max(0, Math.min(100, pilot.exp / expNeed * 100));

  return (
    <div className="legacy-home">
      <section className="legacy-panel legacy-home-hero" aria-label="작전 지휘실">
        <img className="legacy-home-hero-unit" src={unit.image} alt="" aria-hidden="true" />
        <div className="legacy-home-hero-copy">
          <div className="legacy-eyebrow">ROBOT WARS FRONTIER / COMMAND CENTER</div>
          <h1>전설은 다시 시작된다.<br/><span>당신의 선택이, 새로운 시대를 만든다.</span></h1>
          <small>HUMANITY STILL DREAMS · TO A BRIGHTER TOMORROW</small>
        </div>
      </section>

      <div className="legacy-home-core">
        <section className="legacy-panel">
          <header className="legacy-panel-head"><h2>CURRENT PILOT</h2><small>현재 파일럿</small></header>
          <div className="legacy-current-pilot">
            <img src={pilot.avatar} alt={`${pilot.display} 초상화`} />
            <div>
              <h3>{pilot.display}</h3>
              <div className="legacy-muted">{pilot.type} · {pilot.personality}<br/>Lv. {pilot.level}</div>
              <div className="legacy-exp-label"><span>EXP</span><span>{pilot.exp} / {expNeed}</span></div>
              <div className="legacy-exp-bar"><i style={{ width: `${expPct}%` }} /></div>
              <blockquote>「 {pilot.quote} 」</blockquote>
              <button className="legacy-detail-btn" onClick={() => setPage('pilot')}>파일럿 상세 보기 ›</button>
            </div>
          </div>
        </section>

        <section className="legacy-panel">
          <header className="legacy-panel-head"><h2>MAIN UNIT</h2><small>주력 기체</small></header>
          <div className="legacy-main-unit">
            <div className="legacy-unit-stage" style={{ '--unit': `url(${unit.image})` } as CSSProperties}><img src={unit.image} alt={unit.name}/></div>
            <div>
              <h3>{unit.name}</h3>
              <dl className="legacy-stats">
                <div><dt>HP</dt><dd>{stats.hp.toLocaleString()}</dd></div><div><dt>EN</dt><dd>{stats.en}</dd></div>
                <div><dt>이동력</dt><dd>{stats.move}</dd></div><div><dt>운동성</dt><dd>{stats.mobility}</dd></div>
                <div><dt>장갑</dt><dd>{stats.armor}</dd></div><div><dt>조준</dt><dd>{stats.aim}</dd></div>
              </dl>
              <button className="legacy-detail-btn" onClick={() => setPage('hangar')}>기체 상세 보기 ›</button>
            </div>
          </div>
        </section>

        <section className="legacy-panel legacy-info-panel">
          <header className="legacy-panel-head"><h2>INFORMATION</h2><small>작전 공지</small></header>
          <ul className="legacy-notices">
            <li><span>0087/04/10</span><b>새로운 스테이지 <em>[08. 사막의 격돌]</em> 추가</b></li>
            <li><span>0087/04/05</span><b>신규 기체 2종 추가</b></li>
            <li><span>0087/03/28</span><b>파일럿 10인 업데이트</b></li>
            <li><span>0087/03/20</span><b>무인기 AI 및 명중률 밸런스 조정</b></li>
            <li><span>0087/03/15</span><b>강화 파츠 48종 업데이트</b></li>
            <li><span>0087/03/10</span><b>스테이지 10화까지 확장</b></li>
            <li><span>0087/03/01</span><b>ROBOT WARS FRONTIER 정식 오픈</b></li>
          </ul>
        </section>
      </div>

      <div className="legacy-home-lower">
        <section className="legacy-panel">
          <header className="legacy-panel-head"><h2>NEXT MISSION</h2><small>다음 작전</small></header>
          {next ? <div className="legacy-next-mission">
            <div><div className="legacy-eyebrow">MAIN OPERATION {String(nextIndex + 1).padStart(2, '0')}</div><h3>{next.title}</h3><p>{next.desc}</p><div className="legacy-tags"><span>{terrainName[next.terrain]}</span><span>적 {next.enemyCount}기</span><span>Lv. {next.enemyLevel}</span></div></div>
            <div><dl className="legacy-stats"><div><dt>보상</dt><dd>{next.rewardCredit.toLocaleString()} C</dd></div><div><dt>EXP / PP</dt><dd>{next.rewardExp} / {Math.max(15, Math.round(next.rewardExp / 4))}</dd></div><div><dt>제한</dt><dd>{next.turnLimit} TURNS</dd></div></dl><button className="legacy-sortie-btn" onClick={() => setPage('scenario')}>작전 개시 <span>››</span></button></div>
          </div> : <div className="legacy-complete">모든 작전 완료<div className="legacy-muted">모든 메인 오퍼레이션을 클리어했습니다.</div><button className="legacy-detail-btn" onClick={() => setPage('scenario')}>작전 목록 보기 ›</button></div>}
        </section>
        <section className="legacy-panel">
          <header className="legacy-panel-head"><h2>QUICK MENU</h2><small>바로가기</small></header>
          <div className="legacy-quick-menu">
            <button onClick={() => setPage('pilot')}><i>◈</i><b>파일럿 육성</b><small>PILOT</small></button>
            <button onClick={() => setPage('hangar')}><i>⚙</i><b>기체 개발</b><small>DEVELOP</small></button>
            <button onClick={() => setPage('pvp')}><i>⌖</i><b>PvP</b><small>ARENA</small></button>
            <button onClick={() => setPage('tourney')}><i>♜</i><b>대회</b><small>TOURNAMENT</small></button>
          </div>
        </section>
      </div>
    </div>
  );
}
