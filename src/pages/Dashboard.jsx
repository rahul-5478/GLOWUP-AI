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
  { icon: "✨", label: "Face Scan", sub: "AI analysis", tab: 1, color: "#FF6B6B", glow: "rgba(255,107,107,0.25)" },
  { icon: "💪", label: "Fitness", sub: "Workout plan", tab: 2, color: "#4D96FF", glow: "rgba(77,150,255,0.25)" },
  { icon: "👗", label: "Fashion", sub: "Outfit ideas", tab: 3, color: "#845EF7", glow: "rgba(132,94,247,0.25)" },
  { icon: "🧴", label: "Skin", sub: "Skincare", tab: 4, color: "#51CF66", glow: "rgba(81,207,102,0.25)" },
  { icon: "💅", label: "AI Chat", sub: "Style coach", tab: 5, color: "#FFD93D", glow: "rgba(255,217,61,0.25)" },
  { icon: "👚", label: "Wardrobe", sub: "My outfits", tab: 6, color: "#FF6B9D", glow: "rgba(255,107,157,0.25)" },
];

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1000 }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || target === 0) { setCount(target); return; }
    started.current = true;
    const steps = 20;
    const inc = target / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ─── Glow Score Ring ──────────────────────────────────────────────────────────
function GlowRing({ score }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { setTimeout(() => setAnim(score), 300); }, [score]);
  const dash = (anim / 100) * circ;
  const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B+" : score >= 60 ? "B" : "C";

  return (
    <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
      <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4D6D" />
            <stop offset="50%" stopColor="#C77DFF" />
            <stop offset="100%" stopColor="#4361EE" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={9} />
        <circle cx={60} cy={60} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={9}
          strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} filter="url(#ringGlow)"
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg,#FF4D6D,#C77DFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "#C77DFF", lineHeight: 1, marginTop: 2 }}>{grade}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 8, color: "var(--muted)", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>Glow Score</div>
      </div>
    </div>
  );
}

export default function Dashboard({ setTab }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Good night" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Good night";
  const greetingEmoji = hour < 5 ? "🌙" : hour < 12 ? "🌅" : hour < 17 ? "☀️" : hour < 21 ? "🌆" : "🌙";

  const faceScans = parseInt(localStorage.getItem("glowup_face_count") || "0");
  const workouts = parseInt(localStorage.getItem("glowup_fitness_count") || "0");
  const styles = parseInt(localStorage.getItem("glowup_fashion_count") || "0");
  const skinChecks = parseInt(localStorage.getItem("glowup_skin_count") || "0");
  const totalActivity = faceScans + workouts + styles + skinChecks;
  const glowScore = Math.min(100, Math.max(10, 20 + totalActivity * 8 + (user ? 10 : 0)));

  const dayIndex = new Date().getDate() % DAILY_TIPS.length;
  const [currentTip, setCurrentTip] = useState(dayIndex);
  const [tipVisible, setTipVisible] = useState(false);
  useEffect(() => { setTimeout(() => setTipVisible(true), 500); }, []);

  const nextTip = () => {
    setTipVisible(false);
    setTimeout(() => { setCurrentTip(p => (p + 1) % DAILY_TIPS.length); setTipVisible(true); }, 250);
  };
  const tip = DAILY_TIPS[currentTip];

  const journeyDone = [faceScans > 0, workouts > 0, styles > 0, skinChecks > 0, false];
  const journeyProgress = journeyDone.filter(Boolean).length;

  return (
    <div style={{ padding: "0 16px 100px" }}>

      {/* ── Hero Card ── */}
      <div style={{
        background: "linear-gradient(135deg, rgba(255,77,109,0.09) 0%, rgba(199,125,255,0.09) 50%, rgba(67,97,238,0.06) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 26, padding: "22px 20px", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -30, right: 80, width: 120, height: 120, background: "radial-gradient(circle, rgba(199,125,255,0.12), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -20, left: 40, width: 80, height: 80, background: "radial-gradient(circle, rgba(255,77,109,0.1), transparent 70%)", pointerEvents: "none" }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Time-based greeting */}
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
            <span>{greetingEmoji}</span>
            <span>{greeting}</span>
          </div>

          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text)", lineHeight: 1.15, marginBottom: 6 }}>
            {firstName}! <span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>✨</span>
          </div>

          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 12 }}>
            {totalActivity === 0 ? "Start your glow journey today 🚀" : `${totalActivity} analyses done — keep glowing! 🔥`}
          </div>

          {/* Streak pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,190,11,0.1)", border: "1px solid rgba(255,190,11,0.2)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ fontSize: 13 }}>🔥</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "var(--accent2)" }}>
              {Math.max(1, Math.ceil(totalActivity / 2))} day streak
            </span>
          </div>
        </div>

        <GlowRing score={glowScore} />
      </div>

      {/* ── Stats Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Face", count: faceScans, icon: "✨", color: "#FF4D6D" },
          { label: "Workouts", count: workouts, icon: "💪", color: "#4361EE" },
          { label: "Styles", count: styles, icon: "👗", color: "#C77DFF" },
          { label: "Skin", count: skinChecks, icon: "🧴", color: "#06D6A0" },
        ].map(stat => (
          <div key={stat.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, padding: "12px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 18, marginBottom: 5 }}>{stat.icon}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>
              <AnimatedNumber target={stat.count} />
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, color: "var(--muted)", marginTop: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>⚡ Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {QUICK_ACTIONS.map(action => (
            <div key={action.tab} onClick={() => setTab(action.tab)} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "16px 10px", cursor: "pointer", textAlign: "center",
              position: "relative", overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onTouchStart={e => { e.currentTarget.style.transform = "scale(0.95)"; e.currentTarget.style.boxShadow = `0 8px 24px ${action.glow}`; }}
              onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              onMouseDown={e => { e.currentTarget.style.transform = "scale(0.95)"; }}
              onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {/* Glow blob */}
              <div style={{ position: "absolute", top: -10, right: -10, width: 50, height: 50, background: `radial-gradient(circle, ${action.glow}, transparent 70%)`, pointerEvents: "none" }} />

              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: `${action.color}18`, border: `1px solid ${action.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, margin: "0 auto 10px",
                boxShadow: `0 4px 14px ${action.glow}`,
              }}>{action.icon}</div>

              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{action.label}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{action.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Journey Progress ── */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 22, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)" }}>🏆 GlowUp Journey</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent5)", fontWeight: 700 }}>{journeyProgress}/5</div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 5, background: "var(--border2)", borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(journeyProgress / 5) * 100}%`, background: "var(--grad2)", borderRadius: 3, transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 8px rgba(199,125,255,0.5)" }} />
        </div>

        {/* Steps */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {[
            { icon: "📸", label: "Face", done: faceScans > 0, tab: 1 },
            { icon: "💪", label: "Fitness", done: workouts > 0, tab: 2 },
            { icon: "👗", label: "Fashion", done: styles > 0, tab: 3 },
            { icon: "🧴", label: "Skin", done: skinChecks > 0, tab: 4 },
            { icon: "👑", label: "Premium", done: false, tab: 7 },
          ].map((step, i) => (
            <div key={i} onClick={() => setTab(step.tab)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: step.done ? "linear-gradient(135deg,#06D6A0,#4361EE)" : i === journeyProgress ? "linear-gradient(135deg,#FF4D6D,#C77DFF)" : "var(--surface)",
                border: `2px solid ${step.done ? "#06D6A0" : i === journeyProgress ? "#C77DFF" : "var(--border2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                boxShadow: step.done ? "0 4px 12px rgba(6,214,160,0.35)" : i === journeyProgress ? "0 4px 12px rgba(199,125,255,0.35)" : "none",
                transition: "all 0.3s",
              }}>
                {step.done ? "✓" : step.icon}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 8, color: step.done ? "#06D6A0" : "var(--muted)", fontWeight: step.done ? 700 : 400, letterSpacing: 0.3 }}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Daily Tip ── */}
      <div onClick={nextTip} style={{
        background: "linear-gradient(135deg, rgba(255,190,11,0.07), rgba(255,77,109,0.05))",
        border: "1px solid rgba(255,190,11,0.18)",
        borderRadius: 22, padding: 18, marginBottom: 14, cursor: "pointer",
        opacity: tipVisible ? 1 : 0, transform: tipVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.3s, transform 0.3s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{tip.icon}</span>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 700, color: "var(--accent2)", letterSpacing: 0.8, textTransform: "uppercase" }}>
              {tip.category} Tip
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted2)" }}>tap for next →</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{tip.tip}</div>
      </div>

      {/* ── CTA or Activity ── */}
      {totalActivity === 0 ? (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 22, padding: 28, textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 52, marginBottom: 14, animation: "float 3s ease-in-out infinite" }}>🌟</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
            Start Your Transformation
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
            Upload a selfie to get AI-powered face shape analysis, skincare routine & hairstyle recommendations!
          </div>
          <div onClick={() => setTab(1)} style={{ display: "inline-block", background: "var(--grad1)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, padding: "14px 32px", borderRadius: 16, cursor: "pointer", boxShadow: "var(--shadow-accent)" }}>
            ✨ Analyze My Face
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 22, padding: 18, marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>📋 Recent Activity</div>
          {[
            faceScans > 0 && { icon: "✨", label: "Face Analysis", detail: `${faceScans} scans done`, color: "#FF4D6D", tab: 1 },
            workouts > 0 && { icon: "💪", label: "Fitness Plans", detail: `${workouts} plans created`, color: "#4361EE", tab: 2 },
            styles > 0 && { icon: "👗", label: "Fashion Advice", detail: `${styles} looks styled`, color: "#C77DFF", tab: 3 },
            skinChecks > 0 && { icon: "🧴", label: "Skin Analysis", detail: `${skinChecks} checks done`, color: "#06D6A0", tab: 4 },
          ].filter(Boolean).slice(0, 4).map((item, i, arr) => (
            <div key={i} onClick={() => setTab(item.tab)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: `${item.color}15`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ color: "var(--muted2)", fontSize: 18 }}>›</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Premium Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #0D0A1E, #0A1628)",
        border: "1px solid rgba(199,125,255,0.25)",
        borderRadius: 22, padding: 20,
        display: "flex", alignItems: "center", gap: 16,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -10, width: 100, height: 100, background: "radial-gradient(circle, rgba(199,125,255,0.15), transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 38 }}>👑</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Unlock GlowUp Premium</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Unlimited AI scans + Skin analysis + Priority AI</div>
        </div>
        <div onClick={() => setTab(7)} style={{ background: "var(--grad2)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, padding: "10px 16px", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 4px 16px rgba(199,125,255,0.35)" }}>
          ₹299/mo
        </div>
      </div>

    </div>
  );
}