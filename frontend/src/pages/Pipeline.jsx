import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-500 transition-colors">
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
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Resume Analysis Breakdown
          </h1>
          <p className="mt-2 text-slate-400 text-sm max-w-xl">
            Step-by-step visualization of every NLP operation applied to each resume.
          </p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <p className="text-slate-400 text-sm">Pipeline visualization loading...</p>
      </div>
    </div>
  );
}
