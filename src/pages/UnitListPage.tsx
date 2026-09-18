import { unitStats } from '../data/calculations';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

export function UnitListPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const boardUnit = useGameStore((s) => s.boardUnit);
  const setPage = useGameStore((s) => s.setPage);
  const units = [...allUnitTemplates, ...catalog.customUnits].filter((unit) => !unit.enemyOnly && pilot.ownedUnits.includes(unit.id));

  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>UNIT LIST / OWNED MACHINE DATABASE</small><h1>기체 목록</h1></div><div className="resource-badge">OWNED <b>{units.length}</b></div></div>
      <div className="catalog-grid-react">
        {units.map((unit) => {
          const stats = unitStats(pilot, unit);
          return (
            <section className={`panel catalog-card-react ${pilot.unitId === unit.id ? 'selected' : ''}`} key={unit.id}>
              <div className="catalog-art-react"><img src={unit.image} alt="" /></div>
              <small>{unit.role} · COST {unit.cost}</small>
              <h2>{unit.name}</h2>
              <p>{unit.size} · {unit.types.join(' / ')}</p>
              <div className="catalog-statline"><span>HP <b>{stats.hp.toLocaleString()}</b></span><span>EN <b>{stats.en}</b></span><span>MOVE <b>{stats.move}</b></span><span>ARMOR <b>{stats.armor}</b></span></div>
              <div className="catalog-actions-react">
                <button className={pilot.unitId === unit.id ? 'good' : ''} onClick={() => boardUnit(unit.id)}>{pilot.unitId === unit.id ? '현재 탑승기체' : '탑승'}</button>
                <button onClick={() => setPage('hangar')}>기체 개발</button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
