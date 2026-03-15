import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://glowup-ai-backend-1.onrender.com/api";

const S = {
  page: { minHeight: "100vh", background: "#0A0A0F", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px" },
  card: { background: "#1C1C28", borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 400, border: "1px solid #2A2A3A" },
  input: { width: "100%", background: "#13131A", border: "1px solid #2A2A3A", borderRadius: 14, padding: "14px 16px", color: "#F0F0FF", fontSize: 15, outline: "none", marginBottom: 12, boxSizing: "border-box", fontFamily: "inherit" },
  btnPrimary: { width: "100%", padding: "14px", border: "none", borderRadius: 14, background: "linear-gradient(135deg,#FF6B6B,#FF8E53)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 10, fontFamily: "inherit", boxShadow: "0 6px 20px rgba(255,107,107,0.3)" },
  btnOtp: { width: "100%", padding: "13px", border: "1.5px solid rgba(77,150,255,0.4)", borderRadius: 14, background: "rgba(77,150,255,0.08)", color: "#4D96FF", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10, fontFamily: "inherit" },
  btnGhost: { width: "100%", padding: "13px", border: "1.5px solid #2A2A3A", borderRadius: 14, background: "transparent", color: "#8888AA", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 10, fontFamily: "inherit" },
  error: { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13, marginBottom: 14 },
  success: { background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "10px 14px", color: "#4ade80", fontSize: 13, marginBottom: 14 },
  back: { color: "#555577", fontSize: 13, cursor: "pointer", textAlign: "center", marginTop: 8 },
  title: { fontSize: 22, fontWeight: 700, color: "#F0F0FF", fontFamily: "'Playfair Display', serif", marginBottom: 6 },
  sub: { fontSize: 13, color: "#8888AA", marginBottom: 24, lineHeight: 1.5 },
  divider: { display: "flex", alignItems: "center", gap: 12, margin: "14px 0" },
  line: { flex: 1, height: 1, background: "#2A2A3A" },
  divText: { color: "#555577", fontSize: 12 },
};

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("home");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reset = (m) => { setError(""); setMsg(""); setMode(m); };

  // ── Register ───────────────────────────────────────────────
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return setError("All fields required.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try { await register(form.name, form.email, form.password); }
    catch (e) { setError(e.response?.data?.error || "Registration failed."); }
    setLoading(false);
  };

  // ── Password Login ─────────────────────────────────────────
  const handleLogin = async () => {
    if (!form.email || !form.password) return setError("Email and password required.");
    setLoading(true); setError("");
    try { await login(form.email, form.password); }
    catch (e) { setError(e.response?.data?.error || "Login failed."); }
    setLoading(false);
  };

  // ── Send OTP ───────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!form.email) return setError("Enter your email first.");
    setLoading(true); setError(""); setMsg("");
    try {
      await axios.post(`${API}/auth/send-otp`, { email: form.email });
      setOtpEmail(form.email);
      setOtp(["", "", "", "", "", ""]);
      setMsg(`OTP sent to ${form.email}`);
      setMode("otp-input");
    } catch (e) { setError(e.response?.data?.error || "Failed to send OTP."); }
    setLoading(false);
  };

  // ── Verify + Login ─────────────────────────────────────────
  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length !== 6) return setError("Enter complete 6-digit OTP.");
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/auth/verify-otp`, { email: otpEmail, otp: code });
      const res = await axios.post(`${API}/auth/login-otp`, { email: otpEmail });
      localStorage.setItem("glowup_token", res.data.token);
      localStorage.setItem("glowup_user", JSON.stringify(res.data.user));
      window.location.reload();
    } catch (e) { setError(e.response?.data?.error || "Verification failed."); }
    setLoading(false);
  };

  // ── OTP input ──────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const handleOtpKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
  };

  const Logo = () => (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ display: "inline-block", background: "linear-gradient(135deg,#FF6B6B,#FF8E53)", borderRadius: 14, padding: "12px 20px" }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Playfair Display', serif" }}>GlowUp AI</span>
      </div>
    </div>
  );

  // ── HOME ───────────────────────────────────────────────────
  if (mode === "home") return (
    <div style={S.page}><div style={S.card}>
      <Logo />
      <div style={S.title}>Welcome 👋</div>
      <div style={S.sub}>Sign in to get personalized AI recommendations for your face, fitness & fashion.</div>
      {error && <div style={S.error}>⚠️ {error}</div>}
      <button style={S.btnPrimary} onClick={() => reset("login-pass")}>🔑 Login with Password</button>
      <button style={S.btnOtp}     onClick={() => reset("login-otp")}>📧 Login with Email OTP</button>
      <div style={S.divider}><div style={S.line}/><span style={S.divText}>New here?</span><div style={S.line}/></div>
      <button style={S.btnGhost}   onClick={() => reset("register")}>✨ Create Account</button>
    </div></div>
  );

  // ── REGISTER ───────────────────────────────────────────────
  if (mode === "register") return (
    <div style={S.page}><div style={S.card}>
      <div style={S.title}>Create Account ✨</div>
      <div style={S.sub}>Join GlowUp AI — it's free</div>
      {error && <div style={S.error}>⚠️ {error}</div>}
      <input style={S.input} placeholder="Your Name"               value={form.name}     onChange={e => set("name", e.target.value)} />
      <input style={S.input} placeholder="Email Address" type="email"   value={form.email}    onChange={e => set("email", e.target.value)} />
      <input style={S.input} placeholder="Password (min 6)" type="password" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleRegister()} />
      <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleRegister} disabled={loading}>
        {loading ? "Creating..." : "Create Account →"}
      </button>
      <div style={S.back} onClick={() => reset("home")}>← Back</div>
    </div></div>
  );

  // ── LOGIN WITH PASSWORD ────────────────────────────────────
  if (mode === "login-pass") return (
    <div style={S.page}><div style={S.card}>
      <div style={S.title}>Welcome Back 👋</div>
      <div style={S.sub}>Login with your password</div>
      {error && <div style={S.error}>⚠️ {error}</div>}
      <input style={S.input} placeholder="Email Address" type="email"    value={form.email}    onChange={e => set("email", e.target.value)} />
      <input style={S.input} placeholder="Password"      type="password" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
      <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login →"}
      </button>
      <button style={S.btnOtp} onClick={() => reset("login-otp")}>📧 Use OTP instead</button>
      <div style={S.back} onClick={() => reset("home")}>← Back</div>
    </div></div>
  );

  // ── LOGIN WITH OTP - enter email ───────────────────────────
  if (mode === "login-otp") return (
    <div style={S.page}><div style={S.card}>
      <div style={S.title}>Login with OTP 📧</div>
      <div style={S.sub}>We'll send a 6-digit code to your email. No password needed.</div>
      {error && <div style={S.error}>⚠️ {error}</div>}
      <input style={S.input} placeholder="Enter your email" type="email" value={form.email}
        onChange={e => set("email", e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendOTP()} />
      <button style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleSendOTP} disabled={loading}>
        {loading ? "Sending..." : "📨 Send OTP"}
      </button>
      <div style={S.back} onClick={() => reset("home")}>← Back</div>
    </div></div>
  );

  // ── OTP INPUT ──────────────────────────────────────────────
  if (mode === "otp-input") return (
    <div style={S.page}><div style={S.card}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>📬</div>
        <div style={S.title}>Check Your Email</div>
        <div style={S.sub}>
          6-digit code sent to<br />
          <strong style={{ color: "#4D96FF" }}>{otpEmail}</strong>
        </div>
      </div>

      {error && <div style={S.error}>⚠️ {error}</div>}
      {msg   && <div style={S.success}>✅ {msg}</div>}

      {/* OTP boxes */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
        {otp.map((d, i) => (
          <input
            key={i} id={`otp-${i}`}
            type="tel" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => handleOtpKey(i, e)}
            style={{
              width: 46, height: 54, textAlign: "center",
              background: d ? "rgba(77,150,255,0.12)" : "#13131A",
              border: `1.5px solid ${d ? "#4D96FF" : "#2A2A3A"}`,
              borderRadius: 12, color: "#F0F0FF", fontSize: 22,
              fontWeight: 700, outline: "none",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "#555577", marginBottom: 18 }}>
        ⏱️ Expires in 10 minutes
      </div>

      <button
        style={{ ...S.btnPrimary, opacity: (loading || otp.join("").length !== 6) ? 0.6 : 1 }}
        onClick={handleVerifyOTP} disabled={loading || otp.join("").length !== 6}
      >
        {loading ? "Verifying..." : "✅ Verify & Login"}
      </button>

      <button style={{ ...S.btnOtp, opacity: loading ? 0.6 : 1 }} onClick={handleSendOTP} disabled={loading}>
        🔄 Resend OTP
      </button>

      <div style={S.back} onClick={() => reset("home")}>← Back</div>
    </div></div>
  );

  return null;
}