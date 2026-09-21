import { useMemo, useState } from 'react';
import { pilotTemplates } from '../data/pilots';
import { starterUnitIds, unitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { PilotType } from '../types/game';

import { OptionPage } from './OptionPage';
import '../title-screen.css';

type Step = 'title' | 'catalog' | 'options' | 'pilot' | 'type' | 'unit';

export function StartPage() {
  const savedPilot = useGameStore((s) => s.pilot);
  const selectPilot = useGameStore((s) => s.selectPilot);
  const selectType = useGameStore((s) => s.selectType);
  const completeRegistration = useGameStore((s) => s.completeRegistration);
  const enterGame = useGameStore((s) => s.enterGame);
  const [step, setStep] = useState<Step>('title');
  const [selectedMenu, setSelectedMenu] = useState(0);
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

  if (step === 'options') return <section className="title-subpage"><button className="title-back" autoFocus onClick={() => setStep('title')}>시작 화면으로</button><OptionPage /></section>;

  if (step === 'catalog') return <section className="registration-screen">
    <header><small>PILOT ARCHIVE</small><h2>파일럿 도감</h2></header>
    <div className="pilot-grid">{pilotTemplates.map((p) => <button key={p.id} className={`pilot-card ${pilotId === p.id ? 'selected' : ''}`} onClick={() => setPilotId(p.id)}><img src={p.avatar} alt=""/><span><b>{p.display}</b><small>{p.title}</small></span></button>)}</div>
    <div className="pilot-detail"><img src={pilot.fullbody} alt={pilot.display}/><div><small>{pilot.affiliation} · {pilot.rank}</small><h3>{pilot.display}</h3><em>“{pilot.quote}”</em><p>{pilot.desc}</p><div className="chip-row">{pilot.special.map((x) => <span key={x}>{x}</span>)}</div></div></div>
    <footer><button onClick={() => setStep('title')}>시작 화면으로</button></footer>
  </section>;

  if (step === 'title') {
    const items = [
      { label: '시작', action: () => setStep('pilot'), disabled: false },
      { label: '이어하기', action: () => savedPilot && enterGame(), disabled: !savedPilot },
      { label: '파일럿 도감', action: () => setStep('catalog'), disabled: false },
      { label: '설정', action: () => setStep('options'), disabled: false },
    ];
    return <main className="frontier-title" aria-label="슈퍼로봇대전 프론티어 시작 화면">
      <div className="frontier-title-stage">
        <img className="frontier-title-background" src="/ui/title-background.png" alt="슈퍼로봇대전 프론티어 — 더 넓은 우주, 더 많은 인연"/>
        <nav className="frontier-title-menu" aria-label="시작 메뉴" onKeyDown={(event) => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
          const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
          buttons[next]?.focus();
        }}>
          {items.map((item, index) => <button key={item.label} className={`frontier-title-button ${selectedMenu === index ? 'is-selected' : ''}`} disabled={item.disabled} title={item.disabled ? '저장된 게임이 없습니다' : undefined} onPointerEnter={() => !item.disabled && setSelectedMenu(index)} onFocus={() => setSelectedMenu(index)} onClick={item.action}>
            <span className="title-button-frame" aria-hidden="true"/><span className="title-chevron left" aria-hidden="true">»</span><span className="title-button-label">{item.label}</span><span className="title-chevron right" aria-hidden="true">«</span>
          </button>)}
        </nav>
        <div className="frontier-title-ornament" aria-hidden="true"><i/><span/><i/></div>
      </div>
    </main>;
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
