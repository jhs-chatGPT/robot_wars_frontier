import { useState } from 'react';
import { allUnitTemplates } from '../data/units';
import { weaponTemplates } from '../data/weapons';
import { useGameStore } from '../store/gameStore';

export function EncyclopediaPage() {
  const catalog = useGameStore((s) => s.catalog);
  const [selected, setSelected] = useState<string | null>(null);
  const units = [...allUnitTemplates, ...catalog.customUnits].filter((unit) => !unit.enemyOnly);
  const weapons = [...weaponTemplates, ...catalog.customWeapons];
  const unit = units.find((item) => item.id === selected) ?? units[0];
  const unitWeapons = weapons.filter((weapon) => weapon.unitId === unit?.id).sort((a, b) => a.power - b.power);

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>ENCYCLOPEDIA / UNIT ARCHIVE</small><h1>도감</h1></div><div className="resource-badge">UNITS <b>{units.length}</b></div></div>
      <div className="encyclopedia-react">
        <div className="encyclopedia-list-react">{units.map((item) => <button key={item.id} className={item.id === unit?.id ? 'active' : ''} onClick={() => setSelected(item.id)}><img src={item.image} alt=""/><span><b>{item.name}</b><small>{item.role}</small></span></button>)}</div>
        {unit && <section className="panel encyclopedia-detail-react"><div className="encyclopedia-hero-react"><img src={unit.image} alt=""/><div><small>{unit.role}</small><h1>{unit.name}</h1><p>{unit.size} · COST {unit.cost} · {unit.types.join(' / ')}</p><div className="chip-row">{unit.abilities.map((ability) => <span key={ability}>{ability}</span>)}</div></div></div><div className="catalog-statline large"><span>HP <b>{unit.hp.toLocaleString()}</b></span><span>EN <b>{unit.en}</b></span><span>MOVE <b>{unit.move}</b></span><span>MOB <b>{unit.mobility}</b></span><span>ARMOR <b>{unit.armor}</b></span><span>AIM <b>{unit.aim}</b></span></div><h3>무장 데이터</h3><div className="encyclopedia-weapons-react">{unitWeapons.map((weapon) => <div key={weapon.id}><span><b>{weapon.name}</b><small>{weapon.type} · RANGE {weapon.minRange}~{weapon.maxRange}</small></span><strong>{weapon.power}</strong></div>)}</div></section>}
      </div>
    </div>
  );
}
