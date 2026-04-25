import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ goToReset, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const admin = {
      email: "admin@university.edu",
      password: "admin123",
    };

    const student = {
      email: "student@university.edu",
      password: "123456",
    };

    const lecturer = {
      email: "lecturer@university.edu",
      password: "123456",
    };

    if (email === admin.email && password === admin.password) {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", "admin");
      navigate("/dashboard");
    } else if (email === student.email && password === student.password) {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", "student");
      navigate("/student");
    } else if (email === lecturer.email && password === lecturer.password) {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", "lecturer");
      navigate("/lecturer"); // 👈 صفحة الدكتور
    } else {
      setError("Invalid email or password");
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

        <button type="submit">Sign In</button>
      </form>

      <p className="forgot" onClick={goToReset}>
        Forgot password?
      </p>

      <p className="register">
        Student? <span onClick={goToRegister}>Register here</span>
      </p>
    </div>
  );
}

export default LoginForm;