import "../styles/login.css";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import VerificationForm from "../components/VerificationForm";
import ForgetPasswordForm from "../components/ForgetPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";

function Login() {

  const { theme, toggleTheme } = useTheme();
  const MODES = {
    LOGIN: "login",
    REGISTER: "register",
    VERIFY_EMAIL: "verify_email",
    FORGET: "forget",
    NEW_PASSWORD: "new_password",
  };

  const [mode, setMode] = useState(MODES.LOGIN);
  const [pendingEmail, setPendingEmail] = useState("");

  return (
    <div className="login-container">




      {/* LEFT PANEL */}
      <div className="login-left">
        
        <button className="theme-toggle" onClick={toggleTheme}>
    {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>
        <div className="logo-box">⌘</div>
        
               {/* ✅ الزرار هنا */}
  

        <h1>QR Attendance System</h1>

        <p>
          Prevent fake attendance using QR codes with location and time
          verification.
        </p>

        <div className="features">
          <span>Location Verified</span>
          <span>Time Tracked</span>
          <span>Realtime Sync</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right" key={mode}>
        {mode === MODES.LOGIN && (
          <LoginForm
            goToReset={() => setMode(MODES.FORGET)}
            goToRegister={() => setMode(MODES.REGISTER)}
          />
        )}

        {mode === MODES.REGISTER && (
          <RegisterForm
            goBack={() => setMode(MODES.LOGIN)}
            onSuccess={(email) => {
              setPendingEmail(email);
              setMode(MODES.VERIFY_EMAIL);
            }}
          />
        )}

        {mode === MODES.VERIFY_EMAIL && (
          <VerificationForm
            email={pendingEmail}
            goBack={() => setMode(MODES.LOGIN)}
          />
        )}

        {mode === MODES.FORGET && (
          <ForgetPasswordForm
            goBack={() => setMode(MODES.LOGIN)}
            goToNewPassword={(email) => {
              setPendingEmail(email);
              setMode(MODES.NEW_PASSWORD);
            }}
          />
        )}

        {mode === MODES.NEW_PASSWORD && (
          <ResetPasswordForm
            email={pendingEmail}
            goBack={() => setMode(MODES.FORGET)}
            goToLogin={() => setMode(MODES.LOGIN)}
          />
        )}
      </div>

    </div>
  );
}

export default Login;