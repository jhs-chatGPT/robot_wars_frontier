import { useState } from 'react';
import { partTemplates } from '../data/parts';
import { useGameStore } from '../store/gameStore';

export function ShopPage() {
  const pilot = useGameStore((s) => s.pilot)!;
  const buyPart = useGameStore((s) => s.buyPart);
  const [message, setMessage] = useState('');
  return (
    <div className="screen-scroll">
      <div className="screen-heading"><div><small>FRONTIER SUPPLY SHOP</small><h1>상점</h1></div><div className="resource-badge">CREDIT <b>{pilot.credit.toLocaleString()}</b></div></div>
      {message && <div className="inline-message">{message}</div>}
      <div className="shop-grid-react">
        {partTemplates.map((part) => {
          const owned = pilot.partsInventory.includes(part.id);
          return <section className={`panel shop-card-react ${owned ? 'owned' : ''}`} key={part.id}><small>ENHANCEMENT PART</small><h2>{part.name}</h2><p>{part.desc}</p><div><strong>{part.price.toLocaleString()} C</strong><button disabled={owned || pilot.credit < part.price} onClick={() => { const ok = buyPart(part.id); setMessage(ok ? `${part.name} 구매 완료` : '크레딧이 부족합니다.'); }}>{owned ? '보유중' : '구매'}</button></div></section>;
        })}
      </div>
    </div>
  );
}
