import { useEffect, useRef, useState, type ReactNode } from 'react';
import { unitStats } from '../data/calculations';
import { currentDaily, dailyMissions } from '../data/dailyMissions';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { PageId } from '../types/game';

const terrainName = { air: '공중', land: '지상', water: '수중', space: '우주' } as const;
const shortcuts: [PageId, string, string][] = [ ['pilot','파일럿 관리','pilot'], ['unitlist','기체 목록','unit'], ['hangar','기체 개발','develop'], ['parts','강화파츠','parts'], ['pvp','PvP','pvp'], ['tourney','대회','tourney'] ];
const notices = [
  ['업데이트','메인 지휘 화면 개편','09.20','지휘관, 주력 기체, 다음 작전을 한 화면에 배치했습니다. 각 바로가기로 기존 관리 화면을 열 수 있습니다.'],
  ['안내','일일 임무와 보상 안내','09.20','한국 시간 자정에 초기화됩니다. 이번 버전 적용 이후의 작전 승리, 개조, PvP 참가, 전투 종료 시 확정된 격파 수가 집계됩니다. 완료된 임무의 보상 버튼을 누르면 한 번만 지급됩니다.'],
  ['안내','기체 개조와 강화파츠','09.19','기체 개발에서 성능을 개조하고 강화파츠 메뉴에서 보유 파츠를 장착할 수 있습니다.'],
  ['안내','대회 참가 안내','09.19','대회 메뉴에서 참가 조건과 상품을 확인하십시오.'],
  ['안내','저장 데이터 백업','09.19','설정 메뉴에서 데이터를 내보낼 수 있습니다. 브라우저 데이터를 삭제하기 전에 백업하십시오.'],
];
function Panel({ title, subtitle, className = '', children }: { title: string; subtitle: string; className?: string; children: ReactNode }) {
  return <section className={`command-panel ${className}`}><header><h2>{title}</h2><small>{subtitle}</small></header>{children}</section>;
}
export function HomePage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const setPage = useGameStore((s) => s.setPage);
  const battle = useGameStore((s) => s.battle);
  const storedDaily = useGameStore((s) => s.daily);
  const claimDaily = useGameStore((s) => s.claimDaily);
  const [, tick] = useState(0);
  const [notice, setNotice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const timer = setInterval(() => tick((x) => x + 1), 30000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (notice !== null) dialog.current?.showModal(); }, [notice]);
  const daily = currentDaily(storedDaily);
  const units = [...allUnitTemplates, ...catalog.customUnits];
  const unit = units.find((u) => u.id === pilot.unitId) ?? units.find((u) => !u.enemyOnly)!;
  const stats = unitStats(pilot, unit);
  const next = [...scenarios, ...catalog.customScenarios].find((s) => !pilot.scenarioClears.includes(s.id));
  const expNeed = 100 + pilot.level * 20;
  const maxLevel = pilot.level >= 200;
  return <div className="command-home">
    <div className="command-primary">
      <Panel title="지휘관 정보" subtitle="COMMANDER" className="commander-panel">
        <div className="commander-body">
          <img className="commander-portrait" src={pilot.avatar} alt={`${pilot.display} 초상`} />
          <div className="commander-data"><h3>{pilot.display} <span>Lv. <b>{pilot.level}</b></span></h3>
            <dl><div><dt>소속</dt><dd>{pilot.affiliation || 'E.F. FORCE'}</dd></div><div><dt>계급</dt><dd>{pilot.rank}</dd></div><div><dt>상태</dt><dd>{battle && !battle.finished ? '작전 수행 중' : '대기 중'}</dd></div></dl>
            <blockquote>“{pilot.quote || '전원, 출격 준비!'}”</blockquote>
          </div>
        </div>
        <div className="commander-exp"><span>EXP</span><div><small>{maxLevel ? 'MAX LEVEL' : `${pilot.exp.toLocaleString()} / ${expNeed.toLocaleString()}`}</small><progress aria-label="지휘관 경험치" value={maxLevel ? 1 : Math.min(pilot.exp, expNeed)} max={maxLevel ? 1 : expNeed}/></div></div>
      </Panel>
      <Panel title="주력 기체" subtitle="MAIN UNIT" className="unit-panel">
        <div className="unit-body"><img className="unit-portrait" src={unit.image} alt={unit.name}/><div className="unit-data"><h3>{unit.name}</h3><dl>{[['HP',stats.hp],['EN',stats.en],['장갑',stats.armor],['운동성',stats.mobility],['이동력',stats.move]].map(([key,value]) => <div key={key}><dt>{key}</dt><dd>{value.toLocaleString()}</dd></div>)}</dl><button className="console-button" onClick={() => { sessionStorage.setItem('rwf-selected-unit', unit.id); setPage('hangar'); }}>기체 상세 보기 <span aria-hidden="true">›</span></button></div></div>
      </Panel>
      <Panel title="다음 작전" subtitle="NEXT OPERATION" className="operation-panel">
        <div className="operation-art"><img src={next?.terrain === 'space' ? '/assets/backgrounds/bg-space.webp' : '/assets/sortie/hangar.jpg'} alt="작전 구역"/><h3>{next?.title ?? '모든 작전 완료'}</h3></div>
        <div className="operation-footer"><dl><div><dt>권장 전력</dt><dd>{next ? (next.enemyLevel * 1000).toLocaleString() : '—'}</dd></div><div><dt>지형</dt><dd>{next ? terrainName[next.terrain] : '—'}</dd></div><div><dt>작전 타입</dt><dd>스토리 작전</dd></div></dl><button className="console-button sortie-button" onClick={() => setPage('scenario')}>{next ? '작전 준비' : '작전 목록'} <span aria-hidden="true">»</span></button></div>
      </Panel>
    </div>
    <nav className="command-shortcuts" aria-label="빠른 이동">{shortcuts.map(([page,title,icon]) => <button key={page} className="command-panel" onClick={() => setPage(page)}><img src={`/assets/ui/icon_${icon}.svg`} alt=""/><span>{title}</span></button>)}</nav>
    <div className="command-bottom">
      <Panel title="공지사항" subtitle="NOTICE" className="notice-panel"><div className="command-notices">{notices.map(([category,title,date],i) => <button key={title} onClick={() => setNotice(i)}><span className={i === 0 ? 'notice-update' : ''}>[{category}]</span><b>{title}</b><time dateTime={`2026-${date.replace('.', '-')}`}>{date}</time></button>)}</div></Panel>
      <Panel title="진행 중인 이벤트" subtitle="EVENT PREVIEW" className="event-panel"><button className="command-event" onClick={() => setNotice(5)} aria-label="전선 돌파 작전 이벤트 예시 보기"><img src="/assets/backgrounds/bg-space.webp" alt=""/><img className="event-mech" src={unit.image} alt=""/><div><span className="event-status">준비 중</span><h3>전선 돌파 작전</h3><p>다음 전선을 향한 출격을 준비하십시오.</p><time>기간 미정 · 공개 예정</time></div></button></Panel>
      <Panel title="일일 임무" subtitle="DAILY MISSION" className="daily-panel"><div className="command-missions">{dailyMissions.map((m) => { const value = Math.min(daily.counts[m.id],m.target); const claimed = daily.claimed.includes(m.id); const done = value >= m.target; return <div className={`command-mission ${done ? 'is-done' : ''}`} key={m.id}><div><label htmlFor={`daily-${m.id}`}>{m.title}<span>{value}/{m.target}</span></label><progress id={`daily-${m.id}`} value={value} max={m.target}/></div><button disabled={!done || claimed} onClick={() => { if (claimDaily(m.id)) setFeedback(`${m.title} 보상을 수령했습니다.`); }} aria-label={`${m.title}: ${claimed ? '수령 완료' : done ? '보상 수령' : '미완료'}`}><strong>{m.credit ? `${m.credit.toLocaleString()} Cr` : `${m.pp} PP`}</strong><small>{claimed ? '수령 완료' : done ? '보상 받기' : '진행 중'}</small></button></div>; })}</div></Panel>
    </div>
    <span className="command-announcement" role="status">{feedback}</span>
    <dialog className="command-dialog" ref={dialog} onCancel={() => setNotice(null)} onClose={() => setNotice(null)} onClick={(e) => { if(e.target === e.currentTarget) dialog.current?.close(); }}><article className="command-panel"><header><h2>{notice === 5 ? '전선 돌파 작전' : notice !== null ? notices[notice][1] : ''}</h2><button autoFocus aria-label="닫기" onClick={() => dialog.current?.close()}>닫기</button></header><p>{notice === 5 ? '현재 이벤트는 화면 구성용 미리보기입니다. 진행 기간과 특별 보상은 아직 설정되지 않았습니다. 일반 작전과 일일 임무는 이용할 수 있습니다.' : notice !== null ? notices[notice][3] : ''}</p></article></dialog>
  </div>;
}
