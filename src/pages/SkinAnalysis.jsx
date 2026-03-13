import { useState, useRef } from "react";
import { skinAPI } from "../utils/api";
import { GlowButton, SectionTitle, Card, LoadingDots, ErrorMessage } from "../components/UI";

const SKIN_TIPS = {
  oily: ["Use oil-free moisturizer", "Wash face 2x daily", "Use salicylic acid cleanser"],
  dry: ["Use heavy moisturizer", "Avoid hot showers", "Use hyaluronic acid serum"],
  combination: ["Use gentle cleanser", "Moisturize dry areas only", "Use clay mask weekly"],
  normal: ["Maintain current routine", "Use SPF daily", "Stay hydrated"],
};

export default function SkinAnalysis() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImage(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await skinAPI.analyze({ imageBase64: image });
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Skin analysis failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <SectionTitle icon="🧴" title="Skin Analysis" subtitle="AI-powered skincare recommendations" />

      <div onClick={() => fileRef.current.click()} style={{ background: "var(--card)", border: "2px dashed var(--border)", borderRadius: 20, padding: 24, textAlign: "center", cursor: "pointer", marginBottom: 16, position: "relative", overflow: "hidden" }}>
        {preview ? (
          <img src={preview} alt="skin" style={{ width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 14 }} />
        ) : (
          <div>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🤳</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)" }}>Upload a clear face photo</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Good lighting = better analysis</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
      </div>

      <ErrorMessage message={error} />
      <GlowButton onClick={analyze} disabled={!image} gradient="linear-gradient(135deg, #FF6B6B, #845EF7)">
        🔍 Analyze My Skin
      </GlowButton>

      {loading && <Card style={{ marginTop: 16, textAlign: "center" }}><div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>Analyzing your skin...</div><LoadingDots /></Card>}

      {result && (
        <div style={{ marginTop: 16 }}>
          {/* Skin Score */}
          <div style={{ background: "linear-gradient(135deg, rgba(132,94,247,0.15), rgba(255,107,107,0.15))", border: "1px solid rgba(132,94,247,0.3)", borderRadius: 20, padding: 20, marginBottom: 12, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>Skin Health Score</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 56, fontWeight: 700, background: "linear-gradient(135deg, #845EF7, #FF6B6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{result.score || 78}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>out of 100</div>
          </div>

          {/* Skin Type & Tone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Card>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Skin Type</div>
              <div style={{ fontSize: 28 }}>💧</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginTop: 4, textTransform: "capitalize" }}>{result.skinType || "Normal"}</div>
            </Card>
            <Card>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Skin Tone</div>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: result.skinToneHex || "#C68642", border: "2px solid var(--border)", marginBottom: 4 }} />
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>{result.skinTone || "Medium"}</div>
            </Card>
          </div>

          {/* Concerns */}
          {result.concerns?.length > 0 && (
            <Card style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>⚠️ Skin Concerns</div>
              {result.concerns.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < result.concerns.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)" }}>{c}</span>
                </div>
              ))}
            </Card>
          )}

          {/* Routine */}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🌅 Morning Routine</div>
            {result.morningRoutine?.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < result.morningRoutine.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,107,107,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)" }}>{step}</span>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🌙 Night Routine</div>
            {result.nightRoutine?.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < result.nightRoutine.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(132,94,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "#845EF7", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)" }}>{step}</span>
              </div>
            ))}
          </Card>

          {/* Products */}
          <Card>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🛍️ Recommended Products</div>
            {result.products?.map((p, i) => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{p.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.reason}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent3)", marginTop: 4 }}>{p.price}</div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}