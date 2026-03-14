import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const DAILY_TIPS = [
  { icon: "💧", tip: "Drink 3L water today — skin becomes 40% clearer in just 2 weeks!", category: "Skin" },
  { icon: "🌅", tip: "Apply SPF 30+ every morning — it's the #1 anti-aging product!", category: "Skincare" },
  { icon: "💪", tip: "10 mins morning stretching increases energy by 20% all day!", category: "Fitness" },
  { icon: "🥗", tip: "Include turmeric in your diet — natural anti-inflammatory for glowing skin!", category: "Nutrition" },
  { icon: "😴", tip: "7-8 hours sleep = natural face lift. Collagen repairs at night!", category: "Recovery" },
  { icon: "🚿", tip: "Cold water face wash in the morning tightens pores instantly!", category: "Grooming" },
  { icon: "🧴", tip: "Vitamin C serum in morning + Retinol at night = perfect anti-aging combo!", category: "Skincare" },
  { icon: "🏃", tip: "20 mins cardio daily boosts skin blood flow — natural glow guaranteed!", category: "Fitness" },
  { icon: "✂️", tip: "Trim hair every 6-8 weeks — prevents split ends and looks 10x fresher!", category: "Hair" },
  { icon: "🍳", tip: "Eggs for breakfast = biotin boost. Best natural food for strong hair!", category: "Hair" },
  { icon: "🧘", tip: "Stress shows on face first. 5 min meditation = visible skin improvement!", category: "Wellness" },
  { icon: "🌙", tip: "Never sleep with makeup on — it ages skin 3x faster overnight!", category: "Skincare" },
  { icon: "👟", tip: "Compound exercises (squats, deadlifts) burn fat 3x more than cardio!", category: "Fitness" },
  { icon: "🫧", tip: "Clean your phone screen daily — it has more bacteria than a toilet seat!", category: "Skincare" },
];

const QUICK_ACTIONS = [
  { icon: "✨", label: "Face Scan", sub: "AI face analysis", tab: 1, gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)", glow: "rgba(255,107,107,0.3)" },
  { icon: "💪", label: "Workout Plan", sub: "Custom fitness", tab: 2, gradient: "linear-gradient(135deg, #4D96FF, #6B5EE4)", glow: "rgba(77,150,255,0.3)" },
  { icon: "👗", label: "Style Advice", sub: "Outfit ideas", tab: 3, gradient: "linear-gradient(135deg, #845EF7, #D63AF9)", glow: "rgba(132,94,247,0.3)" },
  { icon: "🧴", label: "Skin Check", sub: "Skincare routine", tab: 4, gradient: "linear-gradient(135deg, #51CF66, #20C997)", glow: "rgba(81,207,102,0.3)" },
  { icon: "💅", label: "Style Chat", sub: "AI coach", tab: 5, gradient: "linear-gradient(135deg, #FFD93D, #FF8E53)", glow: "rgba(255,217,61,0.3)" },
  { icon: "👚", label: "Wardrobe", sub: "Outfit manager", tab: 6, gradient: "linear-gradient(135deg, #FF6B9D, #C850C0)", glow: "rgba(255,107,157,0.3)" },
];

const JOURNEY_STEPS = [
  { icon: "📸", label: "Face Scan", done: false, key: "face" },
  { icon: "💪", label: "Fitness", done: false, key: "fitness" },
  { icon: "👗", label: "Fashion", done: false, key: "fashion" },
  { icon: "🧴", label: "Skincare", done: false, key: "skin" },
  { icon: "👑", label: "Premium", done: false, key: "premium" },
];

function AnimatedCounter({ target, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || target === 0) return;
    started.current = true;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

function GlowScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 400);
    return () => clearTimeout(timer);
  }, [score]);
  const dash = (animated / 100) * circumference;

  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="50%" stopColor="#845EF7" />
            <stop offset="100%" stopColor="#4D96FF" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Background ring */}
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        {/* Score ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          filter="url(#glow)"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, background: "linear-gradient(135deg, #FF6B6B, #845EF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2, letterSpacing: 1 }}>GLOW SCORE</div>
      </div>
    </div>
  );
}

export default function Dashboard({ setTab }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const greetingEmoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  // Stats from localStorage
  const faceScans = parseInt(localStorage.getItem("glowup_face_count") || "0");
  const workouts = parseInt(localStorage.getItem("glowup_fitness_count") || "0");
  const styles = parseInt(localStorage.getItem("glowup_fashion_count") || "0");
  const skinChecks = parseInt(localStorage.getItem("glowup_skin_count") || "0");

  const totalActivity = faceScans + workouts + styles + skinChecks;
  const glowScore = Math.min(100, Math.max(10, 20 + totalActivity * 8 + (user ? 10 : 0)));

  // Daily tip rotation
  const dayIndex = new Date().getDate() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[dayIndex];

  // Journey progress
  const journeyDone = [
    faceScans > 0,
    workouts > 0,
    styles > 0,
    skinChecks > 0,
    false, // premium
  ];
  const journeyProgress = journeyDone.filter(Boolean).length;

  const [tipVisible, setTipVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState(dayIndex);

  useEffect(() => {
    const t = setTimeout(() => setTipVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const nextTip = () => {
    setTipVisible(false);
    setTimeout(() => {
      setCurrentTip((prev) => (prev + 1) % DAILY_TIPS.length);
      setTipVisible(true);
    }, 300);
  };

  const activeTip = DAILY_TIPS[currentTip];

  return (
    <div style={{ padding: "0 16px 100px" }}>

      {/* ── Greeting + Glow Score ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,107,107,0.08) 0%, rgba(132,94,247,0.08) 50%, rgba(77,150,255,0.05) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 24,
        padding: "20px 20px",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Decorative glow blob */}
        <div style={{ position: "absolute", top: -30, right: 100, width: 120, height: 120, background: "radial-gradient(circle, rgba(132,94,247,0.15), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>
            {greetingEmoji} {greeting}
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text)", lineHeight: 1.2, marginBottom: 8 }}>
            {firstName}! ✨
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            {totalActivity === 0
              ? "Start your glow journey today 🚀"
              : `${totalActivity} total analyses done — keep going! 🔥`
            }
          </div>
          {/* Streak */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, background: "rgba(255,217,61,0.12)", border: "1px solid rgba(255,217,61,0.25)", borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ fontSize: 14 }}>🔥</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "#FFD93D" }}>
              {Math.max(1, Math.ceil(totalActivity / 2))} day streak
            </span>
          </div>
        </div>

        <GlowScoreRing score={glowScore} />
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { label: "Face", count: faceScans, icon: "✨", color: "#FF6B6B" },
          { label: "Workouts", count: workouts, icon: "💪", color: "#4D96FF" },
          { label: "Styles", count: styles, icon: "👗", color: "#845EF7" },
          { label: "Skin", count: skinChecks, icon: "🧴", color: "#51CF66" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "12px 8px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: stat.color, lineHeight: 1 }}>
              <AnimatedCounter target={stat.count} />
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "var(--muted)", marginTop: 3, letterSpacing: 0.5 }}>{stat.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>
          ⚡ Quick Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {QUICK_ACTIONS.map((action) => (
            <div
              key={action.tab}
              onClick={() => setTab(action.tab)}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 18,
                padding: "14px 10px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = "scale(0.96)";
                e.currentTarget.style.boxShadow = `0 6px 24px ${action.glow}`;
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon with gradient bg */}
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: action.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, margin: "0 auto 8px",
                boxShadow: `0 4px 14px ${action.glow}`,
              }}>{action.icon}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{action.label}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{action.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Journey Progress ── */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>🏆 GlowUp Journey</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent)" }}>{journeyProgress}/5 done</div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 6, background: "var(--surface)", borderRadius: 6, marginBottom: 16, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #FF6B6B, #845EF7, #4D96FF)",
            borderRadius: 6,
            width: `${(journeyProgress / 5) * 100}%`,
            transition: "width 1s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: "0 0 10px rgba(132,94,247,0.5)",
          }} />
        </div>

        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {JOURNEY_STEPS.map((step, i) => (
            <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: journeyDone[i]
                  ? "linear-gradient(135deg, #51CF66, #20C997)"
                  : i === journeyProgress ? "linear-gradient(135deg, #FF6B6B, #845EF7)" : "var(--surface)",
                border: `2px solid ${journeyDone[i] ? "#51CF66" : i === journeyProgress ? "#845EF7" : "var(--border)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
                boxShadow: journeyDone[i] ? "0 4px 12px rgba(81,207,102,0.4)" : i === journeyProgress ? "0 4px 12px rgba(132,94,247,0.4)" : "none",
                transition: "all 0.3s",
              }}>
                {journeyDone[i] ? "✓" : step.icon}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: journeyDone[i] ? "#51CF66" : "var(--muted)", letterSpacing: 0.3, fontWeight: journeyDone[i] ? 700 : 400 }}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Daily Tip ── */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(255,217,61,0.08), rgba(255,107,107,0.06))",
          border: "1px solid rgba(255,217,61,0.2)",
          borderRadius: 20,
          padding: 18,
          marginBottom: 16,
          cursor: "pointer",
          opacity: tipVisible ? 1 : 0,
          transform: tipVisible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.3s, transform 0.3s",
        }}
        onClick={nextTip}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{activeTip.icon}</span>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "#FFD93D", letterSpacing: 0.5 }}>TODAY'S TIP • {activeTip.category.toUpperCase()}</div>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)" }}>tap for next →</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{activeTip.tip}</div>
      </div>

      {/* ── Recent Activity or CTA ── */}
      {totalActivity === 0 ? (
        <div style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌟</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Start Your Transformation</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
            Upload a selfie to get AI-powered hairstyle, skincare & fashion recommendations!
          </div>
          <div
            onClick={() => setTab(1)}
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(255,107,107,0.35)",
            }}
          >
            ✨ Analyze My Face
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, padding: 18 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>📋 Recent Activity</div>
          {[
            faceScans > 0 && { icon: "✨", label: "Face Analysis", detail: `${faceScans} scans completed`, color: "#FF6B6B", tab: 1 },
            workouts > 0 && { icon: "💪", label: "Fitness Plan", detail: `${workouts} plans generated`, color: "#4D96FF", tab: 2 },
            styles > 0 && { icon: "👗", label: "Fashion Advice", detail: `${styles} outfits suggested`, color: "#845EF7", tab: 3 },
            skinChecks > 0 && { icon: "🧴", label: "Skin Analysis", detail: `${skinChecks} checks done`, color: "#51CF66", tab: 4 },
          ].filter(Boolean).slice(0, 4).map((item, i) => (
            <div
              key={i}
              onClick={() => setTab(item.tab)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: `${item.color}18`,
                border: `1px solid ${item.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>›</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Premium Banner ── */}
      <div style={{
        marginTop: 16,
        background: "linear-gradient(135deg, #1A0A2E, #0D1A3E)",
        border: "1px solid rgba(132,94,247,0.3)",
        borderRadius: 20,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "radial-gradient(circle, rgba(132,94,247,0.2), transparent 70%)" }} />
        <div style={{ fontSize: 36 }}>👑</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Unlock GlowUp Premium</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Unlimited AI scans + Skin analysis + Style chat</div>
        </div>
        <div
          onClick={() => setTab(7)}
          style={{
            background: "linear-gradient(135deg, #845EF7, #4D96FF)",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 700,
            padding: "10px 16px",
            borderRadius: 12,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(132,94,247,0.4)",
          }}
        >
          ₹299/mo
        </div>
      </div>

    </div>
  );
}