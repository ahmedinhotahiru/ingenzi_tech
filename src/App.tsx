import React, { useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import routes from "./navigations/index.ts";
import LoadingScreen from "./components/loaders/LoadingScreen.tsx";
import DefaultLayout from "./layouts/default.tsx";
import { useSiteSettings } from "./context/index.tsx";
import colors from "tailwindcss/colors";

const App: React.FC = () => {
  const { siteSettings, loading } = useSiteSettings();

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({
      duration: 1000,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    if (siteSettings) {
      const root = document.documentElement;

      // Set primary and background colors
      root.style.setProperty(
        "--primary-color",
        siteSettings?.properties?.accent_color || "#6366f1",
      );

      root.style.setProperty(
        "--background-color",
        siteSettings?.properties?.background_color || "#ffffff",
      );

      // Find and set Tailwind variable colors
      const accentColor = siteSettings?.properties?.accent_color;
      const primaryVariableColor =
        Object.entries(colors).find(([key]) => key === accentColor)?.[1] ||
        colors.indigo;

      if (typeof primaryVariableColor === "object") {
        Object.entries(primaryVariableColor).forEach(([key, value]) => {
          root.style.setProperty(
            `--primary-variable-color-${key}`,
            value as string,
          );
        });
      }

      // Load and apply font
      const fontFamily = siteSettings?.properties?.font_family || "Montserrat";
      loadFont(fontFamily);
      root.style.setProperty("--font-primary", `'${fontFamily}'`);
    }
  }, [siteSettings]);

  // Function to dynamically load Google Fonts
  const loadFont = (fontName: string) => {
    const fontKey = fontName.replace(/ /g, "+");
    const existingLink = document.querySelector(`link[href*='${fontKey}']`);

    if (!existingLink) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontKey}:wght@100;200;300;400;500;600;700;800;900&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  };

  // Ensure conditional rendering happens **after** hooks are declared
  if (loading || !siteSettings) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full">
      <Router>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <DefaultLayout>
                    <route.component />
                  </DefaultLayout>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
