import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/theme.css";
import { migrateFromLocalStorage } from "./migrate";
import { ThemeProvider } from "./context/ThemeContext";

import { getDeviceId } from "./utils/device";

getDeviceId();
// ✅ رحّل البيانات القديمة قبل ما التطبيق يبدأ
migrateFromLocalStorage().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
});