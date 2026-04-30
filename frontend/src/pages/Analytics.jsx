import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import { getAnalytics } from "../api/api";

/* ── Page hero ── */
function PageHero() {
  return (
    <div className="bg-slate-900 px-5 sm:px-8 pt-10 pb-14 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[220px] bg-brand-600/15 rounded-full blur-3xl"/>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-[0.15em]
          text-brand-400 uppercase mb-3">Recruiter Analytics</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Your Hiring Dashboard
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">
          Screening activity, score trends, and the skills most in-demand across all your job descriptions.
        </p>
      </div>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, value, sub, color }) {
  const colors = {
    blue:   "bg-brand-50 border-brand-100 text-brand-700",
    green:  "bg-emerald-50 border-emerald-100 text-emerald-700",
    amber:  "bg-amber-50 border-amber-100 text-amber-700",
    violet: "bg-violet-50 border-violet-100 text-violet-700",
  };
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${colors[color]}`}>
      <p className="text-[11px] font-bold tracking-widest uppercase opacity-70 mb-2">{label}</p>
      <p className="text-3xl sm:text-4xl font-extrabold leading-none">
        {value ?? <span className="text-slate-300 text-2xl">—</span>}
      </p>
      {sub && <p className="text-xs mt-1.5 opacity-60 font-medium">{sub}</p>}
    </div>
  );
}

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg text-xs">
      <p className="font-bold text-slate-700 mb-1.5">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Empty state ── */
function EmptyState({ navigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-5">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300
        flex items-center justify-center mb-6">
        <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <p className="font-extrabold text-slate-700 text-lg">No data yet</p>
      <p className="text-slate-400 text-sm mt-2 max-w-xs">
        Run your first screening to start seeing analytics, trends, and skill insights here.
      </p>
      <button
        onClick={() => navigate("/screener")}
        className="mt-6 px-6 py-3 bg-brand-600 text-white text-sm font-bold rounded-xl
          hover:bg-brand-500 transition-colors shadow-md shadow-brand-200"
      >
        Go to Screener →
      </button>
    </div>
  );
}

/* ── Score badge ── */
function ScoreBadge({ score }) {
  if (score == null) return <span className="text-xs text-slate-300">—</span>;
  const cls = score >= 70
    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
    : score >= 40
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {score}%
    </span>
  );
}

/* ── Main page ── */
export default function Analytics() {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch(() => setError("Could not load analytics."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHero />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600
              rounded-full animate-spin"/>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && data?.total_screenings === 0 && (
          <EmptyState navigate={navigate} />
        )}

        {/* Dashboard */}
        {!loading && !error && data?.total_screenings > 0 && (
          <div className="space-y-6">

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Screenings"
                value={data.total_screenings}
                sub="all time"
                color="blue"
              />
              <StatCard
                label="Resumes Analyzed"
                value={data.total_resumes}
                sub={`avg ${data.total_screenings ? (data.total_resumes / data.total_screenings).toFixed(1) : 0} per screening`}
                color="violet"
              />
              <StatCard
                label="Avg Match Score"
                value={data.avg_score != null ? `${data.avg_score}%` : null}
                sub="across all screenings"
                color="green"
              />
              <StatCard
                label="Pass Rate"
                value={data.pass_rate != null ? `${data.pass_rate}%` : null}
                sub="candidates scored ≥ 70%"
                color="amber"
              />
            </div>

            {/* ── Charts row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Activity over time */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                  Screening Activity
                </p>
                <h3 className="font-extrabold text-slate-900 mb-5">
                  Screenings &amp; Resumes Over Time
                </h3>
                {data.activity.length < 2 ? (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    More data needed to show trend
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={data.activity} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                      <defs>
                        <linearGradient id="gradScreenings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="gradResumes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#10b981" stopOpacity={0.20}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <Tooltip content={<CustomTooltip />}/>
                      <Area type="monotone" dataKey="screenings" name="Screenings"
                        stroke="#4f46e5" fill="url(#gradScreenings)" strokeWidth={2}/>
                      <Area type="monotone" dataKey="resumes" name="Resumes"
                        stroke="#10b981" fill="url(#gradResumes)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top skills */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                  Skill Demand
                </p>
                <h3 className="font-extrabold text-slate-900 mb-5">
                  Top Skills in Job Descriptions
                </h3>
                {!data.top_skills.length ? (
                  <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                    No skills data yet
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={data.top_skills}
                      layout="vertical"
                      margin={{ top: 0, right: 24, bottom: 0, left: 4 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false}/>
                      <YAxis type="category" dataKey="skill" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} width={80}/>
                      <Tooltip content={<CustomTooltip />}/>
                      <Bar dataKey="count" name="Appearances" fill="#4f46e5" radius={[0, 6, 6, 0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ── Score trend (only if we have scored entries) ── */}
            {data.activity.some(a => a.avg != null) && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                  Performance
                </p>
                <h3 className="font-extrabold text-slate-900 mb-5">Average Match Score Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart
                    data={data.activity.filter(a => a.avg != null)}
                    margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
                  >
                    <defs>
                      <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Area type="monotone" dataKey="avg" name="Avg Score (%)"
                      stroke="#f59e0b" fill="url(#gradScore)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Recent screenings table ── */}
            {data.recent.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                  <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-0.5">
                    History
                  </p>
                  <h3 className="font-extrabold text-slate-900">Recent Screenings</h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.recent.map((r, i) => (
                    <div key={r.id}
                      className="flex items-center gap-4 px-5 sm:px-6 py-4 hover:bg-slate-50/60 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 text-xs font-extrabold
                        flex items-center justify-center flex-shrink-0 border border-brand-100">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {r.resume_count} resume{r.resume_count !== 1 ? "s" : ""} ·{" "}
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:block text-right">
                          <p className="text-[11px] text-slate-400">Top</p>
                          <ScoreBadge score={r.top_score} />
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-400">Avg</p>
                          <ScoreBadge score={r.avg_score} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-100 text-center">
                  <button
                    onClick={() => navigate("/screener")}
                    className="text-xs text-brand-600 font-semibold hover:underline"
                  >
                    Run a new screening →
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
