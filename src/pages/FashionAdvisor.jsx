import { useState } from "react";
import { useCapacitorCamera } from "../hooks/useCapacitorCamera";
import { fashionAPI } from "../utils/api";

const OCCASIONS = ["Casual", "Work/Office", "Party", "Wedding", "Date Night", "Gym", "Festival", "Formal"];
const UPLOAD_MODES = [
  { id: "outfit", icon: "👗", label: "Outfit Photo", sub: "Upload your outfit" },
  { id: "selfie", icon: "🤳", label: "Selfie", sub: "Face-based style match" },
];

export default function FashionAdvisor() {
  const { getPhoto } = useCapacitorCamera();
  const [occasion, setOccasion] = useState("");
  const [uploadMode, setUploadMode] = useState("outfit");
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCapture = async (source) => {
    setError("");
    const { base64, dataUrl, error: err } = await getPhoto(source);
    if (err || !base64) return;
    setImageBase64(base64);
    setImagePreview(dataUrl);
  };

  const removeImage = () => {
    setImageBase64(null);
    setImagePreview(null);
  };

  const handleModeChange = (mode) => {
    setUploadMode(mode);
    removeImage();
    setError("");
  };

  const analyze = async () => {
  if (!occasion) return setError("Please select an occasion!");
  // Image optional rakho — sirf occasion required
  setLoading(true);
  setError("");
  setResult(null);
  try {
    const body = { occasion, uploadMode, mediaType: "image/jpeg" };
    // Only add image if it's a valid string
    if (imageBase64 && typeof imageBase64 === "string" && imageBase64.length > 100) {
      body.imageBase64 = imageBase64;
    }
    const res = await fashionAPI.analyze(body);
    setResult(res.data.result);
    const prev = parseInt(localStorage.getItem("glowup_fashion_count") || "0");
    localStorage.setItem("glowup_fashion_count", prev + 1);
  } catch (err) {
    setError(err.response?.data?.error || "Something went wrong. Try again!");
  }
  setLoading(false);
};

  const reset = () => {
    setResult(null);
    setOccasion("");
    setUploadMode("outfit");
    removeImage();
    setError("");
  };

  const canAnalyze = occasion && !loading;

  return (
    <div style={{ padding: "0 16px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)" }}>
          👗 Fashion{" "}
          <span style={{ background: "linear-gradient(135deg,#845EF7,#FF6B9D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Advisor
          </span>
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          AI-powered outfit recommendations
        </div>
      </div>

      {/* Upload Mode Selector */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
          📸 Choose Analysis Type
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {UPLOAD_MODES.map((m) => (
            <div key={m.id} onClick={() => handleModeChange(m.id)}
              style={{
                flex: 1, padding: "12px 8px", borderRadius: 16, cursor: "pointer", textAlign: "center",
                background: uploadMode === m.id ? "rgba(132,94,247,0.12)" : "var(--surface)",
                border: `1.5px solid ${uploadMode === m.id ? "#845EF7" : "var(--border)"}`,
                transition: "all 0.2s",
                transform: uploadMode === m.id ? "scale(1.03)" : "scale(1)",
              }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: uploadMode === m.id ? "#845EF7" : "var(--text)" }}>
                {m.label}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload Area */}
      <div style={{ marginBottom: 16 }}>
        {!imagePreview ? (
          <div style={{ background: "var(--card)", borderRadius: 20, border: "2px dashed var(--border)", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>{uploadMode === "outfit" ? "👗" : "🤳"}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
              {uploadMode === "outfit" ? "Upload Your Outfit" : "Upload Your Selfie"}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              {uploadMode === "outfit"
                ? "AI will analyze your outfit and suggest improvements"
                : "AI will match styles to your face shape & skin tone"}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={() => handleCapture("gallery")}
                style={{ padding: "10px 20px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                🖼️ Gallery
              </button>
              <button onClick={() => handleCapture("camera")}
                style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#845EF7,#FF6B9D)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(132,94,247,0.4)" }}>
                📷 Camera
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
            <img src={imagePreview} alt="uploaded"
              style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6))" }} />
            <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {uploadMode === "outfit" ? "👗 Outfit ready!" : "🤳 Selfie ready!"}
              </div>
              <button onClick={removeImage}
                style={{ padding: "6px 14px", borderRadius: 20, border: "1.5px solid rgba(255,255,255,0.4)", background: "rgba(0,0,0,0.4)", color: "#fff", fontFamily: "var(--font-body)", fontSize: 12, cursor: "pointer" }}>
                ✕ Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Occasion Selector */}
      <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>
          🎯 Select Occasion
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {OCCASIONS.map((o) => (
            <div key={o} onClick={() => { setOccasion(o); setError(""); }}
              style={{
                padding: "9px 16px", borderRadius: 20, cursor: "pointer",
                background: occasion === o ? "rgba(132,94,247,0.15)" : "var(--surface)",
                color: occasion === o ? "#845EF7" : "var(--muted)",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${occasion === o ? "#845EF7" : "var(--border)"}`,
                transition: "all 0.2s",
                transform: occasion === o ? "scale(1.03)" : "scale(1)",
              }}>
              {o}
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 14, padding: 12, marginBottom: 14, fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6B6B" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Analyze Button */}
      <button onClick={analyze} disabled={!canAnalyze}
        style={{
          width: "100%", padding: "16px", border: "none", borderRadius: 16,
          cursor: canAnalyze ? "pointer" : "not-allowed",
          background: canAnalyze ? "linear-gradient(135deg, #845EF7, #FF6B9D)" : "var(--surface)",
          color: "#fff", fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700,
          boxShadow: canAnalyze ? "0 8px 24px rgba(132,94,247,0.4)" : "none",
          transition: "all 0.2s", marginBottom: 20,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: canAnalyze ? 1 : 0.5,
        }}>
        {loading ? (
          <>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.75s linear infinite" }} />
            Analyzing your style...
          </>
        ) : (
          uploadMode === "outfit" ? "👗 Analyze My Outfit" : "🤳 Match Style To My Face"
        )}
      </button>

      {/* Results */}
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Badge */}
          <div style={{ background: "linear-gradient(135deg, rgba(132,94,247,0.1), rgba(255,107,157,0.1))", borderRadius: 14, padding: "10px 16px", border: "1px solid rgba(132,94,247,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>{uploadMode === "outfit" ? "👗" : "🤳"}</span>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#845EF7", fontWeight: 700 }}>
              {uploadMode === "outfit" ? "Outfit Analysis Complete" : "Face-Based Style Match Complete"} — {occasion}
            </div>
          </div>

          {/* Outfit Review */}
          {uploadMode === "outfit" && result.outfitAnalysis && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Outfit Review</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{result.outfitAnalysis}</div>
              {result.outfitScore && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>Style Score:</div>
                  <div style={{ flex: 1, height: 6, borderRadius: 6, background: "var(--surface)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${result.outfitScore * 10}%`, background: "linear-gradient(90deg,#845EF7,#FF6B9D)", borderRadius: 6 }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#845EF7" }}>{result.outfitScore}/10</div>
                </div>
              )}
            </div>
          )}

          {/* Face Analysis */}
          {uploadMode === "selfie" && result.faceAnalysis && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Face & Skin Analysis</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{result.faceAnalysis}</div>
            </div>
          )}

          {/* Body Shape */}
          {result.bodyShape && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" }}>Body Shape</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text)", textTransform: "capitalize", marginBottom: 6 }}>📐 {result.bodyShape}</div>
              {result.bodyShapeDetails && (
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{result.bodyShapeDetails}</div>
              )}
            </div>
          )}

          {/* Outfit Recommendations */}
          {result.outfitRecommendations?.map((outfit, i) => (
            <div key={i} style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 14, right: 14, padding: "4px 12px", borderRadius: 20,
                background: i === 0 ? "rgba(81,207,102,0.15)" : i === 1 ? "rgba(255,217,61,0.15)" : "rgba(132,94,247,0.15)",
                fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700,
                color: i === 0 ? "#51CF66" : i === 1 ? "#FFD93D" : "#845EF7",
                border: `1px solid ${i === 0 ? "rgba(81,207,102,0.3)" : i === 1 ? "rgba(255,217,61,0.3)" : "rgba(132,94,247,0.3)"}`,
              }}>
                {outfit.priceRange === "budget" ? "💚 Budget" : outfit.priceRange === "mid" ? "💛 Mid" : "💜 Premium"}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 8, paddingRight: 80 }}>
                👔 {outfit.outfit}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 8, lineHeight: 1.5 }}>{outfit.description}</div>
              {outfit.why && (
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#845EF7", fontStyle: "italic", marginBottom: 10 }}>💡 {outfit.why}</div>
              )}
              {outfit.items?.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {outfit.items.map((item, j) => (
                    <div key={j} style={{ padding: "5px 12px", borderRadius: 20, background: "var(--surface)", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text)", border: "1px solid var(--border)" }}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Color Palette */}
          {result.colorPalette?.length > 0 && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14 }}>🎨 Your Color Palette</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {result.colorPalette.map((color, i) => {
                  const hex = color.match(/#[0-9A-Fa-f]{6}/)?.[0] || "#888";
                  const name = color.replace(/#[0-9A-Fa-f]{6}\s*[-–]?\s*/, "").trim();
                  return (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: hex, border: "2px solid var(--border)", boxShadow: `0 4px 12px ${hex}40` }} />
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", textAlign: "center", maxWidth: 56 }}>{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Accessories */}
          {result.accessories?.length > 0 && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>💍 Accessories</div>
              {result.accessories.map((acc, i) => (
                <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 6, display: "flex", gap: 8 }}>
                  <span style={{ color: "#845EF7" }}>•</span> {acc}
                </div>
              ))}
            </div>
          )}

          {/* Brands */}
          {result.brands?.length > 0 && (
            <div style={{ background: "var(--card)", borderRadius: 20, padding: 18, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>🛍️ Recommended Brands</div>
              {result.brands.map((brand, i) => (
                <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 6, display: "flex", gap: 8 }}>
                  <span style={{ color: "#FFD93D" }}>•</span> {brand}
                </div>
              ))}
            </div>
          )}

          {/* Style Tip */}
          {result.styleTip && (
            <div style={{ background: "linear-gradient(135deg, rgba(132,94,247,0.1), rgba(255,107,157,0.1))", borderRadius: 20, padding: 18, border: "1px solid rgba(132,94,247,0.2)" }}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#845EF7", marginBottom: 8, letterSpacing: 1 }}>✨ PRO STYLE TIP</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{result.styleTip}</div>
            </div>
          )}

          {/* Try Again */}
          <button onClick={reset}
            style={{ width: "100%", padding: "13px", border: "1px solid var(--border)", borderRadius: 14, background: "transparent", color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: 13, cursor: "pointer" }}>
            🔄 Try Another Look
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}