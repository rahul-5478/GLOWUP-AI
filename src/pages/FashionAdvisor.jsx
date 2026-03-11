import { useState } from "react";
import { fashionAPI } from "../utils/api";
import { GlowButton, SectionTitle, Card, LoadingDots, ImageUploader, ResultCard, ErrorMessage } from "../components/UI";
import { useLang } from "../hooks/useLanguage";

const OUTFIT_IMAGES = {
  casual: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80",
  office: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  party: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&q=80",
  wedding: "https://images.unsplash.com/photo-1594938298603-c8148c4b4a11?w=300&q=80",
  gym: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=300&q=80",
  date: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80",
  default: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80",
};

export default function FashionAdvisor() {
  const { t } = useLang();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [mediaType, setMediaType] = useState("image/jpeg");
  const [occasion, setOccasion] = useState("casual");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const occasions = [
    { id: "casual", icon: "👟", label: t.casual },
    { id: "office", icon: "💼", label: t.office },
    { id: "party", icon: "🎉", label: t.party },
    { id: "wedding", icon: "💍", label: t.wedding },
    { id: "gym", icon: "🏋️", label: t.gym },
    { id: "date", icon: "🌹", label: t.date },
  ];

  const handleUpload = (preview, base64, mime) => {
    setImagePreview(preview); setImageBase64(base64); setMediaType(mime);
    setResult(null); setError("");
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fashionAPI.analyze(imageBase64, occasion, mediaType);
      setResult(res.data.result);
    } catch (err) {
      setError(err.response?.data?.error || "Fashion analysis failed. Try a clearer full-body photo.");
    }
    setLoading(false);
  };

  const accentColors = ["var(--accent)", "var(--accent4)", "var(--accent3)"];

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <SectionTitle icon="👗" title={t.fashionTitle} subtitle={t.fashionSubtitle} />
      <ImageUploader label={t.uploadBody} preview={imagePreview} onUpload={handleUpload} icon="🧍" />

      {/* Occasion */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>{t.occasion}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {occasions.map(o => (
            <div key={o.id} onClick={() => setOccasion(o.id)} style={{
              background: occasion === o.id ? "rgba(255,107,107,0.15)" : "var(--card)",
              border: `1.5px solid ${occasion === o.id ? "var(--accent)" : "var(--border)"}`,
              borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
            }}>
              <img src={OUTFIT_IMAGES[o.id]} alt={o.label} style={{ width: "100%", height: 60, objectFit: "cover", opacity: occasion === o.id ? 1 : 0.6 }}
                onError={e => { e.target.src = OUTFIT_IMAGES.default; }} />
              <div style={{ padding: "6px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 16 }}>{o.icon}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600, color: occasion === o.id ? "var(--accent)" : "var(--muted)" }}>{o.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {imagePreview && (
        <GlowButton onClick={analyze} style={{ marginTop: 16 }} gradient="var(--grad2)">{t.styleBtn}</GlowButton>
      )}

      {loading && (
        <Card style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>{t.styling}</div>
          <LoadingDots />
        </Card>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          {/* Body Profile */}
          <div style={{ background: "linear-gradient(135deg,rgba(132,94,247,0.2),rgba(77,150,255,0.1))", borderRadius: 18, padding: 18, border: "1px solid rgba(132,94,247,0.3)", marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", fontWeight: 700 }}>{result.bodyShape} Body Shape</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", margin: "8px 0 0", lineHeight: 1.6 }}>{result.bodyShapeDetails}</p>
          </div>

          {/* Outfit Cards with Images */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 12, fontWeight: 700 }}>✨ {t.perfectOutfits}</div>
            {result.outfitRecommendations?.map((o, i) => {
              const outfitImg = OUTFIT_IMAGES[occasion] || OUTFIT_IMAGES.default;
              return (
                <div key={i} style={{
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 16, overflow: "hidden", marginBottom: 10,
                  borderLeft: `3px solid ${accentColors[i] || "var(--accent)"}`,
                }}>
                  <img src={outfitImg} alt={o.outfit} style={{ width: "100%", height: 120, objectFit: "cover", opacity: 0.85 }}
                    onError={e => { e.target.src = OUTFIT_IMAGES.default; }} />
                  <div style={{ padding: 14 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--text)", fontWeight: 700, marginBottom: 4 }}>{o.outfit}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{o.description}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: accentColors[i] || "var(--accent)" }}>✓ {o.why}</div>
                    {o.priceRange && (
                      <div style={{ display: "inline-block", marginTop: 8, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "4px 10px", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)" }}>
                        💰 {o.priceRange}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Palette */}
          <Card style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--text)", marginBottom: 12, fontWeight: 700 }}>🎨 {t.colorPalette}</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {result.colorPalette?.map((c, i) => {
                const hex = c.match(/#[0-9A-Fa-f]{6}/)?.[0] || "#888888";
                const name = c.replace(/#[0-9A-Fa-f]{6}\s*[-–]?\s*/i, "").trim();
                return (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: hex, border: "2px solid var(--border)", marginBottom: 4, boxShadow: `0 4px 12px ${hex}40` }} />
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", maxWidth: 52, wordBreak: "break-word", lineHeight: 1.3 }}>{name}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <ResultCard title={t.accessories} items={result.accessories} gradient="var(--grad4)" icon="💎" />
          <ResultCard title={t.brands} items={result.brands} gradient="var(--grad2)" icon="🛍️" />

          {result.styleTip && (
            <div style={{ background: "rgba(255,217,61,0.1)", border: "1px solid rgba(255,217,61,0.3)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--accent2)", marginBottom: 6, fontWeight: 700 }}>⭐ Style Guru Tip</div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text)", margin: 0, lineHeight: 1.6 }}>{result.styleTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
