import { useState } from "react";

function EnrollForm({ onEnroll }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const allCourses =
      JSON.parse(localStorage.getItem("courses")) || [];

    if (allCourses.length === 0) {
      setError("No courses found ❌");
      return;
    }

    const matched = allCourses.find(
      (c) =>
        c.code.trim().toLowerCase() ===
          code.trim().toLowerCase() &&
        c.password.trim() === password.trim()
    );

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