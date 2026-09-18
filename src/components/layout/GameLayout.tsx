import type { ReactNode } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { PageId } from '../../types/game';

const nav: Array<[PageId, string, string]> = [
  ['home','홈','HOME'],
  ['scenario','작전 출격','MISSION'],
  ['hangar','기체 개발','DEVELOP'],
  ['unitlist','기체 목록','UNIT LIST'],
  ['parts','강화파츠','PARTS'],
  ['pilot','파일럿 관리','PILOT'],
  ['recruit','파일럿 영입','RECRUIT'],
  ['shop','상점','SHOP'],
  ['encyclopedia','도감','ENCYCLOPEDIA'],
  ['pvp','PvP','ARENA'],
  ['tourney','대회','TOURNAMENT'],
  ['admin','관리자','ADMIN'],
  ['option','설정','OPTION'],
  ['titlepage','타이틀로','TITLE'],
];

export function GameLayout({ children }: { children: ReactNode }) {
  const page = useGameStore((s) => s.page);
  const setPage = useGameStore((s) => s.setPage);
  const pilot = useGameStore((s) => s.pilot);
  const battle = useGameStore((s) => s.battle);
  const compactMode = useGameStore((s) => s.settings.compactMode);

  return (
    <div className={`game-shell legacy-shell ${compactMode ? 'compact-ui' : ''}`} data-page={page}>
      <header className="topbar legacy-topbar">
        <div className="legacy-logo"><span>ROBOT WARS</span><small>FRONTIER</small></div>
        <div className="legacy-resources">
          <div className="legacy-resource credit"><span className="legacy-resource-icon gold">C</span><div><small>CREDIT</small><strong>{(pilot?.credit ?? 0).toLocaleString()}</strong></div></div>
          <div className="legacy-resource pp"><span className="legacy-resource-icon crystal">PP</span><div><small>PP</small><strong>{(pilot?.pp ?? 0).toLocaleString()}</strong></div></div>
          <div className="legacy-resource kills"><span className="legacy-resource-icon green">K</span><div><small>KILLS</small><strong>{(pilot?.kills ?? 0).toLocaleString()}</strong></div></div>
        </div>
        <div className="legacy-system">
          {battle && <button className="legacy-battle-chip" onClick={() => setPage('battle')}>전투 W{battle.activeWave}</button>}
          <button className="legacy-gear" aria-label="설정" onClick={() => setPage('option')}>⚙</button>
          <span>Ver React v0.9.3</span><span>UC.0087&nbsp;&nbsp;04/12&nbsp;&nbsp;14:25</span>
        </div>
      </header>
      <aside className="sidebar legacy-sidebar">
        <div className="legacy-nav-head"><small>TACTICAL COMMAND</small><b>OPERATION MENU</b></div>
        <nav>
          {nav.map(([id, label, sub]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
              <span className="legacy-nav-icon" aria-hidden="true">◇</span>
              <span><b>{label}</b><small>{sub}</small></span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">ROBOT WARS : FRONTIER<br/><span>TACTICAL SYSTEM UI</span><br/><b>React v0.9.3</b></div>
      </aside>
      <main className="main-stage legacy-main-stage">{children}</main>
    </div>
  );
}
