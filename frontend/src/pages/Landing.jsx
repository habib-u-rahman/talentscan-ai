import { Link, Navigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ── Reusable fade-up animation wrapper ── */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ── */
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          initial={0}
          animate={inView ? to : 0}
          transition={{ duration: 1.6, ease: "easeOut" }}
        >
          {({ latest }) => Math.round(latest) + suffix}
        </motion.span>
      </motion.span>
    </span>
  );
}

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
      </svg>
    ),
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/20",
    accent: "text-violet-400",
    title: "Smart Resume Ranking",
    desc: "TF-IDF vectorization + cosine similarity scores every resume against your job description in milliseconds.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
      </svg>
    ),
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
    accent: "text-blue-400",
    title: "AI Chatbot Insights",
    desc: "Ask anything about candidates. Our NLP chatbot explains strengths, gaps, and recommendations instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
    accent: "text-emerald-400",
    title: "Visual NLP Pipeline",
    desc: "See every step — tokenization, TF-IDF weights, skill matching — visualized in an interactive dashboard.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    accent: "text-amber-400",
    title: "Instant Results",
    desc: "Upload resumes and get ranked candidates with match scores in under 3 seconds — no configuration needed.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    color: "from-rose-500/20 to-pink-500/10 border-rose-500/20",
    accent: "text-rose-400",
    title: "Skill Gap Detection",
    desc: "Automatically identifies which required skills each candidate has and which are missing from their resume.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: "from-indigo-500/20 to-violet-500/10 border-indigo-500/20",
    accent: "text-indigo-400",
    title: "History Tracking",
    desc: "Every screening session is saved. Revisit any past analysis with full results and pipeline data intact.",
  },
];

const steps = [
  { n: "01", title: "Paste Job Description", desc: "Add your job requirements — the NLP engine extracts key skills and qualifications automatically.", color: "bg-violet-500" },
  { n: "02", title: "Upload Resumes",         desc: "Drop PDF or TXT resume files. Process one or fifty at once — the system scales instantly.",   color: "bg-blue-500" },
  { n: "03", title: "Get Ranked Candidates",  desc: "Cosine similarity scores rank every candidate. Top matches rise to the top automatically.",   color: "bg-emerald-500" },
];

const stats = [
  { value: 10, suffix: "×", label: "Faster Screening" },
  { value: 98, suffix: "%", label: "Accuracy Rate" },
  { value: 50, suffix: "+", label: "Resumes at Once" },
  { value: 3,  suffix: "s", label: "Analysis Time" },
];

export default function Landing() {
  if (localStorage.getItem("user")) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-x-hidden">

      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[130px] top-[-200px] left-[-100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[130px] bottom-[-150px] right-[-100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute w-[400px] h-[400px] bg-emerald-600/15 rounded-full blur-[100px] top-[40%] left-[50%]"
        />
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 flex justify-between items-center px-6 sm:px-10 py-4
          bg-slate-950/80 backdrop-blur-md border-b border-white/[0.06]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight">
            Talant<span className="text-violet-400">Scan</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1
            bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">NLP Powered</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login"
            className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
            Sign In
          </Link>
          <Link to="/signup"
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-bold
              transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105">
            Get Started
          </Link>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section className="relative text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">

        {/* badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full
            bg-violet-500/10 border border-violet-500/25 mb-8"
        >
          <span className="text-violet-400 text-xs font-bold tracking-widest uppercase">
            NLP · TF-IDF · Cosine Similarity
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
        >
          Hire Smarter,{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400
              bg-clip-text text-transparent">
              10× Faster
            </span>
            {/* underline glow */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-1 left-0 right-0 h-[3px] rounded-full
                bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 origin-left"
            />
          </span>
          {" "}with AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-7 text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed"
        >
          Stop spending hours reading resumes. TalantScan uses{" "}
          <span className="text-slate-300 font-semibold">NLP & TF-IDF</span> to instantly
          analyze, rank, and explain every candidate — so you hire the best person, fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/signup"
            className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 rounded-2xl font-bold text-base
              transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50
              hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Start Screening Now
            <motion.svg
              className="w-4 h-4"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </motion.svg>
          </Link>
          <Link to="/login"
            className="px-8 py-4 border border-white/10 hover:border-white/25 rounded-2xl font-semibold
              text-base hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-slate-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            See Demo
          </Link>
        </motion.div>

        {/* ── Floating demo preview card ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 mx-auto max-w-2xl"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10
            shadow-2xl shadow-violet-500/10 bg-slate-900">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-white/[0.07]">
              <span className="w-3 h-3 rounded-full bg-red-500/70"/>
              <span className="w-3 h-3 rounded-full bg-amber-500/70"/>
              <span className="w-3 h-3 rounded-full bg-emerald-500/70"/>
              <span className="ml-3 text-xs text-slate-500 font-mono">TalantScan — Screener</span>
            </div>
            {/* mock results */}
            <div className="p-5 space-y-3">
              {[
                { name: "Habib Ur Rahman",  score: 94, color: "bg-emerald-500", badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", delay: 0.9 },
                { name: "Alishba Khalid",  score: 78, color: "bg-blue-500",   badge: "text-blue-400 bg-blue-400/10 border-blue-400/20",           delay: 1.0 },
                { name: "Zehra Nisar",     score: 61, color: "bg-amber-500",  badge: "text-amber-400 bg-amber-400/10 border-amber-400/20",         delay: 1.1 },
                { name: "Wajeeh Ur Rahman",score: 45, color: "bg-slate-500",  badge: "text-slate-400 bg-slate-400/10 border-slate-400/20",         delay: 1.2 },
              ].map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: c.delay }}
                  className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.07]
                    rounded-xl px-4 py-3"
                >
                  <span className="text-lg w-6 text-center">
                    {["🥇","🥈","🥉",""][i]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                    <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.score}%` }}
                        transition={{ duration: 1, delay: c.delay + 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${c.color}`}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.badge}`}>
                    {c.score}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* glow under card */}
          <div className="h-8 bg-violet-500/20 blur-2xl rounded-full mx-8 -mt-1"/>
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-14 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, suffix, label }, i) => (
            <FadeUp key={label} delay={i * 0.1} className="text-center">
              <p className="text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400
                bg-clip-text text-transparent">
                {value}{suffix}
              </p>
              <p className="text-sm text-slate-500 mt-1 font-medium">{label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <FadeUp className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] text-violet-400 uppercase mb-3">
            Everything You Need
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Powered by Real NLP
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            Every feature is built on actual natural language processing — not just keyword matching.
          </p>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeUp key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${f.color}
                  border backdrop-blur-sm h-full`}
              >
                <div className={`w-11 h-11 rounded-xl bg-white/[0.08] flex items-center
                  justify-center mb-4 ${f.accent}`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Three Steps to Your Best Hire
            </h2>
          </FadeUp>

          <div className="space-y-5">
            {steps.map((step, i) => (
              <FadeUp key={step.n} delay={i * 0.12}>
                <motion.div
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-6 p-6 rounded-2xl bg-white/[0.04]
                    border border-white/[0.07] hover:border-white/[0.14] transition-colors"
                >
                  <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center
                    justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-extrabold text-sm">{step.n}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1.5">{step.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-6">
        <FadeUp>
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden">
            {/* gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-700"/>
            {/* noise overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px, 30px 30px",
              }}
            />
            <div className="relative px-8 py-14 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl mb-5"
              >
                🚀
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Screen Smarter?
              </h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto text-base">
                Join recruiters already using TalantScan to find top talent before anyone else.
                Free to use — no credit card required.
              </p>
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-violet-700
                  font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all
                  shadow-xl shadow-black/20 text-base"
              >
                Create Free Account
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      

    </div>
  );
}
