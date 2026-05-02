import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { parseJwt, getErrorMessage } from "../services/utils";

function LoginForm({ goToReset, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/account/Login", { email, password });
      const token = res.data.token;
      const decoded = parseJwt(token);

      const role = decoded?.[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ]?.toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("isLoggedIn", "true");

      // ✅ لو دكتور، احفظ الـ profile
      if (role === "lecturer") {
        const name = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "";
        const emailFromToken = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email;
        localStorage.setItem("lecturerProfile", JSON.stringify({
          name,
          email: emailFromToken,
        }));
      }

      // ✅ لو طالب، احفظ الـ profile
      if (role === "student") {
        const name = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "";
        const emailFromToken = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email;
        const nameParts = name.split(" ");
        localStorage.setItem("profile", JSON.stringify({
          firstName: nameParts[0] || "",
          lastName: nameParts[1] || "",
          email: emailFromToken,
        }));
      }

      if (role === "admin") navigate("/dashboard");
      else if (role === "lecturer") navigate("/lecturer");
      else if (role === "student") navigate("/student");
      else setError("Unknown role: " + role);

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to your account</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="forgot" onClick={goToReset}>Forgot password?</p>
      <p className="register">
        Student? <span onClick={goToRegister}>Register here</span>
      </p>
    </div>
  );
}

export default LoginForm;