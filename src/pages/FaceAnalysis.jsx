import { useState } from "react";
import { faceAPI } from "../utils/api";
import { GlowButton, SectionTitle, Card, LoadingDots, ImageUploader, ResultCard, ErrorMessage } from "../components/UI";
import { useLang } from "../hooks/useLanguage";

const HAIRSTYLE_IMAGES = {
  "layered": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80",
  "undercut": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80",
  "quiff": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=300&q=80",
  "fade": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&q=80",
  "bob": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  "pixie": "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=300&q=80",
  "side": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&q=80",
  "curly": "https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=300&q=80",
  "default": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80",
};

function getHairImage(style) {
  // Handle both string and object
  const styleName = typeof style === "object" && style !== null ? style.name : style;
  if (!styleName || typeof styleName !== "string") return HAIRSTYLE_IMAGES.default;
  const s = styleName.toLowerCase();
  for (const key of Object.keys(HAIRSTYLE_IMAGES)) {
    if (s.includes(key)) return HAIRSTYLE_IMAGES[key];
  }
  return HAIRSTYLE_IMAGES.default;
}

export default function FaceAnalysis() {
  const { t } = useLang();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = (preview, base64, mime) => {
    setImagePreview(preview); setImageBase64(base64); setMediaType(mime);
    setResult(null); setError("");
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await faceAPI.analyze(imageBase64, mediaType);
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Please try with a clearer selfie.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <SectionTitle icon="✨" title={t.faceTitle} subtitle={t.faceSubtitle} />
      <ImageUploader label={t.uploadSelfie} preview={imagePreview} onUpload={handleUpload} icon="🤳" />
      <ErrorMessage message={error} />
      {imagePreview && !loading && (
        <GlowButton onClick={analyze} style={{ marginTop: 14 }}>{t.analyzeBtn}</GlowButton>
      )}

      {loading && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>{t.analyzing}</div>
          <LoadingDots />
        </Card>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          {/* Face Profile */}
          <div style={{
            background: "linear-gradient(135deg, var(--card) 0%, var(--surface) 100%)",
            borderRadius: 20, padding: 20, border: "1px solid var(--border)", marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text)", fontWeight: 700 }}>{result.faceShape} Face</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {result.jawlineType} jawline · {result.skinTone} skin tone
                </div>
              </div>
              <div style={{ background: "var(--grad3)", borderRadius: 12, padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: 13, color: "#fff", fontWeight: 700 }}>
                {result.confidence}% match
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>{result.faceShapeDetails}</p>
          </div>

          {/* Hairstyle Cards with Images */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 12, fontWeight: 700 }}>💇 {t.bestHairstyles}</div>
            {result.topHairstyles?.map((style, i) => {
              // Handle both string and object format
              const styleName = typeof style === "object" && style !== null ? style.name : style;
              const styleReason = typeof style === "object" && style !== null ? style.reason : "";
              const styleMaintenance = typeof style === "object" && style !== null ? style.maintenance : "";
              const imgUrl = getHairImage(style);

              return (
                <div key={i} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 16, overflow: "hidden", marginBottom: 10,
                  display: "flex", alignItems: "stretch",
                }}>
                  <img src={imgUrl} alt="hairstyle" style={{ width: 90, objectFit: "cover", flexShrink: 0 }}
                    onError={e => { e.target.src = HAIRSTYLE_IMAGES.default; }} />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{styleName}</div>
                    {styleReason && <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{styleReason}</div>}
                    {styleMaintenance && <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--accent)", marginTop: 4 }}>Maintenance: {styleMaintenance}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Skincare Section */}
          {result.skincare && (
            <div style={{ background: "var(--card)", borderRadius: 16, padding: 16, border: "1px solid var(--border)", marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", fontWeight: 700, marginBottom: 10 }}>🧴 Skincare Routine</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--accent)", fontWeight: 700, marginBottom: 6 }}>☀️ Morning</div>
                {result.skincare.morningRoutine?.map((step, i) => (
                  <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", padding: "3px 0" }}>• {step}</div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", fontWeight: 700, marginBottom: 6 }}>🌙 Night</div>
                {result.skincare.nightRoutine?.map((step, i) => (
                  <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text)", padding: "3px 0" }}>• {step}</div>
                ))}
              </div>
            </div>
          )}

          <ResultCard title={t.colorRec} items={result.colorRecommendations} gradient="var(--grad2)" icon="🎨" />
          <ResultCard title={t.stylesAvoid} items={result.stylesAvoid} gradient="linear-gradient(135deg,#555,#333)" icon="⚠️" />
          <ResultCard title={t.groomingTips} items={result.grooming} gradient="var(--grad3)" icon="✂️" />
        </div>
      )}
    </div>
  );
}