import { useMemo, useState } from 'react';
import { pilotTemplates } from '../data/pilots';
import { useGameStore } from '../store/gameStore';

export function RecruitPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const roster = useGameStore((s) => s.pilotRoster);
  const recruitPilot = useGameStore((s) => s.recruitPilot);
  const [message, setMessage] = useState('');
  const ownedIds = useMemo(() => new Set([pilot.id, ...roster.map((item) => item.id)]), [pilot.id, roster]);
  const candidates = pilotTemplates.filter((item) => !ownedIds.has(item.id));

  const costFor = (id: string) => {
    const index = pilotTemplates.findIndex((item) => item.id === id);
    const template = pilotTemplates[index];
    return 60000 + (index % 5) * 10000 + (template?.gender === '여' ? 5000 : 0);
  };

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>PILOT RECRUITMENT</small><h1>파일럿 영입</h1></div><div className="resource-badge">CREDIT <b>{pilot.credit.toLocaleString()}</b></div></div>
      {message && <div className="inline-message">{message}</div>}
      {candidates.length ? <div className="recruit-grid-react">
        {candidates.map((candidate) => {
          const cost = costFor(candidate.id);
          return <section className="panel recruit-card-react" key={candidate.id}>
            <img src={candidate.avatar} alt="" />
            <div><small>{candidate.type} · {candidate.affiliation}</small><h2>{candidate.display}</h2><p>{candidate.title}</p><div className="chip-row">{candidate.special.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div><button disabled={pilot.credit < cost} onClick={() => { const result = recruitPilot(candidate.id); setMessage(result.message); }}>영입 · {cost.toLocaleString()} C</button></div>
          </section>;
        })}
      </div> : <section className="panel empty-panel-react"><h2>모든 기본 파일럿 영입 완료</h2><p>현재 등록된 10명의 파일럿을 모두 확보했습니다.</p></section>}
    </div>
  );
}
