import { useMemo, useState } from 'react';
import { adaptPilotToType } from '../data/pilotAdjust';
import { pilotTemplates } from '../data/pilots';
import { bloodTypes, defaultPilotBirth, deriveSpirits } from '../data/spiritSetup';
import { starterUnitIds, unitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { BloodType, PilotTemplate, PilotType } from '../types/game';

import { OptionPage } from './OptionPage';
import '../title-screen.css';
import '../registration-screen.css';

type Step = 'title' | 'catalog' | 'options' | 'pilot' | 'unit';

function getDefaultBlood(id: string): BloodType {
  const seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return bloodTypes[seed % bloodTypes.length];
}

function displayName(family: string, name: string) {
  return `${family.trim()}${family.trim() && name.trim() ? ' ' : ''}${name.trim()}`.trim();
}

export function StartPage() {
  const savedPilot = useGameStore((s) => s.pilot);
  const selectPilot = useGameStore((s) => s.selectPilot);
  const selectType = useGameStore((s) => s.selectType);
  const completeRegistration = useGameStore((s) => s.completeRegistration);
  const enterGame = useGameStore((s) => s.enterGame);

  const initialPilot = pilotTemplates[0];
  const initialBirth = defaultPilotBirth(initialPilot.age, initialPilot.id);

  const [step, setStep] = useState<Step>('title');
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [pilotId, setPilotId] = useState(initialPilot.id);
  const [type, setType] = useState<PilotType>(initialPilot.type);
  const [unitId, setUnitId] = useState<string>(starterUnitIds[initialPilot.type][0]);
  const [family, setFamily] = useState(initialPilot.family);
  const [firstName, setFirstName] = useState(initialPilot.name);
  const [birthYear, setBirthYear] = useState(initialBirth.year);
  const [birthMonth, setBirthMonth] = useState(initialBirth.month);
  const [birthDay, setBirthDay] = useState(initialBirth.day);
  const [bloodType, setBloodType] = useState<BloodType>(getDefaultBlood(initialPilot.id));

  const pilot = pilotTemplates.find((p) => p.id === pilotId) ?? initialPilot;
  const starterUnits = useMemo(
    () => unitTemplates.filter((u) => (starterUnitIds[type] as readonly string[]).includes(u.id)),
    [type],
  );
  const selectedUnit = starterUnits.find((u) => u.id === unitId) ?? starterUnits[0];
  const spirits = useMemo(
    () => deriveSpirits(birthYear, birthMonth, birthDay, bloodType, type),
    [birthYear, birthMonth, birthDay, bloodType, type],
  );
  const maxDay = new Date(birthYear, birthMonth, 0).getDate();
  const years = useMemo(() => Array.from({ length: 51 }, (_, index) => 1985 + index), []);

  const resetPilotSetup = (nextPilot: PilotTemplate) => {
    const birth = defaultPilotBirth(nextPilot.age, nextPilot.id);
    setPilotId(nextPilot.id);
    setFamily(nextPilot.family);
    setFirstName(nextPilot.name);
    setBirthYear(birth.year);
    setBirthMonth(birth.month);
    setBirthDay(birth.day);
    setBloodType(getDefaultBlood(nextPilot.id));
    setType(nextPilot.type);
    setUnitId(starterUnitIds[nextPilot.type][0]);
    selectPilot(nextPilot.id);
    selectType(nextPilot.type);
  };

  const chooseType = (nextType: PilotType) => {
    setType(nextType);
    selectType(nextType);
    setUnitId(starterUnitIds[nextType][0]);
  };

  const changeYear = (nextYear: number) => {
    setBirthYear(nextYear);
    const nextMaxDay = new Date(nextYear, birthMonth, 0).getDate();
    if (birthDay > nextMaxDay) setBirthDay(nextMaxDay);
  };

  const changeMonth = (nextMonth: number) => {
    setBirthMonth(nextMonth);
    const nextMaxDay = new Date(birthYear, nextMonth, 0).getDate();
    if (birthDay > nextMaxDay) setBirthDay(nextMaxDay);
  };

  const registrationPilot = useMemo(() => {
    const adjusted = adaptPilotToType(pilot, type);
    const nextDisplay = displayName(family, firstName) || pilot.display;
    return {
      ...adjusted,
      family: family.trim(),
      name: firstName.trim(),
      display: nextDisplay,
      type,
      birthYear,
      birthMonth,
      birthDay,
      bloodType,
    } satisfies PilotTemplate;
  }, [pilot, type, family, firstName, birthYear, birthMonth, birthDay, bloodType]);

  if (step === 'options') {
    return (
      <section className="title-subpage">
        <button className="title-back" autoFocus onClick={() => setStep('title')}>시작 화면으로</button>
        <OptionPage />
      </section>
    );
  }

  if (step === 'catalog') {
    return (
      <section className="registration-screen">
        <header><small>PILOT ARCHIVE</small><h2>파일럿 도감</h2></header>
        <div className="pilot-grid">
          {pilotTemplates.map((p) => (
            <button key={p.id} className={`pilot-card ${pilotId === p.id ? 'selected' : ''}`} onClick={() => setPilotId(p.id)}>
              <img src={p.avatar} alt="" />
              <span><b>{p.display}</b><small>{p.title}</small></span>
            </button>
          ))}
        </div>
        <div className="pilot-detail">
          <img src={pilot.fullbody} alt={pilot.display}/>
          <div><small>{pilot.affiliation} · {pilot.rank}</small><h3>{pilot.display}</h3><em>“{pilot.quote}”</em><p>{pilot.desc}</p><div className="chip-row">{pilot.special.map((x) => <span key={x}>{x}</span>)}</div></div>
        </div>
        <footer><button onClick={() => setStep('title')}>시작 화면으로</button></footer>
      </section>
    );
  }

  if (step === 'title') {
    const items = [
      { label: '시작', action: () => { resetPilotSetup(initialPilot); setStep('pilot'); }, disabled: false },
      { label: '이어하기', action: () => savedPilot && enterGame(), disabled: !savedPilot },
      { label: '파일럿 도감', action: () => setStep('catalog'), disabled: false },
      { label: '설정', action: () => setStep('options'), disabled: false },
    ];
    return (
      <main className="frontier-title" aria-label="슈퍼로봇대전 프론티어 시작 화면">
        <div className="frontier-title-stage">
          <img className="frontier-title-background" src="/ui/title-background.png" alt="슈퍼로봇대전 프론티어 — 더 넓은 우주, 더 많은 인연"/>
          <nav className="frontier-title-menu" aria-label="시작 메뉴" onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const nav = event.currentTarget as HTMLElement;
            const buttons = Array.from(nav.querySelectorAll('button:not(:disabled)')) as HTMLButtonElement[];
            const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
            buttons[next]?.focus();
          }}>
            {items.map((item, index) => (
              <button key={item.label} className={`frontier-title-button ${selectedMenu === index ? 'is-selected' : ''}`} disabled={item.disabled} title={item.disabled ? '저장된 게임이 없습니다' : undefined} onPointerEnter={() => !item.disabled && setSelectedMenu(index)} onFocus={() => setSelectedMenu(index)} onClick={item.action}>
                <span className="title-button-frame" aria-hidden="true"/><span className="title-chevron left" aria-hidden="true">»</span><span className="title-button-label">{item.label}</span><span className="title-chevron right" aria-hidden="true">«</span>
              </button>
            ))}
          </nav>
          <div className="frontier-title-ornament" aria-hidden="true"><i/><span/><i/></div>
        </div>
      </main>
    );
  }

  if (step === 'pilot') {
    return (
      <main className="pilot-setup-screen">
        <div className="setup-backdrop" aria-hidden="true"/>
        <header className="setup-topbar">
          <button className="setup-back-button" onClick={() => setStep('title')} aria-label="시작 화면으로 돌아가기">‹</button>
          <div className="setup-brand">
            <img src="/assets/ui/rwf_logo.png" alt="" />
            <div><b>SUPER ROBOT WARS FRONTIER</b><span>PILOT REGISTRATION SYSTEM</span></div>
          </div>
          <div className="setup-progress" aria-label="등록 진행 단계">
            <div className="setup-step active"><strong>01</strong><span>파일럿 선택 · 정보 수정<small>PILOT SETUP</small></span></div>
            <i>›</i>
            <div className="setup-step"><strong>02</strong><span>기체 선택<small>MACHINE SELECT</small></span></div>
          </div>
          <div className="setup-tagline"><b>MAN + MACHINE</b><span>A BRIGHTER TOMORROW</span></div>
        </header>

        <section className="pilot-setup-columns">
          <aside className="setup-panel pilot-list-panel">
            <div className="setup-panel-heading"><span>»</span><div><h2>파일럿 목록</h2><small>PILOT LIST</small></div><b>{String(pilotTemplates.findIndex((p) => p.id === pilotId) + 1).padStart(2, '0')} / {String(pilotTemplates.length).padStart(2, '0')}</b></div>
            <div className="pilot-list-scroll">
              {pilotTemplates.map((p, index) => (
                <button key={p.id} className={`setup-pilot-row ${pilotId === p.id ? 'selected' : ''}`} onClick={() => resetPilotSetup(p)}>
                  <img src={p.avatar} alt=""/>
                  <span><b>{p.display}</b><small>{p.affiliation}</small></span>
                  <em>{String(index + 1).padStart(2, '0')}</em>
                </button>
              ))}
            </div>
            <div className="list-footer-copy"><b>PILOTS MAKE A DIFFERENCE.</b><span>사람의 의지가, 세계를 움직인다.</span></div>
          </aside>

          <section className="setup-panel pilot-visual-panel">
            <div className="setup-panel-heading"><span>»</span><div><h2>파일럿 정보</h2><small>PILOT INFORMATION</small></div></div>
            <div className="pilot-visual-stage">
              <img className="pilot-portrait-large" src={pilot.avatar} alt=""/>
              <div className="portrait-shade"/>
              <img className="pilot-fullbody-large" src={pilot.fullbody} alt={`${registrationPilot.display} 전신`}/>
              <blockquote>「{pilot.quote}」</blockquote>
              <div className="pilot-profile-copy">
                <h1>{registrationPilot.display}</h1>
                <span className="pilot-title-line">{pilot.title}</span>
                <dl>
                  <div><dt>소속</dt><dd>{pilot.affiliation}</dd></div>
                  <div><dt>계급</dt><dd>{pilot.rank}</dd></div>
                  <div><dt>성향</dt><dd>{pilot.personality}</dd></div>
                </dl>
                <p>{pilot.desc}</p>
              </div>
            </div>
          </section>

          <aside className="setup-panel pilot-edit-panel">
            <div className="setup-panel-heading"><span>»</span><div><h2>정보 수정</h2><small>EDIT INFORMATION</small></div></div>
            <div className="pilot-form">
              <div className="form-row split-name">
                <label><span>성</span><input maxLength={10} value={family} onChange={(event) => setFamily(event.target.value)} placeholder="성"/></label>
                <label><span>이름</span><input maxLength={10} value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="이름"/></label>
              </div>

              <div className="form-row birth-row">
                <span className="form-label">생년월일</span>
                <div className="select-field"><select value={birthYear} onChange={(event) => changeYear(Number(event.target.value))}>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select><small>년</small></div>
                <div className="select-field"><select value={birthMonth} onChange={(event) => changeMonth(Number(event.target.value))}>{Array.from({ length: 12 }, (_, index) => index + 1).map((month) => <option key={month} value={month}>{month}</option>)}</select><small>월</small></div>
                <div className="select-field"><select value={birthDay} onChange={(event) => setBirthDay(Number(event.target.value))}>{Array.from({ length: maxDay }, (_, index) => index + 1).map((day) => <option key={day} value={day}>{day}</option>)}</select><small>일</small></div>
              </div>

              <div className="form-row button-row">
                <span className="form-label">혈액형</span>
                <div className="four-buttons">{bloodTypes.map((item) => <button key={item} className={bloodType === item ? 'selected' : ''} onClick={() => setBloodType(item)}>{item}</button>)}</div>
              </div>

              <div className="form-row type-select-row">
                <span className="form-label">계통 선택</span>
                <div className="type-select-cards">
                  <button className={`type-choice real ${type === '리얼계' ? 'selected' : ''}`} onClick={() => chooseType('리얼계')}>
                    <span className="type-emblem">✦</span><b>리얼계</b><small>REAL TYPE</small><em>고기동 · 사격 · 회피 중심</em>
                  </button>
                  <button className={`type-choice super ${type === '슈퍼계' ? 'selected' : ''}`} onClick={() => chooseType('슈퍼계')}>
                    <span className="type-emblem">◆</span><b>슈퍼계</b><small>SUPER TYPE</small><em>고화력 · 장갑 · 근접 중심</em>
                  </button>
                </div>
              </div>

              <div className="spirit-info-box" data-spirit-signature={spirits.join("|")}>
                <span>i</span>
                <div><b>정신 커맨드 자동 결정</b><p>생년월일 + 혈액형 + 계통 조합에 따라 내부적으로 변경됩니다.</p><small>현재 조합 계산 완료 · 기체 선택 이후 게임 데이터에 반영됩니다.</small></div>
              </div>

              <button className="next-machine-button" disabled={!family.trim() && !firstName.trim()} onClick={() => setStep('unit')}>
                <span>기체 선택으로 이동</span><b>»</b><small>PROCEED TO MACHINE SELECT</small>
              </button>
            </div>
          </aside>
        </section>
        <footer className="setup-bottomline"><span>PILOT CUSTOMIZE / FRONTIER COMMAND</span><b>사람과 기계, 그리고 더 먼 내일로.</b></footer>
      </main>
    );
  }

  return (
    <main className="machine-setup-screen">
      <div className="setup-backdrop machine" aria-hidden="true"/>
      <header className="setup-topbar">
        <button className="setup-back-button" onClick={() => setStep('pilot')} aria-label="파일럿 정보 수정으로 돌아가기">‹</button>
        <div className="setup-brand"><img src="/assets/ui/rwf_logo.png" alt=""/><div><b>SUPER ROBOT WARS FRONTIER</b><span>STARTER MACHINE REGISTRATION</span></div></div>
        <div className="setup-progress">
          <div className="setup-step complete"><strong>01</strong><span>파일럿 선택 · 정보 수정<small>PILOT SETUP</small></span></div><i>›</i>
          <div className="setup-step active"><strong>02</strong><span>기체 선택<small>MACHINE SELECT</small></span></div>
        </div>
        <div className="setup-tagline"><b>{type === '리얼계' ? 'REAL TYPE' : 'SUPER TYPE'}</b><span>SELECT YOUR FIRST MACHINE</span></div>
      </header>

      <section className="machine-layout">
        <aside className="setup-panel selected-pilot-summary">
          <div className="setup-panel-heading"><span>»</span><div><h2>선택 파일럿</h2><small>SELECTED PILOT</small></div></div>
          <div className="summary-visual"><img className="summary-face" src={pilot.avatar} alt=""/><img className="summary-body" src={pilot.fullbody} alt=""/></div>
          <div className="summary-copy"><h2>{registrationPilot.display}</h2><small>{pilot.affiliation} · {pilot.rank}</small><div className={`summary-type ${type === '슈퍼계' ? 'super' : ''}`}>{type}</div><dl><div><dt>생년월일</dt><dd>{birthYear}.{String(birthMonth).padStart(2, '0')}.{String(birthDay).padStart(2, '0')}</dd></div><div><dt>혈액형</dt><dd>{bloodType}형</dd></div></dl></div>
        </aside>

        <section className="setup-panel machine-candidate-panel">
          <div className="setup-panel-heading"><span>»</span><div><h2>기체 선택</h2><small>MACHINE SELECT · {type === '리얼계' ? 'REAL TYPE' : 'SUPER TYPE'}</small></div><b>{String(starterUnits.findIndex((u) => u.id === selectedUnit?.id) + 1).padStart(2, '0')} / {String(starterUnits.length).padStart(2, '0')}</b></div>
          <div className="machine-card-grid">
            {starterUnits.map((unit) => (
              <button key={unit.id} className={`machine-choice-card ${unit.id === selectedUnit?.id ? 'selected' : ''}`} onClick={() => setUnitId(unit.id)}>
                <img src={unit.image} alt=""/><span><small>{unit.role}</small><b>{unit.name}</b><em>HP {unit.hp.toLocaleString()} · EN {unit.en}</em></span>
              </button>
            ))}
          </div>
        </section>

        <aside className="setup-panel machine-detail-panel">
          <div className="setup-panel-heading"><span>»</span><div><h2>기체 정보</h2><small>MACHINE INFORMATION</small></div></div>
          {selectedUnit && <>
            <div className="machine-hero"><img src={selectedUnit.image} alt={selectedUnit.name}/><div><small>{selectedUnit.role}</small><h1>{selectedUnit.name}</h1><span>{type}</span></div></div>
            <div className="machine-spec-grid">
              <div><span>HP</span><b>{selectedUnit.hp.toLocaleString()}</b></div><div><span>EN</span><b>{selectedUnit.en}</b></div>
              <div><span>기동성</span><b>{selectedUnit.mobility}</b></div><div><span>장갑</span><b>{selectedUnit.armor}</b></div>
              <div><span>조준</span><b>{selectedUnit.aim}</b></div><div><span>이동</span><b>{selectedUnit.move}</b></div>
            </div>
            <div className="machine-abilities"><small>SPECIAL SYSTEM</small>{selectedUnit.abilities.map((ability) => <span key={ability}>{ability}</span>)}</div>
            <button className="registration-complete" onClick={() => completeRegistration(registrationPilot, selectedUnit.id)}><span>등록 완료 · 홈으로</span><b>»</b><small>CONFIRM PILOT & MACHINE</small></button>
          </>}
        </aside>
      </section>
      <footer className="setup-bottomline"><span>STARTER MACHINE / FRONTIER COMMAND</span><b>첫 기체는 전장의 시작점이다.</b></footer>
    </main>
  );
}
