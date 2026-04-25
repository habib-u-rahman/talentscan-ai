import { Link } from "react-router-dom";

/* ── shared label used on every section ── */
const Label = ({ children }) => (
  <span className="inline-block text-[11px] font-bold tracking-[0.15em] text-brand-500 uppercase mb-3">
    {children}
  </span>
);

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9
          5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    title: "Instant Resume Ranking",
    desc: "Upload multiple resumes and get a ranked list in seconds — no manual reading required.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707
          m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4
          0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    title: "Real NLP Processing",
    desc: "Built on TF-IDF and cosine similarity — the same algorithms taught in university NLP courses.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2
          2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
    title: "AI Career Chatbot",
    desc: "Ask plain-English questions about your results and get instant intelligent answers.",
  },
];

const steps = [
  { n: "01", title: "Paste Job Description", desc: "Copy any job posting into the input field." },
  { n: "02", title: "Upload Resumes",         desc: "Drag & drop PDF or TXT resume files." },
  { n: "03", title: "Get Ranked Results",     desc: "AI scores and sorts candidates instantly." },
  { n: "04", title: "Chat & Explore",         desc: "Ask the chatbot anything about the results." },
];

export default function Home() {
  return (
    <div className="bg-white">

      {/* ━━━ HERO ━━━ */}
      <section className="relative bg-slate-900 overflow-hidden pt-10 pb-16 px-5 sm:px-8">

        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px]
          bg-brand-600/20 rounded-full blur-[120px] pointer-events-none"/>
        <div className="absolute bottom-0 right-0 w-64 h-64
          bg-blue-400/10 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2
          gap-12 items-center">

          {/* ── Left: Text ── */}
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6
              bg-brand-600/15 border border-brand-500/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"/>
              <span className="text-xs font-semibold text-brand-300 tracking-wide">
                AI Resume Screening
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1]
              tracking-tight">
              Find the Best Candidate{" "}
              <span className="text-brand-400">10x Faster</span>
            </h1>

            <p className="mt-5 text-slate-400 text-base leading-relaxed max-w-md">
              Upload resumes, paste a job description, and let our NLP engine rank every
              candidate instantly. Then chat with AI to explore results.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/screener"
                className="px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-xl
                  shadow-lg shadow-brand-600/30 hover:bg-brand-500 active:scale-95 transition-all">
                Start Screening →
              </Link>
              <Link to="/chatbot"
                className="px-6 py-3 border border-white/15 text-white/75 text-sm font-semibold
                  rounded-xl hover:bg-white/8 hover:text-white active:scale-95 transition-all">
                Try the Chatbot
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 flex gap-6">
              {[
                { v: "< 5s",  l: "Analysis" },
                { v: "100%",  l: "Automated" },
                { v: "Free",  l: "Always" },
              ].map(({ v, l }) => (
                <div key={l}>
                  <p className="text-2xl font-extrabold text-white">{v}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Mock UI card ── */}
          <div className="hidden lg:block">
            <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-5
              backdrop-blur-sm shadow-2xl">

              {/* Card top bar */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Candidate Results
                </p>
                <span className="text-[11px] text-emerald-400 font-medium bg-emerald-400/10
                  border border-emerald-400/20 px-2.5 py-1 rounded-full">
                  3 ranked
                </span>
              </div>

              {/* Mock candidate rows */}
              {[
                { name: "Sarah Johnson",  score: 94, color: "bg-emerald-500" },
                { name: "Michael Chen",   score: 78, color: "bg-brand-500"   },
                { name: "Priya Sharma",   score: 61, color: "bg-amber-400"   },
              ].map(({ name, score, color }) => (
                <div key={name}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 mb-2
                    border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center
                    justify-center text-white text-xs font-bold flex-shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{name}</p>
                    <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`}
                        style={{ width: `${score}%` }}/>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white flex-shrink-0">{score}%</span>
                </div>
              ))}

              {/* Mock chat preview */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="bg-brand-600/20 border border-brand-500/20 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 mb-1">AI Assistant</p>
                  <p className="text-sm text-white/80">
                    Sarah Johnson is your top match at <span className="text-brand-400 font-semibold">94%</span> — strong Python and ML skills.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section className="py-24 px-5 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Label>Features</Label>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need in one place
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-lg mx-auto">
              From resume upload to AI chat — a complete hiring intelligence tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div key={title}
                className="group bg-white border border-slate-200 rounded-2xl p-7
                  hover:border-brand-200 hover:shadow-lg hover:shadow-brand-50
                  hover:-translate-y-1 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600
                  flex items-center justify-center mb-5
                  group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-24 px-5 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Label>Process</Label>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map(({ n, title, desc }) => (
              <div key={n}
                className="bg-white border border-slate-200 rounded-2xl p-6
                  hover:border-brand-300 hover:shadow-md transition-all group">
                {/* Step number pill */}
                <div className="inline-flex items-center justify-center w-10 h-10
                  rounded-xl bg-brand-600 text-white font-extrabold text-sm mb-5
                  shadow-md shadow-brand-200 group-hover:scale-110 transition-transform">
                  {n}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/screener"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white
                font-semibold rounded-xl hover:bg-brand-600 hover:shadow-lg
                hover:shadow-brand-200 active:scale-95 transition-all text-sm">
              Try it now — it's free
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ BOTTOM CTA ━━━ */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-3xl p-12 sm:p-16
          text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-brand-600/20 rounded-full blur-3xl"/>
          </div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to screen smarter?
          </h2>
          <p className="relative text-slate-400 text-lg mb-8">
            Upload resumes now — results in under 5 seconds.
          </p>
          <Link to="/screener"
            className="relative inline-block px-10 py-4 bg-brand-600 text-white font-bold
              rounded-xl shadow-2xl shadow-brand-600/30 hover:bg-brand-500
              active:scale-95 transition-all">
            Start Screening →
          </Link>
        </div>
      </section>
    </div>
  );
}
