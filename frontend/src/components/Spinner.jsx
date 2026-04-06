export default function Spinner({ size = "md", label = "Loading…" }) {
  const s = { sm: "w-5 h-5", md: "w-9 h-9", lg: "w-12 h-12" }[size];
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${s}`}>
        <div className={`${s} rounded-full border-4 border-slate-100`}/>
        <div className={`${s} rounded-full border-4 border-transparent border-t-brand-600
          animate-spin absolute inset-0`}/>
      </div>
      {label && <p className="text-sm text-slate-400 font-medium">{label}</p>}
    </div>
  );
}
