import type { ReactNode } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { PageId } from '../../types/game';

const nav: Array<[PageId, string, string, string]> = [
  ['home','홈','BASE','⌂'],
  ['pilot','파일럿 관리','PILOT','◉'],
  ['recruit','파일럿 영입','RECRUIT','＋'],
  ['unitlist','기체 목록','UNIT','◇'],
  ['hangar','기체 개발','DEVELOP','⌁'],
  ['parts','강화파츠','CUSTOMIZE','⛭'],
  ['scenario','작전 출격','SORTIE','⚔'],
  ['pvp','PvP','ARENA','⌖'],
  ['tourney','대회','TOURNAMENT','♜'],
  ['shop','상점','SHOP','▰'],
  ['encyclopedia','도감','ARCHIVE','▤'],
  ['admin','관리자','ADMIN','▦'],
  ['option','설정','SETTING','⚙'],
  ['titlepage','타이틀로','TITLE','↩'],
];

export function GameLayout({ children }: { children: ReactNode }) {
  const page = useGameStore((s) => s.page);
  const setPage = useGameStore((s) => s.setPage);
  const pilot = useGameStore((s) => s.pilot);
  const battle = useGameStore((s) => s.battle);
  const compactMode = useGameStore((s) => s.settings.compactMode);

  return (
    <div className={`game-shell legacy-shell rwf-shell ${compactMode ? 'compact-ui' : ''}`} data-page={page}>
      <header className="topbar rwf-topbar">
        <div className="rwf-brand">
          <div className="rwf-brand-title"><span>ROBOT WARS</span><small>FRONTIER</small></div>
          <div className="rwf-brand-motto"><b>인류의 의지로, 기체에.</b><small>BEYOND THE BATTLEFIELD.</small></div>
        </div>

        <div className="rwf-resource-strip">
          <div className="rwf-resource credit"><span className="rwf-resource-icon">◎</span><div><small>CREDIT</small><strong>{(pilot?.credit ?? 0).toLocaleString()}</strong></div></div>
          <div className="rwf-resource pp"><span className="rwf-resource-icon">P</span><div><small>PP</small><strong>{(pilot?.pp ?? 0).toLocaleString()}</strong></div></div>
          <div className="rwf-resource kills"><span className="rwf-resource-icon">✦</span><div><small>KILLS</small><strong>{(pilot?.kills ?? 0).toLocaleString()}</strong></div></div>
        </div>

        <div className="rwf-faction">
          <span className="rwf-faction-mark">▽</span>
          <div><b>SRW</b><small>EARTH FEDERATION</small></div>
        </div>

        <div className="rwf-system-actions">
          {battle && <button className="rwf-battle-chip" onClick={() => setPage('battle')}>BATTLE W{battle.activeWave}</button>}
          <button aria-label="홈" onClick={() => setPage('home')}>⌂</button>
          <button aria-label="설정" onClick={() => setPage('option')}>⚙</button>
          <small>v0.9.10</small>
        </div>
      </header>

      <aside className="sidebar rwf-sidebar">
        <nav>
          {nav.map(([id, label, sub, icon]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
              <span className="rwf-nav-icon" aria-hidden="true">{icon}</span>
              <span className="rwf-nav-copy"><b>{label}</b><small>{sub}</small></span>
            </button>
          ))}
        </nav>
        <div className="rwf-sidebar-foot">
          <span className="rwf-sidebar-emblem">▽</span>
          <b>E.F. FORCE</b>
          <small>A SAFE TOMORROW<br/>FOR ALL HUMANITY.</small>
          <em>React v0.9.10</em>
        </div>
      </aside>

      <main className="main-stage legacy-main-stage">{children}</main>
    </div>
  );
}
