import { useState } from "react";
import { fitnessAPI } from "../utils/api";
import { GlowButton, SectionTitle, Card, LoadingDots, ResultCard, ErrorMessage } from "../components/UI";
import { useLang } from "../hooks/useLanguage";

const WORKOUT_IMAGES = {
  "Chest": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80",
  "Back": "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&q=80",
  "Legs": "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&q=80",
  "Shoulders": "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&q=80",
  "Cardio": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80",
  "REST": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80",
  "Abs": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  "default": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
};

const INDIAN_FOOD_IMAGES = {
  "roti": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&q=80",
  "dal": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80",
  "rice": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=300&q=80",
  "sabzi": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80",
  "chicken": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&q=80",
  "eggs": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300&q=80",
  "oats": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300&q=80",
  "paratha": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&q=80",
  "paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80",
  "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80",
  "smoothie": "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&q=80",
  "default": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80",
};

function getWorkoutImage(workout) {
  if (!workout) return WORKOUT_IMAGES.default;
  for (const key of Object.keys(WORKOUT_IMAGES)) {
    if (workout.toLowerCase().includes(key.toLowerCase())) return WORKOUT_IMAGES[key];
  }
  return WORKOUT_IMAGES.default;
}

function getFoodImage(meal) {
  if (!meal) return INDIAN_FOOD_IMAGES.default;
  const m = meal.toLowerCase();
  for (const key of Object.keys(INDIAN_FOOD_IMAGES)) {
    if (m.includes(key)) return INDIAN_FOOD_IMAGES[key];
  }
  return INDIAN_FOOD_IMAGES.default;
}

function ProgressChart({ goal, weight }) {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const generateProgress = () => {
    const w = parseFloat(weight) || 70;
    return weeks.map((_, i) => {
      if (goal === "weight_loss") return +(w - i * 0.5).toFixed(1);
      if (goal === "weight_gain") return +(w + i * 0.4).toFixed(1);
      if (goal === "muscle_building") return +(w + i * 0.2).toFixed(1);
      return +(w + (Math.random() * 0.2 - 0.1)).toFixed(1);
    });
  };
  const data = generateProgress();
  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const range = max - min;
  const h = 120, w = 280, pad = 30;
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 14, fontWeight: 700 }}>📈 Progress Forecast</div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6B6B" /><stop offset="100%" stopColor="#4D96FF" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" /><stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0,1,2,3].map(i => (
          <line key={i} x1={pad} y1={pad + i*(h-pad*2)/3} x2={w-pad} y2={pad + i*(h-pad*2)/3} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
        ))}
        <polygon points={`${pad},${h-pad} ${points} ${w-pad},${h-pad}`} fill="url(#areaGrad)" />
        <polyline points={points} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => {
          const x = pad + (i / (data.length - 1)) * (w - pad * 2);
          const y = h - pad - ((v - min) / range) * (h - pad * 2);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#FF6B6B" stroke="#fff" strokeWidth="2" />
              <text x={x} y={h-6} textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="var(--font-body)">{weeks[i]}</text>
              {i === data.length-1 && <text x={x+6} y={y-6} fill="var(--accent)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">{v}kg</text>}
            </g>
          );
        })}
        <text x={pad-4} y={pad} textAnchor="end" fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono)">{data[0]}kg</text>
      </svg>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 4 }}>Projected 8-week weight trajectory</div>
    </Card>
  );
}

function downloadPDF(result, form) {
  const content = `GlowUp AI - Fitness Plan\n========================\nBMI: ${result.bmi}\nDaily Calories: ${result.dailyCalories} kcal\nWater: ${result.waterIntake}\nSleep: ${result.sleepRecommendation}\n\nMACROS\n------\nProtein: ${result.macros?.protein}\nCarbs: ${result.macros?.carbs}\nFat: ${result.macros?.fat}\n\nWEEKLY PLAN\n-----------\n${result.weeklyPlan?.map(d => `\n${d.day}\nWorkout: ${d.workout}\nExercises: ${d.workoutDetails?.join(", ")}\nMeals:\n${d.meals?.map(m => `  - ${m}`).join("\n")}`).join("\n")}\n\nPRO TIPS\n--------\n${result.topTips?.map((t, i) => `${i+1}. ${t}`).join("\n")}\n\nGenerated by GlowUp AI`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "GlowUp-Fitness-Plan.txt"; a.click();
  URL.revokeObjectURL(url);
}

function ShoppingList() {
  const [show, setShow] = useState(false);
  const items = [
    "🌾 Atta (Whole wheat flour) - 1kg","🍚 Brown Rice - 1kg","🫘 Mixed Dal (Masoor, Moong, Chana) - 500g each",
    "🥩 Chicken Breast - 1kg","🥚 Eggs - 2 dozen","🥛 Low fat milk - 2L",
    "🥗 Spinach, Methi, Palak - 500g","🥦 Mixed Vegetables - 1kg","🧅 Onion, Tomato, Garlic, Ginger",
    "🫙 Dahi (Curd) - 500g","🥜 Mixed Nuts - 200g","🍌 Seasonal Fruits",
    "🫒 Mustard / Olive Oil - 500ml","🧂 Salt, Haldi, Jeera, Dhaniya","🌿 Oats - 500g","🍫 Protein Powder (optional)",
  ];
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setShow(!show)} style={{ width: "100%", padding: "14px", border: "1px solid var(--border)", borderRadius: 14, background: show ? "rgba(107,203,119,0.15)" : "var(--card)", color: "var(--accent3)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        🛒 {show ? "Hide" : "Show"} Weekly Shopping List
      </button>
      {show && (
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, marginTop: 8 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", fontWeight: 700, marginBottom: 12 }}>🛒 Indian Grocery List</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < items.length-1 ? "1px solid var(--border)" : "none" }}>
              <input type="checkbox" style={{ accentColor: "var(--accent3)", width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)" }}>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeCard({ meal, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", fontWeight: 700 }}>🍳 {meal}</div>
          <button onClick={onClose} style={{ background: "var(--surface)", border: "none", borderRadius: 10, width: 32, height: 32, cursor: "pointer", color: "var(--muted)", fontSize: 16 }}>✕</button>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(255,107,107,0.1)", borderRadius: 10, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent)" }}>⏱ 20 mins</div>
          <div style={{ background: "rgba(107,203,119,0.1)", borderRadius: 10, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent3)" }}>🔥 ~350 kcal</div>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", fontWeight: 600, marginBottom: 8 }}>Steps:</div>
        {["Gather fresh ingredients and wash vegetables well", "Heat oil on medium flame, add spices", "Add main ingredients and cook till done", "Season with salt, garnish and serve hot"].map((step, i) => (
          <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", padding: "6px 0", display: "flex", gap: 8 }}>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{i+1}.</span> {step}
          </div>
        ))}
      </div>
    </div>
  );
}

const MEAL_CALORIES = { Breakfast: 400, Lunch: 600, Dinner: 500, Snack: 200 };

export default function FitnessCoach() {
  const { t } = useLang();
  const [form, setForm] = useState({ weight: "", height: "", age: "", goal: "weight_loss", unit: "metric" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState("plan");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const goals = [
    { id: "weight_loss", label: t.weightLoss, icon: "🔥" },
    { id: "muscle_building", label: t.muscle, icon: "💪" },
    { id: "weight_gain", label: t.weightGain, icon: "⬆️" },
    { id: "maintenance", label: t.maintenance, icon: "⚖️" },
  ];

  const getPlan = async () => {
    if (!form.weight || !form.height || !form.age) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fitnessAPI.plan(form);
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Could not generate plan. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <SectionTitle icon="💪" title={t.fitnessTitle} subtitle={t.fitnessSubtitle} />

      <div style={{ display: "flex", background: "var(--surface)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
        {["metric", "imperial"].map(u => (
          <button key={u} onClick={() => set("unit", u)} style={{ flex: 1, padding: "10px", border: "none", borderRadius: 10, cursor: "pointer", background: form.unit === u ? "var(--accent)" : "transparent", color: form.unit === u ? "#fff" : "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}>
            {u === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/in)"}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[{ key: "age", label: t.age, unit: "yrs", placeholder: "25" }, { key: "weight", label: t.weight, unit: form.unit === "metric" ? "kg" : "lbs", placeholder: "70" }, { key: "height", label: t.height, unit: form.unit === "metric" ? "cm" : "in", placeholder: "175" }].map(({ key, label, unit, placeholder }) => (
          <div key={key} style={{ background: "var(--card)", borderRadius: 14, padding: "12px 14px", border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <input type="number" value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} style={{ background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-mono)", fontSize: 20, color: "var(--text)", fontWeight: 700, width: "100%", padding: 0 }} />
              <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>{t.goal}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {goals.map(g => (
            <div key={g.id} onClick={() => set("goal", g.id)} style={{ background: form.goal === g.id ? "rgba(255,107,107,0.15)" : "var(--card)", border: `1.5px solid ${form.goal === g.id ? "var(--accent)" : "var(--border)"}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}>
              <span style={{ fontSize: 22 }}>{g.icon}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: form.goal === g.id ? "var(--accent)" : "var(--text)" }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />
      <GlowButton onClick={getPlan} disabled={!form.weight || !form.height || !form.age} gradient="var(--grad3)">{t.generateBtn}</GlowButton>

      {loading && <Card style={{ marginTop: 16, textAlign: "center" }}><div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>{t.building}</div><LoadingDots /></Card>}

      {result && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>{t.dailyCalories}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--accent)" }}>{result.dailyCalories}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>kcal/day</div>
            </div>
            <div style={{ background: "rgba(107,203,119,0.1)", border: "1px solid rgba(107,203,119,0.3)", borderRadius: 16, padding: 16 }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>BMI</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--accent3)" }}>{result.bmi}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{result.estimatedTimeline}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "rgba(77,150,255,0.1)", border: "1px solid rgba(77,150,255,0.3)", borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 22 }}>💧</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--accent4)", marginTop: 6 }}>{result.waterIntake}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>Daily water</div>
            </div>
            <div style={{ background: "rgba(132,94,247,0.1)", border: "1px solid rgba(132,94,247,0.3)", borderRadius: 16, padding: 14 }}>
              <div style={{ fontSize: 22 }}>😴</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "#845EF7", marginTop: 6 }}>{result.sleepRecommendation}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>Sleep/night</div>
            </div>
          </div>

          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 14, fontWeight: 700 }}>🥗 {t.macros}</div>
            {[{ label: "Protein", value: result.macros?.protein, color: "var(--accent)", pct: 30 }, { label: "Carbs", value: result.macros?.carbs, color: "var(--accent4)", pct: 40 }, { label: "Fat", value: result.macros?.fat, color: "var(--accent2)", pct: 30 }].map(m => (
              <div key={m.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)" }}>{m.label}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: m.color, fontWeight: 700 }}>{m.value}</span>
                </div>
                <div style={{ background: "var(--border)", borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${m.pct}%`, height: "100%", background: m.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", background: "var(--surface)", borderRadius: 12, padding: 4, marginBottom: 14 }}>
            {[{ id: "plan", icon: "📅", label: "Weekly Plan" }, { id: "progress", icon: "📈", label: "Progress" }, { id: "shopping", icon: "🛒", label: "Shopping" }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "9px 4px", border: "none", borderRadius: 10, cursor: "pointer", background: activeTab === tab.id ? "var(--accent)" : "transparent", color: activeTab === tab.id ? "#fff" : "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 11, transition: "all 0.2s" }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "plan" && result.weeklyPlan && (
            <div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 12 }}>
                {result.weeklyPlan.map((day, i) => (
                  <div key={i} onClick={() => setActiveDay(i)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 12, cursor: "pointer", background: activeDay === i ? "var(--accent)" : "var(--card)", border: `1px solid ${activeDay === i ? "var(--accent)" : "var(--border)"}`, fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: activeDay === i ? "#fff" : "var(--muted)", transition: "all 0.2s" }}>
                    {day.day?.slice(0, 3)}
                  </div>
                ))}
              </div>
              {result.weeklyPlan[activeDay] && (() => {
                const day = result.weeklyPlan[activeDay];
                return (
                  <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ position: "relative" }}>
                      <img src={getWorkoutImage(day.workout)} alt={day.workout} style={{ width: "100%", height: 160, objectFit: "cover" }} onError={e => { e.target.src = WORKOUT_IMAGES.default; }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "20px 16px 12px" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "#fff", fontWeight: 700 }}>{day.day}</div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>🏃 {day.workout}</div>
                      </div>
                    </div>
                    <div style={{ padding: 16 }}>
                      {day.workoutDetails?.length > 0 && !day.workout?.includes("REST") && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--accent)", fontWeight: 700, marginBottom: 8 }}>💪 Exercises</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                            {day.workoutDetails.map((ex, i) => (
                              <div key={i} style={{ background: "rgba(255,107,107,0.08)", borderRadius: 10, padding: "8px 10px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)" }}>🏋️ {ex}</div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--accent3)", fontWeight: 700, marginBottom: 8 }}>🥗 Meals</div>
                        {day.meals?.map((meal, i) => {
                          const mealType = ["Breakfast", "Lunch", "Dinner", "Snack"][i] || "Meal";
                          const cal = MEAL_CALORIES[mealType] || 300;
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(107,203,119,0.06)", borderRadius: 12, padding: "8px 10px", marginBottom: 6 }}>
                              <img src={getFoodImage(meal)} alt="food" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.src = INDIAN_FOOD_IMAGES.default; }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.4 }}>{meal}</div>
                                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent2)", marginTop: 2 }}>🔥 ~{cal} kcal</div>
                              </div>
                              <button onClick={() => setSelectedMeal(meal)} style={{ background: "rgba(77,150,255,0.15)", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 10, color: "var(--accent4)" }}>Recipe</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "progress" && <ProgressChart goal={form.goal} weight={form.weight} />}
          {activeTab === "shopping" && <ShoppingList />}

          <ResultCard title={t.proTips} items={result.topTips} gradient="var(--grad4)" icon="⚡" />

          <button onClick={() => downloadPDF(result, form)} style={{ width: "100%", padding: "14px", border: "1px solid var(--border)", borderRadius: 14, background: "var(--card)", color: "var(--accent4)", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            📄 Download Plan as PDF
          </button>
        </div>
      )}

      {selectedMeal && <RecipeCard meal={selectedMeal} onClose={() => setSelectedMeal(null)} />}
    </div>
  );
}