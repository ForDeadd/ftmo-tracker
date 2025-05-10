import React, { useState } from 'react'

type Trade = {
  date: string
  profit: number
}

export default function TradeTracker() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [date, setDate] = useState('')
  const [profit, setProfit] = useState(0)

  const addTrade = () => {
    setTrades([...trades, { date, profit }])
    setDate('')
    setProfit(0)
  }

  const totalPnL = trades.reduce((acc, t) => acc + t.profit, 0)
  const maxDrawdown = Math.min(...trades.map(t => t.profit))

  const dailyLossLimit = -1000
  const maxTotalLoss = -5000

  const isChallengeFailed = totalPnL < maxTotalLoss || trades.some(t => t.profit < dailyLossLimit)

  return (
    <div>
      <div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input type="number" value={profit} onChange={e => setProfit(Number(e.target.value))} />
        <button onClick={addTrade}>Ajouter un trade</button>
      </div>
      <div>
        <h2>Stats</h2>
        <p>Total PnL : {totalPnL}€</p>
        <p>Max Drawdown : {maxDrawdown}€</p>
        <p>Status : {isChallengeFailed ? "❌ Challenge échoué" : "✅ Challenge en cours"}</p>
      </div>
      <ul>
        {trades.map((t, i) => (
          <li key={i}>{t.date} : {t.profit}€</li>
        ))}
      </ul>
    </div>
  )
}
