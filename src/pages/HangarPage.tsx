import { useMemo, useState } from 'react';
import { getUpgrades, unitStats, upgradeCost } from '../data/calculations';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { UpgradeKey } from '../types/game';

const upgradeLabels: Record<UpgradeKey, string> = { hp: 'HP', en: 'EN', move: '이동', mobility: '운동성', armor: '장갑', aim: '조준', weapon: '무기' };

function Gauge({ level }: { level: number }) {
  return <div className="upgrade-gauge">{Array.from({ length: 10 }, (_, i) => <i key={i} className={i < level ? 'filled' : ''} />)}</div>;
}

export function HangarPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const boardUnit = useGameStore((s) => s.boardUnit);
  const upgradeUnit = useGameStore((s) => s.upgradeUnit);
  const customUnits = useGameStore((s) => s.catalog.customUnits);
  const [selectedId, setSelectedId] = useState(pilot.unitId);
  const [message, setMessage] = useState('');
  const owned = useMemo(() => [...allUnitTemplates, ...customUnits].filter((u) => !u.enemyOnly && pilot.ownedUnits.includes(u.id)), [pilot.ownedUnits, customUnits]);
  const unit = owned.find((u) => u.id === selectedId) ?? owned[0];
  if (!unit) return <div className="placeholder">보유 기체가 없습니다.</div>;
  const up = getUpgrades(pilot, unit.id);
  const stats = unitStats(pilot, unit);
  const equippedCount = (pilot.equippedParts[unit.id] ?? []).length;

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>UNIT DEVELOP / HANGAR</small><h1>기체 개발</h1></div><div className="resource-badge">CREDIT <b>{pilot.credit.toLocaleString()}</b></div></div>
      <div className="hangar-unit-tabs">{owned.map((u) => <button key={u.id} className={u.id === unit.id ? 'active' : ''} onClick={() => setSelectedId(u.id)}><b>{u.name}</b><small>{u.role}{pilot.unitId === u.id ? ' · 탑승중' : ''}</small></button>)}</div>
      <div className="hangar-react-grid">
        <section className="panel hangar-art-react"><header><b>SELECTED UNIT</b><span>{unit.size} · {unit.types.join('/')}</span></header><img src={unit.image} alt=""/><h2>{unit.name}</h2><p>{unit.role}</p><button className="wide-action" onClick={() => boardUnit(unit.id)}>{pilot.unitId === unit.id ? '현재 탑승기체' : '이 기체에 탑승'}</button><div className="slot-line">강화파츠 <b>{equippedCount} / {unit.slots}</b></div></section>
        <section className="panel hangar-spec-react"><header><b>UNIT SPECIFICATIONS</b><span>10-STEP DEVELOPMENT</span></header><div className="spec-cards"><div><small>HP</small><b>{stats.hp.toLocaleString()}</b></div><div><small>EN</small><b>{stats.en}</b></div><div><small>MOVE</small><b>{stats.move}</b></div><div><small>MOBILITY</small><b>{stats.mobility}</b></div><div><small>ARMOR</small><b>{stats.armor}</b></div><div><small>AIM</small><b>{stats.aim}</b></div></div>
          <div className="upgrade-list">{(Object.keys(upgradeLabels) as UpgradeKey[]).map((key) => { const level = up[key]; const cost = upgradeCost(level, key); return <div className="upgrade-row" key={key}><div><b>{upgradeLabels[key]}</b><span>{level} / 10</span></div><Gauge level={level}/><button disabled={level >= 10 || pilot.credit < cost} onClick={() => { const ok = upgradeUnit(unit.id, key); setMessage(ok ? `${upgradeLabels[key]} ${level + 1}단 개조 완료` : '크레딧이 부족하거나 최대 개조입니다.'); }}>{level >= 10 ? 'MAX' : `${cost.toLocaleString()} C`}</button></div>; })}</div>
          {message && <div className="inline-message">{message}</div>}
        </section>
      </div>
    </div>
  );
}
