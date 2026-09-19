import type { CSSProperties } from 'react';
import { unitStats } from '../data/calculations';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

const terrainName = { air: '공중', land: '지상', water: '수중', space: '우주' } as const;

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
  const ownedCount = pilot.ownedUnits.length;

  return (
    <div className="rwf-home-screen">
      <section className="rwf-home-hero">
        <div className="rwf-home-hero-shade" />
        <div className="rwf-home-hero-copy">
          <small>TACTICAL COMMAND CENTER</small>
          <h1>더 멀리, 더 높은 곳으로.</h1>
          <p>파일럿과 기체, 작전 정보를 한 화면에서 확인하고 다음 전투를 준비하십시오.</p>
        </div>
        <div className="rwf-home-hero-status"><span>ONLINE</span><b>FRONTIER COMMAND NETWORK</b></div>
      </section>

      <div className="rwf-home-primary-grid">
        <section className="rwf-ui-panel rwf-commander-card">
          <header><span>◉</span><b>지휘관 정보</b><small>COMMANDER PROFILE</small></header>
          <div className="rwf-commander-visual">
            <img src={pilot.avatar} alt={`${pilot.display} 초상화`} />
            <div className="rwf-commander-quote">“{pilot.quote}”</div>
          </div>
          <div className="rwf-commander-info">
            <div><h2>{pilot.display}</h2><b>Lv. {pilot.level}</b></div>
            <small>{pilot.affiliation} · {pilot.rank}</small>
            <div className="rwf-home-exp"><span>EXP</span><i><em style={{ width: `${expPct}%` }} /></i><b>{pilot.exp}/{expNeed}</b></div>
            <button onClick={() => setPage('pilot')}>파일럿 관리 <span>›</span></button>
          </div>
        </section>

        <section className="rwf-ui-panel rwf-main-unit-card">
          <header><span>◇</span><b>주력 기체</b><small>MAIN UNIT</small></header>
          <div className="rwf-main-unit-stage" style={{ '--unit-bg': `url(${unit.image})` } as CSSProperties}>
            <img src={unit.image} alt={unit.name} />
            <div className="rwf-main-unit-copy"><small>{unit.id.toUpperCase()}</small><h2>{unit.name}</h2><p>함께 싸울 동료를 확인하고 기체의 한계를 넘어보십시오.</p></div>
          </div>
          <div className="rwf-main-unit-stats">
            <span><small>HP</small><b>{stats.hp.toLocaleString()}</b></span>
            <span><small>EN</small><b>{stats.en}</b></span>
            <span><small>ARMOR</small><b>{stats.armor}</b></span>
            <span><small>MOBILITY</small><b>{stats.mobility}</b></span>
          </div>
          <button className="rwf-panel-action" onClick={() => setPage('hangar')}>기체 상세 보기 <span>›</span></button>
        </section>

        <section className="rwf-ui-panel rwf-next-operation-card">
          <header><span>⚔</span><b>다음 작전</b><small>NEXT OPERATION</small></header>
          {next ? (
            <>
              <div className="rwf-next-operation-visual">
                <span>MAIN STORY</span>
                <strong>제 {nextIndex + 1}작전</strong>
                <h2>{next.title}</h2>
              </div>
              <div className="rwf-next-operation-copy">
                <p>{next.desc}</p>
                <div className="rwf-operation-meta">
                  <span><small>권장 전력</small><b>{(next.enemyLevel * 1000).toLocaleString()}</b></span>
                  <span><small>지형</small><b>{terrainName[next.terrain]}</b></span>
                  <span><small>적 전력</small><b>{next.enemyCount}기</b></span>
                </div>
                <button onClick={() => setPage('scenario')}>작전 준비 <span>»</span></button>
              </div>
            </>
          ) : (
            <div className="rwf-home-complete"><b>ALL CLEAR</b><p>모든 메인 오퍼레이션을 완료했습니다.</p><button onClick={() => setPage('scenario')}>작전 목록 보기</button></div>
          )}
        </section>
      </div>

      <div className="rwf-home-shortcuts">
        <button onClick={() => setPage('pilot')}><span>◉</span><div><b>파일럿 관리</b><small>최고의 파일럿이 역사를 만듭니다.</small></div></button>
        <button onClick={() => setPage('unitlist')}><span>◇</span><div><b>기체 목록</b><small>보유 기체 {ownedCount}기를 확인합니다.</small></div></button>
        <button onClick={() => setPage('hangar')}><span>⌁</span><div><b>기체 개발</b><small>기체 성능을 한계 너머로 끌어올립니다.</small></div></button>
        <button onClick={() => setPage('parts')}><span>⛭</span><div><b>강화파츠</b><small>전투 목적에 맞는 파츠를 장착합니다.</small></div></button>
        <button className="danger" onClick={() => setPage('pvp')}><span>⚔</span><div><b>PvP</b><small>전 세계의 파일럿과 겨룹니다.</small></div></button>
        <button onClick={() => setPage('tourney')}><span>♜</span><div><b>대회</b><small>최고의 자리를 향한 토너먼트.</small></div></button>
      </div>

      <div className="rwf-home-bottom-grid">
        <section className="rwf-ui-panel rwf-news-panel">
          <header><span>▤</span><b>공지사항</b><small>NEWS</small></header>
          <div className="rwf-news-list">
            <div><em>업데이트</em><span>전투 시스템 및 파일럿 육성 UI 개편</span><time>2026.09.19</time></div>
            <div><em>작전</em><span>메인 오퍼레이션 데이터 갱신</span><time>2026.09.18</time></div>
            <div><em>공지</em><span>프론티어 커맨드 네트워크 정상 운영 중</span><time>2026.09.17</time></div>
            <div><em>이벤트</em><span>강화파츠 정비 지원 캠페인</span><time>2026.09.15</time></div>
          </div>
        </section>

        <section className="rwf-ui-panel rwf-event-panel">
          <header><span>✦</span><b>진행 중인 이벤트</b><small>SPECIAL EVENT</small></header>
          <div className="rwf-event-visual" style={{ '--event-unit': `url(${unit.image})` } as CSSProperties}>
            <small>FRONTIER SPECIAL OPERATION</small>
            <h2>푸른 하늘의<br/>그 너머로</h2>
            <p>새로운 세계를 향한 출격</p>
          </div>
        </section>

        <section className="rwf-ui-panel rwf-daily-panel">
          <header><span>◎</span><b>임무</b><small>DAILY MISSION</small></header>
          <div className="rwf-daily-list">
            <div><span>일일 접속하기</span><progress value="1" max="1"/><b>1/1</b><em>PP 100</em></div>
            <div><span>작전 1회 클리어</span><progress value={pilot.records.scenarioWins > 0 ? 1 : 0} max="1"/><b>{pilot.records.scenarioWins > 0 ? '1/1' : '0/1'}</b><em>PP 100</em></div>
            <div><span>기체 강화 1회</span><progress value="0" max="1"/><b>0/1</b><em>PP 100</em></div>
            <div><span>PvP 1회 참가</span><progress value={pilot.pvpWins + pilot.pvpLosses > 0 ? 1 : 0} max="1"/><b>{pilot.pvpWins + pilot.pvpLosses > 0 ? '1/1' : '0/1'}</b><em>PP 100</em></div>
          </div>
        </section>
      </div>
    </div>
  );
}
