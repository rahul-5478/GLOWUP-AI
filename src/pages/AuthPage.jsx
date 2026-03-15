import { useState, useEffect, useRef } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ─── tiny helpers ─── */
const Input = ({ icon, ...props }) => (
  <div style={{ position: "relative", marginBottom: 12 }}>
    <span style={{
      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
      fontSize: 16, opacity: 0.5
    }}>{icon}</span>
    <input {...props} style={{
      width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)",
      color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
      boxSizing: "border-box", transition: "border 0.2s",
      ...(props.style || {})
    }}
      onFocus={e => e.target.style.border = "1px solid rgba(168,85,247,0.6)"}
      onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
    />
  </div>
);

const Btn = ({ children, loading, style, ...props }) => (
  <button {...props} style={{
    width: "100%", padding: "13px", borderRadius: 12, border: "none",
    background: "linear-gradient(135deg,#a855f7,#ec4899)",
    color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
    fontFamily: "inherit", opacity: loading ? 0.7 : 1,
    transition: "opacity 0.2s, transform 0.1s",
    ...(style || {})
  }}
    onMouseDown={e => e.currentTarget.style.transform = "scale(0.98)"}
    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
  >
    {loading ? "⏳ Please wait..." : children}
  </button>
);

/* ─── OTP Boxes ─── */
function OtpBoxes({ value, onChange, length = 6 }) {
  const refs = useRef([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handle = (i, e) => {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = digits.slice();
    arr[i] = v;
    onChange(arr.join(""));
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "16px 0" }}>
      {digits.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          value={d} onChange={e => handle(i, e)} onKeyDown={e => handleKey(i, e)}
          maxLength={1} inputMode="numeric"
          style={{
            width: 44, height: 52, textAlign: "center", fontSize: 22, fontWeight: 700,
            borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)", color: "#fff", outline: "none",
            fontFamily: "inherit", transition: "border 0.2s"
          }}
          onFocus={e => e.target.style.border = "1px solid #a855f7"}
          onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.2)"}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function AuthPage({ onLogin }) {
  // mode: "main" | "register" | "login-pass" | "login-email-otp" | "login-mobile"
  const [mode, setMode] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form fields
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]         = useState("");
  const [mobile, setMobile]   = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  // OTP flow
  const [otpSent, setOtpSent]           = useState(false);
  const [resendTimer, setResendTimer]   = useState(0);
  const [confirmResult, setConfirmResult] = useState(null); // Firebase confirm

  const recaptchaRef = useRef(null);

  // timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const reset = () => {
    setError(""); setSuccess(""); setOtp(""); setMobileOtp("");
    setOtpSent(false); setResendTimer(0);
  };

  /* ── Register ── */
  const handleRegister = async () => {
    if (!name || !email || !password) return setError("Sab fields fill karo.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      onLogin(d.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  /* ── Password Login ── */
  const handlePassLogin = async () => {
    if (!email || !password) return setError("Email aur password daalo.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      onLogin(d.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  /* ── Email OTP: Send ── */
  const handleSendEmailOtp = async () => {
    if (!email) return setError("Email daalo.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/auth/send-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setOtpSent(true); setResendTimer(60);
      setSuccess(`OTP bhej diya ${email} pe! 📧`);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  /* ── Email OTP: Verify ── */
  const handleVerifyEmailOtp = async () => {
    if (otp.length < 6) return setError("6-digit OTP daalo.");
    setLoading(true); setError("");
    try {
      const r = await fetch(`${API}/api/auth/login-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      onLogin(d.user);
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  /* ── Mobile OTP: Setup reCAPTCHA ── */
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  /* ── Mobile OTP: Send SMS ── */
  const handleSendMobileOtp = async () => {
    const num = mobile.trim();
    if (!num || num.length < 10) return setError("Valid mobile number daalo.");
    // Add +91 if not starts with +
    const fullNum = num.startsWith("+") ? num : `+91${num}`;
    setLoading(true); setError("");
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, fullNum, window.recaptchaVerifier);
      setConfirmResult(result);
      setOtpSent(true); setResendTimer(60);
      setSuccess(`SMS bhej diya ${fullNum} pe! 📱`);
    } catch (e) {
      setError(e.message.includes("TOO_SHORT") ? "Valid number daalo (+91XXXXXXXXXX)" : e.message);
      // reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
    setLoading(false);
  };

  /* ── Mobile OTP: Verify SMS ── */
  const handleVerifyMobileOtp = async () => {
    if (mobileOtp.length < 6) return setError("6-digit OTP daalo.");
    if (!confirmResult) return setError("Pehle OTP send karo.");
    setLoading(true); setError("");
    try {
      const result = await confirmResult.confirm(mobileOtp);
      const firebaseToken = await result.user.getIdToken();
      // Send to our backend
      const r = await fetch(`${API}/api/auth/mobile-login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken, mobile: mobile.startsWith("+") ? mobile : `+91${mobile}` })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      onLogin(d.user);
    } catch (e) {
      setError(e.message.includes("invalid-verification-code") ? "Galat OTP hai!" : e.message);
    }
    setLoading(false);
  };

  /* ══ STYLES ══ */
  const card = {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
    fontFamily: "'Inter','Segoe UI',sans-serif", padding: 20,
  };
  const box = {
    background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24,
    padding: "32px 28px", width: "100%", maxWidth: 380, color: "#fff",
  };
  const title = { fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 4,
    background: "linear-gradient(135deg,#a855f7,#ec4899)", WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent" };
  const sub = { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 24 };
  const divider = { display: "flex", alignItems: "center", gap: 10, margin: "16px 0",
    color: "rgba(255,255,255,0.3)", fontSize: 12 };
  const line = { flex: 1, height: 1, background: "rgba(255,255,255,0.1)" };
  const backBtn = { background: "none", border: "none", color: "rgba(255,255,255,0.5)",
    cursor: "pointer", fontSize: 13, marginBottom: 20, padding: 0, fontFamily: "inherit" };
  const outlineBtn = (color = "#a855f7") => ({
    width: "100%", padding: "12px", borderRadius: 12,
    border: `1px solid ${color}40`, background: `${color}10`,
    color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer",
    fontFamily: "inherit", marginBottom: 10, transition: "background 0.2s"
  });

  /* ══ SCREENS ══ */

  // Main landing
  if (mode === "main") return (
    <div style={card}>
      <div style={box}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 48 }}>✨</span>
        </div>
        <div style={title}>GlowUp AI</div>
        <div style={sub}>Your AI-powered glow journey</div>

        <Btn onClick={() => setMode("register")} style={{ marginBottom: 10 }}>
          🚀 Create Account
        </Btn>

        <div style={divider}><span style={line}/> already have account <span style={line}/></div>

        <button style={outlineBtn()} onClick={() => { reset(); setMode("login-pass"); }}>
          🔑 Login with Password
        </button>
        <button style={outlineBtn("#ec4899")} onClick={() => { reset(); setMode("login-email-otp"); }}>
          📧 Login with Email OTP
        </button>
        <button style={outlineBtn("#06b6d4")} onClick={() => { reset(); setMode("login-mobile"); }}>
          📱 Login with Mobile OTP
        </button>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );

  /* ── Register ── */
  if (mode === "register") return (
    <div style={card}>
      <div style={box}>
        <button style={backBtn} onClick={() => setMode("main")}>← Back</button>
        <div style={title}>Create Account</div>
        <div style={sub}>Join GlowUp AI today ✨</div>

        {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171" }}>❌ {error}</div>}

        <Input icon="👤" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <Input icon="📧" placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input icon="🔒" placeholder="Password (min 6 chars)" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <Btn loading={loading} onClick={handleRegister} style={{ marginTop: 8 }}>Create Account 🚀</Btn>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          Already have account?{" "}
          <span style={{ color: "#a855f7", cursor: "pointer" }} onClick={() => { reset(); setMode("login-pass"); }}>Login</span>
        </div>
      </div>
    </div>
  );

  /* ── Password Login ── */
  if (mode === "login-pass") return (
    <div style={card}>
      <div style={box}>
        <button style={backBtn} onClick={() => setMode("main")}>← Back</button>
        <div style={title}>Welcome Back</div>
        <div style={sub}>Login with password 🔑</div>

        {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171" }}>❌ {error}</div>}

        <Input icon="📧" placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input icon="🔒" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <Btn loading={loading} onClick={handlePassLogin} style={{ marginTop: 8 }}>Login 🔑</Btn>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          No account?{" "}
          <span style={{ color: "#a855f7", cursor: "pointer" }} onClick={() => { reset(); setMode("register"); }}>Register</span>
        </div>
      </div>
    </div>
  );

  /* ── Email OTP Login ── */
  if (mode === "login-email-otp") return (
    <div style={card}>
      <div style={box}>
        <button style={backBtn} onClick={() => { reset(); setMode("main"); }}>← Back</button>
        <div style={title}>Email OTP</div>
        <div style={sub}>We'll send a code to your email 📧</div>

        {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171" }}>❌ {error}</div>}
        {success && <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#4ade80" }}>✅ {success}</div>}

        <Input icon="📧" placeholder="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} disabled={otpSent} />

        {!otpSent ? (
          <Btn loading={loading} onClick={handleSendEmailOtp}>Send OTP 📤</Btn>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
              6-digit code daalo 👇
            </div>
            <OtpBoxes value={otp} onChange={setOtp} />
            <Btn loading={loading} onClick={handleVerifyEmailOtp}>Verify & Login ✅</Btn>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
              {resendTimer > 0
                ? <span style={{ color: "rgba(255,255,255,0.4)" }}>Resend in {resendTimer}s</span>
                : <span style={{ color: "#a855f7", cursor: "pointer" }} onClick={() => { setOtp(""); handleSendEmailOtp(); }}>Resend OTP 🔄</span>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ── Mobile OTP Login ── */
  if (mode === "login-mobile") return (
    <div style={card}>
      <div style={box}>
        <button style={backBtn} onClick={() => { reset(); setMode("main"); }}>← Back</button>
        <div style={title}>Mobile OTP</div>
        <div style={sub}>SMS se login karo 📱 (Free)</div>

        {error && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#f87171" }}>❌ {error}</div>}
        {success && <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#4ade80" }}>✅ {success}</div>}

        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>📱</span>
          <span style={{ position: "absolute", left: 40, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>+91</span>
          <input
            placeholder="Mobile Number"
            type="tel"
            value={mobile}
            onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            disabled={otpSent}
            inputMode="numeric"
            style={{
              width: "100%", padding: "12px 14px 12px 72px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)",
              color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {!otpSent ? (
          <Btn loading={loading} onClick={handleSendMobileOtp}>Send SMS OTP 📤</Btn>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
              6-digit SMS code daalo 👇
            </div>
            <OtpBoxes value={mobileOtp} onChange={setMobileOtp} />
            <Btn loading={loading} onClick={handleVerifyMobileOtp}>Verify & Login ✅</Btn>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
              {resendTimer > 0
                ? <span style={{ color: "rgba(255,255,255,0.4)" }}>Resend in {resendTimer}s</span>
                : <span style={{ color: "#06b6d4", cursor: "pointer" }} onClick={() => { setMobileOtp(""); setOtpSent(false); setConfirmResult(null); if (window.recaptchaVerifier) { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; } }}>Change Number 🔄</span>
              }
            </div>
          </>
        )}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );

  return null;
}