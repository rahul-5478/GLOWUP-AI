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
    <div style={{
      position: "fixed", top: 20, right: 16, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none"
    }}>
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          <span style={{ fontSize: 20 }}>{toast.icon}</span>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
              {toast.title}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 1 }}>
              {toast.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = [
  { icon: "🏠", label: "Home" },
  { icon: "✨", label: "Face" },
  { icon: "💪", label: "Fitness" },
  { icon: "👗", label: "Fashion" },
  { icon: "🧴", label: "Skin" },
  { icon: "💅", label: "Chat" },
  { icon: "👚", label: "Wardrobe" },
  { icon: "⚙️", label: "Settings" },
];

function AppShell() {
  const [tab, setTab] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { toasts } = useNotifications();

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
    <div className="mesh-bg" style={{
      height: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      <ToastContainer toasts={toasts} />
      {showPlans && <SubscriptionPage onClose={() => setShowPlans(false)} />}
      {showPayment && <PaymentPage onClose={() => setShowPayment(false)} />}

      {/* ── Header ── */}
      <header className="app-header">
        <div>
          <div className="app-logo">
            Glow
            <span className="text-gradient-1">Up</span>
            <span className="text-gradient-2"> AI</span>
          </div>
          <div style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginTop: 2,
          }}>
            {t.appTagline || "Beauty · Fitness · Fashion"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="pro-badge" onClick={() => setShowPayment(true)}>
            👑 PRO
          </div>
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16 }} key={tab}>
        <div className="tab-content">
          {pages[tab]}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <nav style={{
        background: "rgba(8,8,16,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 4px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))",
        flexShrink: 0,
      }}>
        {TABS.map((item, i) => (
          <div
            key={i}
            className="bottom-nav-item"
            onClick={() => setTab(i)}
          >
            <div className={`bottom-nav-icon ${tab === i ? "active" : ""}`}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: 8,
              fontWeight: 700,
              color: tab === i ? "var(--accent)" : "var(--muted2)",
              letterSpacing: 0.5,
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  useTheme();

  if (loading) return (
    <div className="mesh-bg" style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 20,
    }}>
      {/* Animated logo */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          background: "var(--grad1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          animation: "glowPulse 2s ease-in-out infinite, float 3s ease-in-out infinite",
          boxShadow: "0 0 40px rgba(255,77,109,0.3)",
        }}>
          ✨
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: -0.5,
        }}>
          Glow<span className="text-gradient-1">Up</span>
          <span className="text-gradient-2"> AI</span>
        </div>
        <div style={{
          fontFamily: "var(--font-body)",
          color: "var(--muted)",
          fontSize: 12,
          marginTop: 6,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}>
          Loading your glow...
        </div>
      </div>

      {/* Loading dots */}
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (!user) return <AuthPage />;
  return <AppShell />;
}