import { useState } from "react";
import { fashionAPI } from "../utils/api";

export default function FashionAdvisor() {
  const [occasion, setOccasion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const occasions = ["Casual","Work/Office","Party","Wedding","Date Night","Gym","Festival","Formal"];
  const analyze = async () => {
    if (!occasion) return setError("Please select an occasion!");
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fashionAPI.analyze(null, occasion);
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally { setLoading(false); }
  };
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>👗 Fashion Advisor</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>AI-powered outfit recommendations</div>
      </div>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Select Occasion</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {occasions.map((o) => (
            <div key={o} onClick={() => setOccasion(o)} style={{ padding: "8px 14px", borderRadius: 20, cursor: "pointer", background: occasion === o ? "var(--accent)" : "var(--surface)", color: occasion === o ? "#fff" : "var(--muted)", fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, border: occasion === o ? "none" : "1px solid var(--border)" }}>{o}</div>
          ))}
        </div>
      </div>
      <button onClick={analyze} disabled={loading || !occasion} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", background: loading ? "var(--surface)" : "linear-gradient(135deg, #FF6B6B, #845EF7)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
        {loading ? "Analyzing..." : "Get AI Fashion Advice"}
      </button>
      {error && <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, padding: 12, marginBottom: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6B6B" }}>{error}</div>}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>Body Shape</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{result.bodyShape}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{result.bodyShapeDetails}</div>
          </div>
          {result.outfitRecommendations?.map((outfit, i) => (
            <div key={i} style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{outfit.outfit}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{outfit.description}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent)", marginBottom: 8 }}>{outfit.why}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {outfit.items?.map((item, j) => (
                  <div key={j} style={{ padding: "4px 10px", borderRadius: 10, background: "var(--surface)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text)", border: "1px solid var(--border)" }}>{item}</div>
                ))}
              </div>
            </div>
          ))}
          {result.styleTip && (
            <div style={{ background: "linear-gradient(135deg, rgba(255,107,107,0.1), rgba(132,94,247,0.1))", borderRadius: 16, padding: 16, border: "1px solid rgba(255,107,107,0.2)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--accent)", marginBottom: 6 }}>Pro Style Tip</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)" }}>{result.styleTip}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}