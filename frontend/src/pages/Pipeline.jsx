import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
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
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:    "bg-red-50 text-red-600 border-red-200",
    blue:   "bg-brand-50 text-brand-700 border-brand-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${colors[color]}`}>
      {label}
    </span>
  );
}

function TfidfBar({ term, score, max }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-slate-700 w-28 truncate flex-shrink-0">{term}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 tabular-nums w-10 text-right">{score}</span>
    </div>
  );
}

function ScoreGauge({ score }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
        <text x="55" y="60" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>
          {score}%
        </text>
      </svg>
      <span className="text-xs font-semibold text-slate-500">Final Score</span>
    </div>
  );
}

/* ── per-candidate panel ── */
function CandidatePanel({ data, index }) {
  const [open, setOpen] = useState(index === 0);
  const tfidfMax = data.top_tfidf.length > 0 ? data.top_tfidf[0].score : 1;
  const jdMax    = data.jd_top_tfidf.length > 0 ? data.jd_top_tfidf[0].score : 1;

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-slate-50
          transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 text-xs font-extrabold
          flex items-center justify-center flex-shrink-0">
          #{index + 1}
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-sm">{data.name}</p>
          <p className="text-xs text-slate-400">{data.filename}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border
            ${data.final_score >= 70
              ? "text-emerald-700 bg-emerald-50 border-emerald-200"
              : data.final_score >= 40
                ? "text-amber-700 bg-amber-50 border-amber-200"
                : "text-red-600 bg-red-50 border-red-200"}`}>
            {data.final_score}%
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-5">

          {/* Score + formula */}
          <div className="flex flex-col sm:flex-row gap-6 items-center
            bg-white border border-slate-200 rounded-2xl p-5">
            <ScoreGauge score={data.final_score} />
            <div className="flex-1 space-y-3">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Score Formula
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-xs text-slate-700">
                Score = (cosine x 0.4 + skill_ratio x 0.6) x 100
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cosine Similarity", value: data.cosine_sim },
                  { label: "Skill Ratio",       value: data.skill_ratio },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-brand-50 border border-brand-100 rounded-xl p-3">
                    <p className="text-[11px] text-brand-500 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-lg font-extrabold text-brand-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SectionCard step={1} title="Text Extraction  (PyPDF2 / UTF-8 decode)">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4
              font-mono text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto">
              {data.raw_preview}…
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Raw tokens extracted: <span className="font-bold text-slate-600">{data.raw_token_count}</span>
            </p>
          </SectionCard>

          <SectionCard step={2} title="Text Preprocessing  (NLTK — lowercase + stopwords + lemmatize)">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Raw Tokens",        value: data.raw_token_count,   color: "bg-slate-100 text-slate-700" },
                { label: "Stopwords Removed", value: data.stopwords_removed, color: "bg-red-50 text-red-600" },
                { label: "Clean Tokens",      value: data.clean_token_count, color: "bg-emerald-50 text-emerald-700" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${color} rounded-xl p-3 text-center`}>
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

          <SectionCard step={3} title="TF-IDF Vectorization  (scikit-learn TfidfVectorizer)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resume Top Terms</p>
                <div className="space-y-2">
                  {data.top_tfidf.map(({ term, score }) => (
                    <TfidfBar key={term} term={term} score={score} max={tfidfMax} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Job Description Top Terms</p>
                <div className="space-y-2">
                  {data.jd_top_tfidf.map(({ term, score }) => (
                    <TfidfBar key={term} term={term} score={score} max={jdMax} />
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard step={4} title="Cosine Similarity  (JD vector · Resume vector)">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-brand-500 transition-all duration-700"
                  style={{ width: `${data.cosine_sim * 100}%` }} />
              </div>
              <span className="text-sm font-extrabold text-brand-700 w-14 text-right">
                {(data.cosine_sim * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Raw value: <span className="font-mono font-bold text-slate-600">{data.cosine_sim}</span>
            </p>
          </SectionCard>

          <SectionCard step={5} title="Skill Overlap  (Keyword matching against curated skills list)">
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                  Matched Skills ({data.matched_skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.matched_skills.length > 0
                    ? data.matched_skills.map(s => <Chip key={s} label={s} color="green" />)
                    : <span className="text-xs text-slate-400">None found</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest mb-2">
                  Missing Skills ({data.missing_skills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.missing_skills.length > 0
                    ? data.missing_skills.map(s => <Chip key={s} label={s} color="red" />)
                    : <span className="text-xs text-slate-400">None — full coverage</span>}
                </div>
              </div>
            </div>
          </SectionCard>

        </div>
      )}
    </div>
  );
}

/* ── main page ── */
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
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300
          flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 17v-2m3 2v-4m3 4v-6M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="font-bold text-slate-700">No pipeline data yet</p>
          <p className="text-xs text-slate-400 mt-1">Run an analysis on the Screener page first.</p>
        </div>
        <button onClick={() => navigate("/screener")}
          className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl
            hover:bg-brand-500 transition-colors shadow-md shadow-brand-200">
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
          <span className="inline-block text-[11px] font-bold tracking-[0.15em]
            text-brand-400 uppercase mb-3">NLP Pipeline Dashboard</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Resume Analysis Breakdown
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl">
            Step-by-step visualization of every NLP operation applied to each resume.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 space-y-5">
        <div className="grid grid-cols-3 bg-white border border-slate-200 rounded-2xl
          divide-x divide-slate-100 shadow-sm overflow-hidden">
          {[
            { label: "Resumes Analyzed", value: data.length },
            { label: "Top Score",        value: `${data[0]?.final_score ?? 0}%` },
            { label: "Avg Score",
              value: `${Math.round(data.reduce((s, d) => s + d.final_score, 0) / data.length)}%` },
          ].map(({ label, value }) => (
            <div key={label} className="px-6 py-4 text-center">
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {data.map((candidate, i) => (
            <CandidatePanel key={candidate.filename + i} data={candidate} index={i} />
          ))}
        </div>

        <div className="text-center pb-8">
          <button onClick={() => navigate("/screener")}
            className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl
              hover:bg-brand-600 transition-colors">
            Back to Screener
          </button>
        </div>
      </div>
    </div>
  );
}
