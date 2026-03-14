import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../utils/api";

const STEPS = [
  {
    id: "welcome",
    emoji: "✨",
    gradient: "var(--grad1)",
    title: "GlowUp AI mein\nSwagat hai!",
    subtitle: "Tumhara personal AI beauty, fitness aur fashion coach — bilkul free!",
    features: [
      { icon: "✨", text: "Face shape & hairstyle analysis" },
      { icon: "💪", text: "Personalized fitness & diet plan" },
      { icon: "👗", text: "Fashion advice for any occasion" },
      { icon: "🧴", text: "Custom skincare routine" },
    ],
  },
  {
    id: "gender",
    emoji: "👤",
    gradient: "var(--grad2)",
    title: "Tum kaun ho?",
    subtitle: "Isse AI tumhe better recommendations dega",
  },
  {
    id: "goal",
    emoji: "🎯",
    gradient: "var(--grad3)",
    title: "Tumhara main goal?",
    subtitle: "Hum tumhari journey personalize karenge",
  },
  {
    id: "ready",
    emoji: "🚀",
    gradient: "var(--grad4)",
    title: "Sab set hai!",
    subtitle: "Tumhara GlowUp journey shuru hone wala hai",
  },
];

const GOALS = [
  { id: "weight_loss", icon: "🔥", label: "Weight Loss", desc: "Fat kam karna" },
  { id: "muscle_building", icon: "💪", label: "Muscle Build", desc: "Strong body banana" },
  { id: "weight_gain", icon: "⬆️", label: "Weight Gain", desc: "Healthy weight badhana" },
  { id: "skin_glow", icon: "✨", label: "Skin Glow", desc: "Skin improve karna" },
  { id: "style_upgrade", icon: "👗", label: "Style Up", desc: "Fashion sense badhana" },
  { id: "maintenance", icon: "⚖️", label: "Maintain", desc: "Current level maintain" },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (step === 1 && !gender) return;
    if (step === 2 && !goal) return;

    if (isLast) {
      setSaving(true);
      try {
        await userAPI.updateProfile({ gender, goal });
      } catch (e) {
        // continue anyway
      }
      setSaving(false);
      localStorage.setItem("glowup_onboarded", "true");
      onComplete();
      return;
    }
    setStep((s) => s + 1);
  };

  const canNext = () => {
    if (step === 1) return !!gender;
    if (step === 2) return !!goal;
    return true;
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--bg)",
      display: "flex", flexDirection: "column",
      zIndex: 2000, overflow: "hidden",
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border)", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / STEPS.length) * 100}%`,
          background: current.gradient,
          transition: "width 0.4s ease",
          borderRadius: 2,
        }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 40px" }}>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "16px 0" }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i === step ? current.gradient.split(",")[0].replace("linear-gradient(135deg,", "").trim() : "var(--border2)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Emoji icon */}
        <div style={{ textAlign: "center", marginTop: 8, marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24, margin: "0 auto",
            background: current.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
            boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
            animation: "glowPulse 2s ease-in-out infinite",
          }}>
            {current.emoji}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800,
            color: "var(--text)", lineHeight: 1.2, letterSpacing: -0.5,
            whiteSpace: "pre-line", marginBottom: 8,
          }}>
            {current.title}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            {current.subtitle}
          </div>
        </div>

        {/* Step 0 — Welcome features */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {current.features.map((f, i) => (
              <div key={i} style={{
                background: "var(--card)", border: "1px solid var(--border2)",
                borderRadius: 16, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 14,
                animation: `fadeInUp 0.3s ease ${i * 80}ms both`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: current.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18,
                }}>
                  {f.icon}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
                  {f.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Gender */}
        {step === 1 && (
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { id: "male", icon: "👨", label: "Male" },
              { id: "female", icon: "👩", label: "Female" },
              { id: "other", icon: "🧑", label: "Other" },
            ].map((g) => (
              <div
                key={g.id}
                onClick={() => setGender(g.id)}
                style={{
                  flex: 1, padding: "20px 10px", borderRadius: 20,
                  cursor: "pointer", textAlign: "center",
                  background: gender === g.id ? "var(--accent-glow)" : "var(--card)",
                  border: `2px solid ${gender === g.id ? "var(--accent)" : "var(--border)"}`,
                  transition: "all 0.2s",
                  transform: gender === g.id ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{g.icon}</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                  color: gender === g.id ? "var(--accent)" : "var(--text)",
                }}>
                  {g.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2 — Goal */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {GOALS.map((g) => (
              <div
                key={g.id}
                onClick={() => setGoal(g.id)}
                style={{
                  padding: "16px 14px", borderRadius: 18,
                  cursor: "pointer", textAlign: "center",
                  background: goal === g.id ? "var(--accent-glow)" : "var(--card)",
                  border: `2px solid ${goal === g.id ? "var(--accent)" : "var(--border)"}`,
                  transition: "all 0.2s",
                  transform: goal === g.id ? "scale(1.03)" : "scale(1)",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>{g.icon}</div>
                <div style={{
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                  color: goal === g.id ? "var(--accent)" : "var(--text)",
                }}>
                  {g.label}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  {g.desc}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3 — Ready */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "✅", text: `Gender set: ${gender || "Not specified"}` },
              { icon: "🎯", text: `Goal: ${GOALS.find((g) => g.id === goal)?.label || "Not set"}` },
              { icon: "🤖", text: "AI ready to analyze your face & fitness" },
              { icon: "🎉", text: "Welcome to the GlowUp family!" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "var(--card)", border: "1px solid var(--border2)",
                borderRadius: 14, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
                animation: `fadeInUp 0.3s ease ${i * 80}ms both`,
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text2)" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div style={{ padding: "12px 20px 28px", flexShrink: 0, background: "var(--bg)" }}>
        <button
          onClick={handleNext}
          disabled={!canNext() || saving}
          className="btn-primary"
          style={{
            opacity: canNext() ? 1 : 0.4,
            background: current.gradient,
            boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
          }}
        >
          {saving ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{
                width: 16, height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 0.75s linear infinite",
              }} />
              Saving...
            </span>
          ) : isLast ? "🚀 GlowUp Shuru Karo!" : step === 0 ? "Chalo Shuru Karte Hain →" : "Aage →"}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              width: "100%", marginTop: 10, padding: "12px",
              border: "none", background: "transparent",
              fontFamily: "var(--font-body)", fontSize: 13,
              color: "var(--muted)", cursor: "pointer",
            }}
          >
            ← Wapas jao
          </button>
        )}
      </div>
    </div>
  );
}