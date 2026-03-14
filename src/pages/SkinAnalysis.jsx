import { useState } from "react";
import { skinAPI } from "../utils/api";

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
const CONCERNS = ["Acne", "Dark Spots", "Pigmentation", "Dullness", "Dark Circles", "Oiliness", "Dryness", "Wrinkles", "Pores", "Uneven Tone"];
const LIFESTYLES = ["Outdoor (lots of sun)", "Indoor (AC office)", "Active (sports)", "Stress (long hours)", "Normal"];

export default function SkinAnalysis() {
  const [skinType, setSkinType] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [lifestyle, setLifestyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const toggleConcern = (concern) => {
    setSelectedConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const analyze = async () => {
    if (!skinType) return setError("Please select your skin type!");
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await skinAPI.analyze({
        skinType,
        skinConcerns: selectedConcerns.join(", "),
        age,
        gender,
        lifestyle,
        imageBase64: "text-analysis", // Backend ko satisfy karne ke liye
      });
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>
          💅 Skin Analysis
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          AI-powered personalized skincare routine
        </div>
      </div>

      {!result ? (
        <div>
          {/* Gender */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>👤 Gender</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["male", "female"].map(g => (
                <div key={g} onClick={() => setGender(g)} style={{
                  flex: 1, padding: "12px", textAlign: "center", borderRadius: 14,
                  background: gender === g ? "var(--grad1)" : "var(--card)",
                  border: `1.5px solid ${gender === g ? "transparent" : "var(--border)"}`,
                  fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600,
                  color: gender === g ? "#fff" : "var(--text)", cursor: "pointer",
                }}>
                  {g === "male" ? "👨 Male" : "👩 Female"}
                </div>
              ))}
            </div>
          </div>

          {/* Age */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>🎂 Age</div>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Enter your age"
              style={{ width: "100%", padding: "12px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Skin Type */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>🧴 Skin Type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SKIN_TYPES.map(type => (
                <div key={type} onClick={() => setSkinType(type)} style={{
                  padding: "8px 16px", borderRadius: 20,
                  background: skinType === type ? "var(--grad1)" : "var(--card)",
                  border: `1.5px solid ${skinType === type ? "transparent" : "var(--border)"}`,
                  fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                  color: skinType === type ? "#fff" : "var(--text)", cursor: "pointer",
                }}>
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Concerns */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>⚠️ Skin Concerns (select all that apply)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CONCERNS.map(concern => (
                <div key={concern} onClick={() => toggleConcern(concern)} style={{
                  padding: "8px 14px", borderRadius: 20,
                  background: selectedConcerns.includes(concern) ? "rgba(255,107,107,0.15)" : "var(--card)",
                  border: `1.5px solid ${selectedConcerns.includes(concern) ? "var(--accent)" : "var(--border)"}`,
                  fontFamily: "var(--font-body)", fontSize: 12,
                  color: selectedConcerns.includes(concern) ? "var(--accent)" : "var(--muted)",
                  cursor: "pointer",
                }}>
                  {concern}
                </div>
              ))}
            </div>
          </div>

          {/* Lifestyle */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>🌞 Lifestyle</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LIFESTYLES.map(l => (
                <div key={l} onClick={() => setLifestyle(l)} style={{
                  padding: "12px 16px", borderRadius: 14,
                  background: lifestyle === l ? "rgba(255,107,107,0.1)" : "var(--card)",
                  border: `1.5px solid ${lifestyle === l ? "var(--accent)" : "var(--border)"}`,
                  fontFamily: "var(--font-body)", fontSize: 13,
                  color: lifestyle === l ? "var(--accent)" : "var(--text)", cursor: "pointer",
                }}>
                  {l}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontFamily: "var(--font-body)", fontSize: 13, color: "var(--accent)" }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading || !skinType} style={{
            width: "100%", padding: "16px", border: "none", borderRadius: 16,
            background: skinType ? "var(--grad1)" : "var(--surface)",
            color: skinType ? "#fff" : "var(--muted)",
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15,
            cursor: skinType ? "pointer" : "default",
          }}>
            {loading ? "🔍 Analyzing your skin..." : "💅 Analyze My Skin"}
          </button>
        </div>
      ) : (
        <div>
          {/* Score Card */}
          <div style={{ background: "linear-gradient(135deg, var(--card), var(--surface))", borderRadius: 20, padding: 20, border: "1px solid var(--border)", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 700, background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {result.score}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>Skin Health Score</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 10 }}>
              <div style={{ background: "var(--surface)", borderRadius: 10, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)" }}>
                {result.skinType} skin
              </div>
              <div style={{ background: result.skinToneHex || "#C68642", borderRadius: 10, padding: "6px 12px", fontFamily: "var(--font-body)", fontSize: 12, color: "#fff" }}>
                {result.skinTone} tone
              </div>
            </div>
          </div>

          {/* Concerns */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>⚠️ Detected Concerns</div>
            {result.concerns?.map((c, i) => (
              <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", padding: "4px 0" }}>• {c}</div>
            ))}
          </div>

          {/* Morning Routine */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>☀️ Morning Routine</div>
            {result.morningRoutine?.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>

          {/* Night Routine */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>🌙 Night Routine</div>
            {result.nightRoutine?.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--grad3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{step}</div>
              </div>
            ))}
          </div>

          {/* Products */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>🛍️ Recommended Products</div>
            {result.products?.map((p, i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: 12, padding: "10px 12px", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.reason}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </div>

          {/* Diet Tips */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>🥗 Diet Tips</div>
            {result.dietTips?.map((tip, i) => (
              <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", padding: "4px 0" }}>• {tip}</div>
            ))}
          </div>

          {/* Lifestyle */}
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 16 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>✨ Lifestyle Tips</div>
            {result.lifestyle?.map((tip, i) => (
              <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", padding: "4px 0" }}>• {tip}</div>
            ))}
          </div>

          <button onClick={() => { setResult(null); setSelectedConcerns([]); setSkinType(""); }} style={{
            width: "100%", padding: 14, border: "none", borderRadius: 14,
            background: "var(--surface)", color: "var(--muted)",
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, cursor: "pointer",
          }}>
            🔄 Analyze Again
          </button>
        </div>
      )}
    </div>
  );
}