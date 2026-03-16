import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { userAPI } from "../utils/api";

const GOALS = [
  { id: "weight_loss", icon: "🔥", label: "Weight Loss", desc: "Lose body fat" },
  { id: "muscle_building", icon: "💪", label: "Muscle Build", desc: "Build strong body" },
  { id: "weight_gain", icon: "⬆️", label: "Weight Gain", desc: "Healthy weight gain" },
  { id: "skin_glow", icon: "✨", label: "Skin Glow", desc: "Improve skin health" },
  { id: "style_upgrade", icon: "👗", label: "Style Up", desc: "Upgrade fashion sense" },
  { id: "maintenance", icon: "⚖️", label: "Maintain", desc: "Maintain current level" },
];

const SKIN_TYPES = [
  { id: "oily", icon: "💧", label: "Oily", desc: "Shiny, prone to acne" },
  { id: "dry", icon: "🏜️", label: "Dry", desc: "Tight, flaky skin" },
  { id: "normal", icon: "✅", label: "Normal", desc: "Balanced skin" },
  { id: "combination", icon: "☯️", label: "Combination", desc: "Oily T-zone, dry cheeks" },
  { id: "sensitive", icon: "🌸", label: "Sensitive", desc: "Easily irritated" },
];

const FEATURES = [
  { icon: "✨", label: "Face Analysis", desc: "AI face shape & hairstyle recommendations", color: "#FF6B6B", bg: "rgba(255,107,107,0.12)" },
  { icon: "💪", label: "Fitness Coach", desc: "Custom workout & diet plan", color: "#4D96FF", bg: "rgba(77,150,255,0.12)" },
  { icon: "👗", label: "Fashion Advisor", desc: "Outfit ideas for any occasion", color: "#845EF7", bg: "rgba(132,94,247,0.12)" },
  { icon: "🧴", label: "Skin Analysis", desc: "Personalized skincare routine", color: "#51CF66", bg: "rgba(81,207,102,0.12)" },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [skinType, setSkinType] = useState("");
  const [goal, setGoal] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ refreshUser bhi lo
  const { user, refreshUser } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const totalSteps = 7;

  const canNext = () => {
    if (step === 1) return !!gender;
    if (step === 2) return !!age && parseInt(age) > 0 && parseInt(age) < 120;
    if (step === 3) return !!height && !!weight;
    if (step === 4) return !!skinType;
    if (step === 5) return !!goal;
    return true;
  };

  const handleNext = async () => {
    if (!canNext()) return;

    // Last step — save karo
    if (step === totalSteps - 1) {
      setSaving(true);
      setError("");
      try {
        // ✅ Profile MongoDB mein save karo
        await userAPI.updateProfile({
          profile: {
            gender,
            age: parseInt(age),
            height: parseFloat(height),
            weight: parseFloat(weight),
            skinType,
            goal,
          }
        });

        // ✅ user state refresh karo — profile.gender available ho jaayega
        await refreshUser();

        // ✅ localStorage backup
        localStorage.setItem("glowup_onboarded", "true");
        localStorage.setItem("glowup_user_gender", gender);

        onComplete();
      } catch (e) {
        console.error("Profile save error:", e);
        setError("Profile save nahi hua. Dobara try karo.");
      }
      setSaving(false);
      return;
    }

    setStep(s => s + 1);
  };

  const inputStyle = {
    width: "100%",
    background: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: 14,
    padding: "14px 16px",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    textAlign: "center",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "var(--bg)",
      zIndex: 2000, display: "flex", flexDirection: "column", overflow: "hidden"
    }}>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / totalSteps) * 100}%`,
          background: "linear-gradient(90deg, #FF6B6B, #845EF7, #4D96FF)",
          transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          borderRadius: 2
        }} />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "12px 0 0" }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 3,
            width: i === step ? 20 : 5,
            background: i <= step
              ? "linear-gradient(90deg, #FF6B6B, #845EF7)"
              : "rgba(255,255,255,0.1)",
            transition: "all 0.3s ease"
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(132,94,247,0.35)"
              }}>✨</div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800,
                color: "var(--text)", lineHeight: 1.2, marginBottom: 10
              }}>
                Welcome to{" "}
                <span style={{
                  background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>GlowUp AI</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                Pehle 2 minute mein apna profile setup karo<br />aur 100% personalized results pao!
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 18, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 14
                }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                    background: f.bg, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{f.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{f.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Gender ── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #4D96FF, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>👤</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Aap kaun hain?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                Hairstyle aur fashion recommendations ke liye zaroori hai
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "male", icon: "👨", label: "Male", color: "#4D96FF" },
                { id: "female", icon: "👩", label: "Female", color: "#FF6B9D" },
                { id: "other", icon: "🧑", label: "Other", color: "#845EF7" },
              ].map(g => (
                <div key={g.id} onClick={() => setGender(g.id)}
                  style={{
                    flex: 1, padding: "22px 10px", borderRadius: 20,
                    cursor: "pointer", textAlign: "center",
                    background: gender === g.id ? `${g.color}15` : "var(--card)",
                    border: `2px solid ${gender === g.id ? g.color : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: gender === g.id ? "scale(1.04)" : "scale(1)"
                  }}>
                  <div style={{ fontSize: 38, marginBottom: 10 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: gender === g.id ? g.color : "var(--text)"
                  }}>{g.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Age ── */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FFD93D, #FF6B6B)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🎂</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Aapki umar kya hai?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>Age-appropriate recommendations ke liye</div>
            </div>
            <input
              type="number" placeholder="25" value={age}
              onChange={e => setAge(e.target.value)}
              style={{ ...inputStyle, fontSize: 32, fontWeight: 800, padding: "20px" }}
            />
            <div style={{ textAlign: "center", marginTop: 8, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
              years old
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[18, 20, 22, 25, 28, 30, 35].map(a => (
                <div key={a} onClick={() => setAge(String(a))}
                  style={{
                    padding: "8px 16px", borderRadius: 20, cursor: "pointer",
                    background: age === String(a) ? "rgba(255,107,107,0.15)" : "var(--card)",
                    border: `1.5px solid ${age === String(a) ? "#FF6B6B" : "var(--border)"}`,
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: age === String(a) ? "#FF6B6B" : "var(--muted)"
                  }}>{a}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Height & Weight ── */}
        {step === 3 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #51CF66, #20C997)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>📏</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Height & Weight</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>BMI aur fitness plan ke liye zaroori</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>
                Height (cm)
              </div>
              <input type="number" placeholder="170" value={height}
                onChange={e => setHeight(e.target.value)}
                style={{ ...inputStyle, fontSize: 28, fontWeight: 800 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[155, 160, 165, 170, 175, 180, 185].map(h => (
                  <div key={h} onClick={() => setHeight(String(h))}
                    style={{
                      padding: "6px 10px", borderRadius: 12, cursor: "pointer",
                      background: height === String(h) ? "rgba(81,207,102,0.15)" : "var(--card)",
                      border: `1.5px solid ${height === String(h) ? "#51CF66" : "var(--border)"}`,
                      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                      color: height === String(h) ? "#51CF66" : "var(--muted)"
                    }}>{h}</div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 8, textAlign: "center", textTransform: "uppercase", letterSpacing: 1 }}>
                Weight (kg)
              </div>
              <input type="number" placeholder="70" value={weight}
                onChange={e => setWeight(e.target.value)}
                style={{ ...inputStyle, fontSize: 28, fontWeight: 800 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[50, 55, 60, 65, 70, 75, 80].map(w => (
                  <div key={w} onClick={() => setWeight(String(w))}
                    style={{
                      padding: "6px 10px", borderRadius: 12, cursor: "pointer",
                      background: weight === String(w) ? "rgba(81,207,102,0.15)" : "var(--card)",
                      border: `1.5px solid ${weight === String(w) ? "#51CF66" : "var(--border)"}`,
                      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
                      color: weight === String(w) ? "#51CF66" : "var(--muted)"
                    }}>{w}</div>
                ))}
              </div>
            </div>

            {height && weight && (
              <div style={{
                marginTop: 16, padding: "12px 16px",
                background: "rgba(77,150,255,0.08)", borderRadius: 14,
                border: "1px solid rgba(77,150,255,0.2)", textAlign: "center"
              }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>Your BMI</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 800, color: "#4D96FF" }}>
                  {(parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(1)}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
                  {(() => {
                    const bmi = parseFloat(weight) / ((parseFloat(height) / 100) ** 2);
                    if (bmi < 18.5) return "Underweight";
                    if (bmi < 25) return "Normal ✅";
                    if (bmi < 30) return "Overweight";
                    return "Obese";
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Skin Type ── */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FF6B9D, #845EF7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🧴</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Skin type kya hai?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>Skincare recommendations personalize hongi</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SKIN_TYPES.map(s => (
                <div key={s.id} onClick={() => setSkinType(s.id)}
                  style={{
                    padding: "16px 18px", borderRadius: 16, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    background: skinType === s.id
                      ? "linear-gradient(135deg, rgba(255,107,157,0.1), rgba(132,94,247,0.1))"
                      : "var(--card)",
                    border: `2px solid ${skinType === s.id ? "#845EF7" : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: skinType === s.id ? "scale(1.02)" : "scale(1)"
                  }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                    background: skinType === s.id ? "rgba(132,94,247,0.15)" : "var(--surface)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700,
                      color: skinType === s.id ? "#845EF7" : "var(--text)"
                    }}>{s.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  {skinType === s.id && (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%", background: "#845EF7",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#fff", flexShrink: 0
                    }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 5: Goal ── */}
        {step === 5 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{
                width: 70, height: 70, borderRadius: 22,
                background: "linear-gradient(135deg, #FF6B6B, #FFD93D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, margin: "0 auto 16px"
              }}>🎯</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Main goal kya hai?</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>Apna GlowUp journey personalize karo</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {GOALS.map(g => (
                <div key={g.id} onClick={() => setGoal(g.id)}
                  style={{
                    padding: "18px 14px", borderRadius: 18, cursor: "pointer", textAlign: "center",
                    background: goal === g.id
                      ? "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(132,94,247,0.15))"
                      : "var(--card)",
                    border: `2px solid ${goal === g.id ? "#845EF7" : "var(--border)"}`,
                    transition: "all 0.2s",
                    transform: goal === g.id ? "scale(1.04)" : "scale(1)"
                  }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{g.icon}</div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700,
                    color: goal === g.id ? "#845EF7" : "var(--text)", marginBottom: 4
                  }}>{g.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6: Ready ── */}
        {step === 6 && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 28,
                background: "linear-gradient(135deg, #51CF66, #20C997)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, margin: "0 auto 20px",
                boxShadow: "0 16px 48px rgba(81,207,102,0.35)"
              }}>🚀</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                Sab ready hai,{" "}
                <span style={{
                  background: "linear-gradient(135deg, #51CF66, #20C997)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>{firstName}!</span>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>
                Aapka profile complete ho gaya ✨
              </div>
            </div>

            {/* Profile Summary */}
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 20, marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 14, letterSpacing: 1, textTransform: "uppercase" }}>
                Aapka Profile
              </div>
              {[
                { icon: gender === "male" ? "👨" : gender === "female" ? "👩" : "🧑", label: "Gender", value: gender?.charAt(0).toUpperCase() + gender?.slice(1), color: "#4D96FF" },
                { icon: "🎂", label: "Age", value: `${age} years`, color: "#FFD93D" },
                { icon: "📏", label: "Height", value: `${height} cm`, color: "#51CF66" },
                { icon: "⚖️", label: "Weight", value: `${weight} kg`, color: "#FF6B6B" },
                { icon: "🧴", label: "Skin Type", value: SKIN_TYPES.find(s => s.id === skinType)?.label || skinType, color: "#845EF7" },
                { icon: GOALS.find(g => g.id === goal)?.icon || "🎯", label: "Goal", value: GOALS.find(g => g.id === goal)?.label || goal, color: "#FF6B9D" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 0",
                  borderBottom: i < 5 ? "1px solid var(--border)" : "none"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${item.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{item.label}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{item.value}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                </div>
              ))}
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(255,107,107,0.08), rgba(132,94,247,0.08))",
              border: "1px solid rgba(132,94,247,0.2)", borderRadius: 16, padding: "14px 16px"
            }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#845EF7", fontWeight: 700, marginBottom: 8 }}>
                ✨ Ab yeh sab milega
              </div>
              {[
                "Face shape + gender-accurate hairstyles",
                "Age-appropriate skincare routine",
                "BMI-based fitness & diet plan",
                "Personalized fashion recommendations",
                "Skin type specific products",
              ].map((item, i) => (
                <div key={i} style={{
                  fontFamily: "var(--font-body)", fontSize: 12,
                  color: "var(--muted)", marginBottom: 4, display: "flex", gap: 8
                }}>
                  <span style={{ color: "#51CF66" }}>✓</span> {item}
                </div>
              ))}
            </div>

            {/* ✅ Error message */}
            {error && (
              <div style={{
                marginTop: 12, padding: "10px 14px",
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                borderRadius: 12, fontFamily: "var(--font-body)",
                fontSize: 13, color: "#FF6B6B", textAlign: "center"
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>

      {/* Bottom Button */}
      <div style={{
        padding: "16px 20px 32px", flexShrink: 0,
        background: "linear-gradient(to top, var(--bg) 80%, transparent)"
      }}>
        <button
          onClick={handleNext}
          disabled={!canNext() || saving}
          style={{
            width: "100%", padding: "16px", border: "none", borderRadius: 16,
            cursor: canNext() && !saving ? "pointer" : "not-allowed",
            background: canNext() && !saving
              ? "linear-gradient(135deg, #FF6B6B, #845EF7)"
              : "var(--surface)",
            color: "#fff",
            fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700,
            boxShadow: canNext() ? "0 8px 28px rgba(132,94,247,0.4)" : "none",
            transition: "all 0.2s",
            opacity: canNext() && !saving ? 1 : 0.5,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
          {saving ? (
            <>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                animation: "spin 0.75s linear infinite"
              }} />
              Saving...
            </>
          ) : step === 0 ? "Shuru Karo →"
            : step === totalSteps - 1 ? "🚀 GlowUp Start Karo!"
            : "Next →"}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={saving}
            style={{
              width: "100%", marginTop: 10, padding: "12px", border: "none",
              background: "transparent", fontFamily: "var(--font-body)",
              fontSize: 13, color: "var(--muted)", cursor: "pointer"
            }}>
            ← Wapas Jao
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}