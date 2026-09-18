import type { CSSProperties } from 'react';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

export function UnitListPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const setPage = useGameStore((s) => s.setPage);
  const units = [...allUnitTemplates, ...catalog.customUnits].filter((unit) => !unit.enemyOnly && pilot.ownedUnits.includes(unit.id));

  const openDetail = (unitId: string) => {
    sessionStorage.setItem('rwf-selected-unit', unitId);
    setPage('hangar');
  };

  return (
    <div className="legacy-screen-scroll">
      <div className="legacy-screen-head"><div><small>UNIT LIST</small><h1>기체 목록</h1></div></div>
      <div className="legacy-unit-grid">
        {units.map((unit) => (
          <section className="legacy-panel legacy-unit-card" key={unit.id}>
            <div className="legacy-unit-stage legacy-unit-list-art" style={{ '--unit': `url(${unit.image})` } as CSSProperties}><img src={unit.image} alt={unit.name}/></div>
            <h2>{unit.name}</h2>
            <div className="legacy-muted">{unit.role || '-'} · {unit.size} · {unit.types.join(' / ')} · COST {unit.cost}</div>
            <button className="legacy-detail-btn" onClick={() => openDetail(unit.id)}>상세 보기</button>
          </section>
        ))}
      </div>
    </div>
  );
}
