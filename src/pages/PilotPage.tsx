import { useMemo, useState } from 'react';
import { pilotTrainingSkills } from '../data/pilotSkills';
import { useGameStore } from '../store/gameStore';
import type { PlayerPilot, TerrainKey } from '../types/game';

const statLabels = { melee: '격투', ranged: '사격', reaction: '반응', control: '조종', defense: '방어', skill: '기량', command: '지휘' } as const;
const terrainLabels: Record<TerrainKey, string> = { air: '공', land: '지', water: '수', space: '우' };
const terrainCosts: Record<string, number> = { D: 10, C: 20, B: 30, A: 40 };
const terrainNext: Record<string, string> = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'MAX' };
const SKILLS_PER_PAGE = 8;
type TrainingTab = 'stats' | 'terrain' | 'skills';

function PilotProfile({ pilot, active, onActivate }: { pilot: PlayerPilot; active: boolean; onActivate: () => void }) {
  const total = Object.values(pilot.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  return (
    <section className="panel pilot-profile-react pilot-profile-compact">
      <div className="pilot-profile-art-react"><img src={pilot.fullbody} alt="" /></div>
      <div className="pilot-profile-copy-react">
        <small>{pilot.affiliation} · {pilot.rank}</small>
        <h1>{pilot.display}</h1>
        <h3>{pilot.title}</h3>
        <em>“{pilot.quote}”</em>
        <p className="pilot-description-compact">{pilot.desc}</p>
        <div className="profile-table-react profile-table-compact">
          <span>성별</span><b>{pilot.gender}</b><span>나이</span><b>{pilot.age}세</b>
          <span>유형</span><b>{pilot.type}</b><span>성격</span><b>{pilot.personality}</b>
          <span>특기</span><b>{pilot.specialty}</b><span>총합</span><b>{total}</b>
        </div>
        <div className="chip-row pilot-owned-skills">{pilot.special.map((item) => <span key={item}>{item}</span>)}</div>
        {!active && <button className="activate-pilot-btn" onClick={onActivate}>주력 파일럿으로 지정</button>}
      </div>
    </section>
  );
}

export function PilotPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const roster = useGameStore((s) => s.pilotRoster);
  const trainStat = useGameStore((s) => s.trainStat);
  const trainTerrain = useGameStore((s) => s.trainTerrain);
  const buyPilotSpecial = useGameStore((s) => s.buyPilotSpecial);
  const setActivePilot = useGameStore((s) => s.setActivePilot);
  const [selectedId, setSelectedId] = useState(pilot.id);
  const [message, setMessage] = useState('');
  const [trainingTab, setTrainingTab] = useState<TrainingTab>('stats');
  const [skillPage, setSkillPage] = useState(0);
  const pilots = useMemo(() => [pilot, ...roster.filter((item) => item.id !== pilot.id)], [pilot, roster]);
  const viewed = pilots.find((item) => item.id === selectedId) ?? pilot;
  const isActive = viewed.id === pilot.id;
  const total = Object.values(pilot.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  const skillShop = pilotTrainingSkills.filter((item) => item.type === '공용' || item.type === pilot.type);
  const skillPages = Math.max(1, Math.ceil(skillShop.length / SKILLS_PER_PAGE));
  const safeSkillPage = Math.min(skillPage, skillPages - 1);
  const visibleSkills = skillShop.slice(safeSkillPage * SKILLS_PER_PAGE, safeSkillPage * SKILLS_PER_PAGE + SKILLS_PER_PAGE);

  const activateViewed = () => {
    if (setActivePilot(viewed.id)) {
      setSelectedId(viewed.id);
      setMessage(`${viewed.display}을(를) 주력 파일럿으로 지정했습니다.`);
      setTrainingTab('stats');
      setSkillPage(0);
    }
  };

  return (
    <div className="pilot-management-screen">
      <div className="screen-heading pilot-screen-heading">
        <div><small>PILOT DATABASE / PP TRAINING</small><h1>파일럿 관리</h1></div>
        <div className="resource-badge">PP <b>{pilot.pp}</b></div>
      </div>

      <div className="pilot-three-column">
        <aside className="panel pilot-roster-react pilot-column-list">
          <header><b>PILOT LIST</b><span>{pilots.length}명</span></header>
          <div className="pilot-roster-items">
            {pilots.map((item) => (
              <button key={item.id} className={viewed.id === item.id ? 'active' : ''} onClick={() => { setSelectedId(item.id); setMessage(''); }}>
                <img src={item.avatar} alt=""/>
                <span><b>{item.display}</b><small>{item.title}{item.id === pilot.id ? ' · CURRENT' : ''}</small></span>
              </button>
            ))}
          </div>
        </aside>

        <div className="pilot-column-info">
          <PilotProfile pilot={viewed} active={isActive} onActivate={activateViewed} />
        </div>

        <section className="panel pilot-training-workspace">
          <header className="pilot-training-header">
            <div><small>PP TRAINING</small><b>파일럿 육성</b></div>
            <span>총합 {total}</span>
          </header>

          {!isActive ? (
            <div className="pilot-training-locked">
              <div className="pilot-training-lock-icon">◇</div>
              <h2>{viewed.display}</h2>
              <p>육성은 현재 주력 파일럿에게 적용됩니다.<br/>이 파일럿을 육성하려면 먼저 주력으로 지정하십시오.</p>
              <button className="activate-pilot-btn" onClick={activateViewed}>주력 파일럿으로 지정</button>
            </div>
          ) : (
            <>
              <nav className="pilot-training-tabs" aria-label="파일럿 육성 분류">
                <button className={trainingTab === 'stats' ? 'active' : ''} onClick={() => setTrainingTab('stats')}>능력치<small>PARAMETER</small></button>
                <button className={trainingTab === 'terrain' ? 'active' : ''} onClick={() => setTrainingTab('terrain')}>지형적응<small>TERRAIN</small></button>
                <button className={trainingTab === 'skills' ? 'active' : ''} onClick={() => setTrainingTab('skills')}>특수능력<small>SKILL</small></button>
              </nav>

              <div className="pilot-training-body">
                {trainingTab === 'stats' && (
                  <div className="pilot-stat-grid">
                    {(Object.keys(statLabels) as Array<keyof typeof statLabels>).map((key) => (
                      <div className="pilot-stat-card" key={key}>
                        <div className="pilot-stat-card-head"><b>{statLabels[key]}</b><strong>{pilot.stats[key]}</strong></div>
                        <div className="stat-track"><i style={{ width: `${Math.min(100, pilot.stats[key] / 250 * 100)}%` }} /></div>
                        <button disabled={pilot.pp < 20 || pilot.stats[key] >= 250} onClick={() => { const ok = trainStat(key); setMessage(ok ? `${statLabels[key]} +5` : 'PP가 부족하거나 최대치입니다.'); }}>+5 <small>20 PP</small></button>
                      </div>
                    ))}
                  </div>
                )}

                {trainingTab === 'terrain' && (
                  <div className="pilot-terrain-grid">
                    {(Object.keys(terrainLabels) as TerrainKey[]).map((key) => {
                      const rank = pilot.terrain[key];
                      const next = terrainNext[rank] ?? 'MAX';
                      const cost = terrainCosts[rank] ?? 0;
                      return (
                        <button key={key} disabled={next === 'MAX' || pilot.pp < cost} onClick={() => { const ok = trainTerrain(key); setMessage(ok ? `${terrainLabels[key]} 지형적응 상승` : 'PP가 부족하거나 최고 등급입니다.'); }}>
                          <small>{terrainLabels[key]} TERRAIN</small>
                          <strong>{rank}</strong>
                          <span>{next === 'MAX' ? 'MAXIMUM' : `${rank} → ${next}`}</span>
                          <b>{next === 'MAX' ? 'MAX' : `${cost} PP`}</b>
                        </button>
                      );
                    })}
                  </div>
                )}

                {trainingTab === 'skills' && (
                  <div className="pilot-skill-pager">
                    <div className="pilot-skill-grid">
                      {visibleSkills.map((skill) => {
                        const owned = pilot.special.includes(skill.name);
                        return (
                          <button key={skill.name} disabled={owned || pilot.pp < skill.cost} onClick={() => { const ok = buyPilotSpecial(skill.name, skill.cost); setMessage(ok ? `${skill.name} 습득 완료` : 'PP가 부족하거나 이미 습득한 능력입니다.'); }}>
                            <span><b>{skill.name}</b><small>{skill.type}</small></span>
                            <strong>{owned ? '습득완료' : `${skill.cost} PP`}</strong>
                          </button>
                        );
                      })}
                    </div>
                    <div className="pilot-skill-pagination">
                      <button disabled={safeSkillPage <= 0} onClick={() => setSkillPage((page) => Math.max(0, page - 1))}>‹</button>
                      <span>{safeSkillPage + 1} / {skillPages}</span>
                      <button disabled={safeSkillPage >= skillPages - 1} onClick={() => setSkillPage((page) => Math.min(skillPages - 1, page + 1))}>›</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={`pilot-training-message ${message ? 'show' : ''}`}>{message || '육성 항목을 선택하십시오.'}</div>
        </section>
      </div>
    </div>
  );
}
