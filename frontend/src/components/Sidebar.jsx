import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NAV = [
  {
    to: "/home", label: "Home",
    icon: <svg className="w-4.5 h-4.5 w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  },
  {
    to: "/screener", label: "Screener",
    icon: <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  },
  {
    to: "/chatbot", label: "Chatbot",
    icon: <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>,
  },
  {
    to: "/pipeline", label: "Pipeline",
    icon: <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  },
  {
    to: "/about", label: "About",
    icon: <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
];

function getHistory() {
  try { return JSON.parse(localStorage.getItem("screening_history") || "[]"); }
  catch { return []; }
}

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function Sidebar({ open, onClose }) {
  const { pathname } = useLocation();
  const nav          = useNavigate();
  const [history, setHistory] = useState(getHistory);

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    window.addEventListener("historyUpdated", refresh);
    return () => window.removeEventListener("historyUpdated", refresh);
  }, []);

  const user   = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();

  const logout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("pipeline_data");
    nav("/login");
  };

  const clearHistory = () => {
    localStorage.removeItem("screening_history");
    setHistory([]);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col bg-slate-900
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-white/[0.07] flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <span className="font-bold text-base text-white tracking-tight">
            Talant<span className="text-brand-400">Scan</span>
          </span>
          <button onClick={onClose}
            className="ml-auto lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── New Screening CTA ── */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0">
          <Link
            to="/screener"
            onClick={onClose}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl
              bg-brand-600 text-white text-sm font-semibold
              hover:bg-brand-500 active:scale-[.98] transition-all"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Screening
          </Link>
        </div>

        {/* ── Navigation ── */}
        <nav className="px-3 pb-2 space-y-0.5 flex-shrink-0">
          {NAV.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors
                ${pathname === to
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.07]"}`}
            >
              {icon}
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Divider ── */}
        <div className="mx-3 border-t border-white/[0.07]" />

        {/* ── Recent Analyses (scrollable) ── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-3 py-3
          [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10
          [&::-webkit-scrollbar-track]:bg-transparent">

          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Recent Analyses
            </p>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <svg className="w-8 h-8 text-slate-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <p className="text-xs text-slate-600">No analyses yet</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Run a screening to see history</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {history.slice(0, 20).map(item => (
                <Link
                  key={item.id}
                  to="/screener"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <p className="text-xs text-slate-400 group-hover:text-slate-200 truncate transition-colors leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    {timeAgo(item.date)} · {item.count} resume{item.count !== 1 ? "s" : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="mx-3 border-t border-white/[0.07]" />

        {/* ── User + Logout ── */}
        <div className="px-3 py-3 flex-shrink-0">
          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl">
            <div className="w-8 h-8 rounded-xl bg-brand-600/25 border border-brand-500/30
              flex items-center justify-center text-brand-400 text-sm font-extrabold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user.name || "User"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || ""}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl
              text-slate-400 hover:text-red-400 hover:bg-red-400/[0.08]
              text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign out
          </button>
        </div>

      </aside>
    </>
  );
}
