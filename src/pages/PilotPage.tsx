import { useMemo, useState } from 'react';
import { pilotTrainingSkills, specialLevel } from '../data/pilotSkills';
import { useGameStore } from '../store/gameStore';
import type { PlayerPilot, TerrainKey } from '../types/game';

const statLabels = { melee: '격투', ranged: '사격', reaction: '반응', control: '조종', defense: '방어', skill: '기량' } as const;
const statSub = { melee: '근접 공격 능력', ranged: '원거리 공격 능력', reaction: '상황 대응 속도', control: '기체 제어 능력', defense: '피해 경감 능력', skill: '종합 전투 센스' } as const;
const statIcons = { melee: '⚔', ranged: '⌖', reaction: '✦', control: '◎', defense: '⬡', skill: '◇' } as const;
const terrainLabels: Record<TerrainKey, string> = { air: '공중', land: '지상', water: '수중', space: '우주' };
const terrainIcons: Record<TerrainKey, string> = { air: '✈', land: '▰', water: '≈', space: '◌' };
const terrainCosts: Record<string, number> = { D: 10, C: 20, B: 30, A: 40 };
const terrainNext: Record<string, string> = { D: 'C', C: 'B', B: 'A', A: 'S', S: 'MAX' };
type AbilityFilter = '전체' | '공용' | '전투' | '생존' | '기동' | '지원';

function PilotProfile({ pilot, active, onActivate }: { pilot: PlayerPilot; active: boolean; onActivate: () => void }) {
  const total = Object.values(pilot.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  return (
    <section className="rwf-ui-panel rwf-pilot-profile">
      <header><span>◉</span><b>파일럿 정보</b><small>PILOT INFORMATION</small></header>
      <div className="rwf-pilot-profile-art">
        <img src={pilot.fullbody} alt="" />
        <div className="rwf-pilot-profile-slogan"><b>넘어라, 한계를.</b><small>NO BORDERS. ONLY POSSIBILITIES.</small></div>
        <blockquote>「{pilot.quote}」</blockquote>
      </div>
      <div className="rwf-pilot-profile-main">
        <div className="rwf-pilot-name-row"><div><h2>{pilot.display}</h2><small>{pilot.title}</small></div><strong>Lv. {pilot.level}</strong></div>
        <div className="rwf-pilot-profile-grid">
          <span>소속</span><b>{pilot.affiliation}</b><span>계급</span><b>{pilot.rank}</b>
          <span>성격</span><b>{pilot.personality}</b><span>유형</span><b>{pilot.type}</b>
          <span>전문 분야</span><b>{pilot.specialty}</b><span>능력 총합</span><b>{total}</b>
        </div>
        <p>{pilot.desc}</p>
        <div className="rwf-owned-ability-block"><small>보유 특수능력</small><div>{pilot.special.slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div></div>
        {!active && <button className="rwf-primary-button" onClick={onActivate}>주력 파일럿으로 지정</button>}
      </div>
    </section>
  );
}

export function PilotPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const roster = useGameStore((s) => s.pilotRoster);
  const trainStat = useGameStore((s) => s.trainStat);
  const trainTerrain = useGameStore((s) => s.trainTerrain);
  const trainPilotSpecial = useGameStore((s) => s.trainPilotSpecial);
  const setActivePilot = useGameStore((s) => s.setActivePilot);
  const [selectedId, setSelectedId] = useState(pilot.id);
  const [message, setMessage] = useState('');
  const [abilityModal, setAbilityModal] = useState(false);
  const [abilityFilter, setAbilityFilter] = useState<AbilityFilter>('전체');

  const pilots = useMemo(() => [pilot, ...roster.filter((item) => item.id !== pilot.id)], [pilot, roster]);
  const viewed = pilots.find((item) => item.id === selectedId) ?? pilot;
  const isActive = viewed.id === pilot.id;
  const viewedTotal = Object.values(viewed.stats as Record<string, number>).reduce((sum, value) => sum + value, 0);
  const availableAbilities = pilotTrainingSkills.filter((item) => item.type === '공용' || item.type === pilot.type);
  const filteredAbilities = availableAbilities.filter((item) => abilityFilter === '전체' || abilityFilter === '공용' ? (abilityFilter === '전체' || item.type === '공용') : item.category === abilityFilter);

  const activateViewed = () => {
    if (setActivePilot(viewed.id)) {
      setSelectedId(viewed.id);
      setMessage(`${viewed.display}을(를) 주력 파일럿으로 지정했습니다.`);
    }
  };

  const handleAbility = (ability: (typeof pilotTrainingSkills)[number]) => {
    const current = specialLevel(pilot.special, ability.name);
    const cost = current > 0 ? ability.upgradeCost : ability.cost;
    const ok = trainPilotSpecial(ability.name, cost, ability.maxLevel);
    if (!ok) {
      setMessage(current >= ability.maxLevel ? `${ability.name}은(는) 최대 레벨입니다.` : 'PP가 부족합니다.');
      return;
    }
    const next = current + 1;
    setMessage(current === 0 ? `${ability.name} 습득 완료` : `${ability.name} Lv.${next} 강화 완료`);
  };

  return (
    <div className="rwf-pilot-screen">
      <div className="rwf-page-title">
        <div><span>◉</span><h1>파일럿 관리</h1><small>PILOT MANAGEMENT</small><p>인류의 가능성은, 파일럿으로부터.</p></div>
        <div className="rwf-page-resource"><small>보유 PP</small><b>{pilot.pp.toLocaleString()}</b></div>
      </div>

      <div className="rwf-pilot-layout">
        <aside className="rwf-ui-panel rwf-pilot-roster">
          <header><span>▤</span><b>파일럿 목록</b><small>{pilots.length}명</small></header>
          <div className="rwf-pilot-roster-filter"><button className="active">전체</button><button>레벨 높은 순</button></div>
          <div className="rwf-pilot-roster-list">
            {pilots.map((item) => (
              <button key={item.id} className={viewed.id === item.id ? 'active' : ''} onClick={() => { setSelectedId(item.id); setMessage(''); }}>
                <img src={item.avatar} alt="" />
                <span><b>{item.display}</b><small>{item.title}</small></span>
                <em>Lv. {item.level}</em>
              </button>
            ))}
          </div>
          <div className="rwf-roster-search">⌕ <span>파일럿을 선택하십시오.</span></div>
        </aside>

        <PilotProfile pilot={viewed} active={isActive} onActivate={activateViewed} />

        <section className="rwf-ui-panel rwf-pilot-training">
          <header><span>✦</span><b>파일럿 훈련</b><small>PILOT TRAINING</small><div className="rwf-training-total">총합 <strong>{viewedTotal}</strong></div></header>
          {!isActive ? (
            <div className="rwf-training-locked"><span>◇</span><h2>{viewed.display}</h2><p>육성은 현재 주력 파일럿에게 적용됩니다.</p><button className="rwf-primary-button" onClick={activateViewed}>주력 파일럿으로 지정</button></div>
          ) : (
            <div className="rwf-training-content">
              <section className="rwf-training-section rwf-stat-section">
                <div className="rwf-section-title"><div><b>능력치 강화</b><small>훈련을 통해 파일럿의 기본 능력치를 상승시킵니다.</small></div><span>+5 / 20 PP</span></div>
                <div className="rwf-stat-list">
                  {(Object.keys(statLabels) as Array<keyof typeof statLabels>).map((key) => {
                    const current = pilot.stats[key];
                    const next = Math.min(250, current + 5);
                    return (
                      <div className="rwf-stat-row" key={key}>
                        <span className="rwf-stat-icon">{statIcons[key]}</span>
                        <div className="rwf-stat-name"><b>{statLabels[key]}</b><small>{statSub[key]}</small></div>
                        <strong>{current}</strong><em>»</em><strong className="next">{next}</strong>
                        <div className="rwf-stat-meter"><i style={{ width: `${Math.min(100, current / 250 * 100)}%` }} /></div>
                        <button disabled={pilot.pp < 20 || current >= 250} onClick={() => { const ok = trainStat(key); setMessage(ok ? `${statLabels[key]} +5` : 'PP가 부족하거나 최대치입니다.'); }}>+5 강화 <small>20 PP</small></button>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="rwf-training-bottom">
                <section className="rwf-training-section rwf-terrain-section">
                  <div className="rwf-section-title"><div><b>지형 적응 훈련</b><small>지형별 전투 효율을 향상시킵니다.</small></div></div>
                  <div className="rwf-terrain-cards">
                    {(Object.keys(terrainLabels) as TerrainKey[]).map((key) => {
                      const rank = pilot.terrain[key];
                      const next = terrainNext[rank] ?? 'MAX';
                      const cost = terrainCosts[rank] ?? 0;
                      return (
                        <button key={key} disabled={next === 'MAX' || pilot.pp < cost} onClick={() => { const ok = trainTerrain(key); setMessage(ok ? `${terrainLabels[key]} 지형적응 상승` : 'PP가 부족하거나 최고 등급입니다.'); }}>
                          <span>{terrainIcons[key]}</span><small>{terrainLabels[key]}</small><strong>{rank}</strong><em>{next === 'MAX' ? 'MAX' : `» ${next}`}</em><b>{next === 'MAX' ? 'MAX' : `${cost} PP`}</b>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="rwf-training-section rwf-ability-manage">
                  <div className="rwf-section-title"><div><b>특수능력</b><small>특수능력을 습득하거나 레벨을 강화합니다.</small></div></div>
                  <div className="rwf-ability-summary">
                    <div className="rwf-ability-count"><strong>{pilot.special.length}</strong><small>보유 능력</small></div>
                    <div className="rwf-ability-chips">{pilot.special.slice(0, 6).map((item) => <span key={item}>{item}</span>)}</div>
                  </div>
                  <button className="rwf-primary-button rwf-ability-open" onClick={() => setAbilityModal(true)}>특수능력 습득 / 강화 <span>»</span></button>
                </section>
              </div>
            </div>
          )}
          <div className={`rwf-training-message ${message ? 'show' : ''}`}>{message || '육성 항목을 선택하십시오.'}</div>
        </section>
      </div>

      {abilityModal && (
        <div className="rwf-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setAbilityModal(false); }}>
          <section className="rwf-ability-modal" role="dialog" aria-modal="true" aria-label="특수능력 습득 및 강화">
            <header>
              <div><small>PILOT SPECIAL ABILITY</small><h2>특수능력 습득 / 강화</h2><p>능력을 선택해 새로 습득하거나 현재 레벨을 강화할 수 있습니다.</p></div>
              <div className="rwf-modal-pp"><small>보유 PP</small><b>{pilot.pp.toLocaleString()}</b></div>
              <button className="rwf-modal-close" onClick={() => setAbilityModal(false)}>×</button>
            </header>
            <nav className="rwf-ability-filters">
              {(['전체','공용','전투','생존','기동','지원'] as AbilityFilter[]).map((filter) => <button key={filter} className={abilityFilter === filter ? 'active' : ''} onClick={() => setAbilityFilter(filter)}>{filter}</button>)}
            </nav>
            <div className="rwf-ability-list">
              {filteredAbilities.map((ability) => {
                const current = specialLevel(pilot.special, ability.name);
                const maxed = current >= ability.maxLevel;
                const cost = current > 0 ? ability.upgradeCost : ability.cost;
                return (
                  <article className={`rwf-ability-card ${current > 0 ? 'owned' : ''}`} key={ability.name}>
                    <div className="rwf-ability-card-icon">{ability.category === '전투' ? '⚔' : ability.category === '생존' ? '⬡' : ability.category === '기동' ? '✦' : '◎'}</div>
                    <div className="rwf-ability-card-copy">
                      <div><h3>{ability.name}</h3><span>{ability.type} · {ability.category}</span></div>
                      <p>{ability.description}</p>
                      <div className="rwf-ability-level"><span>현재</span><b>{current > 0 ? `Lv.${current}` : '미습득'}</b><em>→</em><span>다음</span><strong>{maxed ? 'MAX' : ability.maxLevel > 1 ? `Lv.${current + 1}` : '습득'}</strong></div>
                    </div>
                    <button disabled={maxed || pilot.pp < cost} onClick={() => handleAbility(ability)}>{maxed ? 'MAX' : current === 0 ? '습득' : '강화'}<small>{maxed ? '최대 레벨' : `${cost} PP`}</small></button>
                  </article>
                );
              })}
            </div>
            <footer><span>※ 특수능력 효과는 전투 시스템에 즉시 반영됩니다.</span><button onClick={() => setAbilityModal(false)}>닫기</button></footer>
          </section>
        </div>
      )}
    </div>
  );
}
