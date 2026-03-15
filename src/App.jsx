import { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useLang } from "./hooks/useLanguage";
import { useNotifications } from "./hooks/useNotifications";
import { warmUpBackend } from "./utils/api";

// ── Lazy load pages ──
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FaceAnalysis = lazy(() => import("./pages/FaceAnalysis"));
const FitnessCoach = lazy(() => import("./pages/FitnessCoach"));
const FashionAdvisor = lazy(() => import("./pages/FashionAdvisor"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SkinAnalysis = lazy(() => import("./pages/SkinAnalysis"));
const AIStyleChat = lazy(() => import("./pages/AIStyleChat"));
const WardrobeManager = lazy(() => import("./pages/WardrobeManager"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const OnboardingFlow = lazy(() => import("./pages/OnboardingFlow"));

function ToastContainer({ toasts }) {
  if (!toasts?.length) return null;
  return (
    <div style={{
      position: "fixed", top: 20, right: 16, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none",
    }}>
      {toasts.map((toast) => (
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

const PageLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
    <div style={{ display: "flex", gap: 6 }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  </div>
);

function AppShell() {
  const [tab, setTab] = useState(0);
  const [showPlans, setShowPlans] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const { toasts } = useNotifications();
  const { user } = useAuth();

  // Show onboarding for new users
  useEffect(() => {
    const onboarded = localStorage.getItem("glowup_onboarded");
    if (!onboarded && user) {
      const timer = setTimeout(() => setShowOnboarding(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // ── Android Back Button Handler ──
  useEffect(() => {
    let backHandler = null;
    const setupBackButton = async () => {
      try {
        const { App: CapApp } = await import("@capacitor/app");
        backHandler = await CapApp.addListener("backButton", () => {
          if (showPayment) { setShowPayment(false); return; }
          if (showPlans) { setShowPlans(false); return; }
          if (showOnboarding) { setShowOnboarding(false); return; }
          if (tab !== 0) { setTab(0); return; }
          CapApp.exitApp();
        });
      } catch (e) {
        console.log("Capacitor App plugin not available (web mode)");
      }
    };
    setupBackButton();
    return () => { if (backHandler) backHandler.remove(); };
  }, [tab, showPayment, showPlans, showOnboarding]);

  // ── Sirf active page render karo ──
  const renderPage = () => {
    switch (tab) {
      case 0: return <Dashboard setTab={setTab} />;
      case 1: return <FaceAnalysis />;
      case 2: return <FitnessCoach />;
      case 3: return <FashionAdvisor />;
      case 4: return <SkinAnalysis />;
      case 5: return <AIStyleChat />;
      case 6: return <WardrobeManager />;
      case 7: return <SettingsPage />;
      default: return <Dashboard setTab={setTab} />;
    }
  };

  return (
    <div className="mesh-bg" style={{
      height: "100vh", maxWidth: 430,
      margin: "0 auto", display: "flex",
      flexDirection: "column", position: "relative", overflow: "hidden",
    }}>
      <ToastContainer toasts={toasts} />

      <Suspense fallback={null}>
        {showPlans && <SubscriptionPage onClose={() => setShowPlans(false)} />}
        {showPayment && <PaymentPage onClose={() => setShowPayment(false)} />}
        {showOnboarding && <OnboardingFlow onComplete={() => setShowOnboarding(false)} />}
      </Suspense>

      {/* Header */}
      <header className="app-header">
        <div>
          <div className="app-logo">
            Glow
            <span className="text-gradient-1">Up</span>
            <span className="text-gradient-2"> AI</span>
          </div>
          <div style={{
            fontFamily: "var(--font-body)", fontSize: 10,
            color: "var(--muted)", letterSpacing: 1,
            textTransform: "uppercase", marginTop: 2,
          }}>
            {t.appTagline || "Beauty · Fitness · Fashion"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div className="pro-badge" onClick={() => setShowPayment(true)}>👑 PRO</div>
          <div className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </div>
        </div>
      </header>

      {/* Page Content — sirf active page */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: 16 }} key={tab}>
        <div className="tab-content">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </div>
      </div>

      {/* Bottom Nav */}
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
          <div key={i} className="bottom-nav-item" onClick={() => setTab(i)}>
            <div className={`bottom-nav-icon ${tab === i ? "active" : ""}`}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: "var(--font-body)", fontSize: 8, fontWeight: 700,
              color: tab === i ? "var(--accent)" : "var(--muted2)",
              letterSpacing: 0.5, textTransform: "uppercase", transition: "color 0.2s",
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

  useEffect(() => {
    warmUpBackend();
  }, []);

  if (loading) return (
    <div className="mesh-bg" style={{
      height: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20,
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 22,
        background: "var(--grad1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32,
        animation: "glowPulse 2s ease-in-out infinite, float 3s ease-in-out infinite",
        boxShadow: "0 0 40px rgba(255,77,109,0.3)",
      }}>✨</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
          Glow<span className="text-gradient-1">Up</span><span className="text-gradient-2"> AI</span>
        </div>
        <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 12, marginTop: 6, letterSpacing: 2, textTransform: "uppercase" }}>
          Loading your glow...
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="loading-dot" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );

  if (!user) return (
    <Suspense fallback={<div style={{ height: "100vh", background: "var(--bg)" }} />}>
      <AuthPage />
    </Suspense>
  );

  return <AppShell />;
}