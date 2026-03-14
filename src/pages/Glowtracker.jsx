import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://glowup-ai-backend-1.onrender.com/api";

const BADGES = {
  "Skin Star": "🌟",
  "Fitness Beast": "💪",
  "Fashion Icon": "👑",
  "Glow Getter": "✨",
  "Consistency King": "🔥",
  "Perfect Week": "💯",
};

export default function GlowTracker() {
  const [scores, setScores] = useState([]);
  const [latest, setLatest] = useState(null);
  const [trend, setTrend] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ skinScore: 70, fitnessScore: 70, fashionScore: 70, notes: "" });

  const token = localStorage.getItem("glowup_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [histRes, latestRes] = await Promise.all([
        axios.get(`${API}/glow/history`, { headers }),
        axios.get(`${API}/glow/latest`, { headers }),
      ]);
      setScores(histRes.data.scores || []);
      setLatest(latestRes.data.latest);
      setTrend(latestRes.data.trend || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveScore = async () => {
    setSaving(true);
    try {
      const res = await axios.post(`${API}/glow/score`, form, { headers });
      setResult(res.data.weekData);
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const getGradeColor = (score) => {
    if (score >= 90) return "#4CAF50";
    if (score >= 75) return "#FF6B6B";
    if (score >= 60) return "#FFD93D";
    return "#888";
  };

  const getScoreBar = (score) => {
    const color = getGradeColor(score);
    return (
      <div style={{ background: "var(--surface)", borderRadius: 6, height: 8, overflow: "hidden", marginTop: 4 }}>
        <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 6, transition: "width 1s ease" }} />
      </div>
    );
  };

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
          ✨ Glow Score Tracker
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          Track your weekly beauty & fitness progress
        </div>
      </div>

      {/* Latest Score Card */}
      {latest ? (
        <div style={{
          background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
          borderRadius: 24, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.1 }}>✨</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
            THIS WEEK'S GLOW SCORE
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 8 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              {latest.overallScore}
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "#fff", fontWeight: 700 }}>
                {latest.grade || "B+"}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                {trend > 0 ? `▲ +${trend}` : trend < 0 ? `▼ ${trend}` : "→ Stable"} from last week
              </div>
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
            {latest.title || "Keep Glowing!"}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
            {latest.insight}
          </div>

          {/* Badges */}
          {latest.badges && latest.badges.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {latest.badges.map((badge, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "4px 10px", fontFamily: "var(--font-body)", fontSize: 12, color: "#fff" }}>
                  {BADGES[badge] || "🏅"} {badge}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 24, marginBottom: 16, textAlign: "center", border: "2px dashed var(--border)" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", fontWeight: 700 }}>No scores yet!</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Log your first weekly glow score</div>
        </div>
      )}

      {/* Score Breakdown */}
      {latest && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 16, border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>📊 This Week's Breakdown</div>
          {[
            { label: "💅 Skin", score: latest.skinScore, feedback: latest.skinFeedback },
            { label: "💪 Fitness", score: latest.fitnessScore, feedback: latest.fitnessFeedback },
            { label: "👗 Fashion", score: latest.fashionScore, feedback: latest.fashionFeedback },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, color: getGradeColor(item.score) }}>{item.score}</div>
              </div>
              {getScoreBar(item.score)}
              {item.feedback && <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.feedback}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Focus & Win */}
      {latest && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)", borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🏆</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#4CAF50", fontWeight: 700, marginBottom: 4 }}>TOP WIN</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{latest.topWin}</div>
          </div>
          <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 16, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🎯</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>FOCUS NEXT</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)", lineHeight: 1.4 }}>{latest.focusNext}</div>
          </div>
        </div>
      )}

      {/* History Chart */}
      {scores.length > 1 && (
        <div style={{ background: "var(--card)", borderRadius: 20, padding: 20, marginBottom: 16, border: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>📈 Progress History</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {scores.slice(0, 8).reverse().map((s, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", background: `linear-gradient(to top, #FF6B6B, #845EF7)`,
                  borderRadius: "4px 4px 0 0", height: `${s.overallScore * 0.8}%`,
                  minHeight: 8, opacity: i === scores.slice(0, 8).length - 1 ? 1 : 0.6,
                }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--muted)" }}>W{s.week}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      {latest?.motivationalQuote && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid var(--border)", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>💫</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text)", fontStyle: "italic", lineHeight: 1.5 }}>
            "{latest.motivationalQuote}"
          </div>
        </div>
      )}

      {/* Log Score Button */}
      <button onClick={() => setShowForm(true)} style={{
        width: "100%", padding: 16, border: "none", borderRadius: 16,
        background: "linear-gradient(135deg, #FF6B6B, #845EF7)",
        color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700,
        fontSize: 15, cursor: "pointer", marginBottom: 12,
      }}>
        ✨ Log This Week's Score
      </button>

      {/* Score Form Modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "flex-end", padding: 0 }}>
          <div style={{ background: "var(--card)", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
              📝 Log Weekly Scores
            </div>

            {[
              { key: "skinScore", label: "💅 Skin Score", emoji: "💅" },
              { key: "fitnessScore", label: "💪 Fitness Score", emoji: "💪" },
              { key: "fashionScore", label: "👗 Fashion Score", emoji: "👗" },
            ].map(item => (
              <div key={item.key} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{item.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: getGradeColor(form[item.key]) }}>{form[item.key]}</div>
                </div>
                <input
                  type="range" min="0" max="100" value={form[item.key]}
                  onChange={e => setForm(prev => ({ ...prev, [item.key]: parseInt(e.target.value) }))}
                  style={{ width: "100%", accentColor: "#FF6B6B" }}
                />
                {getScoreBar(form[item.key])}
              </div>
            ))}

            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any notes about this week? (optional)"
              style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none", resize: "none", height: 80, boxSizing: "border-box", marginBottom: 16 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 14, border: "1px solid var(--border)", borderRadius: 14, background: "var(--surface)", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={saveScore} disabled={saving} style={{ flex: 2, padding: 14, border: "none", borderRadius: 14, background: "linear-gradient(135deg, #FF6B6B, #845EF7)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, cursor: "pointer" }}>
                {saving ? "Saving..." : "✨ Get AI Insight"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {result && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--card)", borderRadius: 24, padding: 24, width: "100%", maxWidth: 360, border: "1px solid var(--border)", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 56, fontFamily: "var(--font-display)", fontWeight: 700, background: "linear-gradient(135deg, #FF6B6B, #845EF7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {result.overallScore}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{result.title}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>{result.insight}</div>
            </div>

            {result.badges && result.badges.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
                {result.badges.map((badge, i) => (
                  <div key={i} style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B6B)", borderRadius: 20, padding: "6px 14px", fontFamily: "var(--font-body)", fontSize: 12, color: "#fff", fontWeight: 700 }}>
                    {BADGES[badge] || "🏅"} {badge}
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: "var(--surface)", borderRadius: 14, padding: 14, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, color: "var(--text)", fontStyle: "italic" }}>
                "{result.motivationalQuote}"
              </div>
            </div>

            <button onClick={() => setResult(null)} style={{ width: "100%", padding: 14, border: "none", borderRadius: 14, background: "linear-gradient(135deg, #FF6B6B, #845EF7)", color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, cursor: "pointer" }}>
              🚀 Keep Glowing!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}