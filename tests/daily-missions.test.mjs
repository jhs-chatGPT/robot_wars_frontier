import test from 'node:test';
import assert from 'node:assert/strict';
import { dailyDate, freshDaily, advanceDaily, currentDaily, claimDailyReward } from '../src/data/dailyMissions.ts';
test('KST date changes exactly at midnight', () => {
  assert.equal(dailyDate(Date.parse('2026-09-20T14:59:59Z')), '2026-09-20');
  assert.equal(dailyDate(Date.parse('2026-09-20T15:00:00Z')), '2026-09-21');
});
test('old saves and stale dates start with zero progress', () => {
  assert.deepEqual(currentDaily().counts, freshDaily().counts);
  const stale = {...advanceDaily(undefined, {sortie:3}), date:'2000-01-01', claimed:['sortie']};
  assert.equal(currentDaily(stale).counts.sortie, 0);
  assert.deepEqual(currentDaily(stale).claimed, []);
  assert.equal(claimDailyReward(stale, 'sortie'), null);
});
test('incomplete mission cannot pay; completed reward pays only once', () => {
  let daily = advanceDaily(undefined, {sortie:2});
  assert.equal(claimDailyReward(daily, 'sortie'), null);
  daily = advanceDaily(daily, {sortie:1, kills:11});
  const reward = claimDailyReward(daily, 'sortie');
  assert.equal(reward.credit, 5000);
  assert.equal(reward.pp, 0);
  assert.equal(claimDailyReward(reward.daily, 'sortie'), null);
  assert.equal(claimDailyReward(reward.daily, 'kills').pp, 150);
  assert.equal(daily.claimed.length, 0);
});
test('upgrade and PvP counters are independent and survive serialization', () => {
  const value = advanceDaily(undefined, {upgrade:1,pvp:1});
  const restored = JSON.parse(JSON.stringify(value));
  assert.equal(claimDailyReward(restored, 'upgrade').pp,100);
  assert.equal(claimDailyReward(restored, 'pvp').credit,3000);
  assert.equal(restored.counts.sortie,0);
});
