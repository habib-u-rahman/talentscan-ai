import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "../api/api";

/* ── helpers ── */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SUGGESTIONS = [
  { icon: "🏆", text: "What is resume screening" },
  { icon: "🐍", text: "How does scoring work?" },
  { icon: "⚖️",  text: "How does NLP extract skills?" },
  { icon: "📊", text: "How does NLP extract skills?" },
  { icon:"" , text: "What is the best candidate selection process?" },
];

const INITIAL = [{
  role: "bot",
  text: "Hello! I'm your AI hiring assistant. I can answer questions about your screened candidates — scores, skills, comparisons and more. How can I help you today?",
  time: getTime(),
  id:   0,
}];

/* ── Consistent inner-page hero — identical to Screener & About ── */
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

/* ── Copy button ── */
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} title="Copy"
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
        hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
      {copied
        ? <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 4h8a2 2 0 012
              2v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6a2 2 0 012-2z"/>
          </svg>}
    </button>
  );
}

/* ── Single message bubble ── */
function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`group flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
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

      {/* Bubble */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
          ${isUser
            ? "bg-brand-600 text-white rounded-br-md"
            : "bg-white text-slate-800 border border-slate-200 rounded-bl-md"}`}>
          {msg.text}
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[11px] text-slate-400">{msg.time}</span>
          {!isUser && <CopyBtn text={msg.text}/>}
        </div>
      </div>
    </div>
  );
}

/* ── Typing indicator ── */
function TypingIndicator() {
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
        px-5 py-4 shadow-sm flex items-center gap-1.5">
        <span className="dot dot-1"/><span className="dot dot-2"/><span className="dot dot-3"/>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState(INITIAL);
  const [input,    setInput]    = useState("");
  const [typing,   setTyping]   = useState(false);
  const [error,    setError]    = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const idRef      = useRef(1);
  const hasUser    = messages.some(m => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = useCallback(async (text) => {
    const t = text.trim();
    if (!t || typing) return;
    setMessages(p => [...p, { role: "user", text: t, time: getTime(), id: idRef.current++ }]);
    setInput("");
    setTyping(true);
    setError(null);
    try {
      const data = await sendChatMessage(t);
      setMessages(p => [...p, { role: "bot", text: data.reply, time: getTime(), id: idRef.current++ }]);
    } catch {
      setError("Connection failed — is Flask running on port 5000?");
      setMessages(p => [...p, {
        role: "bot",
        text: "I couldn't connect to the backend. Please make sure Flask is running on port 5000.",
        time: getTime(), id: idRef.current++,
      }]);
    } finally {
      setTyping(false);
      inputRef.current?.focus();
    }
  }, [typing]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Same hero as Screener & About ── */}
      <PageHero
        tag="AI Chatbot"
        title="Career Assistant"
        subtitle="Ask anything about your screened candidates in plain English — scores, skills, or comparisons."
      />

      {/* ── Chat container ── */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-5 sm:px-8 py-6 gap-4">

        {/* ── Chat window card ── */}
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl
          shadow-sm overflow-hidden" style={{ minHeight: "520px" }}>

          {/* Card top bar */}
          <div className="flex-shrink-0 px-5 py-3.5 border-b border-slate-100
            flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center
                justify-center shadow-sm">
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                  <span className="text-[11px] text-slate-400">
                    {typing ? "Typing…" : "Online"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 hidden sm:block">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => { setMessages(INITIAL); setError(null); }}
                className="text-xs font-medium text-slate-400 px-3 py-1.5 rounded-lg
                  border border-slate-200 hover:border-red-200 hover:text-red-500
                  hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* ── Suggestion chips (only before first user message) ── */}
          {!hasUser && (
            <div className="flex-shrink-0 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest mb-2">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(({ icon, text }) => (
                  <button key={text} onClick={() => send(text)} disabled={typing}
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

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto chat-scroll px-5 py-5 space-y-5">

            {/* Welcome state — shown before user sends anything */}
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
                <p className="font-bold text-slate-700 text-sm">Start a conversation</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Use a suggestion above or type your own question below.
                </p>
              </div>
            )}

            {/* All messages */}
            {messages.map(m => <Message key={m.id} msg={m}/>)}

            {/* Typing indicator */}
            {typing && <TypingIndicator/>}

            {/* Error */}
            {error && (
              <div className="flex justify-center">
                <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50
                  border border-red-100 rounded-full px-4 py-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {error}
                </span>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>

          {/* ── Input bar ── */}
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
                disabled={typing}
                placeholder="Ask about candidates, skills, match scores…"
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 resize-none
                  outline-none bg-transparent leading-relaxed min-h-[24px] max-h-[120px]
                  disabled:opacity-60"
                style={{ overflow: "hidden" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
                  transition-all active:scale-90 self-end
                  ${input.trim() && !typing
                    ? "bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-200"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[11px] text-slate-400">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono
                  text-[10px]">Enter</kbd> to send ·{" "}
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-mono
                  text-[10px]">Shift+Enter</kbd> for new line
              </span>
              {input.length > 0 && (
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {input.length} chars
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
