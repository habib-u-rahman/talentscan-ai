import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StepBadge({ n }) {
  return (
    <div className="w-8 h-8 rounded-xl bg-brand-600 text-white text-xs font-extrabold
      flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-200">
      {n}
    </div>
  );
}

function SectionCard({ step, title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <StepBadge n={step} />
        <p className="text-sm font-bold text-slate-800">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Chip({ label, color }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:   "bg-red-50 text-red-600 border-red-200",
    blue:  "bg-brand-50 text-brand-700 border-brand-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[color]}`}>
      {label}
    </span>
  );
}

function CandidatePanel({ data, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-slate-50 transition-colors text-left">
        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold
          flex items-center justify-center flex-shrink-0">#{index + 1}</div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">{data.name}</p>
          <p className="text-xs text-slate-400">{data.filename}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border
          ${data.final_score >= 70 ? "text-emerald-700 bg-emerald-50 border-emerald-200"
            : data.final_score >= 40 ? "text-amber-700 bg-amber-50 border-amber-200"
            : "text-red-600 bg-red-50 border-red-200"}`}>
          {data.final_score}%
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-5">
          <SectionCard step={1} title="Text Extraction  (PyPDF2 / UTF-8 decode)">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs
              text-slate-600 leading-relaxed max-h-36 overflow-y-auto">
              {data.raw_preview}...
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Raw tokens extracted: <span className="font-bold text-slate-600">{data.raw_token_count}</span>
            </p>
          </SectionCard>

          <SectionCard step={2} title="Text Preprocessing  (NLTK — lowercase + stopwords + lemmatize)">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Raw Tokens",        value: data.raw_token_count,   cls: "bg-slate-100 text-slate-700" },
                { label: "Stopwords Removed", value: data.stopwords_removed, cls: "bg-red-50 text-red-600" },
                { label: "Clean Tokens",      value: data.clean_token_count, cls: "bg-emerald-50 text-emerald-700" },
              ].map(({ label, value, cls }) => (
                <div key={label} className={`${cls} rounded-xl p-3 text-center`}>
                  <p className="text-xl font-extrabold">{value}</p>
                  <p className="text-[11px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sample Clean Tokens</p>
            <div className="flex flex-wrap gap-1.5">
              {data.sample_tokens.map((t, i) => <Chip key={i} label={t} color="blue" />)}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

export default function Pipeline() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pipeline_data");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5">
        <p className="font-bold text-slate-700">No pipeline data yet</p>
        <p className="text-xs text-slate-400">Run an analysis on the Screener page first.</p>
        <button onClick={() => navigate("/screener")}
          className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-500">
          Go to Screener
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 px-5 sm:px-8 pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[220px] bg-brand-600/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <span className="inline-block text-[11px] font-bold tracking-[0.15em] text-brand-400 uppercase mb-3">
            NLP Pipeline Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Resume Analysis Breakdown</h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl">Step-by-step visualization of every NLP operation.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 space-y-4">
        {data.map((candidate, i) => (
          <CandidatePanel key={candidate.filename + i} data={candidate} index={i} />
        ))}
      </div>
    </div>
  );
}
