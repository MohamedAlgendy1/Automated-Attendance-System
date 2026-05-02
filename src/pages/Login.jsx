// import "../styles/login.css";
// import { useState } from "react";

// import LoginForm from "../components/LoginForm";
// import RegisterForm from "../components/RegisterForm";
// import VerificationForm from "../components/VerificationForm";
// import ForgetPasswordForm from "../components/ForgetPasswordForm";
// import ResetPasswordForm from "../components/ResetPasswordForm";

// function Login() {
//   // الأفضل نقلها برا component عشان ما تتعيدش كل render
//   const MODES = {
//     LOGIN: "login",
//     REGISTER: "register",
//     VERIFY_EMAIL: "verify_email",
//     FORGET: "forget",
//     NEW_PASSWORD: "new_password",
//   };

//   const [mode, setMode] = useState(MODES.LOGIN);
//   const [pendingEmail, setPendingEmail] = useState("");

//   const renderForm = () => {
//     switch (mode) {
//       case MODES.LOGIN:
//         return (
//           <LoginForm
//             goToReset={() => setMode(MODES.FORGET)}
//             goToRegister={() => setMode(MODES.REGISTER)}
//           />
//         );

//       case MODES.REGISTER:
//         return (
//           <RegisterForm
//             goBack={() => setMode(MODES.LOGIN)}
//             onSuccess={(email) => {
//               setPendingEmail(email);
//               setMode(MODES.VERIFY_EMAIL);
//             }}
//           />
//         );

//       case MODES.VERIFY_EMAIL:
//         return (
//           <VerificationForm
//             email={pendingEmail}
//             goBack={() => setMode(MODES.LOGIN)}
//           />
//         );

//       case MODES.FORGET:
//         return (
//           <ForgetPasswordForm
//             goBack={() => setMode(MODES.LOGIN)}
//             goToNewPassword={(email) => {
//               setPendingEmail(email);
//               setMode(MODES.NEW_PASSWORD);
//             }}
//           />
//         );

//       case MODES.NEW_PASSWORD:
//         return (
//           <ResetPasswordForm
//             email={pendingEmail}
//             goBack={() => setMode(MODES.FORGET)}
//             goToLogin={() => setMode(MODES.LOGIN)}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-left">
//         <div className="logo-box">⌘</div>
//         <h1>QR Attendance System</h1>
//         <p>
//           Prevent fake attendance using QR codes with location and time verification.
//         </p>

//         <div className="features">
//           <span>✔ Location Verified</span>
//           <span>✔ Time Tracked</span>
//         </div>
//       </div>

//       <div className="login-right" key={mode}>
//         {renderForm()}
//       </div>
//     </div>
//   );
// }

// export default Login;


import "../styles/login.css";
import { useState } from "react";

import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import VerificationForm from "../components/VerificationForm";
import ForgetPasswordForm from "../components/ForgetPasswordForm";
import ResetPasswordForm from "../components/ResetPasswordForm";

function Login() {
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