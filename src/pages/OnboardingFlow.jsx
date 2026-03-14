import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../utils/api";

const GOALS = [
  { id: "weight_loss", icon: "🔥", label: "Weight Loss", desc: "Fat kam karna" },
  { id: "muscle_building", icon: "💪", label: "Muscle Build", desc: "Strong body banana" },
  { id: "weight_gain", icon: "⬆️", label: "Weight Gain", desc: "Healthy weight badhana" },
  { id: "skin_glow", icon: "✨", label: "Skin Glow", desc: "Skin improve karna" },
  { id: "style_upgrade", icon: "👗", label: "Style Up", desc: "Fashion sense badhana" },
  { id: "maintenance", icon: "⚖️", label: "Maintain", desc: "Current level maintain" },
];

const FEATURES = [
  { icon: "✨", label: "Face Analysis", desc: "AI se face shape & hairstyle", color: "#FF6B6B", bg: "rgba(255,107,107,0.12)" },
  { icon: "💪", label: "Fitness Coach", desc: "Custom workout & diet plan", color: "#4D96FF", bg: "rgba(77,150,255,0.12)" },
  { icon: "👗", label: "Fashion Advisor", desc: "Outfit ideas for any occasion", color: "#845EF7", bg: "rgba(132,94,247,0.12)" },
  { icon: "🧴", label: "Skin Analysis", desc: "Personalized skincare routine", color: "#51CF66", bg: "rgba(81,207,102,0.12)" },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";
  const totalSteps = 4;

  const handleNext = async () => {
    if (step === 1 && !gender) return;
    if (step === 2 && !goal) return;

    if (step === totalSteps - 1) {
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
      zIndex: 2000,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* Top progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / totalSteps) * 100}%`,
          background: "linear-gradient(90deg, #FF6B6B, #845EF7, #4D96FF)",
          transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          borderRadius: 2,
          boxShadow: "0 0 8px rgba(132,94,247,0.6)",
        }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "14px 0 0" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 6, borderRadius: 3,
            width: i === step ? 24 : 6,
            background: i <= step
              ? "linear-gradient(90deg, #FF6B6B, #845EF7)"
              : "rgba(255,255,255,0.1)",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <div style={{ animation: "fadeInUp 0.4s ease" }}>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(132,94,247,0.35)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}>✨</div>

              <div style={{
                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
                color: "var(--text)", lineHeight: 1.2, letterSpacing: -0.5,
                marginBottom: 10,
              }}>
                Welcome to<br />
                <span style={{
                  background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>GlowUp AI</span>
              </div>

              <div style={{
                fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--muted)", lineHeight: 1.6,
              }}>
                Tumhara personal AI beauty, fitness<br />aur fashion coach — bilkul free!
              </div>
            </div>

            {/* Features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14,
                  animation: `fadeInUp 0.3s ease ${i * 80}ms both`,
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    background: f.bg,
                    border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                    boxShadow: `0 4px 14px ${f.color}20`,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 14,
                      fontWeight: 700, color: "var(--text)", marginBottom: 2,
                    }}>{f.label}</div>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 12,
                      color: "var(--muted)",
                    }}>{f.desc}</div>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    width: 8, height: 8, borderRadius: "50%",
                    background: f.color,
                    boxShadow: `0 0 8px ${f.color}`,
                    flexShrink: 0,
                  }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Gender ── */}
        {step === 1 && (
          <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #4D96FF, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px",
                boxShadow: "0 12px 32px rgba(77,150,255,0.3)",
              }}>👤</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800,
                color: "var(--text)", marginBottom: 8,
              }}>Tum kaun ho?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                AI tumhe better recommendations dega
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "male", icon: "👨", label: "Male", color: "#4D96FF" },
                { id: "female", icon: "👩", label: "Female", color: "#FF6B9D" },
                { id: "other", icon: "🧑", label: "Other", color: "#845EF7" },
              ].map((g) => (
                <div key={g.id} onClick={() => setGender(g.id)} style={{
                  flex: 1, padding: "22px 10px", borderRadius: 20,
                  cursor: "pointer", textAlign: "center",
                  background: gender === g.id ? `${g.color}15` : "var(--card)",
                  border: `2px solid ${gender === g.id ? g.color : "var(--border)"}`,
                  transition: "all 0.2s",
                  transform: gender === g.id ? "scale(1.04)" : "scale(1)",
                  boxShadow: gender === g.id ? `0 8px 24px ${g.color}30` : "none",
                }}>
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: gender === g.id ? g.color : "var(--text)",
                  }}>{g.label}</div>
                  {gender === g.id && (
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: g.color, margin: "8px auto 0",
                      boxShadow: `0 0 8px ${g.color}`,
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Goal ── */}
        {step === 2 && (
          <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px",
                boxShadow: "0 12px 32px rgba(255,107,107,0.3)",
              }}>🎯</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800,
                color: "var(--text)", marginBottom: 8,
              }}>Tumhara main goal?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                Hum tumhari journey personalize karenge
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {GOALS.map((g, i) => (
                <div key={g.id} onClick={() => setGoal(g.id)} style={{
                  padding: "18px 14px", borderRadius: 18,
                  cursor: "pointer", textAlign: "center",
                  background: goal === g.id
                    ? "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(132,94,247,0.15))"
                    : "var(--card)",
                  border: `2px solid ${goal === g.id ? "#845EF7" : "var(--border)"}`,
                  transition: "all 0.2s",
                  transform: goal === g.id ? "scale(1.04)" : "scale(1)",
                  boxShadow: goal === g.id ? "0 8px 24px rgba(132,94,247,0.2)" : "none",
                  animation: `fadeInUp 0.3s ease ${i * 60}ms both`,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: goal === g.id ? "#845EF7" : "var(--text)", marginBottom: 4,
                  }}>{g.label}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 11,
                    color: "var(--muted)",
                  }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Ready ── */}
        {step === 3 && (
          <div style={{ animation: "fadeInUp 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #51CF66, #20C997)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(81,207,102,0.35)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}>🚀</div>

              <div style={{
                fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800,
                color: "var(--text)", marginBottom: 8,
              }}>
                Sab set hai,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #51CF66, #20C997)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>{firstName}!</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>
                Tumhara GlowUp journey shuru hone wala hai ✨
              </div>
            </div>

            {/* Summary card */}
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, padding: 20, marginBottom: 12,
            }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 12,
                color: "var(--muted)", marginBottom: 14, letterSpacing: 1,
                textTransform: "uppercase",
              }}>Your Profile</div>

              {[
                {
                  icon: gender === "male" ? "👨" : gender === "female" ? "👩" : "🧑",
                  label: "Gender",
                  value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Not specified",
                  color: "#4D96FF",
                },
                {
                  icon: GOALS.find(g => g.id === goal)?.icon || "🎯",
                  label: "Goal",
                  value: GOALS.find(g => g.id === goal)?.label || "Not set",
                  color: "#845EF7",
                },
                { icon: "🤖", label: "AI Status", value: "Ready to analyze!", color: "#51CF66" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  animation: `fadeInUp 0.3s ease ${i * 100}ms both`,
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.value}</div>
                  </div>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: item.color, boxShadow: `0 0 8px ${item.color}`,
                  }} />
                </div>
              ))}
            </div>

            {/* What's waiting */}
            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,107,0.08), rgba(132,94,247,0.08))",
              border: "1px solid rgba(132,94,247,0.2)",
              borderRadius: 16, padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#845EF7", fontWeight: 700, marginBottom: 8 }}>
                ✨ Tumhare liye tayyar hai
              </div>
              {["Face shape analysis + hairstyle suggestions", "Custom workout & Indian diet plan", "AI outfit recommendations", "Personalized skincare routine"].map((item, i) => (
                <div key={i} style={{
                  fontFamily: "var(--font-body)", fontSize: 12,
                  color: "var(--muted)", marginBottom: 4,
                  display: "flex", gap: 8,
                }}>
                  <span style={{ color: "#51CF66" }}>✓</span> {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* Bottom button */}
      <div style={{
        padding: "16px 20px 32px",
        flexShrink: 0,
        background: "linear-gradient(to top, var(--bg) 80%, transparent)",
      }}>
        <button
          onClick={handleNext}
          disabled={!canNext() || saving}
          style={{
            width: "100%", padding: "16px",
            border: "none", borderRadius: 16,
            cursor: canNext() ? "pointer" : "not-allowed",
            background: canNext()
              ? "linear-gradient(135deg, #FF6B6B, #845EF7)"
              : "var(--surface)",
            color: "#fff",
            fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700,
            boxShadow: canNext() ? "0 8px 28px rgba(132,94,247,0.4)" : "none",
            transition: "all 0.2s",
            opacity: canNext() ? 1 : 0.5,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {saving ? (
            <>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                animation: "spin 0.75s linear infinite",
              }} />
              Saving...
            </>
          ) : step === 0
            ? "Chalo Shuru Karte Hain →"
            : step === totalSteps - 1
            ? "🚀 GlowUp Shuru Karo!"
            : "Aage →"
          }
        </button>

        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            width: "100%", marginTop: 10, padding: "12px",
            border: "none", background: "transparent",
            fontFamily: "var(--font-body)", fontSize: 13,
            color: "var(--muted)", cursor: "pointer",
          }}>
            ← Wapas jao
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}