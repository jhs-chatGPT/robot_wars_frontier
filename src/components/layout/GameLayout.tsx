import type { ReactNode } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { PageId } from '../../types/game';

const nav: Array<[PageId, string, string, string]> = [
  ['home','홈','BASE','home'],
  ['pilot','파일럿 관리','PILOT','pilot'],
  ['recruit','파일럿 영입','RECRUIT','recruit'],
  ['unitlist','기체 목록','UNIT','unit'],
  ['hangar','기체 개발','DEVELOP','develop'],
  ['parts','강화파츠','CUSTOMIZE','parts'],
  ['scenario','작전 출격','SORTIE','sortie'],
  ['pvp','PvP','ARENA','pvp'],
  ['tourney','대회','TOURNAMENT','tourney'],
  ['shop','상점','SHOP','shop'],
  ['encyclopedia','도감','ARCHIVE','archive'],
  ['admin','관리자','ADMIN','admin'],
  ['option','설정','SETTING','setting'],
  ['titlepage','타이틀로','TITLE','title'],
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
          <div className="rwf-brand-title">
            <img className="rwf-logo-image" src="/assets/ui/rwf_logo.png" alt="ROBOT WARS FRONTIER" />
          </div>
          <div className="rwf-brand-motto"><b>인류의 의지로, 기체에.</b><small>BEYOND THE BATTLEFIELD.</small></div>
        </div>

        <div className="rwf-resource-strip" aria-label="보유 자원">
          <div className="rwf-resource credit"><span className="rwf-resource-icon">C</span><div><small>CREDIT</small><strong>{(pilot?.credit ?? 0).toLocaleString()}</strong></div></div>
          <div className="rwf-resource pp"><span className="rwf-resource-icon">P</span><div><small>PP</small><strong>{(pilot?.pp ?? 0).toLocaleString()}</strong></div></div>
          <div className="rwf-resource kills"><span className="rwf-resource-icon">K</span><div><small>KILLS</small><strong>{(pilot?.kills ?? 0).toLocaleString()}</strong></div></div>
        </div>

        <div className="rwf-faction">
          <img src="/assets/ui/emblem_ef_v2.svg" alt="" aria-hidden="true" />
          <div><b>SRW</b><small>EARTH FEDERATION</small><em>FOR A BRIGHTER TOMORROW.</em></div>
        </div>

        <div className="rwf-system-actions">
          {battle && <button className="rwf-battle-chip" onClick={() => setPage('battle')}>BATTLE W{battle.activeWave}</button>}
          <button aria-label="홈" title="홈" onClick={() => setPage('home')}><img src="/assets/ui/icon_home.svg" alt="" /></button>
          <button aria-label="작전 출격" title="작전 출격" onClick={() => setPage('scenario')}><img src="/assets/ui/icon_sortie.svg" alt="" /></button>
          <button aria-label="파일럿 관리" title="파일럿 관리" onClick={() => setPage('pilot')}><img src="/assets/ui/icon_pilot.svg" alt="" /></button>
          <button aria-label="설정" title="설정" onClick={() => setPage('option')}><img src="/assets/ui/icon_setting.svg" alt="" /></button>
          <small>v0.9.12</small>
        </div>
      </header>

      <aside className="sidebar rwf-sidebar">
        <nav>
          {nav.map(([id, label, sub, icon]) => (
            <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
              <span className="rwf-nav-icon" aria-hidden="true"><img src={`/assets/ui/icon_${icon}.svg`} alt="" /></span>
              <span className="rwf-nav-copy"><b>{label}</b><small>{sub}</small></span>
            </button>
          ))}
        </nav>
        <div className="rwf-sidebar-foot">
          <img className="rwf-sidebar-emblem" src="/assets/ui/emblem_ef_v2.svg" alt="" aria-hidden="true" />
          <b>E.F. FORCE</b>
          <small>A SAFE TOMORROW<br/>FOR ALL HUMANITY.</small>
          <em>React v0.9.12</em>
        </div>
      </aside>

      <main className="main-stage legacy-main-stage">{children}</main>
    </div>
  );
}
