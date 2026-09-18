import { useMemo, useState } from 'react';
import { pilotTrainingSkills } from '../data/pilotSkills';
import { useGameStore } from '../store/gameStore';
import type { PlayerPilot, TerrainKey } from '../types/game';

const statLabels = { melee: '격투', ranged: '사격', reaction: '반응', control: '조종', defense: '방어', skill: '기량', command: '지휘' } as const;
const terrainLabels: Record<TerrainKey, string> = { air: '공', land: '지', water: '수', space: '우' };
const terrainCosts: Record<string, number> = { D: 10, C: 20, B: 30, A: 40 };
const terrainNext: Record<string, string> = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'MAX' };

function PilotProfile({ pilot, active, onActivate }: { pilot: PlayerPilot; active: boolean; onActivate: () => void }) {
  const total = Object.values(pilot.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  return <section className="panel pilot-profile-react"><div className="pilot-profile-art-react"><img src={pilot.fullbody} alt="" /></div><div className="pilot-profile-copy-react"><small>{pilot.affiliation} · {pilot.rank}</small><h1>{pilot.display}</h1><h3>{pilot.title}</h3><em>“{pilot.quote}”</em><p>{pilot.desc}</p><div className="profile-table-react"><span>성별</span><b>{pilot.gender}</b><span>나이</span><b>{pilot.age}세</b><span>유형</span><b>{pilot.type}</b><span>성격</span><b>{pilot.personality}</b><span>특기</span><b>{pilot.specialty}</b><span>총합</span><b>{total}</b></div><div className="chip-row">{pilot.special.map((item) => <span key={item}>{item}</span>)}</div>{!active && <button className="activate-pilot-btn" onClick={onActivate}>주력 파일럿으로 지정</button>}</div></section>;
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
  const pilots = useMemo(() => [pilot, ...roster.filter((item) => item.id !== pilot.id)], [pilot, roster]);
  const viewed = pilots.find((item) => item.id === selectedId) ?? pilot;
  const isActive = viewed.id === pilot.id;
  const total = Object.values(pilot.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  const skillShop = pilotTrainingSkills.filter((item) => item.type === '공용' || item.type === pilot.type);

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>PILOT DATABASE / PP TRAINING</small><h1>파일럿 관리</h1></div><div className="resource-badge">PP <b>{pilot.pp}</b></div></div>
      <div className="pilot-db-react">
        <aside className="panel pilot-roster-react"><header><b>PILOT LIST</b><span>{pilots.length}명</span></header>{pilots.map((item) => <button key={item.id} className={viewed.id === item.id ? 'active' : ''} onClick={() => setSelectedId(item.id)}><img src={item.avatar} alt=""/><span><b>{item.display}</b><small>{item.title}{item.id === pilot.id ? ' · CURRENT' : ''}</small></span></button>)}</aside>
        <div className="pilot-detail-stack-react">
          <PilotProfile pilot={viewed} active={isActive} onActivate={() => { if (setActivePilot(viewed.id)) { setSelectedId(viewed.id); setMessage(`${viewed.display}을(를) 주력 파일럿으로 지정했습니다.`); } }} />
          {isActive && <section className="panel training-panel">
            <header><b>PILOT PARAMETERS</b><span>현재 총합 {total}</span></header>
            <div className="stat-training-list">
              {(Object.keys(statLabels) as Array<keyof typeof statLabels>).map((key) => (
                <div className="stat-training-row" key={key}><b>{statLabels[key]}</b><strong>{pilot.stats[key]}</strong><div className="stat-track"><i style={{ width: `${Math.min(100, pilot.stats[key] / 250 * 100)}%` }} /></div><button disabled={pilot.pp < 20 || pilot.stats[key] >= 250} onClick={() => { const ok = trainStat(key); setMessage(ok ? `${statLabels[key]} +5` : 'PP가 부족하거나 최대치입니다.'); }}>+5 · 20 PP</button></div>
              ))}
            </div>
            <div className="terrain-training"><h3>지형적응</h3>{(Object.keys(terrainLabels) as TerrainKey[]).map((key) => { const rank = pilot.terrain[key]; const next = terrainNext[rank] ?? 'MAX'; const cost = terrainCosts[rank] ?? 0; return <button key={key} disabled={next === 'MAX' || pilot.pp < cost} onClick={() => { const ok = trainTerrain(key); setMessage(ok ? `${terrainLabels[key]} 지형적응 상승` : 'PP가 부족하거나 최고 등급입니다.'); }}><b>{terrainLabels[key]} {rank}</b><span>→ {next}</span><small>{next === 'MAX' ? 'MAX' : `${cost} PP`}</small></button>; })}</div>
            <div className="skill-training-react"><h3>특수능력 습득</h3><div>{skillShop.map((skill) => { const owned = pilot.special.includes(skill.name); return <button key={skill.name} disabled={owned || pilot.pp < skill.cost} onClick={() => { const ok = buyPilotSpecial(skill.name, skill.cost); setMessage(ok ? `${skill.name} 습득 완료` : 'PP가 부족하거나 이미 습득한 능력입니다.'); }}><span><b>{skill.name}</b><small>{skill.type}</small></span><strong>{owned ? '습득완료' : `${skill.cost} PP`}</strong></button>; })}</div></div>
            {message && <div className="inline-message">{message}</div>}
          </section>}
        </div>
      </div>
    </div>
  );
}
