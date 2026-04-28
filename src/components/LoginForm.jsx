import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ goToReset, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Admin hardcoded
    if (email === "admin@university.edu" && password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "admin");
      navigate("/dashboard");
      return;
    }

    // ✅ Lecturer من localStorage
    const lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];
    const lecturer = lecturers.find(
      (l) => l.email === email && l.password === password
    );

    if (lecturer) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "lecturer");
      localStorage.setItem("lecturerProfile", JSON.stringify({
        name: lecturer.name,
        email: lecturer.email,
        username: lecturer.username,
      }));
      navigate("/lecturer");
      return;
    }

    // ✅ Student من localStorage
    const students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(
      (s) => s.email === email && s.password === password
    );

    if (student) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "student");
      localStorage.setItem("profile", JSON.stringify({
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        email: student.email,
        ssn: student.ssin,
        username: student.username,
        section: student.section,
        level: student.level,
        department: student.department,
      }));
      navigate("/student");
      return;
    }

    setError("Invalid email or password");
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

      <p className="forgot" onClick={goToReset}>Forgot password?</p>

      <p className="register">
        Student? <span onClick={goToRegister}>Register here</span>
      </p>
    </div>
  );
}

export default LoginForm;