import { useState } from "react";

function EnrollForm({ onEnroll }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code || !password) {
      setError("Please fill all fields");
      return;
    }

    // ✅ دور في كورسات كل الدكاترة
    const lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];
    let matched = null;

    for (const lecturer of lecturers) {
      const lecturerCourses =
        JSON.parse(localStorage.getItem(`courses_${lecturer.email}`)) || [];

      const found = lecturerCourses.find(
        (c) =>
          c.code.trim().toLowerCase() === code.trim().toLowerCase() &&
          c.password.trim() === password.trim()
      );

      if (found) {
        matched = found;
        break;
      }
    }

    if (!matched) {
      setError("Invalid code or password ❌");
      return;
    }

    setError("");
    onEnroll(matched);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Course Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Enroll</button>
    </form>
  );
}

export default EnrollForm;