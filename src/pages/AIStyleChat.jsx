import { useState, useRef, useEffect } from "react";
import axios from "axios";

const SUGGESTIONS = [
  { text: "Best hairstyle for round face?", emoji: "💇" },
  { text: "Skincare for oily skin?", emoji: "🧴" },
  { text: "Outfit for job interview?", emoji: "👔" },
  { text: "Capsule wardrobe tips?", emoji: "👗" },
  { text: "Best colors for dark skin?", emoji: "🎨" },
];

const API = process.env.REACT_APP_API_URL || "https://glowup-ai-backend-1.onrender.com/api";

export default function AIStyleChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I'm your personal AI Style Coach ✨\nAsk me anything about fashion, skincare, fitness, or beauty — I've got you!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await axios.post(
        `${API}/chat/message`,
        { message: msg },
        { headers: { Authorization: `Bearer ${localStorage.getItem("glowup_token")}` } }
      );
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "assistant", text: "Oops, kuch ho gaya 😅 Please try again!" }]);
    }
    setLoading(false);
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ padding: "0 16px 14px", flexShrink: 0 }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(255,77,109,0.08), rgba(199,125,255,0.06))",
          border: "1px solid rgba(199,125,255,0.15)",
          borderRadius: 20, padding: "14px 16px",
          display: "flex", alignItems: "center", gap: 12,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -10, right: -10, width: 70, height: 70, background: "radial-gradient(circle, rgba(199,125,255,0.1), transparent 70%)" }} />
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, #FF4D6D, #C77DFF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 6px 20px rgba(255,77,109,0.3)",
            flexShrink: 0,
          }}>💅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text)" }}>AI Style Coach</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#51CF66", boxShadow: "0 0 6px #51CF66" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#51CF66", fontWeight: 600 }}>Online · Powered by Gemini</span>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "5px 10px", fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)" }}>
            {messages.length - 1} msgs
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>

        {/* Suggestions — shown early */}
        {messages.length <= 2 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 8, textAlign: "center", letterSpacing: 0.5 }}>
              💡 Try asking...
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SUGGESTIONS.map((s, i) => (
                <div key={i} onClick={() => sendMessage(s.text)} style={{
                  padding: "10px 14px", borderRadius: 14, cursor: "pointer",
                  background: "var(--card)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s",
                  animation: `fadeSlideUp 0.4s ease ${i * 0.07}s both`,
                }}>
                  <span style={{ fontSize: 16 }}>{s.emoji}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{s.text}</span>
                  <span style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 14 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
            gap: 8,
            animation: "fadeSlideUp 0.25s ease both",
          }}>
            {/* Avatar for assistant */}
            {msg.role === "assistant" && (
              <div style={{
                width: 34, height: 34, borderRadius: 11,
                background: "linear-gradient(135deg, #FF4D6D, #C77DFF)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0, alignSelf: "flex-end",
                boxShadow: "0 3px 10px rgba(255,77,109,0.25)",
              }}>💅</div>
            )}

            <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 3, alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, #FF4D6D, #C77DFF)"
                  : "var(--card)",
                border: msg.role === "user" ? "none" : "1px solid var(--border)",
                fontFamily: "var(--font-body)", fontSize: 14,
                color: msg.role === "user" ? "#fff" : "var(--text)",
                lineHeight: 1.55,
                boxShadow: msg.role === "user" ? "0 4px 14px rgba(255,77,109,0.25)" : "none",
              }}>
                {msg.text}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "var(--muted)", padding: "0 4px" }}>
                {formatTime()}
              </div>
            </div>

            {/* Avatar for user */}
            {msg.role === "user" && (
              <div style={{
                width: 34, height: 34, borderRadius: 11,
                background: "linear-gradient(135deg, #4361EE, #7B2FBE)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0, alignSelf: "flex-end",
              }}>👤</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg, #FF4D6D, #C77DFF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>💅</div>
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: "18px 18px 18px 5px", padding: "12px 16px",
            }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "linear-gradient(135deg, #FF4D6D, #C77DFF)",
                    animation: `typingDot 1.2s ease ${i * 0.25}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 16px 8px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-end",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 22, padding: "6px 6px 6px 16px",
          transition: "border-color 0.2s",
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask your style coach..."
            style={{
              flex: 1, background: "transparent", border: "none",
              color: "var(--text)", fontFamily: "var(--font-body)",
              fontSize: 14, outline: "none", padding: "8px 0",
              resize: "none",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 42, height: 42, borderRadius: 16,
              background: input.trim() ? "linear-gradient(135deg, #FF4D6D, #C77DFF)" : "var(--surface)",
              border: "none", cursor: input.trim() ? "pointer" : "default",
              fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s", flexShrink: 0,
              boxShadow: input.trim() ? "0 4px 14px rgba(255,77,109,0.3)" : "none",
            }}
          >
            🚀
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 6, fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)" }}>
          Powered by Gemini AI ✨
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes typingDot { 0%,60%,100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-6px); opacity: 1; } }
      `}</style>
    </div>
  );
}