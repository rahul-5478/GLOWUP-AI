import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useLang } from "./hooks/useLanguage";
import { useNotifications } from "./hooks/useNotifications";
import Dashboard from "./pages/Dashboard";
import FaceAnalysis from "./pages/FaceAnalysis";
import FitnessCoach from "./pages/FitnessCoach";
import FashionAdvisor from "./pages/FashionAdvisor";
import SettingsPage from "./pages/SettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AuthPage from "./pages/AuthPage";
import SkinAnalysis from "./pages/SkinAnalysis";
import AIStyleChat from "./pages/AIStyleChat";
import WardrobeManager from "./pages/WardrobeManager";
import PaymentPage from "./pages/PaymentPage";

function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", animation: "slideIn 0.3s ease", display: "flex", alignItems: "center", gap: 10, maxWidth: 280 }}>
          <span style={{ fontSize: 20 }}>{toast.icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{toast.title}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{toast.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppShell() {
  const [tab, setTab] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { toasts } = useNotifications();

  const tabs = [
    { icon: "🏠", label: "Home" },
    { icon: "✨", label: "Face" },
    { icon: "💪", label: "Fitness" },
    { icon: "👗", label: "Fashion" },
    { icon: "🧴", label: "Skin" },
    { icon: "💅", label: "Chat" },
    { icon: "👚", label: "Wardrobe" },
    { icon: "⚙️", label: "Settings" },
  ];

  const pages = [
    <Dashboard setTab={setTab} />,
    <FaceAnalysis />,
    <FitnessCoach />,
    <FashionAdvisor />,
    <SkinAnalysis />,
    <AIStyleChat />,
    <WardrobeManager />,
    <SettingsPage />,
  ];

  return (
    <div style={{ background: "var(--bg)", height: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
      <ToastContainer toasts={toasts} />
      {showPlans && <SubscriptionPage onClose={() => setShowPlans(false)} />}
      {showPayment && <PaymentPage onClose={() => setShowPayment(false)} />}

      {/* Header */}
      <div style={{ padding: "16px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)", flexShrink: 0, paddingTop: "max(16px, env(safe-area-inset-top, 16px))" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text)", lineHeight: 1 }}>
            Glow<span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Up</span>
            <span style={{ background: "var(--grad2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> AI</span>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--muted)", letterSpacing: 0.5 }}>{t.appTagline}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div onClick={() => setShowPayment(true)} style={{ padding: "6px 12px", borderRadius: 20, cursor: "pointer", background: "linear-gradient(135deg, #FFD93D, #FF6B6B)", fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 700, color: "#fff", boxShadow: "0 3px 10px rgba(255,107,107,0.4)" }}>👑 Pro</div>
          <div onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16 }}>{pages[tab]}</div>

      {/* Bottom Nav */}
      <div style={{ background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 0 max(14px, env(safe-area-inset-bottom, 14px))", flexShrink: 0 }}>
        {tabs.map((t, i) => (
          <div key={i} onClick={() => setTab(i)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 6px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: tab === i ? "rgba(255,107,107,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "all 0.2s", border: tab === i ? "1.5px solid rgba(255,107,107,0.4)" : "1.5px solid transparent", transform: tab === i ? "scale(1.05)" : "scale(1)" }}>{t.icon}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 600, color: tab === i ? "var(--accent)" : "var(--muted)", letterSpacing: 0.3 }}>{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  useTheme();
  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✨</div>
      <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14 }}>Loading GlowUp AI...</div>
    </div>
  );
  if (!user) return <AuthPage />;
  return <AppShell />;
}