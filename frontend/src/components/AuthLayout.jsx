function IllustrationPanel() {
  return (
    <div className="relative h-full bg-slate-900 flex flex-col items-center justify-between px-10 py-10 overflow-hidden">

      {/* Dot-grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[440px] h-[440px] bg-brand-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-48 h-48
        bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ── Brand bar ── */}
      <div className="relative w-full flex items-center gap-2.5 auth-illus-1">
        <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">
          Talant<span className="text-brand-400">Scan</span>
        </span>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5
          bg-brand-600/20 border border-brand-500/30 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-brand-300 tracking-wide">Live NLP</span>
        </div>
      </div>

      {/* ── Main SVG illustration ── */}
      <div className="relative w-full flex-1 flex items-center justify-center auth-illus-2">
        <svg viewBox="0 0 340 400" fill="none" className="w-full max-h-[400px]">
          <defs>
            {/* Clip scan line to the document icon */}
            <clipPath id="hubDocClip">
              <rect x="156" y="173" width="28" height="34" rx="4"/>
            </clipPath>
          </defs>

          {/* ════ Animated connecting lines ════ */}
          {/* Card 1 → hub */}
          <line x1="65" y1="113" x2="126" y2="147"
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"
            className="dash-flow"/>
          {/* Card 2 → hub */}
          <line x1="170" y1="99" x2="170" y2="126"
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"
            className="dash-flow"/>
          {/* Card 3 → hub */}
          <line x1="276" y1="113" x2="214" y2="147"
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"
            className="dash-flow"/>
          {/* Hub → results */}
          <line x1="170" y1="254" x2="170" y2="263"
            stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.4"
            className="dash-flow"/>

          {/* ════ Central AI hub ════ */}
          <circle cx="170" cy="190" r="76" fill="rgba(37,99,235,0.07)"/>
          {/* Static guide ring */}
          <circle cx="170" cy="190" r="64"
            stroke="rgba(37,99,235,0.18)" strokeWidth="1.5" fill="none"/>
          {/* Rotating arc */}
          <circle cx="170" cy="190" r="64"
            stroke="#3b82f6" strokeWidth="2.5" fill="none"
            strokeDasharray="55 50 30 80" strokeLinecap="round"
            className="rotate-slow"
            style={{ transformOrigin: "170px 190px" }}/>
          {/* Inner ring */}
          <circle cx="170" cy="190" r="48"
            stroke="rgba(37,99,235,0.12)" strokeWidth="1" fill="none"/>
          {/* Filled core */}
          <circle cx="170" cy="190" r="36" fill="#1e40af" stroke="#2563eb" strokeWidth="1.5"/>

          {/* Document icon inside hub */}
          <rect x="156" y="173" width="28" height="34" rx="4"
            fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
          <rect x="161" y="180" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.60)"/>
          <rect x="161" y="186" width="18" height="2"   rx="1"   fill="rgba(255,255,255,0.30)"/>
          <rect x="161" y="191" width="16" height="2"   rx="1"   fill="rgba(255,255,255,0.30)"/>
          <rect x="161" y="196" width="18" height="2"   rx="1"   fill="rgba(255,255,255,0.30)"/>
          {/* Scanning beam */}
          <rect x="156" y="181" width="28" height="2" rx="1"
            fill="#60a5fa" className="svg-scan" clipPath="url(#hubDocClip)"/>

          {/* ════ Resume card 1 — top-left ════ */}
          <g className="doc-float-1">
            <rect x="28" y="22" width="72" height="90" rx="10"
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
            {/* Avatar */}
            <circle cx="52" cy="52" r="14"
              fill="rgba(16,185,129,0.20)" stroke="rgba(16,185,129,0.45)" strokeWidth="1"/>
            <text x="52" y="57" textAnchor="middle" fontSize="12" fill="#34d399" fontWeight="800">S</text>
            {/* Name lines */}
            <rect x="70" y="44" width="22" height="4" rx="2" fill="rgba(255,255,255,0.40)"/>
            <rect x="70" y="52" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.20)"/>
            {/* Body lines */}
            <rect x="38" y="74" width="52" height="2.5" rx="1.25" fill="rgba(255,255,255,0.18)"/>
            <rect x="38" y="80" width="44" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            <rect x="38" y="86" width="50" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            {/* Score badge */}
            <rect x="36" y="98" width="36" height="14" rx="7"
              fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.55)" strokeWidth="1"/>
            <text x="54" y="108" textAnchor="middle" fontSize="8.5" fill="#34d399" fontWeight="800">94%</text>
          </g>

          {/* ════ Resume card 2 — top-center ════ */}
          <g className="doc-float-2">
            <rect x="134" y="8" width="72" height="90" rx="10"
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
            <circle cx="158" cy="38" r="14"
              fill="rgba(37,99,235,0.20)" stroke="rgba(59,130,246,0.45)" strokeWidth="1"/>
            <text x="158" y="43" textAnchor="middle" fontSize="12" fill="#93c5fd" fontWeight="800">M</text>
            <rect x="176" y="30" width="22" height="4" rx="2" fill="rgba(255,255,255,0.40)"/>
            <rect x="176" y="38" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.20)"/>
            <rect x="144" y="60" width="52" height="2.5" rx="1.25" fill="rgba(255,255,255,0.18)"/>
            <rect x="144" y="66" width="44" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            <rect x="144" y="72" width="50" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            <rect x="142" y="84" width="36" height="14" rx="7"
              fill="rgba(59,130,246,0.25)" stroke="rgba(59,130,246,0.55)" strokeWidth="1"/>
            <text x="160" y="94" textAnchor="middle" fontSize="8.5" fill="#93c5fd" fontWeight="800">78%</text>
          </g>

          {/* ════ Resume card 3 — top-right ════ */}
          <g className="doc-float-3">
            <rect x="240" y="22" width="72" height="90" rx="10"
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
            <circle cx="264" cy="52" r="14"
              fill="rgba(245,158,11,0.20)" stroke="rgba(245,158,11,0.45)" strokeWidth="1"/>
            <text x="264" y="57" textAnchor="middle" fontSize="12" fill="#fcd34d" fontWeight="800">P</text>
            <rect x="282" y="44" width="22" height="4" rx="2" fill="rgba(255,255,255,0.40)"/>
            <rect x="282" y="52" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.20)"/>
            <rect x="250" y="74" width="52" height="2.5" rx="1.25" fill="rgba(255,255,255,0.18)"/>
            <rect x="250" y="80" width="44" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            <rect x="250" y="86" width="50" height="2.5" rx="1.25" fill="rgba(255,255,255,0.12)"/>
            <rect x="248" y="98" width="36" height="14" rx="7"
              fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.55)" strokeWidth="1"/>
            <text x="266" y="108" textAnchor="middle" fontSize="8.5" fill="#fcd34d" fontWeight="800">61%</text>
          </g>

          {/* ════ Ranked results panel ════ */}
          <g>
            <rect x="40" y="264" width="260" height="116" rx="12"
              fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.11)" strokeWidth="1"/>
            <text x="56" y="285" fontSize="7.5" fill="rgba(255,255,255,0.35)"
              fontWeight="700" letterSpacing="1.5">RANKED RESULTS</text>

            {/* Row 1 — Sarah */}
            <circle cx="62" cy="306" r="8" fill="rgba(16,185,129,0.25)"/>
            <text x="62" y="309.5" textAnchor="middle" fontSize="7.5" fill="#34d399" fontWeight="800">S</text>
            <rect x="76" y="303" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="76" y="308" width="140" height="4" rx="2"
              fill="rgba(16,185,129,0.55)"
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              className="svg-bar svg-bar-1"/>
            <text x="284" y="310" textAnchor="end" fontSize="8.5" fill="#34d399" fontWeight="800">94%</text>

            {/* Row 2 — Michael */}
            <circle cx="62" cy="330" r="8" fill="rgba(59,130,246,0.25)"/>
            <text x="62" y="333.5" textAnchor="middle" fontSize="7.5" fill="#93c5fd" fontWeight="800">M</text>
            <rect x="76" y="327" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="76" y="332" width="108" height="4" rx="2"
              fill="rgba(59,130,246,0.55)"
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              className="svg-bar svg-bar-2"/>
            <text x="284" y="334" textAnchor="end" fontSize="8.5" fill="#93c5fd" fontWeight="800">78%</text>

            {/* Row 3 — Priya */}
            <circle cx="62" cy="354" r="8" fill="rgba(245,158,11,0.25)"/>
            <text x="62" y="357.5" textAnchor="middle" fontSize="7.5" fill="#fcd34d" fontWeight="800">P</text>
            <rect x="76" y="351" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>
            <rect x="76" y="356" width="85" height="4" rx="2"
              fill="rgba(245,158,11,0.55)"
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              className="svg-bar svg-bar-3"/>
            <text x="284" y="358" textAnchor="end" fontSize="8.5" fill="#fbbf24" fontWeight="800">61%</text>
          </g>

        </svg>
      </div>

      {/* ── Tagline ── */}
      <div className="relative text-center auth-illus-3 pb-2">
        <h2 className="text-2xl font-extrabold text-white leading-snug">
          Find the Best Candidate{" "}
          <span className="text-brand-400">10× Faster</span>
        </h2>
        <p className="text-slate-500 text-sm mt-1.5">
          NLP · TF-IDF · Cosine Similarity · Skill Matching
        </p>
      </div>

    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex">

      {/* Left — illustration (desktop only) */}
      <div className="hidden lg:block lg:w-[52%] xl:w-[54%] sticky top-0 h-screen">
        <IllustrationPanel />
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-8 py-4 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Mobile brand (hidden on desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
            </div>
            <span className="font-extrabold text-xl text-slate-900">
              Talant<span className="text-brand-400">Scan</span>
            </span>
          </div>

          {children}
        </div>
      </div>

    </div>
  );
}
