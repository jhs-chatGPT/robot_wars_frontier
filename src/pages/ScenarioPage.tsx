import { scenarios } from '../data/scenarios';
import { useGameStore } from '../store/gameStore';

const terrainName = { air: '공중', land: '지상', water: '수중', space: '우주' } as const;

export function ScenarioPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const customScenarios = useGameStore((s) => s.catalog.customScenarios);
  const startScenario = useGameStore((s) => s.startScenario);
  const list = [...scenarios, ...customScenarios];

  return (
    <div className="screen-scroll mission-screen-react">
      <div className="screen-heading">
        <div><small>MISSION CONTROL / SCENARIO</small><h1>작전 출격</h1></div>
        <div className="resource-badge">CLEAR <b>{pilot.scenarioClears.length}/{list.length}</b></div>
      </div>
      <div className="mission-list-react">
        {list.map((scenario, index) => {
          const clear = pilot.scenarioClears.includes(scenario.id);
          const unlocked = index === 0 || pilot.scenarioClears.includes(list[index - 1].id);
          return (
            <article className={`mission-card-react ${clear ? 'clear' : ''} ${!unlocked ? 'locked' : ''}`} key={scenario.id}>
              <div className="mission-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="mission-body-react">
                <small>{clear ? 'MISSION COMPLETE' : unlocked ? 'AVAILABLE OPERATION' : 'LOCKED'}</small>
                <h2>{scenario.title}</h2>
                <p>{scenario.desc}</p>
                <strong>{scenario.objective}</strong>
                <div className="mission-tags">
                  <span>{terrainName[scenario.terrain]}</span><span>적 {scenario.enemyCount}기</span><span>Lv.{scenario.enemyLevel}</span><span>{scenario.turnLimit} ROUNDS</span>
                </div>
                <div className="mission-reward-line">REWARD · {scenario.rewardCredit.toLocaleString()} C / EXP {scenario.rewardExp} / PP {Math.max(15, Math.round(scenario.rewardExp / 4))}</div>
              </div>
              <button className="mission-sortie" disabled={!unlocked} onClick={() => startScenario(scenario.id)}>{clear ? 'REPLAY' : 'SORTIE'} ›</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
