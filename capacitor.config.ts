import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.glowupai.app",
  appName: "GlowUp AI",
  webDir: "build",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A0A0F",
      showSpinner: false,
    },
    StatusBar: {
      style: "Dark",
      backgroundColor: "#0A0A0F",
    },
  },
};

export default config;