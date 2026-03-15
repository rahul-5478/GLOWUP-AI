import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useLang, translations } from "../hooks/useLanguage";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang, t, changeLang } = useLang();
  const { notifications, toggle, requestPermission } = useNotifications();
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "hi", label: "हिंदी", flag: "🇮🇳" },
    { code: "pa", label: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
    { code: "ur", label: "اردو", flag: "🇵🇰" },
  ];

  const Toggle = ({ value, onToggle }) => (
    <div onClick={onToggle} style={{
      width: 48, height: 26, borderRadius: 13, cursor: "pointer",
      background: value ? "var(--accent3)" : "var(--border)",
      position: "relative", transition: "background 0.3s",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: value ? 25 : 3,
        transition: "left 0.3s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );

  return (
    <div style={{ padding: "0 16px 100px" }} className="tab-content">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>⚙️</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text)", fontWeight: 700 }}>{t.settingsTitle}</span>
        </div>
      </div>

      {/* Account Info */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>
          Account
        </div>
        <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, color: "#fff",
            fontFamily: "var(--font-display)",
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", fontWeight: 600 }}>
              {user?.name || "User"}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
              {user?.email || ""}
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>
          Appearance
        </div>
        <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{theme === "dark" ? "🌙" : "☀️"}</span>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", fontWeight: 600 }}>
                {theme === "dark" ? t.darkMode : t.lightMode}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
                {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              </div>
            </div>
          </div>
          <Toggle value={theme === "dark"} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Language */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>
          {t.language}
        </div>
        <div style={{ padding: "12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {languages.map(l => (
              <div key={l.code} onClick={() => changeLang(l.code)} style={{
                padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                background: lang === l.code ? "rgba(255,107,107,0.15)" : "var(--surface)",
                border: `1.5px solid ${lang === l.code ? "var(--accent)" : "var(--border)"}`,
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 22 }}>{l.flag}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: lang === l.code ? "var(--accent)" : "var(--text)" }}>{l.label}</span>
                {lang === l.code && <span style={{ marginLeft: "auto", color: "var(--accent)", fontSize: 16 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>
          {t.notificationsTitle}
        </div>

        {!notifications.permission && (
          <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
            <button onClick={requestPermission} style={{
              width: "100%", padding: "12px", border: "none", borderRadius: 12,
              background: "var(--grad1)", color: "#fff",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}>🔔 Enable Push Notifications</button>
          </div>
        )}

        {[
          { key: "workout", icon: "💪", label: t.workoutReminder, sub: "Daily at 8:00 AM" },
          { key: "water", icon: "💧", label: t.waterReminder, sub: "Every 2 hours" },
          { key: "progress", icon: "📊", label: t.progressReport, sub: "Every Sunday" },
        ].map((item, i, arr) => (
          <div key={item.key} style={{
            padding: "16px 18px",
            borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text)", fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>{item.sub}</div>
              </div>
            </div>
            <Toggle value={notifications[item.key]} onToggle={() => toggle(item.key)} />
          </div>
        ))}
      </div>

      {/* App Info */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "18px", textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--text)", fontWeight: 700 }}>GlowUp AI</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Version 2.0.0 · Powered by Groq AI</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", marginTop: 8 }}>Made with ❤️ for your GlowUp journey</div>
      </div>

      {/* Logout */}
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 11, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>
          Session
        </div>

        {!showConfirm ? (
          <div
            onClick={() => setShowConfirm(true)}
            style={{
              padding: "16px 18px", display: "flex", alignItems: "center",
              gap: 12, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22 }}>🚪</span>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 600, color: "#FF6B6B" }}>
                Logout
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)" }}>
                Sign out from your account
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "16px 18px" }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text)", marginBottom: 14, textAlign: "center" }}>
              Logout hona chahte ho? 🤔
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: "12px", border: "1.5px solid var(--border)",
                  borderRadius: 12, background: "transparent",
                  color: "var(--muted)", fontFamily: "var(--font-body)",
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={logout}
                style={{
                  flex: 1, padding: "12px", border: "none",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #FF6B6B, #FF4444)",
                  color: "#fff", fontFamily: "var(--font-body)",
                  fontWeight: 700, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255,107,107,0.35)",
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}