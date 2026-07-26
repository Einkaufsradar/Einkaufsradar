"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Bell, TrendingDown, Settings, X, Sun, Moon, Info } from "lucide-react";

const THEMES = {
  light: {
    pageBg: "#EEF1EA",
    cardBg: "#FDFDF9",
    ink: "#1C2B27",
    sub: "#5B6B65",
    green: "#2F6F4E",
    amber: "#C98A2E",
    border: "#1C2B2722",
  },
  dark: {
    pageBg: "#12181A",
    cardBg: "#1D2624",
    ink: "#EFF3EF",
    sub: "#9AACA4",
    green: "#4C9E75",
    amber: "#D9A441",
    border: "#EFF3EF22",
  },
};

const STATES = [
  "Berlin", "NRW", "Sachsen", "Bremen", "Bayern", "Hessen",
  "Niedersachsen", "Hamburg", "Baden-Württemberg", "Sachsen-Anhalt",
  "Thüringen", "Rheinland-Pfalz", "Schleswig-Holstein", "Brandenburg",
  "Saarland", "Mecklenburg-Vorpommern",
];

const CHAINS = ["Aldi Süd", "Lidl", "Netto", "Rewe", "Edeka", "Kaufland", "Penny", "Aldi Nord", "Real", "Norma"];

// TEMPORÄRE Demo-Daten. Sobald Supabase angebunden ist, wird diese Funktion
// durch einen echten Datenbank-Abruf ersetzt (dazu kommen wir in Phase 2).
function seededScores(seed) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return CHAINS
    .map((name) => ({ name, score: Math.round(55 + rand() * 44) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function hashOf(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
  return h + 1;
}

const WEEKS = [
  { label: "KW 26", range: "22.06 – 28.06" },
  { label: "KW 27", range: "29.06 – 05.07" },
  { label: "KW 28", range: "06.07 – 12.07" },
];

export default function Home() {
  const [weekIdx, setWeekIdx] = useState(1);
  const [selectedState, setSelectedState] = useState(null);
  const [notify, setNotify] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");

  const t = isDark ? THEMES.dark : THEMES.light;
  const week = WEEKS[weekIdx];

  const ranking = useMemo(() => {
    if (!selectedState) return [];
    return seededScores(hashOf(selectedState + week.label));
  }, [selectedState, week.label]);

  return (
    <div
      style={{ background: t.pageBg, color: t.ink, minHeight: "100vh", fontFamily: "'Inter', sans-serif", transition: "background 0.2s, color 0.2s" }}
      className="w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap');
        .display-font { font-family: 'Archivo Black', sans-serif; }
        .mono-font { font-family: 'IBM Plex Mono', monospace; }
        .torn-top {
          height: 14px;
          background-color: ${t.cardBg};
          -webkit-mask-image: linear-gradient(135deg, transparent 50%, black 50%), linear-gradient(-135deg, transparent 50%, black 50%);
          -webkit-mask-size: 18px 14px;
          -webkit-mask-repeat: repeat-x;
          -webkit-mask-position: 0 0, 0 0;
          mask-image: linear-gradient(135deg, transparent 50%, black 50%), linear-gradient(-135deg, transparent 50%, black 50%);
          mask-size: 18px 14px;
          mask-repeat: repeat-x;
          mask-position: 0 0, 0 0;
          transition: background-color 0.2s;
        }
        .torn-bottom {
          height: 14px;
          background-color: ${t.cardBg};
          -webkit-mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
          -webkit-mask-size: 18px 14px;
          -webkit-mask-repeat: repeat-x;
          -webkit-mask-position: 0 100%, 0 100%;
          mask-image: linear-gradient(45deg, transparent 50%, black 50%), linear-gradient(-45deg, transparent 50%, black 50%);
          mask-size: 18px 14px;
          mask-repeat: repeat-x;
          mask-position: 0 100%, 0 100%;
          transition: background-color 0.2s;
        }
      `}</style>

      <div className="max-w-md mx-auto px-5 pt-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: t.green }}
            >
              <TrendingDown size={16} color="#fff" />
            </div>
            <h1 className="display-font text-xl tracking-tight" style={{ color: t.ink }}>
              EINKAUFSRADAR
            </h1>
          </div>
          <button
            aria-label="Einstellungen"
            onClick={() => { setSettingsOpen(true); setSettingsTab("general"); }}
            className="p-2 rounded-full active:scale-95 transition-transform"
            style={{ color: t.sub }}
          >
            <Settings size={20} />
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: t.sub }}>
          Die Antwort, wo diese Woche am günstigsten eingekauft wird.
        </p>

        {/* Week nav — ticker style */}
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mb-6 mono-font"
          style={{ background: t.ink, color: t.pageBg }}
        >
          <button
            aria-label="Vorherige Woche"
            onClick={() => setWeekIdx((i) => Math.max(0, i - 1))}
            disabled={weekIdx === 0}
            className="p-1 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold tracking-widest">{week.label}</div>
            <div className="text-xs opacity-70">{week.range}</div>
          </div>
          <button
            aria-label="Nächste Woche"
            onClick={() => setWeekIdx((i) => Math.min(WEEKS.length - 1, i + 1))}
            disabled={weekIdx === WEEKS.length - 1}
            className="p-1 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {!selectedState ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: t.sub }}>
                Bundesland wählen
              </h2>
              <button
                onClick={() => setNotify((n) => !n)}
                className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: notify ? t.green : "transparent",
                  color: notify ? "#fff" : t.green,
                  border: `1px solid ${t.green}`,
                }}
              >
                <Bell size={12} />
                {notify ? "Aktiv" : "Push aktivieren"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STATES.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className="text-left rounded-xl px-4 py-4 transition-transform active:scale-95"
                  style={{
                    background: t.cardBg,
                    border: `1.5px solid ${t.border}`,
                    color: t.ink,
                  }}
                >
                  <span className="font-semibold text-sm">{state}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedState(null)}
              className="flex items-center gap-1 text-sm font-medium mb-4"
              style={{ color: t.green }}
            >
              <ArrowLeft size={16} /> Zurück
            </button>

            {/* Receipt card */}
            <div className="torn-top" />
            <div style={{ background: t.cardBg }} className="px-5 pt-2 pb-4">
              <div className="text-center mb-4">
                <div className="display-font text-lg" style={{ color: t.ink }}>
                  {selectedState.toUpperCase()}
                </div>
                <div className="text-xs mono-font" style={{ color: t.sub }}>
                  TOP 10 · {week.label} · {week.range}
                </div>
              </div>

              <div className="border-t border-dashed mb-2" style={{ borderColor: t.border }} />

              <div className="space-y-2">
                {ranking.map((entry, i) => {
                  const rank = i + 1;
                  const isTop = rank === 1;
                  return (
                    <div
                      key={entry.name}
                      className="flex items-center justify-between py-1.5"
                      style={{
                        borderBottom: i < ranking.length - 1 ? `1px dotted ${t.border}` : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="mono-font text-xs font-semibold w-5 text-center rounded"
                          style={{
                            color: isTop ? "#fff" : t.ink,
                            background: isTop ? t.amber : "transparent",
                          }}
                        >
                          {rank}
                        </span>
                        <span className={`text-sm ${isTop ? "font-bold" : "font-medium"}`}>
                          {entry.name}
                        </span>
                      </div>
                      <span className="mono-font text-sm font-semibold" style={{ color: isTop ? t.green : t.ink }}>
                        {entry.score}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-dashed mt-3 pt-3" style={{ borderColor: t.border }}>
                <button
                  onClick={() => { setSettingsOpen(true); setSettingsTab("scoring"); }}
                  className="text-[11px] leading-snug underline decoration-dotted text-left"
                  style={{ color: t.sub }}
                >
                  Score = 65% Grundpreis-Niveau (Alltagsprodukte) + 35% Angebotstiefe. Wie wird
                  bewertet?
                </button>
              </div>
            </div>
            <div className="torn-bottom" />

            <p className="text-center text-xs mt-4" style={{ color: t.sub }}>
              Aktualisiert · Montag 07:00 Uhr
            </p>
          </>
        )}
      </div>

      {/* Settings overlay */}
      {settingsOpen && (
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center z-50"
          style={{ background: "#00000066" }}
          onClick={() => setSettingsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 sm:pb-6 max-h-[85vh] overflow-y-auto"
            style={{ background: t.cardBg, color: t.ink }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="display-font text-base">EINSTELLUNGEN</h2>
              <button aria-label="Schließen" onClick={() => setSettingsOpen(false)} style={{ color: t.sub }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              {[
                { id: "general", label: "Allgemein" },
                { id: "scoring", label: "Bewertung" },
                { id: "about", label: "Über" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSettingsTab(tab.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: settingsTab === tab.id ? t.green : "transparent",
                    color: settingsTab === tab.id ? "#fff" : t.sub,
                    border: `1px solid ${settingsTab === tab.id ? t.green : t.border}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {settingsTab === "general" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon size={16} /> : <Sun size={16} />}
                    <span className="text-sm font-medium">Darstellung</span>
                  </div>
                  <div className="flex rounded-full overflow-hidden border" style={{ borderColor: t.border }}>
                    <button
                      onClick={() => setIsDark(false)}
                      className="px-3 py-1.5 text-xs font-medium"
                      style={{ background: !isDark ? t.green : "transparent", color: !isDark ? "#fff" : t.sub }}
                    >
                      Hell
                    </button>
                    <button
                      onClick={() => setIsDark(true)}
                      className="px-3 py-1.5 text-xs font-medium"
                      style={{ background: isDark ? t.green : "transparent", color: isDark ? "#fff" : t.sub }}
                    >
                      Dunkel
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span className="text-sm font-medium">Push-Benachrichtigung</span>
                  </div>
                  <button
                    onClick={() => setNotify((n) => !n)}
                    className="w-10 h-6 rounded-full relative transition-colors"
                    style={{ background: notify ? t.green : t.border }}
                  >
                    <span
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                      style={{ left: notify ? "18px" : "2px" }}
                    />
                  </button>
                </div>
                <p className="text-[11px]" style={{ color: t.sub }}>
                  Bei aktivierter Benachrichtigung meldet sich Einkaufsradar jeden Montag um 7 Uhr mit
                  dem neuen Ranking für dein gewähltes Bundesland.
                </p>
              </div>
            )}

            {settingsTab === "scoring" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">So entsteht der Score</p>
                <div className="flex items-center gap-3">
                  <div className="mono-font text-lg font-bold" style={{ color: t.green }}>65%</div>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Grundpreis-Niveau: Preise eines festen Warenkorbs aus ca. 25 Alltagsprodukten
                    (Milch, Brot, Eier, Nudeln u.a.), erhoben je Händler und Region.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="mono-font text-lg font-bold" style={{ color: t.amber }}>35%</div>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Angebotstiefe: wie stark und wie breit ein Händler diese Woche rabattiert.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-[11px]" style={{ color: t.sub }}>
                    Niedrigster Gesamtpreis-Score = Platz 1. Die Gewichtung ist ein Modell, kein
                    amtlicher Wert, und wird laufend anhand von Nutzer-Feedback justiert.
                  </p>
                </div>
              </div>
            )}

            {settingsTab === "about" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info size={16} style={{ color: t.sub }} />
                  <p className="text-sm font-medium">Über Einkaufsradar</p>
                </div>
                <p className="text-xs" style={{ color: t.sub }}>
                  Einkaufsradar zeigt jede Woche, wo Lebensmittel-Einkauf in deinem Bundesland am
                  günstigsten ist — ohne Prospekte zu wälzen.
                </p>
                <div className="text-xs space-y-1" style={{ color: t.sub }}>
                  <div className="flex justify-between"><span>Version</span><span className="mono-font">0.1 · Prototyp</span></div>
                  <div className="flex justify-between"><span>Datenstand</span><span className="mono-font">{week.label}</span></div>
                  <div className="flex justify-between"><span>Nächstes Update</span><span className="mono-font">Mo. 07:00</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}