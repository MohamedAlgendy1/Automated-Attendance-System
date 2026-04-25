import "../styles/login.css";
import { useState } from "react";

import LoginForm from "../components/LoginForm";
import ResetForm from "../components/ResetForm";
import RegisterForm from "../components/RegisterForm";

function Login() {
  const FORM_TYPES = {
    LOGIN: "login",
    RESET: "reset",
    REGISTER: "register"
  };

  const [mode, setMode] = useState(FORM_TYPES.LOGIN);

  const forms = {
    login: (
      <LoginForm
        goToReset={() => setMode(FORM_TYPES.RESET)}
        goToRegister={() => setMode(FORM_TYPES.REGISTER)}
      />
    ),
    reset: <ResetForm goBack={() => setMode(FORM_TYPES.LOGIN)} />,
    register: <RegisterForm goBack={() => setMode(FORM_TYPES.LOGIN)} />
  };

  return (
    <div className="login-container">
      {/* LEFT */}
      <div className="login-left">
        <div className="logo-box">⌘</div>

        <h1>QR Attendance System</h1>

        <p>
          Prevent fake attendance using QR codes with location and time
          verification.
        </p>

        <div className="features">
          <span>✔ Location Verified</span>
          <span>✔ Time Tracked</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-right" key={mode}>
        {forms[mode]}
      </div>
    </div>
  );
}

export default Login;