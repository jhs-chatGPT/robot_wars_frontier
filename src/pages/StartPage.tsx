import { useMemo, useState } from 'react';
import { pilotTemplates } from '../data/pilots';
import { starterUnitIds, unitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { PilotType } from '../types/game';

type Step = 'title' | 'pilot' | 'type' | 'unit';

export function StartPage() {
  const savedPilot = useGameStore((s) => s.pilot);
  const selectPilot = useGameStore((s) => s.selectPilot);
  const selectType = useGameStore((s) => s.selectType);
  const completeRegistration = useGameStore((s) => s.completeRegistration);
  const enterGame = useGameStore((s) => s.enterGame);
  const [step, setStep] = useState<Step>('title');
  const [pilotId, setPilotId] = useState(pilotTemplates[0].id);
  const [type, setType] = useState<PilotType>('리얼계');
  const [unitId, setUnitId] = useState('u1');

  const pilot = pilotTemplates.find((p) => p.id === pilotId)!;
  const starterUnits = useMemo(() => unitTemplates.filter((u) => (starterUnitIds[type] as readonly string[]).includes(u.id)), [type]);

  const chooseType = (nextType: PilotType) => {
    setType(nextType);
    selectType(nextType);
    const first = unitTemplates.find((u) => u.id === starterUnitIds[nextType][0]);
    if (first) setUnitId(first.id);
  };

  if (step === 'title') {
    return (
      <div className="start-title">
        <div className="title-glow" />
        <div className="title-copy">
          <small>TACTICAL ROBOT SIMULATION</small>
          <h1>ROBOT WARS<br/><span>FRONTIER</span></h1>
          <p>전장을 개척하고, 파일럿과 기체를 성장시켜 새로운 전선에 도전하세요.</p>
          <div className="title-actions">
            <button className="primary" onClick={() => setStep('pilot')}>처음부터 시작</button>
            <button disabled={!savedPilot} onClick={() => savedPilot && enterGame()}>이어서하기</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'pilot') {
    return (
      <section className="registration-screen">
        <header><small>PILOT REGISTRATION</small><h2>파일럿 선택</h2><p>작전에 투입할 주인공 파일럿을 선택하세요.</p></header>
        <div className="pilot-grid">
          {pilotTemplates.map((p) => (
            <button key={p.id} className={`pilot-card ${pilotId === p.id ? 'selected' : ''}`} onClick={() => { setPilotId(p.id); selectPilot(p.id); }}>
              <img src={p.avatar} alt="" />
              <span><b>{p.display}</b><small>{p.title}</small></span>
            </button>
          ))}
        </div>
        <div className="pilot-detail">
          <img src={pilot.fullbody} alt="" />
          <div><small>{pilot.affiliation} · {pilot.rank}</small><h3>{pilot.display}</h3><em>“{pilot.quote}”</em><p>{pilot.desc}</p><div className="chip-row">{pilot.special.map((x) => <span key={x}>{x}</span>)}</div></div>
        </div>
        <footer><button onClick={() => setStep('title')}>이전</button><button className="primary" onClick={() => setStep('type')}>다음</button></footer>
      </section>
    );
  }

  if (step === 'type') {
    return (
      <section className="registration-screen compact">
        <header><small>COMBAT TYPE</small><h2>계통 선택</h2><p>전투 성향에 맞는 파일럿 계통을 선택하세요.</p></header>
        <div className="type-grid">
          {(['리얼계','슈퍼계'] as PilotType[]).map((item) => (
            <button key={item} className={`type-card ${type === item ? 'selected' : ''}`} onClick={() => chooseType(item)}>
              <b>{item}</b><span>{item === '리얼계' ? '고기동 · 사격 · 회피 중심' : '고화력 · 장갑 · 근접 중심'}</span>
            </button>
          ))}
        </div>
        <footer><button onClick={() => setStep('pilot')}>이전</button><button className="primary" onClick={() => setStep('unit')}>기체 선택</button></footer>
      </section>
    );
  }

  return (
    <section className="registration-screen">
      <header><small>STARTER UNIT</small><h2>초기 기체 선택</h2><p>{type} 전용 후보 중 첫 주력 기체를 선택하세요.</p></header>
      <div className="unit-grid">
        {starterUnits.map((unit) => (
          <button key={unit.id} className={`unit-card ${unitId === unit.id ? 'selected' : ''}`} onClick={() => setUnitId(unit.id)}>
            <img src={unit.image} alt="" />
            <div><small>{unit.role}</small><h3>{unit.name}</h3><p>HP {unit.hp.toLocaleString()} · EN {unit.en} · 이동 {unit.move}</p><span>파츠 {unit.slots}칸</span></div>
          </button>
        ))}
      </div>
      <footer><button onClick={() => setStep('type')}>이전</button><button className="primary" onClick={() => completeRegistration(pilot, unitId)}>등록 완료 · 홈으로</button></footer>
    </section>
  );
}
