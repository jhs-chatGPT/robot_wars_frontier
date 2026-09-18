import { currentEnemy, spiritCost, usableWeapons } from '../data/battleEngine';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { weaponTemplates } from '../data/weapons';
import { useGameStore } from '../store/gameStore';

function Bar({ value, max, kind }: { value: number; max: number; kind: 'hp' | 'en' }) {
  const pct = max ? Math.max(0, Math.min(100, value / max * 100)) : 0;
  return <div className={`combat-bar ${kind}`}><i style={{ width: `${pct}%` }} /></div>;
}

export function BattlePage() {
  const battle = useGameStore((s) => s.battle);
  const pilot = useGameStore((s) => s.pilot)!;
  const catalog = useGameStore((s) => s.catalog);
  const battleMove = useGameStore((s) => s.battleMove);
  const battleAttack = useGameStore((s) => s.battleAttack);
  const battleGuard = useGameStore((s) => s.battleGuard);
  const battleAuto = useGameStore((s) => s.battleAuto);
  const useSpirit = useGameStore((s) => s.useSpirit);
  const leaveBattle = useGameStore((s) => s.leaveBattle);

  if (!battle) return <div className="screen-scroll"><div className="panel empty-panel">진행 중인 전투가 없습니다.</div></div>;
  const scenario = [...scenarios, ...catalog.customScenarios].find((item) => item.id === battle.scenarioId);
  const enemy = currentEnemy(battle);
  const units = [...allUnitTemplates, ...catalog.customUnits];
  const weapons = [...weaponTemplates, ...catalog.customWeapons];
  const playerUnit = units.find((unit) => unit.id === battle.player.unitId);
  const enemyUnit = enemy ? units.find((unit) => unit.id === enemy.unitId) : null;
  const usable = usableWeapons(battle.player, battle.distance, catalog.customWeapons);
  const usableIds = new Set(usable.map((weapon) => weapon.id));
  const playerWeapons = weapons.filter((weapon) => weapon.unitId === battle.player.unitId);

  return (
    <div className="battle-screen-react">
      <div className="battle-head-react">
        <div><small>COMBAT LOG / TEXT BATTLE</small><h1>{scenario?.title ?? '전술전투'}</h1></div>
        <div className="battle-round">WAVE {battle.activeWave}/{battle.maxWave} · ROUND {battle.round} · DIST <b>{battle.distance}</b></div>
      </div>
      <div className="battle-main-react">
        <div className="combat-column">
          <section className="combatant-react player-side">
            <div className="combatant-art"><img src={playerUnit?.image} alt="" /></div>
            <div className="combatant-data"><small>PLAYER UNIT</small><h2>{battle.player.name}</h2><h3>{playerUnit?.name}</h3><b>HP {battle.player.hp.toLocaleString()} / {battle.player.maxHp.toLocaleString()}</b><Bar value={battle.player.hp} max={battle.player.maxHp} kind="hp" /><b>EN {battle.player.en} / {battle.player.maxEn}</b><Bar value={battle.player.en} max={battle.player.maxEn} kind="en" /><p>기력 {battle.player.morale} · 이동 {battle.player.move}</p></div>
          </section>
          {enemy && <section className="combatant-react enemy-side-react">
            <div className="combatant-art"><img src={enemyUnit?.image} alt="" /></div>
            <div className="combatant-data"><small>{enemy.isBoss ? 'BOSS' : enemy.pilot.enemyRankLabel ?? 'ENEMY'}</small><h2>{enemy.name}</h2><h3>{enemyUnit?.name}</h3><b>HP {enemy.hp.toLocaleString()} / {enemy.maxHp.toLocaleString()}</b><Bar value={enemy.hp} max={enemy.maxHp} kind="hp" /><b>EN {enemy.en} / {enemy.maxEn}</b><Bar value={enemy.en} max={enemy.maxEn} kind="en" /><p>{enemy.pilot.enemyRole} · AI {enemy.pilot.battleAI}</p></div>
          </section>}
          <section className="battle-controls-react panel">
            <header><b>TACTICAL CONTROL</b><span>거리 1~16 · 현재 {battle.distance}</span></header>
            <div className="maneuver-actions"><button disabled={battle.finished || battle.distance <= 1} onClick={() => battleMove(-Math.min(3, battle.player.move))}>접근 ◀</button><button disabled={battle.finished} onClick={battleGuard}>방어</button><button disabled={battle.finished} onClick={battleAuto}>자동 행동</button><button disabled={battle.finished || battle.distance >= 16} onClick={() => battleMove(Math.min(3, battle.player.move))}>이탈 ▶</button></div>
            <div className="spirit-actions">{pilot.spirits.map((spirit) => <button key={spirit} disabled={battle.finished || pilot.sp < (spiritCost[spirit] ?? 999)} onClick={() => useSpirit(spirit)}>{spirit}<small>{spiritCost[spirit] ?? '-'} SP</small></button>)}</div>
            <div className="weapon-list-react">{playerWeapons.map((weapon) => {
              const ammoState = battle.player.weapons.find((state) => state.id === weapon.id);
              const enabled = usableIds.has(weapon.id) && !battle.finished;
              return <button key={weapon.id} disabled={!enabled} onClick={() => battleAttack(weapon.id)}><span><b>{weapon.name}</b><small>{weapon.type} · RANGE {weapon.minRange}-{weapon.maxRange + battle.player.rangeBonus}</small></span><span><strong>{weapon.power}</strong><small>{weapon.enCost ? `EN ${Math.max(0, Math.round(weapon.enCost * (1 + battle.player.enCostPct)))}` : weapon.ammo ? `AMMO ${ammoState?.ammoLeft ?? 0}/${weapon.ammo}` : 'FREE'}</small></span></button>;
            })}</div>
          </section>
          {battle.finished && <section className={`battle-result-react ${battle.result === 'win' ? 'win' : 'lose'}`}><small>{battle.result === 'win' ? 'MISSION COMPLETE' : 'MISSION FAILED'}</small><h2>{battle.result === 'win' ? '작전 성공' : '작전 실패'}</h2><button onClick={leaveBattle}>작전 화면으로 돌아가기</button></section>}
        </div>
        <aside className="combat-log-panel"><header><b>COMBAT LOG</b><span>{battle.log.length} LINES</span></header><pre>{battle.log.slice(-100).join('\n')}</pre></aside>
      </div>
    </div>
  );
}
