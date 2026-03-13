import { useState, useRef, useEffect } from "react";
import { GlowButton, Card } from "../components/UI";
import axios from "axios";

const SUGGESTIONS = [
  "What should I wear to a job interview?",
  "Best hairstyle for round face?",
  "How to build a capsule wardrobe?",
  "Skincare routine for oily skin?",
  "Best colors for dark skin tone?",
];

export default function AIStyleChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your personal AI Style Coach! 💅 Ask me anything about fashion, skincare, fitness, or beauty!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/message`,
        { message: msg },
        { headers: { Authorization: `Bearer ${localStorage.getItem("glowup_token")}` } }
      );
      setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again! 💔" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 0 0", display: "flex", flexDirection: "column", height: "calc(100vh - 130px)" }}>
      {/* Header */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💅</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>AI Style Coach</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent3)" }}>● Online</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            {msg.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>💅</div>
            )}
            <div style={{ maxWidth: "75%", padding: "12px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.role === "user" ? "var(--grad1)" : "var(--card)", border: msg.role === "user" ? "none" : "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 14, color: msg.role === "user" ? "#fff" : "var(--text)", lineHeight: 1.5 }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💅</div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "18px 18px 18px 4px", padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div style={{ padding: "8px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {SUGGESTIONS.map((s, i) => (
            <div key={i} onClick={() => sendMessage(s)} style={{ flexShrink: 0, padding: "8px 12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", cursor: "pointer", whiteSpace: "nowrap" }}>
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", display: "flex", gap: 10, borderTop: "1px solid var(--border)" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask your style coach..."
          style={{ flex: 1, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 24, padding: "12px 16px", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{ width: 46, height: 46, borderRadius: "50%", background: input.trim() ? "var(--grad1)" : "var(--surface)", border: "none", cursor: input.trim() ? "pointer" : "default", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
          🚀
        </button>
      </div>
    </div>
  );
}