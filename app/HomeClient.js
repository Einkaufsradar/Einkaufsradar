"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowUp, ArrowDown, Minus, Bell, TrendingDown, Settings, X, Sun, Moon, Info, Mail, Trophy, Share2, Truck, FileText, Shield, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const FEEDBACK_EMAIL = "einkaufsradar@gmail.com";

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

const ONLINE_DELIVERY = "Online-Lieferdienst";
const ONLINE_CHAINS = ["Rewe", "myTime", "Edeka24", "Flaschenpost", "Knuspr", "Picnic", "Flink"];

const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getISOWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function formatDayMonth(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

function buildWeeks(numWeeks) {
  const weeks = [];
  const currentMonday = getMonday(new Date());
  for (let i = numWeeks - 1; i >= 0; i--) {
    const monday = new Date(currentMonday);
    monday.setDate(monday.getDate() - i * 7);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    weeks.push({
      label: `KW ${getISOWeekNumber(monday)}`,
      range: `${formatDayMonth(monday)} – ${formatDayMonth(sunday)}`,
      monday,
    });
  }
  return weeks;
}

function formatErhobenDate(isoDateString) {
  if (!isoDateString) return null;
  const d = new Date(isoDateString);
  if (isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

const WEEKS = buildWeeks(10);

function getPreviousMonthLabel() {
  const now = new Date();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfPrevMonth = new Date(firstOfThisMonth.getTime() - 1);
  return `${MONTH_NAMES[lastOfPrevMonth.getMonth()]} ${lastOfPrevMonth.getFullYear()}`;
}

function getPreviousMonthWeeks(weeksList) {
  const now = new Date();
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfPrevMonth = new Date(firstOfThisMonth.getTime() - 1);
  const targetMonth = lastOfPrevMonth.getMonth();
  const targetYear = lastOfPrevMonth.getFullYear();
  return weeksList.filter(
    (w) => w.monday.getMonth() === targetMonth && w.monday.getFullYear() === targetYear
  );
}

function getCurrentMonthLabel() {
  const now = new Date();
  return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
}

function getDaysUntilNextEvaluation() {
  const now = new Date();
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffMs = firstOfNextMonth.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export default function HomeClient() {
  const [weekIdx, setWeekIdx] = useState(WEEKS.length - 1);
  const [selectedState, setSelectedState] = useState(null);
  const [notify, setNotify] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [monthlyOpen, setMonthlyOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [ranking, setRanking] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [erhobenAm, setErhobenAm] = useState(null);
  const [monthlyTop, setMonthlyTop] = useState([]);
  const [monthlyTotalWeeks, setMonthlyTotalWeeks] = useState(0);

  const t = isDark ? THEMES.dark : THEMES.light;
  const week = WEEKS[weekIdx];
  const isOnlineDelivery = selectedState === ONLINE_DELIVERY;

  useEffect(() => {
    if (!selectedState) {
      setRanking([]);
      setLoadError(false);
      setErhobenAm(null);
      return;
    }

    let isCancelled = false;

    async function loadRanking() {
      setRankingLoading(true);
      setLoadError(false);
      const currentWeek = WEEKS[weekIdx];

      const { data: currentData, error: currentError } = await supabase
        .from("preise")
        .select("chain, price, erhoben_am")
        .eq("region", selectedState)
        .eq("week", currentWeek.label);

      if (currentError) {
        console.error("Fehler beim Laden der Preise:", currentError);
        if (!isCancelled) {
          setRanking([]);
          setLoadError(true);
          setErhobenAm(null);
          setRankingLoading(false);
        }
        return;
      }
      if (!currentData || currentData.length === 0) {
        if (!isCancelled) {
          setRanking([]);
          setErhobenAm(null);
          setRankingLoading(false);
        }
        return;
      }

      const sortedCurrent = [...currentData].sort((a, b) => a.price - b.price);
      const bestPrice = sortedCurrent[0].price;
      const currentRanking = sortedCurrent.map((entry) => ({
        name: entry.chain,
        diffPercent: Math.round(((entry.price - bestPrice) / bestPrice) * 100),
      }));
      const weekErhobenAm = formatErhobenDate(sortedCurrent[0]?.erhoben_am);

      if (weekIdx === 0) {
        if (!isCancelled) {
          setRanking(currentRanking.map((entry) => ({ ...entry, trend: null })));
          setErhobenAm(weekErhobenAm);
          setRankingLoading(false);
        }
        return;
      }

      const prevWeek = WEEKS[weekIdx - 1];
      const { data: prevData } = await supabase
        .from("preise")
        .select("chain, price")
        .eq("region", selectedState)
        .eq("week", prevWeek.label);

      if (!prevData || prevData.length === 0) {
        if (!isCancelled) {
          setRanking(currentRanking.map((entry) => ({ ...entry, trend: null })));
          setErhobenAm(weekErhobenAm);
          setRankingLoading(false);
        }
        return;
      }

      const sortedPrev = [...prevData].sort((a, b) => a.price - b.price);
      const prevRankByName = {};
      sortedPrev.forEach((entry, i) => { prevRankByName[entry.chain] = i + 1; });

      const finalRanking = currentRanking.map((entry, i) => {
        const currentRank = i + 1;
        const prevRank = prevRankByName[entry.name];
        let trend = null;
        if (prevRank !== undefined) {
          trend = currentRank < prevRank ? "up" : currentRank > prevRank ? "down" : "same";
        }
        return { ...entry, trend };
      });

      if (!isCancelled) {
        setRanking(finalRanking);
        setErhobenAm(weekErhobenAm);
        setRankingLoading(false);
      }
    }

    loadRanking();

    return () => { isCancelled = true; };
  }, [selectedState, isOnlineDelivery, weekIdx]);

  useEffect(() => {
    if (!monthlyOpen || !selectedState) {
      setMonthlyTop([]);
      setMonthlyTotalWeeks(0);
      return;
    }

    let isCancelled = false;

    async function loadMonthly() {
      const prevWeeks = getPreviousMonthWeeks(WEEKS);
      if (prevWeeks.length === 0) {
        if (!isCancelled) { setMonthlyTop([]); setMonthlyTotalWeeks(0); }
        return;
      }

      const weekLabels = prevWeeks.map((w) => w.label);

      const { data, error } = await supabase
        .from("preise")
        .select("week, chain, price")
        .eq("region", selectedState)
        .in("week", weekLabels);

      if (error || !data || data.length === 0) {
        if (!isCancelled) { setMonthlyTop([]); setMonthlyTotalWeeks(0); }
        return;
      }

      const priceSumsByChain = {};
      const priceCountsByChain = {};
      const weeksPresent = new Set();
      data.forEach((row) => {
        weeksPresent.add(row.week);
        priceSumsByChain[row.chain] = (priceSumsByChain[row.chain] || 0) + row.price;
        priceCountsByChain[row.chain] = (priceCountsByChain[row.chain] || 0) + 1;
      });

      const averages = Object.keys(priceSumsByChain).map((chain) => ({
        chain,
        avgPrice: priceSumsByChain[chain] / priceCountsByChain[chain],
      }));
      averages.sort((a, b) => a.avgPrice - b.avgPrice);

      const bestAvg = averages[0]?.avgPrice;
      const withDiff = averages.map((entry) => ({
        chain: entry.chain,
        diffPercent: bestAvg ? Math.round(((entry.avgPrice - bestAvg) / bestAvg) * 100) : 0,
      }));

      if (!isCancelled) {
        setMonthlyTop(withDiff.slice(0, 3));
        setMonthlyTotalWeeks(weeksPresent.size);
      }
    }

    loadMonthly();

    return () => { isCancelled = true; };
  }, [monthlyOpen, selectedState]);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem("einkaufsradar_last_state");
      const isValidSaved = savedState && (STATE_CHAINS[savedState] || savedState === ONLINE_DELIVERY);
      if (isValidSaved) setSelectedState(savedState);

      const savedDark = window.localStorage.getItem("einkaufsradar_dark_mode");
      if (savedDark) {
        setIsDark(savedDark === "dark");
      } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
      }

      const savedNotify = window.localStorage.getItem("einkaufsradar_notify");
      if (savedNotify) setNotify(savedNotify === "true");
    } catch (e) {
      // localStorage nicht verfügbar – einfach ignorieren
    }
  }, []);

  const chooseState = (state) => {
    setSelectedState(state);
    try {
      window.localStorage.setItem("einkaufsradar_last_state", state);
    } catch (e) {
      // ignorieren, falls nicht verfügbar
    }
  };

  const goHome = () => {
    setSelectedState(null);
    try {
      window.localStorage.setItem("einkaufsradar_last_state", "");
    } catch (e) {
      // ignorieren, falls nicht verfügbar
    }
  };

  const setDarkMode = (value) => {
    setIsDark(value);
    try {
      window.localStorage.setItem("einkaufsradar_dark_mode", value ? "dark" : "light");
    } catch (e) {
      // ignorieren, falls nicht verfügbar
    }
  };

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

    if (navigator.share) {
      try {
        await navigator.share({ text, url: "https://einkaufsradar.com" });
      } catch (e) {
        // Nutzer hat den Teilen-Dialog abgebrochen – bewusst nichts weiter tun
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${text} https://einkaufsradar.com`);
      setShareMsg("Link kopiert!");
      setTimeout(() => setShareMsg(""), 2000);
    } catch (e) {
      setShareMsg("Teilen nicht möglich");
      setTimeout(() => setShareMsg(""), 2000);
    }
  };

  const feedbackMailto = "mailto:" + FEEDBACK_EMAIL + "?subject=" + encodeURIComponent("Feedback zu Einkaufsradar");

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
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: t.green }}>
              <TrendingDown size={16} color="#fff" />
            </div>
            <h1 className="display-font text-xl tracking-tight" style={{ color: t.ink }}>
              EINKAUFSRADAR
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {!selectedState && (
              <button aria-label="Teilen" onClick={handleShare} className="p-2 rounded-full active:scale-95 transition-transform" style={{ color: t.sub }}>
                <Share2 size={20} />
              </button>
            )}
            <button aria-label="Monatsbestenliste" onClick={() => setMonthlyOpen(true)} className="p-2 rounded-full active:scale-95 transition-transform" style={{ color: t.sub }}>
              <Trophy size={20} />
            </button>
            <button aria-label="Einstellungen" onClick={() => { setSettingsOpen(true); setSettingsTab("general"); }} className="p-2 rounded-full active:scale-95 transition-transform" style={{ color: t.sub }}>
              <Settings size={20} />
            </button>
          </div>
        </div>
        <p className="text-sm mb-3 text-center" style={{ color: t.sub }}>
          Der wöchentliche Lebensmittel-Preisvergleich für dein Bundesland.
        </p>

        <div
          className="flex items-start gap-2 rounded-lg px-3 py-2 mb-5"
          style={{ background: `${t.amber}1A`, border: `1px solid ${t.amber}55` }}
        >
          <AlertCircle size={14} style={{ color: t.amber, marginTop: 2, flexShrink: 0 }} />
          <p className="text-xs leading-snug" style={{ color: t.sub }}>
            Einkaufsradar befindet sich im Testbetrieb. Die angezeigten Werte sind
            aktuell noch Testdaten und werden schrittweise durch recherchierte
            Werte ersetzt.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-6 mono-font" style={{ background: t.ink, color: t.pageBg }}>
          <button aria-label="Vorherige Woche" onClick={() => setWeekIdx((i) => Math.max(0, i - 1))} disabled={weekIdx === 0} className="p-1 disabled:opacity-30">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold tracking-widest">{week.label}</div>
            <div className="text-xs opacity-70">{week.range}</div>
          </div>
          <button aria-label="Nächste Woche" onClick={() => setWeekIdx((i) => Math.min(WEEKS.length - 1, i + 1))} disabled={weekIdx === WEEKS.length - 1} className="p-1 disabled:opacity-30">
            <ChevronRight size={20} />
          </button>
        </div>

        {!selectedState ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: t.sub }}>
                Bundesland wählen
              </h2>
              <button onClick={toggleNotify} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" style={{ background: notify ? t.green : "transparent", color: notify ? "#fff" : t.green, border: `1px solid ${t.green}` }}>
                <Bell size={12} />
                {notify ? "Aktiv" : "Push aktivieren"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STATES.map((state) => (
                <button key={state} onClick={() => chooseState(state)} className="text-left rounded-xl px-4 py-4 transition-transform active:scale-95" style={{ background: t.cardBg, border: `1.5px solid ${t.border}`, color: t.ink }}>
                  <span className="font-semibold text-sm">{state}</span>
                </button>
              ))}
            </div>

            <button onClick={() => chooseState(ONLINE_DELIVERY)} className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-4 mt-3 transition-transform active:scale-95" style={{ background: t.cardBg, border: `1.5px solid ${t.border}`, color: t.ink }}>
              <Truck size={16} style={{ color: t.green }} />
              <span className="font-semibold text-sm">Online-Lieferdienst</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={goHome} className="flex items-center gap-1 text-sm font-medium" style={{ color: t.green }}>
                <ArrowLeft size={16} /> Zurück
              </button>
              <button onClick={handleShare} className="flex items-center gap-1 text-sm font-medium" style={{ color: t.green }}>
                <Share2 size={16} /> {shareMsg || "Teilen"}
              </button>
            </div>

            <div className="torn-top" />
            <div style={{ background: t.cardBg }} className="px-5 pt-2 pb-4">
              <div className="text-center mb-4">
                <div className="display-font text-lg" style={{ color: t.ink }}>
                  {selectedState.toUpperCase()}
                </div>
                <div className="text-xs mono-font" style={{ color: t.sub }}>
                  TOP {ranking.length} · {week.label} · {week.range}
                </div>
                {erhobenAm && (
                  <div className="text-xs mono-font mt-0.5" style={{ color: t.sub }}>
                    Erhoben am {erhobenAm}
                  </div>
                )}
              </div>

              <div className="border-t border-dashed mb-2" style={{ borderColor: t.border }} />

              {loadError && (
                <p className="text-sm text-center py-6" style={{ color: t.sub }}>
                  Die Preise konnten gerade nicht geladen werden. Bitte versuch es später erneut.
                </p>
              )}

              {!loadError && !rankingLoading && ranking.length === 0 && (
                <p className="text-sm text-center py-6" style={{ color: t.sub }}>
                  Für {selectedState} liegen für {week.label} noch keine Preise vor.
                </p>
              )}

              {!loadError && ranking.length > 0 && (
                <div className="space-y-2">
                  {ranking.map((entry, i) => {
                    const rank = i + 1;
                    const isTop = rank === 1;
                    const isPodium = rank <= 3;
                    const medalColor = rank === 1 ? "#D4AF37" : rank === 2 ? "#A8A8A8" : rank === 3 ? "#B5651D" : null;
                    return (
                      <div key={entry.name} className={`flex items-center justify-between px-3 rounded-lg ${isPodium ? "py-2.5" : "py-1.5"}`} style={{ background: isPodium ? `${medalColor}1A` : "transparent", border: isPodium ? `1px solid ${medalColor}55` : "none", borderBottom: !isPodium && i < ranking.length - 1 ? `1px dotted ${t.border}` : undefined }}>
                        <div className="flex items-center gap-3">
                          <span className="mono-font text-xs font-bold w-6 h-6 flex items-center justify-center rounded" style={{ color: isPodium ? "#fff" : t.ink, background: isPodium ? medalColor : "transparent" }}>
                            {rank}
                          </span>
                          {entry.trend && (
                            <span title={entry.trend === "up" ? "Besser als letzte Woche" : entry.trend === "down" ? "Schlechter als letzte Woche" : "Unverändert zur letzten Woche"} className="flex items-center flex-shrink-0">
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
              )}

              <div className="border-t border-dashed mt-3 pt-3" style={{ borderColor: t.border }}>
                <button onClick={() => { setSettingsOpen(true); setSettingsTab("scoring"); }} className="text-[11px] leading-snug underline decoration-dotted text-left" style={{ color: t.sub }}>
                  Alle Werte beziehen sich auf den günstigsten Anbieter dieser Woche. Wie wird bewertet?
                </button>
              </div>
            </div>
            <div className="torn-bottom" />
          </>
        )}
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50" style={{ background: "#00000066" }} onClick={() => setSettingsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 sm:pb-6 max-h-[85vh] overflow-y-auto" style={{ background: t.cardBg, color: t.ink }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="display-font text-base">EINSTELLUNGEN</h2>
              <button aria-label="Schließen" onClick={() => setSettingsOpen(false)} style={{ color: t.sub }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
              {[
                { id: "general", label: "Allgemein" },
                { id: "scoring", label: "Bewertung" },
                { id: "hints", label: "Hinweise" },
                { id: "about", label: "Über" },
              ].map((tab) => (
                <button key={tab.id} onClick={() => setSettingsTab(tab.id)} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: settingsTab === tab.id ? t.green : "transparent", color: settingsTab === tab.id ? "#fff" : t.sub, border: `1px solid ${settingsTab === tab.id ? t.green : t.border}` }}>
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
                    <button onClick={() => setDarkMode(false)} className="px-3 py-1.5 text-xs font-medium" style={{ background: !isDark ? t.green : "transparent", color: !isDark ? "#fff" : t.sub }}>
                      Hell
                    </button>
                    <button onClick={() => setDarkMode(true)} className="px-3 py-1.5 text-xs font-medium" style={{ background: isDark ? t.green : "transparent", color: isDark ? "#fff" : t.sub }}>
                      Dunkel
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span className="text-sm font-medium">Push-Benachrichtigung</span>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: notify ? t.green : "transparent", color: notify ? "#fff" : t.sub, border: `1px solid ${notify ? t.green : t.border}` }}>
                    {notify ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <p className="text-xs" style={{ color: t.sub }}>
                  Bei aktivierter Push-Benachrichtigung meldet sich Einkaufsradar jeden Sonntag um 18 Uhr mit dem neuen Ranking für dein Bundesland. Ein-/ausschalten geht über den Button auf der Startseite.
                </p>

                <div className="border-t border-dashed pt-4 mt-1" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Wöchentliche Aktualisierung</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Jede neue Kalenderwoche steht automatisch ab Montag 00:00 Uhr zur Verfügung, sobald die entsprechenden Preise recherchiert und eingetragen wurden.
                  </p>
                </div>

                <div className="border-t border-dashed pt-4 mt-1" style={{ borderColor: t.border }}>
                  <a href={feedbackMailto} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: t.pageBg, textDecoration: "none" }}>
                    <span className="flex items-center gap-2">
                      <Mail size={16} style={{ color: t.sub }} />
                      <span className="text-sm font-medium" style={{ color: t.ink }}>Feedback senden</span>
                    </span>
                    <span className="text-xs" style={{ color: t.green }}>öffnen</span>
                  </a>
                  <p className="text-xs mt-2" style={{ color: t.sub }}>
                    Öffnet dein Mail-Programm mit einer vorausgefüllten Nachricht an uns.
                  </p>
                </div>
              </div>
            )}

            {settingsTab === "scoring" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">So entsteht die Rangliste</p>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Bundesländer</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Bei Handelsketten mit einem öffentlich einsehbaren Online-Shop werden
                    zusätzlich die dort veröffentlichten Preise ausgewählter Alltagsprodukte
                    einbezogen. Bei Ketten ohne einen solchen öffentlichen Online-Vergleich
                    fließen ausschließlich die Wochenangebote in die Bewertung ein. Die
                    Gewichtung zwischen beiden Bestandteilen kann sich daher von Kette zu
                    Kette unterscheiden. Bei kleineren, regionalen Handelsketten kann die
                    verfügbare Datengrundlage insgesamt dünner ausfallen als bei
                    bundesweit vertretenen Ketten.
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
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Alltagsprodukte</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Zu den berücksichtigten Alltagsprodukten zählen: Getreideprodukte,
                    Milchprodukte, Fleisch, Fisch, Eier, Kartoffeln, Gemüse, Obst,
                    Hülsenfrüchte, Pflanzliche Produkte und Wasser. Die verglichenen
                    Produkte können sich in Marke, Verpackungsgröße oder Rezeptur
                    unterscheiden.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Wochenangebote</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Diese werden direkt aus den veröffentlichten Prospekten und Angebotsseiten
                    der jeweiligen Handelskette erhoben.
                  </p>
                </div>
                <p className="text-xs mt-4" style={{ color: t.sub }}>Stand: August 2026</p>
              </div>
            )}

            {settingsTab === "hints" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Wichtiger Hinweis</p>
                <p className="text-xs" style={{ color: t.sub }}>
                  Alle Angaben beruhen auf eigenen, händisch durchgeführten
                  Stichproben-Erhebungen aus öffentlich zugänglichen Quellen (Prospekte,
                  Online-Shops der Händler) zu einem bestimmten Zeitpunkt. Sie erheben
                  keinen Anspruch auf Vollständigkeit, Repräsentativität oder taggenaue
                  Aktualität und können von den tatsächlichen Preisen vor Ort abweichen.
                  "Bester Preis" bezeichnet das Ergebnis unserer Erhebung, keine geprüfte,
                  absolute Tatsache. Solltest du eine Abweichung feststellen, kontaktiere
                  uns gerne über einkaufsradar@gmail.com – wir korrigieren gemeldete
                  Fehler umgehend. Einkaufsradar erhebt keinen Anspruch auf eine bestimmte
                  Ersparnis und dient ausschließlich der allgemeinen Orientierung, nicht
                  als Kauf- oder Finanzberatung.
                </p>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Hinweis</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Die angezeigten Werte sind Durchschnittswerte auf Bundeslandebene.
                    Tatsächliche Preise können je nach Filiale, Stadt oder Kommune leicht
                    abweichen. Auch kann sich der Preis im Online-Shop einer Kette von dem
                    Preis derselben Kette vor Ort in der Filiale unterscheiden.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2" style={{ borderColor: t.border }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Markenrechtlicher Hinweis</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Alle genannten Marken- und Unternehmensnamen sind Eigentum der
                    jeweiligen Inhaber. Es besteht keine Verbindung oder Zusammenarbeit
                    mit Einkaufsradar.
                  </p>
                </div>
                <p className="text-xs mt-4" style={{ color: t.sub }}>Stand: August 2026</p>
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
                  <p className="text-xs font-semibold mb-1" style={{ color: t.ink }}>Testbetrieb</p>
                  <p className="text-xs" style={{ color: t.sub }}>
                    Einkaufsradar befindet sich aktuell im Testbetrieb. Die angezeigten
                    Werte sind noch Testdaten und werden schrittweise durch recherchierte
                    Werte ersetzt.
                  </p>
                </div>
                <div className="border-t border-dashed pt-3 mt-2 text-xs space-y-1" style={{ borderColor: t.border, color: t.sub }}>
                  <div className="flex justify-between"><span>Version</span><span className="mono-font">01.08.26 · BETA</span></div>
                  <div className="flex justify-between"><span>Datenstand</span><span className="mono-font">{week.label}</span></div>
                  <div className="flex justify-between"><span>Nächstes Update</span><span className="mono-font">So. 18:00</span></div>
                </div>

                <div className="border-t border-dashed pt-3 mt-2 space-y-1" style={{ borderColor: t.border }}>
                  <a href="/impressum" className="flex items-center justify-between py-1.5" style={{ textDecoration: "none" }}>
                    <span className="flex items-center gap-2">
                      <FileText size={14} style={{ color: t.sub }} />
                      <span className="text-xs font-medium" style={{ color: t.ink }}>Impressum</span>
                    </span>
                    <span className="text-xs" style={{ color: t.sub }}>&rsaquo;</span>
                  </a>
                  <a href="/datenschutz" className="flex items-center justify-between py-1.5" style={{ textDecoration: "none" }}>
                    <span className="flex items-center gap-2">
                      <Shield size={14} style={{ color: t.sub }} />
                      <span className="text-xs font-medium" style={{ color: t.ink }}>Datenschutzerklärung</span>
                    </span>
                    <span className="text-xs" style={{ color: t.sub }}>&rsaquo;</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {monthlyOpen && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50" style={{ background: "#00000066" }} onClick={() => setMonthlyOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-t-2xl sm:rounded-2xl px-5 pt-5 pb-8 sm:pb-6" style={{ background: t.cardBg, color: t.ink }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="display-font text-base">MONATSBESTENLISTE</h2>
              <button aria-label="Schließen" onClick={() => setMonthlyOpen(false)} style={{ color: t.sub }}>
                <X size={20} />
              </button>
            </div>

            <p className="text-[11px] text-center mb-4" style={{ color: t.sub }}>
              Bestenliste für {getCurrentMonthLabel()} in {getDaysUntilNextEvaluation()} {getDaysUntilNextEvaluation() === 1 ? "Tag" : "Tagen"} verfügbar
            </p>

            {selectedState && (
              <div className="text-center mb-4">
                <div className="display-font text-base" style={{ color: t.ink }}>
                  {isOnlineDelivery ? "ONLINE-LIEFERDIENST" : selectedState.toUpperCase()}
                </div>
                <div className="text-xs mono-font mt-0.5" style={{ color: t.sub }}>{getPreviousMonthLabel()}</div>
              </div>
            )}

            {!selectedState && (
              <>
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
                <p className="text-sm text-center" style={{ color: t.sub }}>Bitte wähle zuerst ein Bundesland aus, um die Monatsbestenliste zu sehen.</p>
              </>
            )}

            {selectedState && monthlyTop.length > 0 && (
              <>
                <div className="flex items-end justify-center gap-2 mb-2">
                  {[1, 0, 2].map((slot) => {
                    const entry = monthlyTop[slot];
                    const rank = slot + 1;
                    const medalColor = rank === 1 ? "#D4AF37" : rank === 2 ? "#A8A8A8" : "#B5651D";
                    const barHeight = rank === 1 ? "h-24" : rank === 2 ? "h-16" : "h-12";
                    return (
                      <div key={rank} className="flex flex-col items-center gap-1.5 w-20">
                        <div className="rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ width: rank === 1 ? 28 : 24, height: rank === 1 ? 28 : 24, background: medalColor }}>
                          {rank}
                        </div>
                        <div className={`w-full ${barHeight} rounded-t-md flex flex-col items-center justify-center px-1 text-center`} style={{ background: `${medalColor}22`, border: `1px solid ${medalColor}66` }}>
                          {entry ? (
                            <>
                              <span className="text-xs font-bold leading-tight" style={{ color: t.ink }}>{entry.chain}</span>
                              <span className="mono-font text-[10px] mt-0.5 font-semibold" style={{ color: rank === 1 ? t.green : t.sub }}>
                                {rank === 1 ? "Bester Schnitt" : `+${Math.max(1, entry.diffPercent)}% teurer`}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs" style={{ color: t.sub }}>–</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-center mt-3" style={{ color: t.sub }}>
                  Basiert auf dem Durchschnittspreis über {monthlyTotalWeeks} Wochen
                </p>
              </>
            )}

            {selectedState && monthlyTop.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: t.sub }}>
                Für {getPreviousMonthLabel()} liegen noch nicht genügend Daten vor.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}