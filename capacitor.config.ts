import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.glowupai.app",
  appName: "GlowUp AI",
  webDir: "build",
  server: {
    androidScheme: "https",
    // For development with local backend:
    // url: "http://YOUR_LOCAL_IP:3000",
    // cleartext: true,
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
