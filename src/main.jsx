import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { migrateFromLocalStorage } from "./migrate";

// ✅ رحّل البيانات القديمة قبل ما التطبيق يبدأ
migrateFromLocalStorage().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});