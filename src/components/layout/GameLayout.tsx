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
    <div className={`game-shell ${compactMode ? 'compact-ui' : ''}`}>
      <header className="topbar">
        <div><strong>ROBOT WARS FRONTIER</strong><span>TACTICAL COMMAND SYSTEM</span></div>
        <div className="topbar-meta"><b>v0.9.0</b>{battle && <button className="battle-return-chip" onClick={() => setPage('battle')}>전투 진행중 · W{battle.activeWave}</button>}{pilot && <span>Lv.{pilot.level} {pilot.display} · {pilot.credit.toLocaleString()}C</span>}</div>
      </header>
      <aside className="sidebar">
        <div className="brand-mark">RWF</div>
        <nav>
          {nav.map(([id, label, sub]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
              <span className="nav-dot" />
              <span><b>{label}</b><small>{sub}</small></span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">TACTICAL SYSTEM UI<br/><b>v0.9.0</b></div>
      </aside>
      <main className="main-stage">{children}</main>
    </div>
  );
}
