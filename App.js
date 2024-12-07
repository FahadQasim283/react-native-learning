import React from "react";
import { ThemeProvider } from "./lib/apptheme/themecontext";
import ThemeScreen from "./lib/apptheme/themescreen";

const App = () => {
  return (
    <ThemeProvider>
        <ThemeScreen />
    </ThemeProvider>
  );
};
export default App;
