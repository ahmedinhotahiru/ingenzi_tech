import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./navigations/index.ts";
import LoadingScreen from "./components/loaders/LoadingScreen.tsx";
import DefaultLayout from "./layouts/default.tsx";
import { useSiteSettings } from "./context/index.tsx";
import colors from "tailwindcss/colors";
import AOS from "aos";
import "aos/dist/aos.css";

const App: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // dynamic colors
  // document.documentElement.style.setProperty(
  //   "--primary-color",
  //   siteSettings?.themeColor!
  // );
  // document.documentElement.style.setProperty(
  //   "--secondary-color",
  //   siteSettings?.themeColor!
  // );
  // document.documentElement.style.setProperty(
  //   "--background-color",
  //   siteSettings?.themeColor!
  // );

  const primaryVar = "blue";
  const secondryVar = "yellow";

  let primaryVariableColor = "";
  let secondaryVariableColor = "";

  Object.keys(colors).forEach(function (color: string, index: number) {
    if (color === primaryVar) {
      primaryVariableColor = Object.values(colors)[index];
    }
    if (color === secondryVar) {
      secondaryVariableColor = Object.values(colors)[index];
    }
  });

  const styles = `
  :root {
       --primary: ${primaryVar};
    --primary-variable-color-50: ${primaryVariableColor[50]};
    --primary-variable-color-100: ${primaryVariableColor[100]};
    --primary-variable-color-200: ${primaryVariableColor[200]};
    --primary-variable-color-300: ${primaryVariableColor[300]};
    --primary-variable-color-400: ${primaryVariableColor[400]};
    --primary-variable-color-500: ${primaryVariableColor[500]};
    --primary-variable-color-600: ${primaryVariableColor[600]};
    --primary-variable-color-700: ${primaryVariableColor[700]};
    --primary-variable-color-800: ${primaryVariableColor[800]};
    --primary-variable-color-900: ${primaryVariableColor[900]};

    --secondary: ${secondryVar};
    --secondary-variable-color-50: ${secondaryVariableColor[50]};
    --secondary-variable-color-100: ${secondaryVariableColor[100]};
    --secondary-variable-color-200: ${secondaryVariableColor[200]};
    --secondary-variable-color-300: ${secondaryVariableColor[300]};
    --secondary-variable-color-400: ${secondaryVariableColor[400]};
    --secondary-variable-color-500: ${secondaryVariableColor[500]};
    --secondary-variable-color-600: ${secondaryVariableColor[600]};
    --secondary-variable-color-700: ${secondaryVariableColor[700]};
    --secondary-variable-color-800: ${secondaryVariableColor[800]};
    --secondary-variable-color-900: ${secondaryVariableColor[900]};
  }
`;

  // Dynamically add Google Font link
  // const loadFont = (fontName: string) => {
  //   const fontKey = fontName.replace(" ", "+");
  //   const existingLink = document.querySelector(`link[href*='${fontKey}']`);
  //   if (!existingLink) {
  //     const link = document.createElement("link");
  //     link.href = `https://fonts.googleapis.com/css2?family=${fontKey}:wght@100;300;400;500;700;900&display=swap`;
  //     link.rel = "stylesheet";
  //     document.head.appendChild(link);
  //   }
  // };

  // loadFont("selectedFont");

  // dynamic fonts

  // document.documentElement.style.setProperty(
  //   "--font-primary",
  //   `'${siteSettings?.themeColor!}'`
  // );

  // document.documentElement.style.setProperty(
  //   "--font-secondary",
  //   `'${siteSettings?.themeColor!}'`
  // );

  return (
    <div className="w-full">
      <style
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />

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
