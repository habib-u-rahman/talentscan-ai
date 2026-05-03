import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const getTime  = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SUGGESTIONS = [
  { icon: "🏆", text: "Who is my best candidate?" },
  { icon: "🐍", text: "Which candidates know Python?" },
  { icon: "⚖️", text: "Compare my top 2 candidates" },
  { icon: "📊", text: "What skills are most common?" },
  { icon: "❓", text: "Who is missing the most required skills?" },
];

const INITIAL = [{
  role: "bot",
  text: "Hello! I'm your AI hiring assistant powered by Groq & LLaMA 3. Screen some resumes first, then ask me anything about your candidates — scores, skills, comparisons and more.",
  sources:   [],
  streaming: false,
  time: getTime(),
  id:   0,
}];

/* ── helpers ─────────────────────────────────────────────────────────────── */

function renderMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g,     "<em>$1</em>")
    .replace(/`(.*?)`/g,       '<code class="bg-slate-100 px-1 rounded text-[11px] font-mono">$1</code>')
    .replace(/\n/g,            "<br/>");
}

/* ── PageHero ────────────────────────────────────────────────────────────── */
function PageHero() {
  return (
    <div className="bg-slate-900 px-5 sm:px-8 pt-10 pb-14 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[220px] bg-brand-600/15 rounded-full blur-3xl"/>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <span className="inline-block text-[11px] font-bold tracking-[0.15em] text-brand-400 uppercase mb-3">
          RAG · AI Chatbot
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Career Assistant
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">
          Ask anything about your screened candidates in plain English — scores, skills, or comparisons.
        </p>
        {/* Stack badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {["Groq · LLaMA 3.1", "sentence-transformers", "RAG Pipeline", "PostgreSQL"].map(b => (
            <span key={b} className="text-[10px] font-semibold px-2.5 py-1 rounded-full
              bg-slate-800 border border-slate-700 text-slate-400">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Copy button ─────────────────────────────────────────────────────────── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }}
      title="Copy"
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
        hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
      {copied
        ? <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 4h8a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6a2 2 0 012-2z"/>
          </svg>}
    </button>
  );
}

/* ── Source chips ────────────────────────────────────────────────────────── */
function Sources({ sources }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 self-center mr-0.5">
        Sources:
      </span>
      {sources.map((s, i) => (
        <div key={i} className="flex items-center gap-1 px-2 py-0.5 bg-brand-50
          border border-brand-100 rounded-full text-[10px] text-brand-700 font-medium">
          <span>{s.name}</span>
          <span className="text-brand-300">·</span>
          <span className="text-brand-500">{s.score}%</span>
        </div>
      ))}
    </div>
  );
}

/* ── Message bubble ──────────────────────────────────────────────────────── */
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {isUser
        ? <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-200 flex items-center
              justify-center text-slate-600 text-[11px] font-extrabold self-end">You</div>
        : <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 flex items-center
              justify-center self-end shadow-md shadow-brand-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
                a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>}

      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser
            ? "bg-brand-600 text-white rounded-br-md"
            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"}`}>
          {isUser
            ? msg.text
            : <span dangerouslySetInnerHTML={{ __html: renderMd(msg.text || "​") }}/>}
          {msg.streaming && (
            <span className="inline-block w-0.5 h-3.5 bg-brand-500 ml-0.5 align-middle
              animate-pulse rounded-full"/>
          )}
        </div>

        {!isUser && <Sources sources={msg.sources}/>}

        <div className={`flex items-center gap-2 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[11px] text-slate-400">{msg.time}</span>
          {!isUser && !msg.streaming && msg.text && <CopyBtn text={msg.text}/>}
        </div>
      </div>
    </div>
  );
}

/* ── Status / typing indicator ───────────────────────────────────────────── */
function StatusIndicator({ status }) {
  const label = status === "searching"   ? "Searching your candidates…"
              : status === "generating"  ? "Generating response…"
              : "Thinking…";
  const icon  = status === "searching"  ? "🔍" : "✨";

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-brand-600 flex items-center
        justify-center shadow-md shadow-brand-200">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
            a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md
        px-4 py-3 shadow-sm flex items-center gap-2 text-xs text-slate-500">
        <span>{icon}</span>
        <span>{label}</span>
        <span className="flex gap-1 ml-1">
          <span className="dot dot-1"/><span className="dot dot-2"/><span className="dot dot-3"/>
        </span>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function Chatbot() {
  const [messages, setMessages]   = useState(INITIAL);
  const [input,    setInput]      = useState("");
  const [status,   setStatus]     = useState(null); // null | "searching" | "generating"
  const [error,    setError]      = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const idRef      = useRef(1);
  const hasUser    = messages.some(m => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = useCallback(async (text) => {
    const t = text.trim();
    if (!t || status) return;

    const userMsg = { role: "user", text: t, sources: [], streaming: false, time: getTime(), id: idRef.current++ };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setStatus("searching");
    setError(null);

    const botId  = idRef.current++;
    const botMsg = { role: "bot", text: "", sources: [], streaming: true, time: getTime(), id: botId };
    setMessages(p => [...p, botMsg]);

    try {
      const token   = localStorage.getItem("token");
      const history = [...messages, userMsg]
        .filter(m => m.id !== 0)
        .slice(-10)
        .map(m => ({ role: m.role, text: m.text }));

      const resp = await fetch(`${API_BASE}/chat/stream`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ message: t, history }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${resp.status}`);
      }

      const reader  = resp.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") {
            setMessages(p => p.map(m => m.id === botId ? { ...m, streaming: false } : m));
            setStatus(null);
            return;
          }
          try {
            const parsed = JSON.parse(raw);
            if (parsed.status === "generating") {
              setStatus("generating");
              if (parsed.sources?.length) {
                setMessages(p => p.map(m => m.id === botId ? { ...m, sources: parsed.sources } : m));
              }
            } else if (parsed.content) {
              setStatus("generating");
              setMessages(p => p.map(m =>
                m.id === botId ? { ...m, text: m.text + parsed.content } : m
              ));
            } else if (parsed.error) {
              setMessages(p => p.map(m =>
                m.id === botId ? { ...m, text: `Error: ${parsed.error}`, streaming: false } : m
              ));
              setStatus(null);
              return;
            }
          } catch { /* ignore parse errors */ }
        }
      }

      setMessages(p => p.map(m => m.id === botId ? { ...m, streaming: false } : m));
      setStatus(null);

    } catch (err) {
      setMessages(p => p.map(m =>
        m.id === botId
          ? { ...m, text: `Sorry, something went wrong: ${err.message}`, streaming: false }
          : m
      ));
      setStatus(null);
      setError(err.message);
    }
  }, [status, messages]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PageHero/>

      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-5 sm:px-8 py-6 gap-4">

        {/* Chat card */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl
          shadow-sm overflow-hidden" style={{ minHeight: "clamp(360px, 60vh, 520px)" }}>

          {/* Top bar */}
          <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-100
            flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
                    a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-none">Career Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status ? "bg-amber-400 animate-pulse" : "bg-emerald-500 animate-pulse"}`}/>
                  <span className="text-[11px] text-slate-400">
                    {status === "searching"  ? "Searching…"
                   : status === "generating" ? "Generating…"
                   : "Online · RAG powered"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:block">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => { setMessages(INITIAL); setError(null); setStatus(null); }}
                className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg
                  border border-slate-200 hover:border-red-200 hover:text-red-500
                  hover:bg-red-50 transition-colors">
                Clear
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          {!hasUser && (
            <div className="flex-shrink-0 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-2">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(({ icon, text }) => (
                  <button key={text} onClick={() => send(text)} disabled={!!status}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium
                      text-brand-600 bg-white border border-brand-100 rounded-full
                      hover:bg-brand-50 hover:border-brand-300 active:scale-95
                      transition-all disabled:opacity-50">
                    <span>{icon}</span>{text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll px-5 py-5 space-y-5">

            {!hasUser && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100
                  flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14
                      a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                  </svg>
                </div>
                <p className="font-bold text-slate-700 text-sm">Ask about your candidates</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Screen resumes first, then I can answer questions grounded in your real data.
                </p>
              </div>
            )}

            {messages.map(m => <Message key={m.id} msg={m}/>)}

            {status && !messages.find(m => m.streaming) && (
              <StatusIndicator status={status}/>
            )}

            {error && (
              <div className="flex justify-center">
                <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50
                  border border-red-100 rounded-full px-4 py-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </span>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 border-t border-slate-100 px-5 py-4 bg-white">
            <div className="flex items-end gap-3 bg-slate-50 border border-slate-200
              rounded-2xl px-4 py-3 focus-within:border-brand-400 focus-within:ring-2
              focus-within:ring-brand-100 focus-within:bg-white transition-all">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                disabled={!!status}
                placeholder="Ask about candidates, skills, match scores…"
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 resize-none
                  outline-none bg-transparent leading-relaxed min-h-[24px] max-h-[120px]
                  disabled:opacity-60"
                style={{ overflow: "hidden" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || !!status}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all active:scale-90 self-end
                  ${input.trim() && !status
                    ? "bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <span className="hidden sm:inline text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px]">Enter</kbd> to send ·{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono text-[10px]">Shift+Enter</kbd> for new line
              </span>
              {input.length > 0 && (
                <span className="text-[11px] text-slate-400 tabular-nums">{input.length} chars</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
