// App.tsx responsive, mobile-friendly
import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

interface TradeDay {
  day: number
  target: number
  achieved: number
  label: string
}

const createPhase1 = (): TradeDay[] => [
  { day: 1, target: 1000, achieved: 0, label: 'Lundi' },
  { day: 2, target: 1000, achieved: 0, label: 'Mardi' },
  { day: 3, target: 1000, achieved: 0, label: 'Mercredi' },
  { day: 4, target: 1000, achieved: 0, label: 'Jeudi' },
  { day: 5, target: 1000, achieved: 0, label: 'Vendredi' },
  { day: 6, target: 150, achieved: 0, label: 'Samedi' },
  { day: 7, target: 150, achieved: 0, label: 'Dimanche' },
  { day: 8, target: 1000, achieved: 0, label: 'Lundi' },
  { day: 9, target: 1000, achieved: 0, label: 'Mardi' },
  { day: 10, target: 1000, achieved: 0, label: 'Mercredi' },
  { day: 11, target: 150, achieved: 0, label: 'Jeudi' },
  { day: 12, target: 150, achieved: 0, label: 'Vendredi' }
]

const createPhase2 = (): TradeDay[] => [
  { day: 1, target: 400, achieved: 0, label: 'Lundi' },
  { day: 2, target: 400, achieved: 0, label: 'Mardi' },
  { day: 3, target: 400, achieved: 0, label: 'Mercredi' },
  { day: 4, target: 400, achieved: 0, label: 'Jeudi' },
  { day: 5, target: 400, achieved: 0, label: 'Vendredi' },
  { day: 6, target: 100, achieved: 0, label: 'Samedi' },
  { day: 7, target: 100, achieved: 0, label: 'Dimanche' },
  { day: 8, target: 400, achieved: 0, label: 'Lundi' },
  { day: 9, target: 400, achieved: 0, label: 'Mardi' },
  { day: 10, target: 400, achieved: 0, label: 'Mercredi' },
  { day: 11, target: 400, achieved: 0, label: 'Jeudi' },
  { day: 12, target: 400, achieved: 0, label: 'Vendredi' }
]

const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="w-full bg-gray-800 dark:bg-gray-300 h-4 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
      style={{ width: `${percent}%` }}
    ></div>
  </div>
)

const TableSection = ({ title, days, onChange, progress }: {
  title: string
  days: TradeDay[]
  onChange: (index: number, value: number) => void
  progress: number
}) => (
  <div className="bg-gray-800 dark:bg-gray-100 text-white dark:text-black rounded-2xl p-6 shadow-lg mb-10 overflow-x-auto">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-2xl font-semibold mb-4 sm:mb-0">{title}</h2>
      <div className="text-right">
        <p className="text-sm text-gray-400 dark:text-gray-600 mb-1">Progression</p>
        <p className="text-xl font-bold text-green-400">{progress.toFixed(1)}%</p>
        <ProgressBar percent={progress} />
      </div>
    </div>
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-gray-700 dark:bg-gray-300 text-left">
          <th className="p-2 text-sm font-medium text-gray-300 dark:text-black">Jour</th>
          <th className="p-2 text-sm font-medium text-gray-300 dark:text-black">Montant</th>
          <th className="p-2 text-sm font-medium text-gray-300 dark:text-black">Objectif</th>
          <th className="p-2 text-sm font-medium text-gray-300 dark:text-black">%</th>
        </tr>
      </thead>
      <tbody>
        {days.map((d, i) => (
          <tr key={i} className="bg-gray-900 dark:bg-white border-b border-gray-700 hover:bg-gray-800">
            <td className="p-2 whitespace-nowrap">Jour {d.day} ({d.label})</td>
            <td className="p-2">
              <input
                type="number"
                value={d.achieved}
                onChange={e => onChange(i, Number(e.target.value))}
                className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black p-2 rounded w-full max-w-[90px] text-center border border-gray-700 focus:outline-none"
              />
            </td>
            <td className="p-2 whitespace-nowrap">{d.target}€</td>
            <td className="p-2 whitespace-nowrap">{((d.achieved / d.target) * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export default function App() {
  const [phase1, setPhase1] = useState<TradeDay[]>([])
  const [phase2, setPhase2] = useState<TradeDay[]>([])
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('dark') === 'true'
  })

  useEffect(() => {
    async function fetchData() {
      const { data: p1 } = await supabase.from('tracker').select('*').eq('phase', 'phase1').single()
      const { data: p2 } = await supabase.from('tracker').select('*').eq('phase', 'phase2').single()
      setPhase1(p1?.data || createPhase1())
      setPhase2(p2?.data || createPhase2())
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (phase1.length)
      supabase.from('tracker').upsert([{ phase: 'phase1', data: phase1 }], { onConflict: 'phase' })
  }, [phase1])

  useEffect(() => {
    if (phase2.length)
      supabase.from('tracker').upsert([{ phase: 'phase2', data: phase2 }], { onConflict: 'phase' })
  }, [phase2])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('dark', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const calculateProgress = (list: TradeDay[]) => {
    const totalAchieved = list.reduce((acc, d) => acc + d.achieved, 0)
    const totalTarget = list.reduce((acc, d) => acc + d.target, 0)
    return totalTarget === 0 ? 0 : (totalAchieved / totalTarget) * 100
  }

  const globalProgress = calculateProgress([...phase1, ...phase2])
  const phase1Progress = calculateProgress(phase1)
  const phase2Progress = calculateProgress(phase2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black dark:from-white dark:to-gray-200 text-white dark:text-black font-sans flex flex-col md:flex-row">
      <div className="w-full md:w-64 fixed md:relative top-0 left-0 h-auto md:h-full bg-gray-950 dark:bg-gray-100 p-4 md:p-6 shadow-2xl z-50 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold mb-4">Progression Globale</h2>
          <p className="text-3xl text-cyan-400 font-bold mb-2">{globalProgress.toFixed(1)}%</p>
          <ProgressBar percent={globalProgress} />
        </div>
        <button
          onClick={toggleDarkMode}
          className="mt-6 text-sm px-3 py-2 rounded bg-gray-800 dark:bg-gray-300 text-white dark:text-black hover:opacity-80 transition"
        >
          {darkMode ? '🌞 Mode Jour' : '🌙 Mode Nuit'}
        </button>
      </div>

      <div className="flex-1 p-4 md:p-10 mt-44 md:mt-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-center text-green-400 drop-shadow">FTMO Tracker</h1>

        <TableSection
          title="Phase 1"
          days={phase1}
          onChange={(i, v) => {
            const updated = [...phase1];
            updated[i].achieved = v;
            setPhase1(updated);
          }}
          progress={phase1Progress}
        />

        <TableSection
          title="Phase 2"
          days={phase2}
          onChange={(i, v) => {
            const updated = [...phase2];
            updated[i].achieved = v;
            setPhase2(updated);
          }}
          progress={phase2Progress}
        />
      </div>
    </div>
  )
}