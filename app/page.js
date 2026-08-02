"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowUp, ArrowDown, Minus, Bell, TrendingDown, Settings, X, Sun, Moon, Info, Mail, Trophy, Share2, Truck } from "lucide-react";

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
  "Berlin", "Nordrhein-Westfalen", "Sachsen", "Bremen", "Bayern", "Hessen",
  "Niedersachsen", "Hamburg", "Baden-Württemberg", "Sachsen-Anhalt",
  "Thüringen", "Rheinland-Pfalz", "Schleswig-Holstein", "Brandenburg",
  "Saarland", "Mecklenburg-Vorpommern",
].sort((a, b) => a.localeCompare(b, "de"));

// Recherchierte, bundeslandspezifische Top-10-Ketten (siehe Einkaufsradar-Ketten-Liste.md)
const STATE_CHAINS = {
  "Baden-Württemberg": ["Aldi Süd", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Norma", "Hieber", "Globus"],
  "Bayern": ["Aldi Süd", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Norma", "V-Markt", "Globus"],
  "Berlin": ["Aldi Nord", "Lidl", "Rewe", "Edeka", "Kaufland", "Penny", "Netto", "Netto Nord", "Norma", "Bio Company"],
  "Brandenburg": ["Aldi Nord", "Lidl", "Rewe", "Edeka", "Kaufland", "Penny", "Netto", "Netto Nord", "Norma", "Bio Company"],
  "Bremen": ["Aldi Nord", "Lidl", "Rewe", "Edeka", "Kaufland", "Penny", "Netto", "Combi", "famila", "Marktkauf"],
  "Hamburg": ["Aldi Nord", "Edeka", "Rewe", "Lidl", "Kaufland", "Penny", "Netto", "Netto Nord", "famila", "Globus"],
  "Hessen": ["Edeka", "Rewe", "Aldi Süd", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "tegut", "Norma"],
  "Mecklenburg-Vorpommern": ["Aldi Nord", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Netto Nord", "Norma", "famila"],
  "Niedersachsen": ["Edeka", "Rewe", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "Combi", "famila", "K+K"],
  "Nordrhein-Westfalen": ["Edeka", "Rewe", "Aldi Süd", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "K+K", "HIT"],
  "Rheinland-Pfalz": ["Aldi Süd", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Norma", "Wasgau", "Globus"],
  "Saarland": ["Aldi Süd", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Globus", "Norma", "Wasgau"],
  "Sachsen": ["Edeka", "Rewe", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "Netto Nord", "Konsum", "Norma"],
  "Sachsen-Anhalt": ["Edeka", "Rewe", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "Netto Nord", "Norma", "NP"],
  "Schleswig-Holstein": ["Aldi Nord", "Lidl", "Edeka", "Rewe", "Kaufland", "Penny", "Netto", "Netto Nord", "famila", "Markant"],
  "Thüringen": ["Edeka", "Rewe", "Aldi Nord", "Lidl", "Kaufland", "Penny", "Netto", "tegut", "Norma", "Aldi Süd"],
};

// Bundesweiter, 17. Auswahl-Punkt: Online-Lieferdienste (kein Bundesland-Bezug).
// Bewusst getrennt von STATE_CHAINS, weil hier andere Anbieter/Logik gelten (siehe Briefing).
const ONLINE_DELIVERY = "Online-Lieferdienst";
const ONLINE_CHAINS = ["Rewe", "myTime", "Edeka24", "Flaschenpost", "Knuspr", "Picnic", "Flink"];

// Berechnet Prozent-Differenz zum Guenstigsten (Platz 1 = "Bester Preis").
// Maximale Differenz ist bewusst auf 30% begrenzt, damit die Werte realistisch wirken.
function seededScores(seed, chains) {
  if (!chains || chains.length === 0) return [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const raw = chains.map((name) => ({ name, raw: rand() * 30 }));
  raw.sort((a, b) => a.raw - b.raw);
  const minRaw = raw[0].raw;
  return raw.map((entry) => ({
    name: entry.name,
    diffPercent: Math.round(entry.raw - minRaw),
  }));
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
  { label: "KW 29", range: "13.07 – 19.07" },
  { label: "KW 30", range: "20.07 – 26.07" },
  { label: "KW 31", range: "27.07 – 02.08" },
  { label: "KW 32", range: "03.08 – 09.08" },
  { label: "KW 33", range: "10.08 – 16.08" },
];

export default function Home() {
  const [weekIdx, setWeekIdx] = useState(WEEKS.length - 1);
  const [selectedState, setSelectedState] = useState(null);
  const [notify, setNotify] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [monthlyOpen, setMonthlyOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const t = isDark ? THEMES.dark : THEMES.light;
  const week = WEEKS[weekIdx];
  const isOnlineDelivery = selectedState === ONLINE_DELIVERY;

  const ranking = useMemo(() => {
    if (!selectedState) return [];
    const chains = isOnlineDelivery ? ONLINE_CHAINS : (STATE_CHAINS[selectedState] || []);
    const currentWeek = WEEKS[weekIdx];
    const current = seededScores(hashOf(selectedState + currentWeek.label), chains);

    // Trend bezieht sich bewusst ausschließlich auf die direkte Vorwoche, nie kumulativ.
    if (weekIdx === 0) {
      return current.map((entry) => ({ ...entry, trend: null }));
    }
    const prevWeek = WEEKS[weekIdx - 1];
    const previous = seededScores(hashOf(selectedState + prevWeek.label), chains);
    const prevRankByName = {};
    previous.forEach((entry, i) => { prevRankByName[entry.name] = i + 1; });

    return current.map((entry, i) => {
      const currentRank = i + 1;
      const prevRank = prevRankByName[entry.name];
      let trend = null;
      if (prevRank !== undefined) {
        trend = currentRank < prevRank ? "up" : currentRank > prevRank ? "down" : "same";
      }
      return { ...entry, trend };
    });
  }, [selectedState, isOnlineDelivery, weekIdx]);

  // Beim ersten Laden: zuletzt gewähltes Bundesland, Darstellung und Push-Status wiederherstellen
  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem("einkaufsradar_last_state");
      // Nur wiederherstellen, wenn der gespeicherte Wert noch ein gültiges Bundesland
      // oder der Online-Lieferdienst ist – sonst könnte ein veralteter/ungültiger Wert
      // (z. B. nach einer Umbenennung) beim Laden zum Absturz führen.
      const isValidSaved = savedState && (STATE_CHAINS[savedState] || savedState === ONLINE_DELIVERY);
      if (isValidSaved) setSelectedState(savedState);
      const savedDark = window.localStorage.getItem("einkaufsradar_dark_mode");
      if (savedDark) setIsDark(savedDark === "dark");
      const savedNotify = window.localStorage.getItem("einkaufsradar_notify");
      if (savedNotify) setNotify(savedNotify === "true");
    } catch (e) {
      // localStorage nicht verfügbar – einfach ignorieren
    }
  }, []);

  // Bei jeder Auswahl: neues Bundesland merken
  const chooseState = (state) => {
    setSelectedState(state);
    try {
      window.localStorage.setItem("einkaufsradar_last_state", state);
    } catch (e) {
      // ignorieren, falls nicht verfügbar
    }
  };

  // Bei jedem Wechsel: Darstellung (Hell/Dunkel) merken
  const setDarkMode = (value) => {
    setIsDark(value);
    try {
      window.localStorage.setItem("einkaufsradar_dark_mode", value ? "dark" : "light");
    } catch (e) {
      // ignorieren, falls nicht verfügbar
    }
  };

  // Bei jedem Wechsel: Push-Benachrichtigung-Status merken
  const toggleNotify = () => {
    setNotify((n) => {
      const next = !n;
      try {
        window.localStorage.setItem("einkaufsradar_notify", String(next));
      } catch (e) {
        // ignorieren, falls nicht verfügbar
      }
      return next;
    });
  };

  const handleShare = async () => {
    const topEntry = ranking[0];
    let text = "Einkaufsradar – der wöchentliche Lebensmittel-Preisvergleich für dein Bundesland – einkaufsradar.com";
    if (topEntry) {
      text = isOnlineDelivery
        ? `${topEntry.name} ist diese Woche bei den Online-Lieferdiensten am günstigsten – einkaufsradar.com`
        : `${topEntry.name} ist diese Woche in ${selectedState} am günstigsten – einkaufsradar.com`;
    }

    // Natives Teilen-Menü, falls verfügbar (z. B. am Handy)
    if (navigator.share) {
      try {
        await navigator.share({ text, url: "https://einkaufsradar.com" });
      } catch (e) {
        // Nutzer hat den Teilen-Dialog abgebrochen – bewusst nichts weiter tun
      }
      return;
    }

    // Fallback nur, wenn kein natives Teilen-Menü existiert (z. B. am Desktop)
    try {
      await navigator.clipboard.writeText(`${text} https://einkaufsradar.com`);
      setShareMsg("Link kopiert!");
      setTimeout(() => setShareMsg(""), 2000);
    } catch (e) {
      setShareMsg("Teilen nicht möglich");
      setTimeout(() => setShareMsg(""), 2000);
    }
  };

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
        button:not(:disabled) {
          cursor: pointer;
        }
        /* Hover-Feedback nur bei echter Maus (Desktop) – auf Touchscreens
           bliebe ein Hover-Zustand sonst nach dem Antippen hängen. */
        @media (hover: hover) and (pointer: fine) {
          button:not(:disabled) {
            transition: filter 0.15s, transform 0.15s;
          }
          button:not(:disabled):hover {
            filter: brightness(0.95);
          }
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
          <div className="flex items-center gap-1">
            {!selectedState && (
              <button
                aria-label="Teilen"
                onClick={handleShare}
                className="p-2 rounded-full active:scale-95 transition-transform"
                style={{ color: t.sub }}
              >
                <Share2 size={20} />
              </button>
            )}
            <button
              aria-label="Monatsbestenliste"
              onClick={() => setMonthlyOpen(true)}
              className="p-2 rounded-full active:scale-95 transition-transform"
              style={{ color: t.sub }}
            >
              <Trophy size={20} />
            </button>
            <button
              aria-label="Einstellungen"
              onClick={() => { setSettingsOpen(true); setSettingsTab("general"); }}
              className="p-2 rounded-full active:scale-95 transition-transform"
              style={{ color: t.sub }}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm mb-6 text-center" style={{ color: t.sub }}>
          Der wöchentliche Lebensmittel-Preisvergleich für dein Bundesland.
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
                onClick={toggleNotify}
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
                  onClick={() => chooseState(state)}
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

            {/* Zusätzlicher, bundesweiter Punkt — bewusst unterhalb der Bundesländer und
                doppelt so breit, damit er als sinnvoller Zusatz wirkt, nicht als 17. Bundesland */}
            <button
              onClick={() => chooseState(ONLINE_DELIVERY)}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-4 mt-3 transition-transform active:scale-95"
              style={{
                background: t.cardBg,
                border: `1.5px solid ${t.border}`,
                color: t.ink,
              }}
            >
              <Truck size={16} style={{ color: t.green }} />
              <span className="font-semibold text-sm">Online-Lieferdienst</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedState(null)}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: t.green }}
              >
                <ArrowLeft size={16} /> Zurück
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color: t.green }}
              >
                <Share2 size={16} /> {shareMsg || "Teilen"}
              </button>
            </div>

            {/* Receipt card */}
            <div className="torn-top" />
            <div style={{ background: t.cardBg }} className="px-5 pt-2 pb-4">
              <div className="text-center mb-4">
                <div className="display-font text-lg" style={{ color: t.ink }}>
                  {selectedState.toUpperCase()}
                </div>
                <div className="text-xs mono-font" style={{ color: t.sub }}>
                  TOP {ranking.length} · {week.label} · {week.range}
                </div>
              </div>

              <div className="border-t border-dashed mb-2" style={{ borderColor: t.border }} />

              <div className="space-y-2">
                {ranking.map((entry, i) => {
                  const rank = i + 1;
                  const isTop = rank === 1;
                  const isPodium = rank <= 3;
                  const medalColor =
                    rank === 1 ? "#D4AF37" : rank === 2 ? "#A8A8A8" : rank === 3 ? "#B5651D" : null;
                  return (
                    <div
                      key={entry.name}
                      className={`flex items-center justify-between px-3 rounded-lg ${isPodium ? "py-2.5" : "py-1.5"}`}
                      style={{
                        background: isPodium ? `${medalColor}1A` : "transparent",
                        border: isPodium ? `1px solid ${medalColor}55` : "none",
                        borderBottom: !isPodium && i < ranking.length - 1 ? `1px dotted ${t.border}` : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="mono-font text-xs font-bold w-6 h-6 flex items-center justify-center rounded"
                          style={{
                            color: isPodium ? "#fff" : t.ink,
                            background: isPodium ? medalColor : "transparent",
                          }}
                        >
                          {rank}
                        </span>
                        {entry.trend && (
                          <span
                            title={
                              entry.trend === "up"
                                ? "Besser als letzte Woche"
                                : entry.trend === "down"
                                ? "Schlechter als letzte Woche"
                                : "Unverändert zur letzten Woche"
                            }
                            className="flex items-center flex-shrink-0"
                          >
                            {entry.trend === "up" && <ArrowUp size={14} strokeWidth={2.5} color={t.green} />}
                            {entry.trend === "down" && <ArrowDown size={14} strokeWidth={2.5} color={t.amber} />}
                            {entry.trend === "same" && <Minus size={14} strokeWidth={2.5} color={t.sub} />}
                          </span>
                        )}
                        <span className={`text-sm ${isPodium ? "font-bold" : "font-medium"}`} style={{ fontSize: isPodium ? "0.95rem" : undefined }}>
                          {entry.name}
                        </span>
                      </div>
                      <span className="mono-font text-sm font-semibold" style={{ color: isTop ? t.green : t.ink }}>
                        {isTop ? "Bester Preis" : `+${Math.max(1, entry.diffPercent)}% Teurer`}
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
                  Alle Werte beziehen sich auf den günstigsten Anbieter dieser Woche. Wie wird
                  bewertet?
                </button>
              </div>
            </div>
            <div className="torn-bottom" />

            <p className="text-center text-xs mt-4" style={{ color: t.sub }}>
              Aktualisiert · Montag 08:00 Uhr
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
                      onClick={() => setDarkMode(false)}
                      className="px-3 py-1.5 text-xs font-medium"
                      style={{ background: !isDark ? t.green : "transparent", color: !isDark ? "#fff" : t.sub }}
                    >
                      Hell
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
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
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      background: notify ? t.green : "transparent",
                      color: notify ? "#fff" : t.sub,
                      border: `1px solid ${notify ? t.green : t.border}`,
                    }}
                  >
                    {notify ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <p className="text-xs" style={{ color: t.sub }}>
                  Bei aktivierter Push-Benachrichtigung meldet sich Einkaufsradar jeden Montag um 8 Uhr mit
                  dem neuen Ranking für dein Bundesland. Ein-/ausschalten geht über den
                  Button auf der Startseite.
                </p>

                <div className="border-t border-dashed pt-4 mt-1" style={{ borderColor: t.border }}>
                  <div
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 opacity-60"
                    style={{ background: t.pageBg }}
                  >
                    <div className="flex items-center gap-2">
                      <Mail size={16} style={{ color: t.sub }} />
                      <span className="text-sm font-medium">Feedback senden</span>
                    </div>
                    <span className="text-xs" style={{ color: t.sub }}>bald verfügbar</span>
                  </div>
                  <p className="text-xs mt-2" style={{ color: t.sub }}>
                    Öffnet dein Mail-Programm mit einer vorausgefüllten Nachricht an uns.
                  </p>
                </div>
              </div>
            )}

            {settingsTab === "scoring" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">So entsteht die Rangliste</p>
                <p className="text-xs" style={{ color: t.sub }}>
                  Der jeweils günstigste Anbieter der Woche wird als Bester Preis ausgewiesen.
                  Alle weiteren Plätze zeigen, um wie viel Prozent sie im Vergleich dazu teurer
                  ausfallen. Der kleine Pfeil neben dem Rang zeigt, ob sich eine Kette gegenüber
                  der Vorwoche verbessert oder verschlechtert hat.
                </p>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Bundesländer</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Die Rangfolge basiert auf einem festen Warenkorb aus Alltagsprodukten
                    (Getreideprodukte, Milchprodukte, Fleisch, Fisch, Eier, Kartoffeln, Gemüse,
                    Obst, Hülsenfrüchte, Pflanzliche Produkte und Wasser) sowie den aktuellen
                    Wochenangeboten je Händler. Die Gewichtung liegt bei 65 % Alltagsprodukten und
                    35 % Angeboten.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Online-Lieferdienst</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Da sich die Sortimente der Anbieter leicht unterscheiden, ist ein fester
                    Warenkorbvergleich hier nicht sachgerecht. Bewertet werden daher
                    ausschließlich die aktuellen Wochenangebote.
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
                  Einkaufsradar ermittelt jede Woche, in welchem Supermarkt deines
                  Bundeslandes der Lebensmitteleinkauf am günstigsten ausfällt. Verlässlich
                  recherchiert, erspart dir den mühsamen Preisvergleich und das Blättern
                  durch Prospekte.
                </p>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Die angezeigten Werte sind Durchschnittswerte auf Bundeslandebene. Tatsächliche
                    Preise können je nach Filiale, Stadt oder Kommune leicht abweichen.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2 text-xs space-y-1" style={{ borderColor: t.border, color: t.sub }}>
                  <div className="flex justify-between"><span>Version</span><span className="mono-font">0.3 · Prototyp</span></div>
                  <div className="flex justify-between"><span>Datenstand</span><span className="mono-font">{week.label}</span></div>
                  <div className="flex justify-between"><span>Nächstes Update</span><span className="mono-font">Mo. 08:00</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly podium overlay */}
      {monthlyOpen && (
        <div
          className="fixed inset-0 flex items-end sm:items-center justify-center z-50"
          style={{ background: "#00000066" }}
          onClick={() => setMonthlyOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 sm:pb-6"
            style={{ background: t.cardBg, color: t.ink }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="display-font text-base">MONATSBESTENLISTE</h2>
              <button aria-label="Schließen" onClick={() => setMonthlyOpen(false)} style={{ color: t.sub }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex items-end justify-center gap-3 mb-5 opacity-50">
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#A8A8A8" }}>2</div>
                <div className="w-16 h-14 rounded-t-md" style={{ background: t.border }} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "#D4AF37" }}>1</div>
                <div className="w-16 h-20 rounded-t-md" style={{ background: t.border }} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "#B5651D" }}>3</div>
                <div className="w-16 h-10 rounded-t-md" style={{ background: t.border }} />
              </div>
            </div>

            <p className="text-sm text-center font-medium mb-1">Bald verfügbar</p>
            <p className="text-xs text-center" style={{ color: t.sub }}>
              Sobald ausreichend Wochendaten vorliegen, zeigen wir dir hier, welcher
              Händler im vergangenen Monat am häufigsten die günstigsten Preise bot.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}