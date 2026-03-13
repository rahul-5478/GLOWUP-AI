import { useState } from "react";
import api from "../utils/api";

const PLANS = [
  { name: "Pro", price: 299, features: ["Unlimited AI Analysis", "Skin Analysis", "AI Style Chat", "Priority Support"], color: "#FF6B6B", icon: "⭐" },
  { name: "Premium", price: 599, features: ["Everything in Pro", "Wardrobe Manager", "Personal Style Coach", "Exclusive Trends"], color: "#845EF7", icon: "👑" },
];

export default function PaymentPage({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (plan) => {
    setLoading(true); setError(""); setSuccess("");
    try {
      const loaded = await loadRazorpay();
      if (!loaded) return setError("Razorpay load nahi hua. Internet check karo!");

      const { data } = await api.post("/payment/create-order", { amount: plan.price, plan: plan.name });

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "GlowUp AI",
        description: `${plan.name} Plan - ₹${plan.price}/month`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.name,
            });
            setSuccess(`🎉 ${plan.name} Plan activated! Welcome to GlowUp AI Premium!`);
          } catch {
            setError("Payment verification failed.");
          }
        },
        prefill: { name: "GlowUp User", email: "user@glowupai.com" },
        theme: { color: plan.color },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || "Payment failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ background: "var(--bg)", borderRadius: "28px 28px 0 0", padding: "28px 20px 48px", width: "100%", maxWidth: 430, maxHeight: "90vh", overflowY: "auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)" }}>👑 Upgrade Plan</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>Unlock all AI features</div>
          </div>
          <div onClick={onClose} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18 }}>✕</div>
        </div>

        {success && (
          <div style={{ background: "rgba(100,200,100,0.15)", border: "1px solid rgba(100,200,100,0.4)", borderRadius: 14, padding: 16, marginBottom: 16, fontFamily: "var(--font-body)", fontSize: 14, color: "#64C864", textAlign: "center" }}>{success}</div>
        )}
        {error && (
          <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 14, padding: 16, marginBottom: 16, fontFamily: "var(--font-body)", fontSize: 13, color: "#FF6B6B" }}>❌ {error}</div>
        )}

        {/* Plans */}
        {PLANS.map((plan) => (
          <div key={plan.name} style={{ background: "var(--card)", borderRadius: 20, padding: 20, border: `1.5px solid ${plan.color}40`, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{plan.icon} {plan.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 24, fontWeight: 700, color: plan.color, marginTop: 2 }}>₹{plan.price}<span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 400 }}>/month</span></div>
              </div>
            </div>
            {plan.features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: `${plan.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: plan.color, flexShrink: 0 }}>✓</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>{f}</div>
              </div>
            ))}
            <button onClick={() => handlePayment(plan)} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", cursor: loading ? "not-allowed" : "pointer", background: `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)`, color: "#fff", fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 700, marginTop: 14, boxShadow: `0 4px 20px ${plan.color}40` }}>
              {loading ? "Processing..." : `Get ${plan.name} - ₹${plan.price}`}
            </button>
          </div>
        ))}

        {/* Free plan note */}
        <div style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          🔒 Secure payment via Razorpay • Cancel anytime
        </div>
      </div>
    </div>
  );
}