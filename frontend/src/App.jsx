import { useState, useRef, useEffect, useCallback } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

function formatTime() {
  return new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

// Streaming text hook
function StreamingText({ text }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, 20);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <>
      {displayed}
      {!done && <span className="streaming-cursor" />}
    </>
  );
}

function UserMessage({ text, time }) {
  return (
    <div className="flex flex-col items-start message-fade-in">
      <div className="px-4 py-3 shadow-sm max-w-[78%] text-sm leading-relaxed"
        style={{ background: 'linear-gradient(135deg,#0D1B2A,#1565C0)', color: 'white', borderRadius: '18px 18px 4px 18px' }}>
        {text}
      </div>
      <span className="text-[10px] mt-1 mr-1" style={{ color: '#a0b8cc' }}>{time}</span>
    </div>
  );
}

function ThinkingMessage() {
  return (
    <div className="flex justify-end message-fade-in">
      <div className="px-5 py-3 shadow-sm flex items-center gap-2"
        style={{ background: 'white', border: '1.5px solid #e0f4ef', borderRight: '3px solid #00C9A7', borderRadius: '18px 18px 18px 4px' }}>
        <span className="text-sm italic" style={{ color: '#94a3b8' }}>חושב</span>
        <div className="thinking-dots flex items-center"><span /><span /><span /></div>
      </div>
    </div>
  );
}

function AIMessage({ category, answer, responseTime, time }) {
  return (
    <div className="flex flex-col items-end message-fade-in">
      <div className="p-4 shadow-sm max-w-[78%]"
        style={{ background: 'white', border: '1.5px solid #e0f4ef', borderRight: '3px solid #00C9A7', borderRadius: '18px 18px 18px 4px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#00A88A', display: 'block', marginBottom: 4 }}>
          <i className="fas fa-tag" style={{ marginLeft: 4 }} />{category}
        </span>
        <p className="text-sm leading-relaxed" style={{ color: '#1a2940' }}>
          <StreamingText text={answer} />
        </p>
      </div>
      <div className="flex items-center gap-3 mt-1 ml-1">
        {responseTime && (
          <span style={{ fontSize: 10, color: '#00C9A7', display: 'flex', alignItems: 'center', gap: 3 }}>
            <i className="fas fa-bolt" style={{ fontSize: 10 }} />{responseTime}
          </span>
        )}
        <span className="text-[10px]" style={{ color: '#a0b8cc' }}>{time}</span>
      </div>
    </div>
  );
}

function ErrorMessage({ msg }) {
  return (
    <div className="flex justify-center message-fade-in">
      <div className="text-xs px-4 py-2 rounded-full flex items-center gap-2"
        style={{ background: '#fff0f0', color: '#ef4444', border: '1px solid #fecaca' }}>
        <i className="fas fa-exclamation-circle" /> {msg}
      </div>
    </div>
  );
}

function BugModal({ open, onClose }) {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState(null);
  const locationRef = useRef(null);

  useEffect(() => {
    if (open) {
      setLocation(''); setDescription(''); setFeedback(null);
      setTimeout(() => locationRef.current?.focus(), 50);
    }
  }, [open]);

  async function submit() {
    if (!location.trim() || !description.trim()) {
      setFeedback({ type: 'warn', text: 'נא למלא את כל השדות' }); return;
    }
    try {
      const res = await fetch(`${API_BASE}/assistant/report`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location.trim(), description: description.trim() })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFeedback({ type: 'ok', text: `✓ דיווח #${data.id} התקבל! הועבר לטיפול` });
      setTimeout(onClose, 2000);
    } catch {
      setFeedback({ type: 'err', text: 'שגיאה בשליחה — וודא שהשרת פעיל' });
    }
  }

  const fbStyles = {
    warn: { background: '#fffbeb', color: '#d97706' },
    ok:   { background: '#f0faf8', color: '#00a88a', border: '1px solid #c8eee8' },
    err:  { background: '#fff0f0', color: '#ef4444', border: '1px solid #fecaca' },
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(13,27,42,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <i className="fas fa-bug" />
            </div>
            <div>
              <h2 className="font-bold text-lg" style={{ color: '#0D1B2A' }}>דיווח על תקלה</h2>
              <p className="text-xs text-slate-400">הדיווח יועבר לצוות הטכני</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 text-xl transition-colors">
            <i className="fas fa-times" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: '#0D1B2A' }}>מיקום התקלה</label>
            <input ref={locationRef} type="text" value={location} onChange={e => setLocation(e.target.value)}
              placeholder='לדוגמה: שירותים קומה 2, בניין 3'
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
              style={{ color: '#0D1B2A' }}
              onFocus={e => { e.target.style.borderColor='#00C9A7'; e.target.style.boxShadow='0 0 0 3px rgba(0,201,167,0.1)'; }}
              onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: '#0D1B2A' }}>תיאור התקלה</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              rows={3} placeholder="תאר את התקלה בפירוט..."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none transition-all"
              style={{ color: '#0D1B2A' }}
              onFocus={e => { e.target.style.borderColor='#00C9A7'; e.target.style.boxShadow='0 0 0 3px rgba(0,201,167,0.1)'; }}
              onBlur={e => { e.target.style.borderColor=''; e.target.style.boxShadow=''; }} />
          </div>
        </div>
        {feedback && (
          <div className="mt-3 text-sm text-center py-2 rounded-xl" style={fbStyles[feedback.type]}>
            {feedback.text}
          </div>
        )}
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-all">
            ביטול
          </button>
          <button onClick={submit}
            className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
            <i className="fas fa-paper-plane" style={{ marginLeft: 4 }} />שלח דיווח
          </button>
        </div>
      </div>
    </div>
  );
}

const QUICK_QUESTIONS = [
  { icon: 'fa-map-marker-alt', label: 'מזכירות',      q: 'איפה המזכירות?' },
  { icon: 'fa-calendar',       label: 'מועד א׳',       q: 'מתי מועד א׳ מבחנים?' },
  { icon: 'fa-utensils',       label: 'קפיטריה',       q: 'מה שעות הקפיטריה?' },
  { icon: 'fa-wifi',           label: 'WiFi',          q: 'איך מתחברים לוויפי?' },
  { icon: 'fa-tools',          label: 'תקלות פתוחות', q: 'האם יש תקלות פתוחות כרגע?' },
  { icon: 'fa-graduation-cap', label: 'מלגה',          q: 'איך מגישים בקשה למלגה?' },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 40);
  }, [messages]);

  const ask = useCallback(async (question) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setLoading(true);
    const userTime = formatTime();
    setMessages(prev => [...prev, { type: 'user', text: q, time: userTime }, { type: 'thinking' }]);
    const t0 = Date.now();
    try {
      const res = await fetch(`${API_BASE}/assistant/ask`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q })
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail || `שגיאת שרת ${res.status}`);
      }
      const data = await res.json();
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1) + ' שניות';
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'thinking'),
        { type: 'ai', category: data.category, answer: data.answer, responseTime: elapsed, time: formatTime() }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev.filter(m => m.type !== 'thinking'),
        { type: 'error', msg: e.message || 'וודא שהשרת רץ בטרמינל' }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading]);

  const charLen = input.length;
  const counterColor = charLen > 450 ? '#ef4444' : charLen > 350 ? '#f59e0b' : '#c0d8e8';

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar */}
      <nav style={{ background: '#0D1B2A', borderBottom: '2px solid #00C9A7', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,201,167,0.15)', border: '1px solid rgba(0,201,167,0.3)', flexShrink: 0 }}>
            <i className="fas fa-robot" style={{ color: '#00C9A7' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>CyberPro Smart Assistant</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, lineHeight: 1.2 }}>עוזר קמפוס חכם</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setBugOpen(true)}
            style={{ color: 'white', fontSize: '0.82rem', padding: '6px 14px', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(0,201,167,0.3)', opacity: 0.9, transition: 'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor='#ef4444'; e.currentTarget.style.opacity=1; }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(0,201,167,0.3)'; e.currentTarget.style.opacity=0.9; }}>
            <i className="fas fa-bug" style={{ fontSize: '0.75rem' }} /> דווח תקלה
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', opacity: 0.7 }}>
            <div className="status-dot" /> פעיל
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div ref={containerRef} className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, background: '#f8fbff' }}>
        {/* Welcome card */}
        <div className="message-fade-in" style={{ padding: 16, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', maxWidth: '78%', marginRight: 'auto', background: 'linear-gradient(135deg,#f0faf8,#e8f4fd)', border: '1.5px solid #c8eee8', borderRight: '3px solid #00C9A7' }}>
          <p style={{ fontWeight: 600, marginBottom: 4, color: '#0D1B2A' }}>שלום! אני העוזר הדיגיטלי של קמפוס CyberPro 👋</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>שאל אותי על שעות פעילות, מיקומי כיתות, מבחנים ותקלות — ואענה מיידית.</p>
        </div>

        {messages.map((m, i) => {
          if (m.type === 'user')     return <UserMessage     key={i} text={m.text} time={m.time} />;
          if (m.type === 'thinking') return <ThinkingMessage key={i} />;
          if (m.type === 'ai')       return <AIMessage       key={i} category={m.category} answer={m.answer} responseTime={m.responseTime} time={m.time} />;
          if (m.type === 'error')    return <ErrorMessage    key={i} msg={m.msg} />;
          return null;
        })}
      </div>

      {/* Input area */}
      <div style={{ background: 'white', borderTop: '1.5px solid #e8f4fd', flexShrink: 0, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}>
        {/* Quick chips */}
        <div className="custom-scrollbar" style={{ background: '#fafcff', borderBottom: '1px solid #eaf3fb', padding: '10px 16px 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {QUICK_QUESTIONS.map(({ icon, label, q }) => (
            <button key={q} onClick={() => ask(q)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1.5px solid #d1e8f5', color: '#1565C0', fontSize: '0.78rem', padding: '6px 14px', borderRadius: 9999, cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background='#e8f8f5'; e.currentTarget.style.borderColor='#00C9A7'; e.currentTarget.style.color='#00A88A'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 3px 10px rgba(0,201,167,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; e.currentTarget.style.borderColor='#d1e8f5'; e.currentTarget.style.color='#1565C0'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
              <i className={`fas ${icon}`} style={{ color: '#00C9A7' }} /> {label}
            </button>
          ))}
        </div>

        {/* Text input row */}
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value.slice(0, 500))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ask(); } }}
              placeholder="הקלד את השאלה שלך כאן..."
              autoComplete="off"
              disabled={loading}
              style={{ width: '100%', borderRadius: 9999, padding: '12px 20px', paddingLeft: 60, fontSize: '0.875rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1.5px solid #d1e8f5', color: '#0D1B2A', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease' }}
              onFocus={e => { e.target.style.borderColor='#00C9A7'; e.target.style.boxShadow='0 0 0 3px rgba(0,201,167,0.1)'; }}
              onBlur={e => { e.target.style.borderColor='#d1e8f5'; e.target.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'; }} />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: counterColor, transition: 'color 0.2s', pointerEvents: 'none' }}>
              {charLen}/500
            </span>
          </div>
          <button onClick={() => ask()} disabled={loading || !input.trim()}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#00C9A7,#1565C0)', color: 'white', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', transition: 'all 0.2s ease', opacity: loading || !input.trim() ? 0.6 : 1 }}
            onMouseEnter={e => { if (!loading && input.trim()) { e.currentTarget.style.background='linear-gradient(135deg,#00A88A,#1976D2)'; e.currentTarget.style.transform='scale(1.05)'; } }}
            onMouseLeave={e => { e.currentTarget.style.background='linear-gradient(135deg,#00C9A7,#1565C0)'; e.currentTarget.style.transform=''; }}>
            <i className="fas fa-paper-plane" style={{ fontSize: '0.875rem', marginRight: 1 }} />
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, paddingBottom: 8, color: '#a0b8cc' }}>
          Powered by Claude AI &amp; FastAPI &nbsp;·&nbsp; התשובות מבוססות על מאגר הקמפוס — לאישור פנה למזכירות
        </p>
      </div>

      <BugModal open={bugOpen} onClose={() => setBugOpen(false)} />
    </div>
  );
}
