import { useRef, useState } from "react";

export default function FileUpload({ files, onChange }) {
  const ref  = useRef(null);
  const [drag, setDrag] = useState(false);

  const merge = (incoming) => {
    const names = new Set(files.map(f => f.name));
    onChange([...files, ...Array.from(incoming).filter(f => !names.has(f.name))]);
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); merge(e.dataTransfer.files); }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-5 sm:p-8 text-center
          select-none transition-all duration-150
          ${drag
            ? "border-brand-400 bg-brand-50 scale-[1.01]"
            : "border-slate-200 hover:border-brand-300 hover:bg-slate-50/60"}`}
      >
        <div className={`mx-auto w-11 h-11 rounded-xl flex items-center justify-center mb-3
          transition-colors ${drag ? "bg-brand-100" : "bg-slate-100"}`}>
          <svg className={`w-5 h-5 transition-colors ${drag ? "text-brand-600" : "text-slate-400"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">
          {drag ? "Drop files here" : "Drag & drop resumes"}
        </p>
        <p className="text-xs text-slate-400 mb-3">PDF and TXT files supported</p>
        <span className="inline-block px-5 py-2 bg-brand-600 text-white text-xs font-semibold
          rounded-lg shadow-sm hover:bg-brand-500 transition-colors">
          Browse Files
        </span>
        <input ref={ref} type="file" multiple accept=".pdf,.txt"
          className="hidden" onChange={e => merge(e.target.files)}/>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div key={file.name}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl
                border border-slate-200 group hover:border-slate-300 transition-colors">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                text-[10px] font-extrabold tracking-wide
                ${file.name.endsWith(".pdf")
                  ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"}`}>
                {file.name.endsWith(".pdf") ? "PDF" : "TXT"}
              </span>
              <span className="flex-1 text-sm text-slate-700 truncate">{file.name}</span>
              <span className="text-xs text-slate-400 mr-1">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                onClick={() => onChange(files.filter(f => f.name !== file.name))}
                className="opacity-60 sm:opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500
                  transition-all flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
