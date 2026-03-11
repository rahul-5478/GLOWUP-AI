import { useState } from "react";

const plans = [
  {
    id: "free", name: "Free", price: "₹0", period: "forever", icon: "🌱",
    gradient: "linear-gradient(135deg, #555 0%, #333 100%)",
    features: ["✅ 3 Face Analyses / month","✅ 3 Fitness Plans / month","✅ 3 Fashion Analyses / month","✅ Basic recommendations","✅ Dark/Light mode","❌ PDF Download","❌ Progress Charts","❌ Indian Diet Plans","❌ Priority AI"],
    cta: "Current Plan", active: true,
  },
  {
    id: "pro", name: "Pro", price: "₹299", period: "per month", icon: "⚡",
    gradient: "linear-gradient(135deg, #4D96FF 0%, #845EF7 100%)", badge: "Popular",
    features: ["✅ Unlimited Face Analyses","✅ Unlimited Fitness Plans","✅ Unlimited Fashion Analyses","✅ Indian food diet plans","✅ Calorie count per meal","✅ PDF Download","✅ Progress Charts","✅ Shopping list","❌ Priority AI (faster)"],
    cta: "Upgrade to Pro", active: false,
  },
  {
    id: "premium", name: "Premium", price: "₹599", period: "per month", icon: "👑",
    gradient: "linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%)", badge: "Best Value",
    features: ["✅ Everything in Pro","✅ Priority AI (fastest)","✅ Recipes for each meal","✅ Weekly progress report","✅ Personal stylist chat","✅ Hairstyle preview images","✅ Skin analysis","✅ Wardrobe manager","✅ 24/7 AI support"],
    cta: "Upgrade to Premium", active: false,
  },
];

export default function SubscriptionPage({ onClose }) {
  const [selected, setSelected] = useState("free");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, overflowY: "auto", padding: "20px 16px 40px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#fff", fontWeight: 700 }}>
            ✨ GlowUp <span style={{ background: "linear-gradient(135deg, #FFD93D, #FF6B6B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plans</span>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>Choose your perfect plan</div>
        </div>
        <button onClick={onClose} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--muted)", fontSize: 20, width: 40, height: 40, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      </div>

      {/* Plan Cards */}
      {plans.map(plan => (
        <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
          background: "var(--card)",
          border: `2px solid ${selected === plan.id ? "#FF6B6B" : "var(--border)"}`,
          borderRadius: 20, marginBottom: 14, overflow: "hidden",
          transform: selected === plan.id ? "scale(1.01)" : "scale(1)",
          transition: "all 0.2s", cursor: "pointer",
          boxShadow: selected === plan.id ? "0 8px 30px rgba(255,107,107,0.25)" : "none",
        }}>
          {/* Plan Header */}
          <div style={{ background: plan.gradient, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{plan.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "#fff", fontWeight: 700 }}>{plan.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "#fff", fontWeight: 700 }}>
                  {plan.price} <span style={{ fontSize: 12, fontFamily: "var(--font-body)", opacity: 0.8 }}>{plan.period}</span>
                </div>
              </div>
            </div>
            {plan.badge && (
              <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 12px", fontFamily: "var(--font-body)", fontSize: 11, color: "#fff", fontWeight: 700 }}>
                {plan.badge}
              </div>
            )}
          </div>

          {/* Features */}
          <div style={{ padding: "16px 20px" }}>
            {plan.features.map((f, i) => (
              <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 13, color: f.startsWith("❌") ? "var(--muted)" : "var(--text)", padding: "4px 0", lineHeight: 1.5 }}>
                {f}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div style={{ padding: "0 16px 16px" }}>
            <button
              style={{
                width: "100%", padding: "12px", border: "none", borderRadius: 14,
                background: plan.active ? "var(--surface)" : plan.gradient,
                color: plan.active ? "var(--muted)" : "#fff",
                fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14,
                cursor: plan.active ? "default" : "pointer",
              }}
              onClick={e => {
                e.stopPropagation();
                if (!plan.active) {
                  setSelectedPlan(plan);
                  setShowPayment(true);
                }
              }}
            >
              {plan.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "var(--card)", borderRadius: 24, padding: 28, width: "100%", maxWidth: 360, border: "1px solid var(--border)" }}>
            
            {/* Modal Header */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{selectedPlan.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text)", fontWeight: 700 }}>
                {selectedPlan.name} Plan
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, marginTop: 4, background: selectedPlan.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {selectedPlan.price}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{selectedPlan.period}</div>
            </div>

            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)", marginBottom: 16, textAlign: "center" }}>
              Choose payment method
            </div>

            {/* Payment Options */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { icon: "📱", label: "GPay", color: "#4285F4" },
                { icon: "💜", label: "PhonePe", color: "#5F259F" },
                { icon: "🔵", label: "Paytm", color: "#002970" },
                { icon: "💳", label: "Card", color: "#FF6B6B" },
              ].map((p, i) => (
                <div key={i} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 12px", textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 26 }}>{p.icon}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 600, color: "var(--text)", marginTop: 6 }}>{p.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 16 }}>🔒</span>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
                Payment integration coming soon in next update!
              </div>
            </div>

            <button onClick={() => setShowPayment(false)} style={{
              width: "100%", padding: 14, border: "none", borderRadius: 14,
              background: "var(--surface)", color: "var(--muted)",
              fontFamily: "var(--font-body)", fontWeight: 600, cursor: "pointer", fontSize: 14,
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}