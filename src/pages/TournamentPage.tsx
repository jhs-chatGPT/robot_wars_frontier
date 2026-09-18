import { useMemo, useState } from 'react';
import { allUnitTemplates } from '../data/units';
import { useGameStore } from '../store/gameStore';
import type { BattleAI, TournamentDraft } from '../types/game';

const aiTypes: BattleAI[] = ['균형형','공격형','방어형','회피형','지원형'];

export function TournamentPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const tournaments = useGameStore((s) => s.tournaments);
  const customUnits = useGameStore((s) => s.catalog.customUnits);
  const createAiTournament = useGameStore((s) => s.createAiTournament);
  const createCustomTournament = useGameStore((s) => s.createCustomTournament);
  const deleteTournament = useGameStore((s) => s.deleteTournament);
  const testTournamentDefense = useGameStore((s) => s.testTournamentDefense);
  const enterTournament = useGameStore((s) => s.enterTournament);
  const [hostOpen, setHostOpen] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultLog, setResultLog] = useState<string[]>([]);
  const units = useMemo(() => [...allUnitTemplates, ...customUnits].filter((unit) => !unit.enemyOnly), [customUnits]);
  const owned = units.filter((unit) => pilot.ownedUnits.includes(unit.id));

  const [draft, setDraft] = useState<TournamentDraft>({
    name: '프론티어 방어전', rounds: 3, minLv: Math.max(1, pilot.level - 10), maxCost: 450,
    prizeCredit: 0, prizePP: 0, prizeUnitId: null, defenseLineup: pilot.ownedUnits.slice(0, 1).map((unitId) => ({ unitId, ai: '균형형' as BattleAI })),
  });

  const showResult = (title: string, log: string[]) => { setResultTitle(title); setResultLog(log); };
  const active = tournaments.filter((item) => item.status === 'active');
  const completed = tournaments.filter((item) => item.status === 'completed');

  return (
    <div className="screen-scroll tournament-screen-react">
      <div className="screen-heading"><div><small>TOURNAMENT CONTROL</small><h1>토너먼트 센터</h1></div><div className="resource-badge">WINS <b>{pilot.tournamentWins}</b></div></div>
      <section className="panel tournament-toolbar"><div><h2>대회 목록</h2><p>AI 대회 참가 또는 직접 토너먼트를 개최한다. 직접 개최 시 보유 기체로 수비 순서를 구성하고 상품을 잠글 수 있다.</p></div><div><button onClick={createAiTournament}>AI 자동 대회 개최</button><button onClick={() => setHostOpen(true)}>직접 토너먼트 개최</button></div></section>
      <h2 className="section-title-react">진행 중인 대회</h2>
      <div className="tournament-list-react">{active.length ? active.slice().reverse().map((t) => <article className="tournament-card-react" key={t.id}>
        <div><small>{t.isCustom ? 'USER HOST' : 'AI HOST'}</small><h2>{t.name}</h2><p>{t.format} · Lv.{t.minLv}+ · {t.maxCost ? `Cost ≤ ${t.maxCost}` : '코스트 제한 없음'} · 참가비 {t.entry.toLocaleString()}C</p><strong>우승 상품 · {(t.prizeCredit ?? t.prize).toLocaleString()}C{t.prizePP ? ` + ${t.prizePP}PP` : ''}{t.prizeUnitId ? ` + ${units.find((u) => u.id === t.prizeUnitId)?.name ?? '기체'}` : ''}</strong>{t.defenseLineup.length > 0 && <div className="defense-line-react">{t.defenseLineup.map((slot, index) => <span key={`${slot.unitId}-${index}`}>{index + 1}. {units.find((u) => u.id === slot.unitId)?.name ?? slot.unitId} / {slot.ai}</span>)}</div>}</div>
        <div className="tourney-actions">{t.isCustom ? <button onClick={() => showResult('수비 테스트 결과', testTournamentDefense(t.id))}>수비 테스트</button> : <button className="good" onClick={() => showResult(`${t.name} · 결과`, enterTournament(t.id))}>참가</button>}<button className="danger" onClick={() => deleteTournament(t.id)}>삭제</button></div>
      </article>) : <div className="empty-panel panel">개최 중인 대회가 없습니다.</div>}</div>
      <h2 className="section-title-react">종료된 대회</h2>
      <div className="tournament-list-react">{completed.length ? completed.slice().reverse().map((t) => <article className="tournament-card-react completed" key={t.id}><div><small>COMPLETED</small><h2>{t.name}</h2><p>{t.format}</p><strong>우승자 · {t.winnerName ?? '기록 없음'}</strong></div><div className="tourney-actions"><button onClick={() => showResult(`${t.name} · 전투 로그`, t.battleLog ?? ['저장된 전투 로그가 없습니다.'])}>전투 로그</button></div></article>) : <div className="empty-panel panel">아직 종료된 대회가 없습니다.</div>}</div>

      {hostOpen && <div className="modal-backdrop"><div className="tournament-modal-react"><header><div><small>CUSTOM TOURNAMENT</small><h2>직접 토너먼트 개최</h2></div><button onClick={() => setHostOpen(false)}>×</button></header><div className="tournament-form-react">
        <label>대회명<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
        <label>규모<select value={draft.rounds} onChange={(e) => setDraft({ ...draft, rounds: Number(e.target.value) })}><option value={2}>4강</option><option value={3}>8강</option><option value={4}>16강</option></select></label>
        <label>최소 레벨<input type="number" min={1} value={draft.minLv} onChange={(e) => setDraft({ ...draft, minLv: Number(e.target.value) })} /></label>
        <label>기체 코스트 제한<input type="number" value={draft.maxCost} onChange={(e) => setDraft({ ...draft, maxCost: Number(e.target.value) })} /></label>
        <label>우승 Credit<input type="number" value={draft.prizeCredit} onChange={(e) => setDraft({ ...draft, prizeCredit: Math.max(0, Number(e.target.value)) })} /><small>보유 {pilot.credit.toLocaleString()}C</small></label>
        <label>우승 PP<input type="number" value={draft.prizePP} onChange={(e) => setDraft({ ...draft, prizePP: Math.max(0, Number(e.target.value)) })} /><small>보유 {pilot.pp}PP</small></label>
        <label>우승 기체<select value={draft.prizeUnitId ?? ''} onChange={(e) => setDraft({ ...draft, prizeUnitId: e.target.value || null })}><option value="">없음</option>{owned.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
      </div><h3>수비 편성</h3><div className="defense-editor-react">{[0,1,2,3].map((index) => {
        const slot = draft.defenseLineup[index];
        return <div key={index}><b>수비 {index + 1}</b><select value={slot?.unitId ?? ''} onChange={(e) => { const next = [...draft.defenseLineup]; if (!e.target.value) next.splice(index, 1); else next[index] = { unitId: e.target.value, ai: next[index]?.ai ?? '균형형' }; setDraft({ ...draft, defenseLineup: next.filter(Boolean) }); }}><option value="">미배치</option>{owned.map((unit) => <option key={unit.id} value={unit.id}>{unit.name} · Cost {unit.cost}</option>)}</select><select value={slot?.ai ?? '균형형'} onChange={(e) => { if (!slot) return; const next = [...draft.defenseLineup]; next[index] = { ...slot, ai: e.target.value as BattleAI }; setDraft({ ...draft, defenseLineup: next }); }}>{aiTypes.map((ai) => <option key={ai}>{ai}</option>)}</select></div>;
      })}</div><footer><button onClick={() => setHostOpen(false)}>취소</button><button className="primary-action" onClick={() => { const result = createCustomTournament(draft); if (result.ok) setHostOpen(false); showResult('대회 개최', [result.message]); }}>직접 개최</button></footer></div></div>}

      {resultLog.length > 0 && <div className="modal-backdrop"><div className="result-modal-react"><header><div><small>TOURNAMENT RESULT</small><h2>{resultTitle}</h2></div><button onClick={() => setResultLog([])}>×</button></header><pre>{resultLog.join('\n')}</pre><footer><button onClick={() => setResultLog([])}>닫기</button></footer></div></div>}
    </div>
  );
}
