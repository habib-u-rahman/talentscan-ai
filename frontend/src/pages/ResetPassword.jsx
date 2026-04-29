import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../api/api";

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open
    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [done,     setDone]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const nav = useNavigate();

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8)          s++;
    if (/[A-Z]/.test(password))        s++;
    if (/[0-9]/.test(password))        s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-brand-400", "bg-emerald-500"][strength];
  const strengthText  = ["", "text-red-500", "text-amber-500", "text-brand-500", "text-emerald-600"][strength];

  const showError = msg => { setError(msg); setShakeKey(k => k + 1); };

  if (!token) {
    return (
      <AuthLayout>
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 text-center auth-card">
          <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-200
            flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Invalid Link</h1>
          <p className="text-sm text-slate-500 mb-6">
            This reset link is missing a token. Please request a new password reset.
          </p>
          <Link to="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white
              text-sm font-bold rounded-xl hover:bg-brand-500 shadow-lg shadow-brand-300/40
              active:scale-[.98] transition-all">
            Request New Link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const submit = async () => {
    if (!password || !confirm) { showError("Please fill in all fields."); return; }
    if (password.length < 6)   { showError("Password must be at least 6 characters."); return; }
    if (password !== confirm)   { showError("Passwords do not match."); return; }
    setLoading(true); setError(null);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => nav("/login", { state: { message: "Password reset! Please sign in with your new password." } }), 2000);
    } catch (err) {
      showError(err?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/60 p-8 auth-card">

        {!done ? (
          <>
            {/* Header */}
            <div className="text-center mb-6 field-1">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center
                mx-auto mb-4 shadow-lg shadow-brand-300/40">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900">Set new password</h1>
              <p className="text-sm text-slate-400 mt-1">Must be at least 6 characters.</p>
            </div>

            {/* Error */}
            {error && (
              <div key={shakeKey} className="shake bg-red-50 border border-red-100 rounded-xl
                px-4 py-3 mb-5 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-xs text-red-600 font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* New password */}
              <div className="field-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm text-slate-800
                      bg-slate-50/50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>

                {/* Strength meter */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300
                            ${i <= strength ? strengthColor : "bg-slate-100"}`} />
                      ))}
                    </div>
                    <p className={`text-[11px] font-semibold ${strengthText}`}>{strengthLabel}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="field-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConf ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submit()}
                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm text-slate-800
                      bg-slate-50/50 outline-none focus:ring-2 transition-all
                      ${confirm && confirm !== password
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : confirm && confirm === password
                          ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100"
                          : "border-slate-200 focus:border-brand-400 focus:ring-brand-100"}`}
                  />
                  <button type="button" onClick={() => setShowConf(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    <EyeIcon open={showConf} />
                  </button>
                </div>
                {confirm && confirm !== password && (
                  <p className="text-[11px] text-red-500 font-semibold mt-1">Passwords don't match</p>
                )}
                {confirm && confirm === password && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Passwords match</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="field-4">
              <button
                onClick={submit}
                disabled={loading}
                className={`w-full mt-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200
                  ${loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-300/40 active:scale-[.98]"}`}
              >
                {loading
                  ? <span className="flex items-center justify-center gap-2"><Spinner />Resetting…</span>
                  : "Reset Password"}
              </button>
              <div className="text-center mt-5">
                <Link to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium
                    hover:text-brand-600 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* ── Success ── */
          <div className="success-enter text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200
              flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Password reset!</h2>
            <p className="text-sm text-slate-500 mb-4">Redirecting you to sign in…</p>
            <div className="flex justify-center">
              <Spinner />
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
