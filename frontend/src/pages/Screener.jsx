import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload    from "../components/FileUpload";
import Spinner       from "../components/Spinner";
import { screenResumes } from "../api/api";

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

/* ── Score ring ── */
function ScoreRing({ score }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = 28, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6"/>
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}/>
      <text x="36" y="41" textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>
        {score}%
      </text>
    </svg>
  );
}

/* ── Inline result card ── */
function CandidateCard({ candidate, rank, onView }) {
  const { name, score, details } = candidate;
  const medals = ["🥇", "🥈", "🥉"];
  const barColor = score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-400" : "bg-red-400";
  const scoreBadge = score >= 70
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : score >= 40
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="group flex items-center gap-4 bg-white border border-slate-200
      rounded-2xl px-5 py-4 hover:border-brand-200 hover:shadow-md
      hover:shadow-brand-50 transition-all duration-200">

      {/* Rank / medal */}
      <div className="flex-shrink-0 text-center w-10">
        {rank <= 3
          ? <span className="text-2xl leading-none">{medals[rank - 1]}</span>
          : <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 font-bold
              text-xs flex items-center justify-center mx-auto">
              #{rank}
            </span>}
      </div>

      {/* Score ring */}
      <div className="flex-shrink-0">
        <ScoreRing score={score}/>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">{name}</p>
        {details && <p className="text-xs text-slate-400 mt-0.5 truncate">{details}</p>}

        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full bar-grow ${barColor}`}
            style={{ width: `${score}%` }}/>
        </div>
      </div>

      {/* Score badge + button */}
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreBadge}`}>
          {score}%
        </span>
        <button
          onClick={() => onView(candidate)}
          className="text-[11px] font-semibold text-brand-600 hover:text-brand-800
            hover:underline transition-colors"
        >
          Details →
        </button>
      </div>
    </div>
  );
}

export default function Screener() {
  const navigate = useNavigate();
  const [jd,         setJd]         = useState("");
  const [files,      setFiles]      = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [done,       setDone]       = useState(false);

  const ready = jd.trim().length > 0 && files.length > 0;

  /* step status helpers */
  const step1Done = jd.trim().length > 0;
  const step2Done = files.length > 0;

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setCandidates([]);
    setDone(false);
    try {
      const data = await screenResumes(jd, files);
      setCandidates(data.candidates || []);
      if (data.pipeline) {
        sessionStorage.setItem("pipeline_data", JSON.stringify(data.pipeline));
      }
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message ||
        "Cannot reach the backend. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  /* summary stats */
  const avgScore = candidates.length
    ? Math.round(candidates.reduce((s, c) => s + c.score, 0) / candidates.length)
    : 0;
  const topScore  = candidates.length ? Math.max(...candidates.map(c => c.score)) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHero
        tag="Resume Screener"
        title="Screen & Rank Candidates"
        subtitle="Paste a job description, upload resumes, and get AI-powered rankings in seconds."
      />

      {/* ── Step progress bar ── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3">
          <div className="flex items-center gap-3">
            {[
              { n: 1, label: "Job Description", done: step1Done },
              { n: 2, label: "Upload Resumes",  done: step2Done },
              { n: 3, label: "View Results",    done: done },
            ].map((step, i) => (
              <div key={step.n} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={`h-px w-8 sm:w-16 rounded-full transition-colors
                    ${step.done ? "bg-brand-400" : "bg-slate-200"}`}/>
                )}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center
                    text-[11px] font-extrabold flex-shrink-0 transition-colors
                    ${step.done
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 text-slate-400"}`}>
                    {step.done
                      ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      : step.n}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block transition-colors
                    ${step.done ? "text-slate-700" : "text-slate-400"}`}>
                    {step.label}
                  </span>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-7 items-start">

          {/* ══════════ LEFT PANEL ══════════ */}
          <div className="space-y-5">

            {/* ── Step 1: Job Description ── */}
            <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
              ${step1Done ? "border-brand-200" : "border-slate-200"}`}>

              {/* Card header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                  text-xs font-extrabold flex-shrink-0 transition-colors
                  ${step1Done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Job Description</p>
                  <p className="text-xs text-slate-400">Paste the full job posting below</p>
                </div>
                <span className="text-[11px] font-mono text-slate-300 tabular-nums">
                  {jd.length} chars
                </span>
              </div>

              <div className="p-5">
                <textarea
                  rows={10}
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  placeholder="e.g. We're looking for a Python developer with experience in machine learning, NLP, scikit-learn, and REST APIs. Strong communication skills required…"
                  className="w-full text-sm text-slate-800 placeholder-slate-300 resize-none
                    outline-none leading-relaxed bg-slate-50 rounded-xl p-4 border
                    border-slate-200 focus:bg-white focus:border-brand-400
                    focus:ring-2 focus:ring-brand-100 transition"
                />

                {/* Word count hint */}
                {jd.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9
                        10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs text-emerald-600 font-medium">Job description added</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Step 2: Upload ── */}
            <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
              ${step2Done ? "border-brand-200" : "border-slate-200"}`}>

              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                  text-xs font-extrabold flex-shrink-0 transition-colors
                  ${step2Done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">Upload Resumes</p>
                  <p className="text-xs text-slate-400">
                    {files.length > 0
                      ? `${files.length} file${files.length > 1 ? "s" : ""} ready to analyze`
                      : "PDF and TXT files supported"}
                  </p>
                </div>
                {step2Done && (
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50
                    border border-brand-200 px-2.5 py-1 rounded-full">
                    {files.length} file{files.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="p-5">
                <FileUpload files={files} onChange={setFiles}/>
              </div>
            </div>

            {/* ── Analyze button (large) ── */}
            <button
              onClick={analyze}
              disabled={!ready || loading}
              className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wide
                flex items-center justify-center gap-2 transition-all
                ${ready && !loading
                  ? "bg-brand-600 text-white shadow-xl shadow-brand-200 hover:bg-brand-500 active:scale-[.98]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
            >
              {loading
                ? <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Running NLP Analysis…
                  </>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                        00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2
                        m-6 9l2 2 4-4"/>
                    </svg>
                    Analyze Resumes
                  </>}
            </button>
            {!ready && (
              <p className="text-center text-xs text-slate-400 -mt-2">
                Complete both steps above to run the analysis.
              </p>
            )}

          </div>

          {/* ══════════ RIGHT PANEL ══════════ */}
          <div className="sticky top-28">

            {/* Results header card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center
                    text-xs font-extrabold flex-shrink-0 transition-colors
                    ${done ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    3
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Results</p>
                    <p className="text-xs text-slate-400">
                      {candidates.length > 0
                        ? `${candidates.length} candidate${candidates.length > 1 ? "s" : ""} ranked by match score`
                        : "Ranked candidates appear here"}
                    </p>
                  </div>
                </div>
                {done && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50
                      border border-emerald-200 px-3 py-1 rounded-full">
                      ✓ Complete
                    </span>
                    <button
                      onClick={() => navigate("/pipeline")}
                      className="text-xs font-bold text-brand-600 bg-brand-50
                        border border-brand-200 px-3 py-1 rounded-full
                        hover:bg-brand-100 transition-colors"
                    >
                      View Pipeline →
                    </button>
                  </div>
                )}
              </div>

              {/* ── Summary strip (only when results exist) ── */}
              {done && candidates.length > 0 && (
                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                  {[
                    { label: "Analyzed",  value: candidates.length },
                    { label: "Top Score", value: `${topScore}%`    },
                    { label: "Average",   value: `${avgScore}%`    },
                  ].map(({ label, value }) => (
                    <div key={label} className="px-4 py-3 text-center">
                      <p className="text-lg font-extrabold text-slate-900">{value}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Body ── */}
              <div className="p-5 min-h-[320px] flex flex-col">

                {/* Loading */}
                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
                    <Spinner size="lg" label=""/>
                    <div className="text-center">
                      <p className="font-semibold text-slate-700 text-sm">Analyzing resumes…</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Running TF-IDF vectorization &amp; cosine similarity
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {!loading && error && (
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center
                      justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-red-700 mb-1">Connection Error</p>
                    <p className="text-xs text-red-500 leading-relaxed">{error}</p>
                    <button onClick={() => setError(null)}
                      className="mt-4 text-xs text-red-400 underline hover:text-red-600">
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {!loading && !error && candidates.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed
                      border-slate-200 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857
                          M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
                          0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <p className="font-bold text-slate-700 text-sm">No candidates yet</p>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-[200px]">
                      Complete both steps on the left and click Analyze Resumes.
                    </p>
                  </div>
                )}

                {/* Candidate list */}
                {!loading && !error && candidates.length > 0 && (
                  <div className="space-y-3">
                    {candidates.map((c, i) => (
                      <CandidateCard
                        key={c.name + i}
                        candidate={c}
                        rank={i + 1}
                        onView={setSelected}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ DETAIL MODAL ══════════ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center
            justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-slate-900 px-6 py-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-widest text-brand-400 uppercase mb-1">
                  Candidate Profile
                </p>
                <h3 className="text-lg font-extrabold text-white">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center
                  text-white/70 hover:bg-white/20 transition-colors mt-0.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Score block */}
              <div className="flex items-center gap-5 p-5 bg-brand-50 border border-brand-100
                rounded-2xl">
                <ScoreRing score={selected.score}/>
                <div>
                  <p className="text-[11px] font-bold tracking-widest text-brand-400 uppercase">
                    Match Score
                  </p>
                  <p className="text-4xl font-extrabold text-brand-700 leading-none mt-1">
                    {selected.score}%
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {selected.score >= 70
                      ? "Strong match — highly recommended"
                      : selected.score >= 40
                        ? "Moderate match — worth considering"
                        : "Low match — may not be suitable"}
                  </p>
                </div>
              </div>

              {selected.details && (
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                    Details
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selected.details}</p>
                </div>
              )}

              {selected.skills?.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">
                    Matched Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map(s => (
                      <span key={s}
                        className="px-3 py-1 bg-white text-brand-600 rounded-lg
                          text-xs font-semibold border border-brand-100">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold
                  text-sm hover:bg-brand-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
