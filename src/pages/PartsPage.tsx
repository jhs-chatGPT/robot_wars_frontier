import { useState } from 'react';
import { partTemplates } from '../data/parts';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

export function PartsPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const togglePart = useGameStore((s) => s.togglePart);
  const customUnits = useGameStore((s) => s.catalog.customUnits);
  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const inventory = partTemplates.filter((part) => pilot.partsInventory.includes(part.id));
  const ownedUnits = [...allUnitTemplates, ...customUnits].filter((unit) => !unit.enemyOnly && pilot.ownedUnits.includes(unit.id));
  const activePart = partTemplates.find((part) => part.id === activePartId) ?? null;

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>OPTION PARTS / INVENTORY</small><h1>강화파츠</h1></div><div className="resource-badge">OWNED <b>{inventory.length}</b></div></div>
      <div className="parts-grid">{inventory.map((part) => {
        const equippedUnits = ownedUnits.filter((unit) => (pilot.equippedParts[unit.id] ?? []).includes(part.id));
        return <section className="panel part-card" key={part.id}><div><small>OPTION PART</small><h2>{part.name}</h2><p>{part.desc}</p>{equippedUnits.length > 0 && <span className="equipped-mark">장착중 · {equippedUnits.map((u) => u.name).join(', ')}</span>}</div><button onClick={() => setActivePartId(part.id)}>장착 / 해제</button></section>;
      })}</div>
      {inventory.length === 0 && <div className="placeholder-box">보유 중인 강화파츠가 없습니다.</div>}
      {message && <div className="inline-message floating-message">{message}</div>}
      {activePart && <div className="modal-backdrop" onClick={() => setActivePartId(null)}><div className="parts-modal" onClick={(e) => e.stopPropagation()}><header><div><small>SELECT UNIT</small><h2>{activePart.name}</h2><p>{activePart.desc}</p></div><button onClick={() => setActivePartId(null)}>×</button></header><div className="parts-unit-list">{ownedUnits.map((unit) => { const eq = pilot.equippedParts[unit.id] ?? []; const equipped = eq.includes(activePart.id); return <button key={unit.id} className={equipped ? 'equipped' : ''} onClick={() => { const result = togglePart(unit.id, activePart.id); setMessage(result === 'full' ? `${unit.name}: 슬롯이 가득 찼습니다.` : result === 'equipped' ? `${unit.name}에 장착했습니다.` : result === 'removed' ? `${unit.name}에서 해제했습니다.` : '장착할 수 없습니다.'); }}><img src={unit.image} alt=""/><div><b>{unit.name}</b><span>{eq.length} / {unit.slots} SLOT</span><small>{equipped ? '현재 장착중 · 클릭하면 해제' : '클릭해서 장착'}</small></div></button>; })}</div></div></div>}
    </div>
  );
}
