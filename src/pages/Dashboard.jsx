import { useAuth } from "../hooks/useAuth";

export default function Dashboard({ setTab }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const features = [
    { icon: "✨", label: "Face Analysis", sub: "Hairstyle & skin recommendations", tab: 1, gradient: "var(--grad1)" },
    { icon: "💪", label: "Fitness Coach", sub: "Calorie & personalized workout plan", tab: 2, gradient: "var(--grad3)" },
    { icon: "👗", label: "Fashion Advisor", sub: "Style guide for any occasion", tab: 3, gradient: "var(--grad2)" },
  ];

  const stats = [
    { icon: "🧠", label: "AI-Powered", sub: "Claude Vision AI" },
    { icon: "⚡", label: "Instant", sub: "Real-time analysis" },
    { icon: "🔒", label: "Secure", sub: "Data encrypted" },
    { icon: "🎯", label: "Personalized", sub: "100% for you" },
  ];

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1C1C28 0%, #23233A 50%, #1C2835 100%)",
        borderRadius: 24, padding: 24, marginBottom: 20,
        border: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 140, height: 140, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,107,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
          Welcome back, {firstName} 👋
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "var(--text)", lineHeight: 1.1, marginBottom: 8 }}>
          Your{" "}
          <span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Glow</span>
          <span style={{ background: "var(--grad2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Up</span>
          {" "}Journey
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
          AI-powered beauty, fitness & fashion. Look and feel your absolute best. ✨
        </p>
      </div>

      {/* Features */}
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
        AI Features
      </div>
      {features.map((f, i) => (
        <div
          key={i}
          onClick={() => setTab(f.tab)}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20, padding: 20,
            marginBottom: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 16,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: f.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, flexShrink: 0,
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}>{f.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", fontWeight: 700 }}>{f.label}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{f.sub}</div>
          </div>
          <div style={{ color: "var(--muted)", fontSize: 20 }}>›</div>
        </div>
      ))}

      {/* Why GlowUp */}
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 8 }}>
        Why GlowUp AI
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16 }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
