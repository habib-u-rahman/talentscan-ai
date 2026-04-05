import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  { label: "Home",     to: "/" },
  { label: "Screener", to: "/screener" },
  { label: "Chatbot",  to: "/chatbot" },
  { label: "About",    to: "/about" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [opaque,   setOpaque]   = useState(false);
  const { pathname }            = useLocation();

  useEffect(() => {
    const fn = () => setOpaque(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close drawer on route change */
  useEffect(() => setOpen(false), [pathname]);

  const linkCls = (to) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname === to
        ? "text-brand-600 bg-brand-50"
        : opaque
          ? "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
          : "text-white/75 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        opaque
          ? "bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors ${
            opaque ? "text-slate-900" : "text-white"
          }`}>
            Talant<span className="text-brand-400">Scan</span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, to }) => (
            <Link key={to} to={to} className={linkCls(to)}>{label}</Link>
          ))}
        </nav>

        <Link
          to="/screener"
          className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600
            text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-600/20
            hover:bg-brand-500 active:scale-95 transition-all"
        >
          Get Started
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(v => !v)}
          className={`md:hidden p-2 rounded-lg transition-colors ${
            opaque ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 py-3 space-y-1 shadow-xl">
          {NAV.map(({ label, to }) => (
            <Link key={to} to={to}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-50"
              }`}>
              {label}
            </Link>
          ))}
          <div className="pt-1">
            <Link to="/screener"
              className="block text-center px-4 py-3 bg-brand-600 text-white rounded-xl
                text-sm font-semibold">
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
