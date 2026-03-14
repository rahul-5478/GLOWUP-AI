import { useState, useRef } from "react";
import { skinAPI } from "../utils/api";

const GRADE_CONFIG = {
  A: { color: "#4ade80", bg: "rgba(74,222,128,0.12)", label: "Excellent", emoji: "✨" },
  B: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", label: "Good", emoji: "👍" },
  C: { color: "#facc15", bg: "rgba(250,204,21,0.12)", label: "Fair", emoji: "⚠️" },
  D: { color: "#f87171", bg: "rgba(248,113,113,0.12)", label: "Needs Care", emoji: "🔴" },
};
const SEVERITY_COLOR = { Mild: "#4ade80", Moderate: "#facc15", Severe: "#f87171" };
const STEP_ICONS = { Cleanser: "🧴", Toner: "💧", Serum: "✨", Moisturizer: "🌿", Sunscreen: "☀️", "Eye Cream": "👁️", Exfoliator: "🔄", Mask: "🎭", default: "💊" };

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function ScoreRing({ score, grade }) {
  const cfg = GRADE_CONFIG[grade] || GRADE_CONFIG["B"];
  const r = 52, c = 2 * Math.PI * r, fill = (score / 100) * c;
  return (
    <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto" }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={cfg.color} strokeWidth="10"
          strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${cfg.color}80)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: cfg.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2, letterSpacing: 2 }}>SKIN SCORE</div>
        <div style={{ marginTop: 6, background: cfg.bg, border: `1px solid ${cfg.color}40`, borderRadius: 20, padding: "2px 10px", fontSize: 11, color: cfg.color, fontWeight: 700 }}>
          {cfg.emoji} {cfg.label}
        </div>
      </div>
    </div>
  );
}

function ProblemCard({ problem }) {
  const [open, setOpen] = useState(false);
  const col = SEVERITY_COLOR[problem.severity] || "#facc15";
  return (
    <div onClick={() => setOpen(!open)} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 16, padding: 16, marginBottom: 10, cursor: "pointer", borderLeft: `3px solid ${col}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f0ff" }}>{problem.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{problem.affectedArea} · Urgency: {problem.urgency}</div>
        </div>
        <div style={{ background: `${col}18`, border: `1px solid ${col}40`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: col, fontWeight: 700 }}>{problem.severity}</div>
      </div>
      <div style={{ marginTop: 10, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 5 }}>
        <div style={{ width: `${problem.severityPercent || 50}%`, height: "100%", background: `linear-gradient(90deg, ${col}80, ${col})`, borderRadius: 4 }} />
      </div>
      {open && <div style={{ marginTop: 12, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>{problem.description}</div>}
    </div>
  );
}

function ProductCard({ product, index }) {
  const [open, setOpen] = useState(index === 0);
  const icon = STEP_ICONS[product.category] || STEP_ICONS.default;
  const timeColor = product.timeOfDay === "Morning" ? "#facc15" : "#818cf8";
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, fontSize: 20, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#f0f0ff" }}>Step {product.step}</span>
            <span style={{ background: `${timeColor}18`, border: `1px solid ${timeColor}40`, borderRadius: 20, padding: "2px 8px", fontSize: 10, color: timeColor, fontWeight: 600 }}>{product.timeOfDay}</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{product.productName}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{product.brand} · <span style={{ color: "#4ade80" }}>{product.price}</span></div>
        </div>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#60a5fa" }}>🛒 {product.availableAt}</span>
              <span style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#4ade80" }}>⏱ {product.duration}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 10 }}>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>Why: </span>{product.whyThisProduct}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
              <span style={{ color: "#facc15", fontWeight: 600 }}>How to use: </span>{product.howToUse}
            </div>
            {product.targetsProblems?.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {product.targetsProblems.map((p, i) => (
                  <span key={i} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "2px 8px", fontSize: 10, color: "#f87171" }}>🎯 {p}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WeekCard({ weekNum, weekData }) {
  const [open, setOpen] = useState(weekNum === "week1");
  const colors = ["#60a5fa", "#a78bfa", "#34d399", "#f97316"];
  const col = colors[["week1","week2","week3","week4"].indexOf(weekNum)] || colors[0];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${col}30`, borderRadius: 18, marginBottom: 10, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ padding: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${col}20`, border: `1px solid ${col}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: col, fontWeight: 700 }}>
            W{["week1","week2","week3","week4"].indexOf(weekNum) + 1}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f0ff" }}>{weekData?.title}</div>
        </div>
        <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && weekData && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ paddingTop: 12, display: "grid", gap: 12 }}>
            {weekData.morning?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "#facc15", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>☀️ MORNING</div>
                {weekData.morning.map((s, i) => <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", padding: "4px 0", paddingLeft: 12, borderLeft: "2px solid rgba(250,204,21,0.3)" }}>{s}</div>)}
              </div>
            )}
            {weekData.night?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "#818cf8", fontWeight: 700, marginBottom: 6, letterSpacing: 1 }}>🌙 NIGHT</div>
                {weekData.night.map((s, i) => <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", padding: "4px 0", paddingLeft: 12, borderLeft: "2px solid rgba(129,140,248,0.3)" }}>{s}</div>)}
              </div>
            )}
            {weekData.avoid?.length > 0 && (
              <div style={{ background: "rgba(248,113,113,0.06)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#f87171", fontWeight: 700, marginBottom: 4 }}>❌ AVOID</div>
                {weekData.avoid.map((a, i) => <div key={i} style={{ fontSize: 12, color: "rgba(248,113,113,0.7)" }}>{a}</div>)}
              </div>
            )}
            {weekData.expectedResult && (
              <div style={{ background: "rgba(74,222,128,0.06)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 4 }}>🎯 EXPECTED RESULT</div>
                <div style={{ fontSize: 12, color: "rgba(74,222,128,0.8)" }}>{weekData.expectedResult}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function SkinAnalysis() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const galleryRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageBase64(await toBase64(file));
    setResult(null);
    setError("");
  };

  // Opens gallery
  const openGallery = () => {
    galleryRef.current.value = "";
    galleryRef.current.click();
  };

  // Opens camera — dynamically create input so capture attribute works natively
  const openCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.setAttribute("capture", "user"); // front camera
    input.style.display = "none";
    document.body.appendChild(input);
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        setImageBase64(await toBase64(file));
        setResult(null);
        setError("");
      }
      document.body.removeChild(input);
    };
    input.click();
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true); setError("");
    try {
      const res = await skinAPI.analyze({ imageBase64, mediaType: "image/jpeg" });
      setResult(res.data.result);
      setActiveTab("overview");
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "overview", icon: "🏠", label: "Overview" },
    { id: "problems", icon: "🔍", label: "Problems" },
    { id: "products", icon: "🧴", label: "Products" },
    { id: "plan", icon: "📅", label: "4-Week Plan" },
    { id: "diet", icon: "🥗", label: "Diet & Tips" },
  ];

  return (
    <div style={{ padding: "0 16px 100px" }}>

      {/* Gallery input only — camera opened dynamically via JS */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#f0f0ff", fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
          Skin <span style={{ background: "linear-gradient(135deg, #f87171, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analyzer</span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          Face++ AI scan · Product plan · 4-week treatment
        </div>
      </div>

      {/* Preview or placeholder */}
      {imagePreview ? (
        <div style={{ position: "relative", marginBottom: 16, borderRadius: 20, overflow: "hidden" }}>
          <img src={imagePreview} alt="skin" style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 20, display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)", borderRadius: 20, display: "flex", alignItems: "flex-end", padding: 16 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>✅ Photo ready — tap below to change</div>
          </div>
        </div>
      ) : (
        <div onClick={openGallery} style={{ background: "rgba(255,255,255,0.02)", border: "1.5px dashed rgba(255,255,255,0.1)", borderRadius: 20, marginBottom: 16, cursor: "pointer", minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: 28 }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🤳</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f0ff", marginBottom: 6 }}>Upload Your Selfie</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              Face++ AI will scan your skin<br />Acne · Dark spots · Pores · Pigmentation
            </div>
          </div>
        </div>
      )}

      {/* ── BUTTONS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {/* 📸 Take Photo → opens camera */}
        <button
          onClick={openCamera}
          style={{
            padding: "13px 10px", border: "1.5px solid rgba(248,113,113,0.35)", borderRadius: 14,
            background: "rgba(248,113,113,0.08)", color: "#f87171",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7
          }}
        >
          📸 Take Photo
        </button>

        {/* 🖼️ Gallery → opens file picker */}
        <button
          onClick={openGallery}
          style={{
            padding: "13px 10px", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14,
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.65)",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7
          }}
        >
          🖼️ Gallery
        </button>
      </div>

      {/* Analyze button */}
      {imageBase64 && !loading && (
        <button
          onClick={analyze}
          style={{
            width: "100%", padding: "16px", border: "none", borderRadius: 16,
            background: "linear-gradient(135deg, #f87171, #fb923c)",
            color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer",
            marginBottom: 16, boxShadow: "0 8px 24px rgba(248,113,113,0.35)"
          }}
        >
          🔬 Analyze My Skin with AI
        </button>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔬</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f0f0ff", marginBottom: 8 }}>Scanning Your Skin...</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>Face++ AI is detecting acne, dark spots,<br />pores, pigmentation and more...</div>
          <div style={{ marginTop: 16, display: "flex", gap: 6, justifyContent: "center" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 14, padding: 14, marginBottom: 16, fontSize: 13, color: "#f87171" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── RESULTS ── */}
      {result && (
        <div>
          {/* Score card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 24, marginBottom: 16 }}>
            <ScoreRing score={result.skinScore} grade={result.grade} />

            {result.faceAnalysis?.verifiedByFacePP && (
              <div style={{ margin: "14px auto 0", width: "fit-content", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 20, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10 }}>✅</span>
                <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600 }}>Verified by Face++ AI</span>
              </div>
            )}

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[
                { label: "Age", value: result.faceAnalysis?.age || "—", icon: "🎂" },
                { label: "Gender", value: result.faceAnalysis?.gender || "—", icon: "👤" },
                { label: "Skin", value: result.skinType || "—", icon: "🧬" },
              ].map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, color: "#f0f0ff", fontWeight: 700 }}>{item.value}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{item.label}</div>
                </div>
              ))}
            </div>

            {result.skinTypeSummary && (
              <div style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 12, borderLeft: "3px solid rgba(248,113,113,0.4)" }}>
                {result.skinTypeSummary}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", overflowX: "auto", gap: 6, marginBottom: 16, paddingBottom: 4 }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flexShrink: 0, padding: "8px 14px", border: "1px solid",
                borderColor: activeTab === tab.id ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.07)",
                borderRadius: 12, background: activeTab === tab.id ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.03)",
                color: activeTab === tab.id ? "#f87171" : "rgba(255,255,255,0.45)",
                fontWeight: 600, fontSize: 12, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5
              }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              {result.dermatologistNote && (
                <div style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: 16, padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700, marginBottom: 8 }}>👨‍⚕️ DERMATOLOGIST NOTE</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontStyle: "italic" }}>"{result.dermatologistNote}"</div>
                </div>
              )}
              {result.detectedProblems?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>DETECTED ISSUES ({result.detectedProblems.length})</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {result.detectedProblems.map((p, i) => (
                      <div key={i} onClick={() => setActiveTab("problems")} style={{ background: `${SEVERITY_COLOR[p.severity] || "#facc15"}12`, border: `1px solid ${SEVERITY_COLOR[p.severity] || "#facc15"}30`, borderRadius: 20, padding: "5px 12px", fontSize: 12, color: SEVERITY_COLOR[p.severity] || "#facc15", cursor: "pointer" }}>
                        {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.skinStrengths?.length > 0 && (
                <div style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, marginBottom: 8 }}>💪 SKIN STRENGTHS</div>
                  {result.skinStrengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: "rgba(74,222,128,0.8)", padding: "3px 0" }}>✓ {s}</div>)}
                </div>
              )}
              {result.estimatedResults && (
                <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: 16, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "#fb923c", fontWeight: 700, marginBottom: 6 }}>⏱ EXPECTED RESULTS</div>
                  <div style={{ fontSize: 13, color: "rgba(251,146,60,0.8)", lineHeight: 1.6 }}>{result.estimatedResults}</div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ tab: "products", icon: "🧴", label: "See Products", color: "#60a5fa" }, { tab: "plan", icon: "📅", label: "4-Week Plan", color: "#a78bfa" }].map(btn => (
                  <button key={btn.tab} onClick={() => setActiveTab(btn.tab)} style={{ padding: "14px", border: `1px solid ${btn.color}30`, borderRadius: 14, background: `${btn.color}08`, color: btn.color, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Problems */}
          {activeTab === "problems" && (
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Based on real Face++ skin scan · Tap for details</div>
              {result.faceAnalysis?.skinRawData && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#60a5fa", fontWeight: 700, marginBottom: 12 }}>📊 FACE++ SCAN DATA</div>
                  {Object.entries(result.faceAnalysis.skinRawData).map(([key, val]) => {
                    const labels = { acne: "Acne", darkCircle: "Dark Circles", skinSpot: "Dark Spots", pores: "Pores", wrinkle: "Wrinkles", eyePouch: "Eye Bags", blackheads: "Blackheads", whiteheads: "Whiteheads", nasolabialFold: "Nasolabial Folds" };
                    const pct = Math.round(val);
                    const col = pct < 30 ? "#4ade80" : pct < 60 ? "#facc15" : "#f87171";
                    return (
                      <div key={key} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{labels[key] || key}</span>
                          <span style={{ fontSize: 12, color: col, fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 4, height: 4 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: col, borderRadius: 4 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {result.detectedProblems?.map((p, i) => <ProblemCard key={i} problem={p} />)}
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Indian products · Budget-friendly · Tap for details</div>
              {result.productPlan?.map((p, i) => <ProductCard key={i} product={p} index={i} />)}
              {result.weeklyTreatments?.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>🗓 WEEKLY TREATMENTS</div>
                  {result.weeklyTreatments.map((t, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>{t.day}</span>
                        <span style={{ fontSize: 12, color: "#4ade80" }}>{t.price}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#f0f0ff", marginBottom: 4 }}>{t.treatment} · {t.product}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{t.instructions}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Plan */}
          {activeTab === "plan" && result.treatmentPlan && (
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Follow consistently · Tap week to expand</div>
              {["week1","week2","week3","week4"].map(w => result.treatmentPlan[w] && <WeekCard key={w} weekNum={w} weekData={result.treatmentPlan[w]} />)}
            </div>
          )}

          {/* Diet */}
          {activeTab === "diet" && (
            <div>
              {result.ingredientsToUse?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>✅ INGREDIENTS TO USE</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {result.ingredientsToUse.map((ing, i) => <div key={i} style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#4ade80" }}>{ing}</div>)}
                  </div>
                </div>
              )}
              {result.ingredientsToAvoid?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#f87171", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>❌ INGREDIENTS TO AVOID</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {result.ingredientsToAvoid.map((ing, i) => <div key={i} style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#f87171" }}>{ing}</div>)}
                  </div>
                </div>
              )}
              {result.dietForSkin?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: "#facc15", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>🥗 DIET FOR HEALTHY SKIN</div>
                  {result.dietForSkin.map((tip, i) => <div key={i} style={{ background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.1)", borderRadius: 12, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: "rgba(250,204,21,0.8)" }}>🍽️ {tip}</div>)}
                </div>
              )}
              {result.lifestyleTips?.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>💡 LIFESTYLE TIPS</div>
                  {result.lifestyleTips.map((tip, i) => <div key={i} style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.1)", borderRadius: 12, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: "rgba(167,139,250,0.8)" }}>💜 {tip}</div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}