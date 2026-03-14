import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const DAILY_TIPS = [
  { icon: "💧", tip: "Aaj 8 glass paani piyo — skin glow karti hai!", color: "var(--accent4)" },
  { icon: "🌞", tip: "Subah SPF 50 lagao — sun damage se bachao!", color: "var(--accent2)" },
  { icon: "😴", tip: "7-8 ghante ki neend skin repair karti hai.", color: "var(--accent5)" },
  { icon: "🥗", tip: "Vitamin C se bharpur khana khao — orange, amla!", color: "var(--accent3)" },
  { icon: "🧴", tip: "Moisturizer raat ko zaroori hai — skin barrier banata hai.", color: "var(--accent)" },
  { icon: "💪", tip: "Sirf 20 min walk bhi fitness ke liye kaafi hai!", color: "var(--accent3)" },
  { icon: "✨", tip: "Face wash karte waqt garam paani avoid karo.", color: "var(--accent)" },
];

const QUICK_ACTIONS = [
  { icon: "✨", label: "Face Scan", tab: 1, gradient: "var(--grad1)", desc: "Hairstyle & skin" },
  { icon: "💪", label: "Fitness", tab: 2, gradient: "var(--grad3)", desc: "Workout plan" },
  { icon: "👗", label: "Fashion", tab: 3, gradient: "var(--grad2)", desc: "Style advice" },
  { icon: "🧴", label: "Skin", tab: 4, gradient: "var(--grad4)", desc: "Skincare tips" },
  { icon: "💅", label: "AI Chat", tab: 5, gradient: "linear-gradient(135deg,#C77DFF,#4361EE)", desc: "Style coach" },
  { icon: "👚", label: "Wardrobe", tab: 6, gradient: "linear-gradient(135deg,#06D6A0,#4361EE)", desc: "Your clothes" },
];

function StatCard({ icon, value, label, color, delay = 0 }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value) || 0;

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 40 + delay);
    return () => clearInterval(timer);
  }, [target, delay]);

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 18, padding: "16px 14px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700,
        color: color, lineHeight: 1,
      }}>
        {target > 0 ? count : value}
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

function GlowScoreRing({ score = 0 }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => s >= 80 ? "#06D6A0" : s >= 60 ? "#FFBE0B" : "#FF4D6D";
  const getLabel = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <svg width="90" height="90" className="progress-ring">
          <circle className="progress-ring-track" cx="45" cy="45" r={radius} strokeWidth="6" />
          <circle
            className="progress-ring-fill"
            cx="45" cy="45" r={radius}
            strokeWidth="6"
            stroke={getColor(score)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: getColor(score) }}>
            {score}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 8, color: "var(--muted)" }}>SCORE</div>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: getColor(score), fontWeight: 600 }}>
        {getLabel(score)}
      </div>
    </div>
  );
}

export default function Dashboard({ setTab }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  // Analyses count from user data
  const analyses = user?.analyses || [];
  const faceCount = analyses.filter((a) => a.type === "face").length;
  const fitnessCount = analyses.filter((a) => a.type === "fitness").length;
  const fashionCount = analyses.filter((a) => a.type === "fashion").length;
  const totalAnalyses = analyses.length;

  // Glow score based on activity
  const glowScore = Math.min(95, 30 + totalAnalyses * 8 + (user?.profile?.goal ? 10 : 0));

  // Daily tip — rotate by day of week
  const tip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

  // Streak (days since account created)
  const daysSince = user?.createdAt
    ? Math.min(30, Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + 1)
    : 1;

  return (
    <div style={{ padding: "0 16px 100px" }} className="fade-in-up">

      {/* Hero Card */}
      <div style={{
        background: "linear-gradient(135deg, var(--card) 0%, var(--card2) 100%)",
        borderRadius: 24, padding: "20px 20px 18px",
        marginBottom: 18, border: "1px solid var(--border2)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ambient blob */}
        <div style={{
          position: "absolute", top: -50, right: -30,
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,77,109,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -20,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67,97,238,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
              Welcome back, {firstName} 👋
            </div>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 26,
              fontWeight: 800, color: "var(--text)", lineHeight: 1.15, marginBottom: 8,
              letterSpacing: -0.5,
            }}>
              Your <span className="text-gradient-1">Glow</span>
              <span className="text-gradient-2">Up</span> Journey
            </div>
            <div style={{
              display: "flex", gap: 8, flexWrap: "wrap",
            }}>
              <div style={{
                background: "var(--accent-glow)", border: "1px solid rgba(255,77,109,0.3)",
                borderRadius: 20, padding: "4px 10px",
                fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent)", fontWeight: 600,
              }}>
                🔥 {daysSince} day streak
              </div>
              <div style={{
                background: "rgba(6,214,160,0.1)", border: "1px solid rgba(6,214,160,0.2)",
                borderRadius: 20, padding: "4px 10px",
                fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent3)", fontWeight: 600,
              }}>
                ✅ {totalAnalyses} analyses
              </div>
            </div>
          </div>
          <GlowScoreRing score={glowScore} />
        </div>
      </div>

      {/* Daily Tip */}
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: 16, padding: "13px 16px",
        marginBottom: 18,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: `${tip.color}22`,
          border: `1.5px solid ${tip.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>
          {tip.icon}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>
            Aaj ka tip ✨
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text2)", lineHeight: 1.4 }}>
            {tip.tip}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
        <StatCard icon="✨" value={faceCount} label="Face Scans" color="var(--accent)" delay={0} />
        <StatCard icon="💪" value={fitnessCount} label="Workouts" color="var(--accent3)" delay={100} />
        <StatCard icon="👗" value={fashionCount} label="Styles" color="var(--accent4)" delay={200} />
        <StatCard icon="🔥" value={`${daysSince}d`} label="Streak" color="var(--accent2)" delay={0} />
      </div>

      {/* Quick Actions */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)",
        marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase",
      }}>
        Quick Actions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <div
            key={i}
            onClick={() => setTab(a.tab)}
            style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 18, padding: "14px 10px",
              cursor: "pointer", textAlign: "center",
              transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
              position: "relative", overflow: "hidden",
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.96)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
              e.currentTarget.style.borderColor = "var(--border2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14, margin: "0 auto 8px",
              background: a.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}>
              {a.icon}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
              {a.label}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
              {a.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {analyses.length > 0 && (
        <>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)",
            marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase",
          }}>
            Recent Activity
          </div>
          <div style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 18, overflow: "hidden", marginBottom: 18,
          }}>
            {analyses.slice(-4).reverse().map((a, i) => {
              const icons = { face: "✨", fitness: "💪", fashion: "👗", skin: "🧴" };
              const colors = { face: "var(--accent)", fitness: "var(--accent3)", fashion: "var(--accent4)", skin: "var(--accent2)" };
              const labels = { face: "Face Analysis", fitness: "Fitness Plan", fashion: "Fashion Advice", skin: "Skin Analysis" };
              const date = a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "Recently";
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px",
                  borderBottom: i < Math.min(analyses.length, 4) - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: `${colors[a.type]}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>
                    {icons[a.type] || "🤖"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                      {labels[a.type] || "Analysis"}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
                      {date}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
                    color: colors[a.type],
                    background: `${colors[a.type]}15`,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    Done ✓
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CTA if no activity */}
      {analyses.length === 0 && (
        <div style={{
          background: "linear-gradient(135deg, rgba(255,77,109,0.08), rgba(67,97,238,0.08))",
          border: "1px dashed var(--border2)",
          borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 18,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }} className="float">🚀</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", fontWeight: 700, marginBottom: 6 }}>
            Apna Glow Journey Start Karo!
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
            Face scan karo ya fitness plan banao — bilkul free!
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => setTab(1)}
              style={{
                padding: "10px 20px", border: "none", borderRadius: 12,
                background: "var(--grad1)", color: "#fff",
                fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              ✨ Face Scan
            </button>
            <button
              onClick={() => setTab(2)}
              style={{
                padding: "10px 20px", border: "none", borderRadius: 12,
                background: "var(--grad3)", color: "#fff",
                fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
                cursor: "pointer",
              }}
            >
              💪 Fitness Plan
            </button>
          </div>
        </div>
      )}

      {/* Why GlowUp */}
      <div style={{
        fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)",
        marginBottom: 12, letterSpacing: 1.5, textTransform: "uppercase",
      }}>
        Why GlowUp AI
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: "🤖", label: "Real AI Vision", sub: "Face++ & Groq AI", color: "var(--accent)" },
          { icon: "⚡", label: "Instant Results", sub: "Under 5 seconds", color: "var(--accent3)" },
          { icon: "🔒", label: "100% Private", sub: "Data encrypted", color: "var(--accent4)" },
          { icon: "🇮🇳", label: "Made for India", sub: "Indian context AI", color: "var(--accent2)" },
        ].map((s, i) => (
          <div key={i} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: 16,
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 8 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}