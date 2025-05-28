import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

interface TradeDay {
  day: number;
  target: number;
  achieved: number;
  label: string;
}

const createPhase1 = (): TradeDay[] => [
  { day: 1, target: 200, achieved: 0, label: 'Lundi' },
  { day: 2, target: 200, achieved: 0, label: 'Mardi' },
  { day: 3, target: 200, achieved: 0, label: 'Mercredi' },
  { day: 4, target: 200, achieved: 0, label: 'Jeudi' },
  { day: 5, target: 200, achieved: 0, label: 'Vendredi' }
];

const createPhase2 = (): TradeDay[] => [
  { day: 1, target: 100, achieved: 0, label: 'Lundi' },
  { day: 2, target: 100, achieved: 0, label: 'Mardi' },
  { day: 3, target: 100, achieved: 0, label: 'Mercredi' },
  { day: 4, target: 100, achieved: 0, label: 'Jeudi' },
  { day: 5, target: 100, achieved: 0, label: 'Vendredi' }
];

// Progress bar styled as a medieval "XP bar"
interface MedievalProgressBarProps {
  percent: number;
  color?: string;
  bg?: string;
  height?: number;
}

const MedievalProgressBar: React.FC<MedievalProgressBarProps> = ({ percent, color = "#f5e06b", bg = "#282317", height = 18 }) => (
  <div style={{
    width: "100%",
    height,
    background: `repeating-linear-gradient(135deg,${bg} 0 10px,#1a1610 10px 20px)`,
    borderRadius: height / 2,
    border: "2px solid #a67c32",
    boxShadow: `0 0 16px #000a, 0 0 24px #f5e06b33 inset`,
    overflow: "hidden",
    position: "relative"
  }}>
    <div style={{
      height: "100%",
      width: `${percent}%`,
      background: `linear-gradient(90deg,${color} 0%,#e8c46c 100%)`,
      borderRadius: height / 2,
      boxShadow: `0 0 18px 0 #f5e06b99, 0 0 15px 0 #a67c32 inset`,
      transition: "width 0.7s cubic-bezier(.6,1.8,.6,1)",
      position: "absolute",
      left: 0,
      top: 0
    }} />
    {/* Decorative end cap */}
    <div style={{
      position: "absolute",
      right: -6,
      top: -2,
      width: 14,
      height: height+4,
      background: `radial-gradient(circle,#f5e06b 60%,#a67c32 100%)`,
      borderRadius: "50%",
      boxShadow: "0 0 10px #f5e06bb8",
      opacity: percent > 4 ? 1 : 0
    }} />
  </div>
);

// Medieval "parchment" stat card
const MedievalStat = ({
  label, value, percent, accent
}: {
  label: string;
  value: string;
  percent?: number;
  accent: string;
}) => (
  <div style={{
    background: "linear-gradient(135deg,#2e2313 90%,#422c0b 100%)",
    borderRadius: 14,
    border: `3px solid #a67c32`,
    boxShadow: `0 2px 18px #0008, 0 0 0 4px #a67c3236`,
    padding: "26px 34px 20px 34px",
    margin: 12,
    minWidth: 190,
    maxWidth: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
    fontFamily: "'UnifrakturCook', 'IM Fell English', serif"
  }}>
    <span style={{
      fontSize: 16,
      fontFamily: "'IM Fell English SC', serif",
      color: "#e8c46c",
      letterSpacing: 0.5,
      marginBottom: 7,
      textShadow: `0 2px 6px #a67c32bb`
    }}>{label}</span>
    <span style={{
      fontSize: 32,
      fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
      fontWeight: 700,
      color: accent,
      letterSpacing: 2,
      textShadow: `0 3px 18px #f5e06b44`
    }}>{value}</span>
    {percent !== undefined &&
      <div style={{ marginTop: 9, width: "100%" }}>
        <MedievalProgressBar percent={percent} color={accent} />
      </div>
    }
    {/* Scroll edge */}
    <div style={{
      position: "absolute", right: 10, bottom: 10,
      width: 22, height: 22,
      background: "radial-gradient(circle,#f5e06b 60%,#a67c32 100%)",
      borderRadius: "50%",
      opacity: 0.18
    }} />
  </div>
);

// Medieval table
const MedievalTable = ({
  days,
  onChange,
  accent,
}: {
  days: TradeDay[];
  onChange: (index: number, value: number) => void;
  accent: string;
}) => (
  <div style={{
    overflowX: "auto",
    marginTop: 12,
    background: "linear-gradient(120deg,#35280f 60%,#231b0b 100%)",
    borderRadius: 18,
    border: "3px solid #a67c32",
    boxShadow: `0 0 24px #000a, 0 0 0 4px #a67c3228`
  }}>
    <table style={{
      width: "100%",
      borderCollapse: "collapse",
      fontFamily: "'IM Fell English SC', serif",
      color: "#ffeebc",
      fontSize: 18
    }}>
      <thead>
        <tr>
          {["Jour", "Atteint", "Objectif", "% Atteint"].map((h, idx) => (
            <th key={h} style={{
              background: "#463216",
              color: "#f5e06b",
              fontWeight: 900,
              fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
              fontSize: 18,
              padding: "15px 10px",
              borderBottom: "2.5px solid #a67c32",
              borderTopLeftRadius: idx === 0 ? 13 : 0,
              borderTopRightRadius: idx === 3 ? 13 : 0,
              letterSpacing: 1.8,
              textShadow: "0 2px 8px #f5e06b44"
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map((d, i) => (
          <tr key={i} style={{
            background: i % 2 === 0 ? "#211905" : "#2e2313",
            borderBottom: "2px solid #a67c3244",
            fontWeight: 700,
            transition: "background .2s"
          }}>
            <td style={{
              padding: "15px 10px",
              color: accent,
              fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
              fontWeight: 900,
              fontSize: 21,
              textAlign: "center"
            }}>{d.label}</td>
            <td style={{ padding: "13px 10px", textAlign: "center" }}>
              <input
                type="number"
                value={d.achieved}
                min="0"
                onChange={e => onChange(i, Number(e.target.value))}
                style={{
                  width: 80,
                  fontSize: 18,
                  fontFamily: "'IM Fell English', serif",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: 8,
                  border: `2px solid #a67c32`,
                  borderRadius: 7,
                  background: "#f5e06b22",
                  color: "#f5e06b",
                  boxShadow: `0 2px 14px 0 #a67c3222`,
                  outline: "none",
                  transition: "border .2s"
                }}
              />
            </td>
            <td style={{
              padding: "15px 10px",
              textAlign: "center",
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'UnifrakturCook', serif"
            }}>
              <span style={{
                background: accent,
                color: "#231b0b",
                borderRadius: 9,
                padding: "4px 13px",
                fontWeight: 900,
                fontSize: 17,
                boxShadow: `0 0 12px 0 ${accent}55`
              }}>{d.target}€</span>
            </td>
            <td style={{
              padding: "15px 10px", fontWeight: 900,
              color: d.achieved >= d.target ? "#f5e06b" : accent,
              fontSize: 20,
              textAlign: "center"
            }}>
              {((d.achieved / d.target) * 100).toFixed(1)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function App() {
  const [phase1, setPhase1] = useState<TradeDay[]>([]);
  const [phase2, setPhase2] = useState<TradeDay[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: p1, error: p1Error } = await supabase.from('tracker').select('*').eq('phase', 'phase1').single();
        if (p1Error && p1Error.code !== 'PGRST116') console.error('Error fetching phase 1:', p1Error);
        setPhase1(p1?.data ?? createPhase1());
        const { data: p2, error: p2Error } = await supabase.from('tracker').select('*').eq('phase', 'phase2').single();
        if (p2Error && p2Error.code !== 'PGRST116') console.error('Error fetching phase 2:', p2Error);
        setPhase2(p2?.data ?? createPhase2());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.background = "radial-gradient(ellipse at 60% 10%, #33240b 0%, #1a1407 70%, #131006 100%)";
    document.body.style.color = "#ffeebc";
    document.body.style.fontFamily = "'IM Fell English SC', 'UnifrakturCook', serif";
  }, []);

  const handleChange = async (
    phase: 'phase1' | 'phase2',
    index: number,
    value: number,
    list: TradeDay[],
    setter: React.Dispatch<React.SetStateAction<TradeDay[]>>
  ) => {
    const updated = [...list];
    updated[index].achieved = value;
    setter(updated);
    try {
      const { error } = await supabase.from('tracker').upsert([{ phase, data: updated }], { onConflict: 'phase' });
      if (error) console.error(`Erreur lors de la sauvegarde ${phase}:`, error);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const calculateProgress = (list: TradeDay[]) => {
    const totalAchieved = list.reduce((acc, d) => acc + d.achieved, 0);
    const totalTarget = list.reduce((acc, d) => acc + d.target, 0);
    return totalTarget === 0 ? 0 : (totalAchieved / totalTarget) * 100;
  };

  // Medieval accent color
  const accent1 = "#f5e06b";
  const accent2 = "#e8c46c";
  const accentGlobal = "#a67c32";

  // Some summary stats
  const totalAchieved = phase1.concat(phase2).reduce((acc, d) => acc + d.achieved, 0);
  const totalTarget = phase1.concat(phase2).reduce((acc, d) => acc + d.target, 0);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      padding: 0,
      margin: 0,
      background: "none"
    }}>
      {/* HEADER */}
      <header style={{
        width: "100%",
        background: "#1a1407",
        borderBottom: `3px solid #a67c32`,
        boxShadow: `0 2px 32px #a67c3230`,
        padding: 0,
        margin: 0,
        position: "sticky",
        top: 0,
        zIndex: 40
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 36px 20px 36px"
        }}>
          <div style={{
            fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
            fontWeight: 900,
            fontSize: 38,
            letterSpacing: 1,
            color: "#f5e06b",
            textShadow: `0 0 18px #a67c32bb`
          }}>
            🛡️ FTMO <span style={{ color: accentGlobal, textShadow: `0 0 20px #a67c32cc` }}>TRACKER</span>
          </div>
          <div style={{
            color: accent1,
            fontFamily: "'IM Fell English SC', serif",
            fontWeight: 600,
            fontSize: 17,
            letterSpacing: 2
          }}>
            <span style={{ color: accent1, textShadow: `0 0 10px #f5e06b77` }}>Guild of Traders</span>
          </div>
        </div>
      </header>

      {/* SUMMARY STATS */}
      <section style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 16px",
        display: "flex",
        gap: 13,
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 38,
        marginBottom: 12
      }}>
        <MedievalStat
          label="Progression Globale"
          value={calculateProgress([...phase1, ...phase2]).toFixed(1) + " %"}
          percent={calculateProgress([...phase1, ...phase2])}
          accent={accent1}
        />
        <MedievalStat
          label="Montant Atteint"
          value={totalAchieved + " pièces d'or"}
          accent={accent2}
        />
        <MedievalStat
          label="Objectif Total"
          value={totalTarget + " pièces d'or"}
          accent={accentGlobal}
        />
      </section>

      {/* PHASES */}
      <main style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 16px 60px 16px"
      }}>
        <section style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
            fontSize: 28,
            color: accent1,
            fontWeight: 900,
            letterSpacing: 1.5,
            margin: 0,
            marginBottom: 12,
            textShadow: `0 0 18px #f5e06b77`
          }}>Phase 1 : Quête du Marché</h2>
          <MedievalProgressBar percent={calculateProgress(phase1)} color={accent1} />
          <MedievalTable
            days={phase1}
            onChange={(i, v) => handleChange('phase1', i, v, phase1, setPhase1)}
            accent={accent1}
          />
        </section>
        <section>
          <h2 style={{
            fontFamily: "'UnifrakturCook', 'IM Fell English', serif",
            fontSize: 28,
            color: accent2,
            fontWeight: 900,
            letterSpacing: 1.5,
            margin: 0,
            marginBottom: 12,
            textShadow: `0 0 18px #e8c46c77`
          }}>Phase 2 : Épreuve du Trésor</h2>
          <MedievalProgressBar percent={calculateProgress(phase2)} color={accent2} />
          <MedievalTable
            days={phase2}
            onChange={(i, v) => handleChange('phase2', i, v, phase2, setPhase2)}
            accent={accent2}
          />
        </section>
      </main>
      <footer style={{
        textAlign: "center",
        color: "#f5e06b",
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: 1.5,
        margin: "36px 0 18px 0",
        fontFamily: "'IM Fell English SC', serif",
        opacity: 0.8,
        textShadow: "0 1px 8px #a67c3222"
      }}>
      </footer>
      {/* Medieval Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=IM+Fell+English:wght@400;700&family=UnifrakturCook:wght@700&display=swap" rel="stylesheet" />
    </div>
  );
}