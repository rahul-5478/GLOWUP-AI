import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { GlowButton, ErrorMessage } from "../components/UI";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        if (!form.name) { setError("Name is required."); setLoading(false); return; }
        await register(form.name, form.email, form.password);
      }
      // Navigation handled automatically by App.jsx — user state change triggers re-render
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "#1C1C28",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 15,
    outline: "none",
    marginBottom: 12,
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 20px",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: "var(--grad1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 34, margin: "0 auto 16px",
          boxShadow: "0 8px 30px rgba(255,107,107,0.4)",
        }}>✨</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text)" }}>
          Glow<span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Up</span>
          <span style={{ background: "var(--grad2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> AI</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginTop: 6 }}>
          Your AI-powered beauty companion
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--card)",
        borderRadius: 24,
        padding: 28,
        border: "1px solid var(--border)",
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "var(--surface)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer",
              background: mode === m ? "var(--accent)" : "transparent",
              color: mode === m ? "#fff" : "var(--muted)",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
            }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              style={inputStyle}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => set("password", e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: 20 }}
          />
          <GlowButton type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "✨ Sign In" : "🚀 Create Account"}
          </GlowButton>
        </form>
      </div>

      <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 13, marginTop: 24, textAlign: "center" }}>
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setMode(mode === "login" ? "register" : "login")}
          style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>
          {mode === "login" ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
}
