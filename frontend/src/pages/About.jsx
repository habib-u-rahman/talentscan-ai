/* ── Consistent inner-page hero ── */
function PageHero({ tag, title, subtitle }) {
  return (
    <div className="bg-slate-900 px-5 sm:px-8 pt-28 pb-14 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[220px] bg-brand-600/15 rounded-full blur-3xl"/>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-[0.15em]
          text-brand-400 uppercase mb-3">{tag}</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">{subtitle}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: "Instant Results",
    desc:  "Get a fully ranked candidate list in under 5 seconds, no matter how many resumes you upload.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618
          3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622
          0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: "Unbiased Scoring",
    desc:  "Pure text-based matching driven by content relevance — no subjective human bias.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012
          2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
    title: "Conversational AI",
    desc:  "Ask the chatbot about results in plain English and get clear, instant answers.",
    color: "bg-brand-50 text-brand-600 border-brand-100",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414
          5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
    title: "Multi-format Support",
    desc:  "Upload PDF resumes, plain text files, or a mix of both at the same time.",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

const steps = [
  {
    n: "01", title: "Upload Resumes",
    desc: "Drop PDF or TXT resume files into the screener's drag-and-drop zone.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>
    ),
  },
  {
    n: "02", title: "Paste Job Description",
    desc: "Copy any job posting into the text area — the system extracts key requirements.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0
          112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
      </svg>
    ),
  },
  {
    n: "03", title: "AI Processes Text",
    desc: "Text is tokenized, cleaned, and vectorized using TF-IDF in milliseconds.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707
          m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4
          0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
  },
  {
    n: "04", title: "Candidates Ranked",
    desc: "Cosine similarity scores every resume and sorts them from highest to lowest match.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2
          2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2
          2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
  },
  {
    n: "05", title: "Review Results",
    desc: "Browse ranked candidate cards with scores, progress bars, and detailed profiles.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2
          2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
  },
  {
    n: "06", title: "Chat with AI",
    desc: "Ask the AI chatbot anything about results — it answers in plain English instantly.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012
          2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">

      <PageHero
        tag="About"
        title="About Talant Scan AI"
        subtitle="An AI-powered system that automates resume screening and makes hiring results conversational."
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-6">

        {/* ── Row 1: Overview + Key Features ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* What it does */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <span className="inline-block text-[11px] font-bold tracking-[0.15em]
              text-brand-500 uppercase mb-3">Overview</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-5">What does it do?</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              <strong className="text-slate-800 font-semibold">Talant Scan AI</strong> removes
              the manual effort from resume screening. Upload candidate resumes, paste a job
              description, and the system instantly scores and ranks every applicant.
            </p>
            <p className="text-slate-500 leading-relaxed">
              An integrated AI chatbot lets you ask plain-English questions — "Who is the best
              candidate?", "Which candidates know Python?" — and get direct answers without
              opening a single file.
            </p>
          </div>

          {/* ── Key Features — redesigned ── */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <span className="inline-block text-[11px] font-bold tracking-[0.15em]
              text-brand-500 uppercase mb-3">Key Features</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Why use it?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(({ icon, title, desc, color }) => (
                <div key={title}
                  className="group flex flex-col gap-3 p-4 rounded-2xl border border-slate-100
                    bg-slate-50/50 hover:border-brand-200 hover:bg-white hover:shadow-md
                    hover:shadow-brand-50 transition-all duration-200">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl border flex items-center
                    justify-center flex-shrink-0 ${color}
                    group-hover:scale-110 transition-transform`}>
                    {icon}
                  </div>
                  {/* Text */}
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── How It Works — redesigned ── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Section header */}
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/60">
            <span className="inline-block text-[11px] font-bold tracking-[0.15em]
              text-brand-500 uppercase mb-2">Process</span>
            <h2 className="text-2xl font-extrabold text-slate-900">How it works</h2>
            <p className="text-slate-500 text-sm mt-1">
              Six simple steps from upload to insight.
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {steps.map(({ n, title, desc, icon }, i) => (
                <div key={n}
                  className="group relative flex gap-4 p-5 rounded-2xl border border-slate-200
                    bg-white hover:border-brand-300 hover:shadow-lg hover:shadow-brand-50
                    transition-all duration-200">

                  {/* Step number + icon stacked */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {/* Numbered badge */}
                    <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center
                      justify-center font-extrabold text-xs shadow-md shadow-brand-200
                      group-hover:scale-110 transition-transform">
                      {n}
                    </div>
                    {/* Icon below */}
                    <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand-500
                      flex items-center justify-center mt-1">
                      {icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-0.5">
                    <p className="font-bold text-slate-900 text-sm mb-1.5">{title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                  </div>

                  {/* Arrow connector for lg grid (every 3rd hides it) */}
                  {i % 3 !== 2 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2
                      z-10 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm
                      items-center justify-center">
                      <svg className="w-3 h-3 text-brand-400" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                          d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
