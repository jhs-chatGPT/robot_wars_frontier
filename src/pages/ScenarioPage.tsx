import { useMemo, useState } from 'react';
import { scenarios } from '../data/scenarios';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';

const terrainName = { air: '공중', land: '지상', water: '수중', space: '우주' } as const;

function danger(level: number) {
  if (level >= 50) return 'EXTREME';
  if (level >= 30) return 'HIGH';
  if (level >= 16) return 'ELEVATED';
  return 'NORMAL';
}

function recommend(terrain: keyof typeof terrainName) {
  if (terrain === 'space') return '우주 적응 A 이상 · 장거리 무장 권장';
  if (terrain === 'water') return '수중 적응 A 이상 · 이동력 보강 권장';
  if (terrain === 'air') return '공중 적응 A 이상 · 고기동 기체 권장';
  return '지상 적응 A 이상 · 균형 편성 권장';
}

export function ScenarioPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const customScenarios = useGameStore((s) => s.catalog.customScenarios);
  const customUnits = useGameStore((s) => s.catalog.customUnits);
  const startScenario = useGameStore((s) => s.startScenario);
  const list = [...scenarios, ...customScenarios];
  const units = [...allUnitTemplates, ...customUnits];
  const unlockedCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < list.length - 1; i += 1) {
      if (pilot.scenarioClears.includes(list[i].id)) count = i + 2;
      else break;
    }
    return Math.min(list.length, count);
  }, [list, pilot.scenarioClears]);
  const visible = list.slice(0, unlockedCount);
  const next = visible.find((s) => !pilot.scenarioClears.includes(s.id)) ?? visible[visible.length - 1];
  const [selectedId, setSelectedId] = useState(next?.id ?? visible[0]?.id ?? '');
  const selected = visible.find((s) => s.id === selectedId) ?? next ?? visible[0];

  if (!selected) return <div className="sortie-ref sortie-empty"><h1>작전 출격</h1><p>현재 대기 중인 작전은 없습니다.</p></div>;

  const globalIndex = Math.max(0, list.findIndex((s) => s.id === selected.id));
  const enemyUnits = selected.enemyFormation.map((row) => units.find((u) => u.id === row.unitId)).filter(Boolean);
  const enemy = enemyUnits[0];
  const enemyNames = [...new Set(enemyUnits.map((u) => u!.name))].join(' / ') || '미확인 기체';
  const waves = Math.max(1, ...selected.enemyFormation.map((row) => row.wave || 1));
  const rankSet = [...new Set(selected.enemyFormation.map((row) => row.rank === 'commander' ? '지휘관' : row.rank === 'elite' ? '엘리트' : '일반'))].join(' / ');
  const heroBg = selected.terrain === 'space' ? '/assets/backgrounds/bg-space.webp' : '/assets/sortie/hangar.jpg';
  const operatorLine = pilot.scenarioClears.includes(selected.id)
    ? '이미 클리어한 작전입니다. 전투 기록 재검증을 위해 재출격할 수 있습니다.'
    : `작전 데이터 확인 완료. ${selected.title} 출격 준비를 시작합니다.`;

  return (
    <div className="sortie-ref">
      <header className="sortie-headline">
        <div><div className="sortie-headline-main"><h1>작전 출격 <span>SORTIE</span></h1></div><p>출격할 작전을 선택하고, 전장으로 나아가십시오.</p></div>
        <div className="sortie-headline-tag">HUMANITY STILL DREAMS<br/>TO A BRIGHTER TOMORROW</div>
      </header>

      <div className="sortie-stage">
        <aside className="sortie-list" aria-label="출격 가능한 작전">
          {visible.map((scenario) => {
            const idx = list.findIndex((x) => x.id === scenario.id);
            const active = scenario.id === selected.id;
            const clear = pilot.scenarioClears.includes(scenario.id);
            const bg = scenario.terrain === 'space' ? '/assets/backgrounds/bg-space.webp' : '/assets/sortie/hangar.jpg';
            return <button key={scenario.id} className={`sortie-mission ${active ? 'active' : ''} ${clear ? 'clear' : ''}`} aria-pressed={active} style={{ backgroundImage: `url(${bg})` }} onClick={() => setSelectedId(scenario.id)}><small>MAIN {String(idx + 1).padStart(2, '0')}</small><b>{scenario.title}</b><em>{terrainName[scenario.terrain]} 작전</em><span className="new">{clear ? 'CLEAR' : active ? 'NEW' : ''}</span></button>;
          })}
        </aside>

        <section className="sortie-detail" aria-label="선택한 작전 상세" aria-live="polite">
          <div className="sortie-hero" style={{ backgroundImage: `url(${heroBg})` }}>
            {enemy?.image && <img className="sortie-enemy-art" src={enemy.image} alt={enemy.name}/>} 
            <div className="sortie-hero-copy"><small>MAIN OPERATION {String(globalIndex + 1).padStart(2, '0')}</small><h2>{selected.title}</h2><div className="sub">{terrainName[selected.terrain]} 전구 작전</div></div>
            <div className="sortie-desc">{selected.desc}</div>
          </div>
          <div className="sortie-info-grid">
            <div className="sortie-info"><div className="ico">✦</div><div><small>작전 목표 / OBJECTIVE</small><b>{selected.objective}<small>제한 {selected.turnLimit} TURNS</small></b></div></div>
            <div className="sortie-info"><div className="ico">△</div><div><small>작전 지역 / TERRAIN</small><b>{terrainName[selected.terrain]} 전장</b></div></div>
            <div className="sortie-info"><div className="ico">♞</div><div><small>예상 적 전력 / ENEMY ESTIMATE</small><b><strong>{danger(selected.enemyLevel)}</strong><br/>{enemyNames} · {selected.enemyCount}기 · Lv.{selected.enemyLevel}<br/><small>{rankSet} · {waves} WAVE</small></b></div></div>
            <div className="sortie-info"><div className="ico">➤</div><div><small>권장 편성 / RECOMMEND</small><b>{recommend(selected.terrain)}</b></div></div>
          </div>
          <div className="sortie-reward"><div className="reward-title"><b>클리어 보상</b><small>REWARD</small></div><span><i>●</i> {selected.rewardCredit.toLocaleString()} C</span><span>EXP {selected.rewardExp}</span><span>PP {Math.max(15, Math.round(selected.rewardExp / 4))}</span></div>
        </section>

        <aside className="sortie-operator"><img className="sortie-cecil-art" src="/assets/operators/cecil_fullbody.png" alt="오퍼레이터 세실 전신"/><div className="sortie-operator-label"><b>오퍼레이터 세실</b><small>OPERATOR CECIL</small></div></aside>
      </div>

      <section className="sortie-dialogue">
        <div className="sortie-dialogue-portrait"><img src="/assets/operators/cecil_portrait.png" alt="오퍼레이터 세실"/></div>
        <div className="sortie-dialogue-copy"><div className="sortie-dialogue-name"><b>오퍼레이터 세실</b><small>OPERATOR CECIL</small></div><p>{operatorLine}</p></div>
        <div className="sortie-action-wrap"><button className="sortie-action" onClick={() => startScenario(selected.id)}>작전 출격 »<small>SORTIE</small></button></div>
      </section>
    </div>
  );
}
