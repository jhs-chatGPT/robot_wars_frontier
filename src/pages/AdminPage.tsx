import { useRef, useState } from 'react';
import { allUnitTemplates } from '../data/units';
import { weaponTemplates } from '../data/weapons';
import { useGameStore } from '../store/gameStore';
import type { ScenarioTemplate, UnitTemplate, WeaponTemplate, WeaponType } from '../types/game';

type Tab = 'unit' | 'weapon' | 'scenario' | 'pilot' | 'data';

export function AdminPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const addCustomUnit = useGameStore((s) => s.addCustomUnit);
  const addCustomWeapon = useGameStore((s) => s.addCustomWeapon);
  const addCustomScenario = useGameStore((s) => s.addCustomScenario);
  const grantUnit = useGameStore((s) => s.grantUnit);
  const addPilotSkill = useGameStore((s) => s.addPilotSkill);
  const importState = useGameStore((s) => s.importState);
  const [tab, setTab] = useState<Tab>('unit');
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [unit, setUnit] = useState({ name: '', hp: 6000, en: 200, move: 6, mobility: 110, armor: 1500, aim: 140, size: 'M', types: '공중,육지,우주', abilities: '', slots: 2, cost: 300, image: '', role: '사용자 등록 기체' });
  const [weapon, setWeapon] = useState({ unitId: 'u1', name: '', type: '원거리' as WeaponType, power: 3000, minRange: 1, maxRange: 4, accuracy: 10, crit: 10, enCost: 10, ammo: 0 });
  const [scenario, setScenario] = useState({ title: '', desc: '', objective: '적 부대를 전멸시켜라.', terrain: 'land' as ScenarioTemplate['terrain'], enemyUnitId: 'e_g1', enemyCount: 3, enemyLevel: 10, turnLimit: 16, rewardCredit: 50000, rewardExp: 200 });
  const [skill, setSkill] = useState('');
  const units = [...allUnitTemplates, ...catalog.customUnits];
  const weapons = [...weaponTemplates, ...catalog.customWeapons];

  const submitUnit = () => {
    if (!unit.name.trim()) return setMessage('기체명을 입력하세요.');
    const next: UnitTemplate = {
      id: `cu-${Date.now().toString(36)}`, name: unit.name.trim(), role: unit.role, image: unit.image || '/assets/units/unit_1.webp', hp: unit.hp, en: unit.en,
      move: unit.move, mobility: unit.mobility, armor: unit.armor, aim: unit.aim, size: unit.size, slots: unit.slots, cost: unit.cost,
      terrain: { air: 'A', land: 'A', water: 'B', space: 'A' }, types: unit.types.split(',').map((x) => x.trim()).filter(Boolean), abilities: unit.abilities.split(',').map((x) => x.trim()).filter(Boolean),
    };
    addCustomUnit(next); setMessage(`기체 등록 완료 · ${next.name}`); setUnit({ ...unit, name: '' });
  };

  const submitWeapon = () => {
    if (!weapon.name.trim()) return setMessage('무기명을 입력하세요.');
    const next: WeaponTemplate = { id: `cw-${Date.now().toString(36)}`, ...weapon, name: weapon.name.trim(), terrain: { air: 'A', land: 'A', water: 'B', space: 'A' } };
    addCustomWeapon(next); setMessage(`무기 등록 완료 · ${next.name}`); setWeapon({ ...weapon, name: '' });
  };

  const submitScenario = () => {
    if (!scenario.title.trim()) return setMessage('시나리오 제목을 입력하세요.');
    const formation = Array.from({ length: scenario.enemyCount }, (_, index) => ({ rank: 'general' as const, unitId: scenario.enemyUnitId, profileIndex: index, wave: Math.floor(index / 3) + 1, label: index > 0 && index % 3 === 0 ? '증원 도착' : undefined }));
    const next: ScenarioTemplate = { id: `cs-${Date.now().toString(36)}`, title: scenario.title.trim(), desc: scenario.desc, objective: scenario.objective, terrain: scenario.terrain, enemyCount: scenario.enemyCount, enemyLevel: scenario.enemyLevel, rewardCredit: scenario.rewardCredit, rewardExp: scenario.rewardExp, turnLimit: scenario.turnLimit, enemyFormation: formation };
    addCustomScenario(next); setMessage(`시나리오 등록 완료 · ${next.title}`); setScenario({ ...scenario, title: '', desc: '' });
  };

  const exportData = () => {
    const state = useGameStore.getState();
    const payload = { pilot: state.pilot, pilotRoster: state.pilotRoster, pvpResults: state.pvpResults, tournaments: state.tournaments, catalog: state.catalog, settings: state.settings };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'robot_wars_frontier_react_v0.9_save.json'; link.click(); URL.revokeObjectURL(link.href);
  };

  const importFile = async (file?: File) => {
    if (!file) return;
    try { const parsed = JSON.parse(await file.text()); setMessage(importState(parsed) ? '저장 데이터를 복원했습니다.' : '복원할 파일럿 데이터가 없습니다.'); }
    catch { setMessage('올바른 JSON 저장 파일이 아닙니다.'); }
  };

  return <div className="screen-scroll admin-screen-react">
    <div className="screen-heading"><div><small>DATA CONTROL / ADMIN</small><h1>관리자 패널</h1></div><div className="resource-badge">CUSTOM <b>{catalog.customUnits.length + catalog.customWeapons.length + catalog.customScenarios.length}</b></div></div>
    <section className="panel admin-shell-react">
      <div className="admin-tabs-react">{(['unit','weapon','scenario','pilot','data'] as Tab[]).map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{{ unit:'기체', weapon:'무기', scenario:'시나리오', pilot:'파일럿 능력', data:'데이터' }[item]}</button>)}</div>
      {message && <div className="admin-message">{message}</div>}
      <div className="admin-pane-react">
        {tab === 'unit' && <><h2>기체 추가</h2><div className="admin-form-grid">
          <label>기체명<input value={unit.name} onChange={(e) => setUnit({ ...unit, name: e.target.value })}/></label><label>역할<input value={unit.role} onChange={(e) => setUnit({ ...unit, role: e.target.value })}/></label><label>HP<input type="number" value={unit.hp} onChange={(e) => setUnit({ ...unit, hp: +e.target.value })}/></label><label>EN<input type="number" value={unit.en} onChange={(e) => setUnit({ ...unit, en: +e.target.value })}/></label><label>이동<input type="number" value={unit.move} onChange={(e) => setUnit({ ...unit, move: +e.target.value })}/></label><label>운동성<input type="number" value={unit.mobility} onChange={(e) => setUnit({ ...unit, mobility: +e.target.value })}/></label><label>장갑<input type="number" value={unit.armor} onChange={(e) => setUnit({ ...unit, armor: +e.target.value })}/></label><label>조준<input type="number" value={unit.aim} onChange={(e) => setUnit({ ...unit, aim: +e.target.value })}/></label><label>사이즈<select value={unit.size} onChange={(e) => setUnit({ ...unit, size: e.target.value })}><option>S</option><option>M</option><option>L</option><option>LL</option></select></label><label>슬롯<input type="number" value={unit.slots} onChange={(e) => setUnit({ ...unit, slots: +e.target.value })}/></label><label>코스트<input type="number" value={unit.cost} onChange={(e) => setUnit({ ...unit, cost: +e.target.value })}/></label><label>타입(쉼표)<input value={unit.types} onChange={(e) => setUnit({ ...unit, types: e.target.value })}/></label><label>특수능력(쉼표)<input value={unit.abilities} onChange={(e) => setUnit({ ...unit, abilities: e.target.value })}/></label><label className="span2">이미지 URL<input value={unit.image} onChange={(e) => setUnit({ ...unit, image: e.target.value })}/></label>
        </div><button className="primary-action admin-submit" onClick={submitUnit}>기체 등록</button><h3>등록 기체</h3><div className="admin-list-react">{units.filter((item) => !item.enemyOnly).map((item) => <div key={item.id}><span><b>{item.name}</b><small>HP {item.hp} · EN {item.en} · Cost {item.cost}</small></span><button disabled={pilot.ownedUnits.includes(item.id)} onClick={() => grantUnit(item.id)}>{pilot.ownedUnits.includes(item.id) ? '보유중' : '현재 유저에게 지급'}</button></div>)}</div></>}
        {tab === 'weapon' && <><h2>무기 추가</h2><div className="admin-form-grid"><label>기체<select value={weapon.unitId} onChange={(e) => setWeapon({ ...weapon, unitId: e.target.value })}>{units.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>무기명<input value={weapon.name} onChange={(e) => setWeapon({ ...weapon, name: e.target.value })}/></label><label>타입<select value={weapon.type} onChange={(e) => setWeapon({ ...weapon, type: e.target.value as WeaponType })}><option>근접</option><option>원거리</option><option>특수</option></select></label><label>공격력<input type="number" value={weapon.power} onChange={(e) => setWeapon({ ...weapon, power: +e.target.value })}/></label><label>최소 사거리<input type="number" value={weapon.minRange} onChange={(e) => setWeapon({ ...weapon, minRange: +e.target.value })}/></label><label>최대 사거리<input type="number" value={weapon.maxRange} onChange={(e) => setWeapon({ ...weapon, maxRange: +e.target.value })}/></label><label>명중<input type="number" value={weapon.accuracy} onChange={(e) => setWeapon({ ...weapon, accuracy: +e.target.value })}/></label><label>크리티컬<input type="number" value={weapon.crit} onChange={(e) => setWeapon({ ...weapon, crit: +e.target.value })}/></label><label>EN 소모<input type="number" value={weapon.enCost} onChange={(e) => setWeapon({ ...weapon, enCost: +e.target.value })}/></label><label>탄수<input type="number" value={weapon.ammo} onChange={(e) => setWeapon({ ...weapon, ammo: +e.target.value })}/></label></div><button className="primary-action admin-submit" onClick={submitWeapon}>무기 등록</button><h3>추가 무기</h3><div className="admin-list-react">{weapons.slice(-12).map((item) => <div key={item.id}><span><b>{item.name}</b><small>{units.find((unitItem) => unitItem.id === item.unitId)?.name} · {item.power} · {item.minRange}-{item.maxRange}</small></span></div>)}</div></>}
        {tab === 'scenario' && <><h2>시나리오 추가</h2><div className="admin-form-grid"><label>제목<input value={scenario.title} onChange={(e) => setScenario({ ...scenario, title: e.target.value })}/></label><label className="span2">설명<input value={scenario.desc} onChange={(e) => setScenario({ ...scenario, desc: e.target.value })}/></label><label className="span2">목표<input value={scenario.objective} onChange={(e) => setScenario({ ...scenario, objective: e.target.value })}/></label><label>지형<select value={scenario.terrain} onChange={(e) => setScenario({ ...scenario, terrain: e.target.value as ScenarioTemplate['terrain'] })}><option value="land">지상</option><option value="air">공중</option><option value="water">수중</option><option value="space">우주</option></select></label><label>적 기체<select value={scenario.enemyUnitId} onChange={(e) => setScenario({ ...scenario, enemyUnitId: e.target.value })}>{units.filter((item) => item.enemyOnly).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>적 수<input type="number" value={scenario.enemyCount} onChange={(e) => setScenario({ ...scenario, enemyCount: +e.target.value })}/></label><label>적 레벨<input type="number" value={scenario.enemyLevel} onChange={(e) => setScenario({ ...scenario, enemyLevel: +e.target.value })}/></label><label>라운드 제한<input type="number" value={scenario.turnLimit} onChange={(e) => setScenario({ ...scenario, turnLimit: +e.target.value })}/></label><label>보상 Credit<input type="number" value={scenario.rewardCredit} onChange={(e) => setScenario({ ...scenario, rewardCredit: +e.target.value })}/></label><label>보상 EXP<input type="number" value={scenario.rewardExp} onChange={(e) => setScenario({ ...scenario, rewardExp: +e.target.value })}/></label></div><button className="primary-action admin-submit" onClick={submitScenario}>시나리오 등록</button></>}
        {tab === 'pilot' && <><h2>현재 파일럿 특수능력</h2><div className="pilot-skill-admin"><div className="chip-row">{pilot.special.map((item) => <span key={item}>{item}</span>)}</div><label>새 특수능력<input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="예: 뉴타입 Lv2" /></label><button className="primary-action" onClick={() => { addPilotSkill(skill); setSkill(''); setMessage('특수능력을 추가했습니다.'); }}>특수능력 추가</button></div></>}
        {tab === 'data' && <><h2>저장 데이터</h2><p>현재 파일럿/로스터, 전적, 대회, 사용자 등록 데이터를 JSON으로 백업하고 복원합니다. 이전 P15.6.23 JSON 백업도 가져올 수 있습니다.</p><div className="data-actions-react"><button onClick={exportData}>JSON 백업 다운로드</button><button onClick={() => fileRef.current?.click()}>JSON 복원</button><input ref={fileRef} hidden type="file" accept="application/json" onChange={(e) => importFile(e.target.files?.[0])}/></div></>}
      </div>
    </section>
  </div>;
}
