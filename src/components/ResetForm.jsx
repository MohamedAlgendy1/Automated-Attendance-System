import { useState } from "react";

function ResetForm({ goBack }) {
  const [email, setEmail] = useState("");
  const [ssin, setSsin] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Email validation
    if (!email.includes("@")) {
      setError("Invalid email");
      setSuccess("");
      return;
    }

    // 🆔 SSIN validation
    if (!/^\d+$/.test(ssin)) {
      setError("Student ID must contain numbers only");
      setSuccess("");
      return;
    }

    if (ssin.length < 5) {
      setError("Invalid Student ID");
      setSuccess("");
      return;
    }

    // 🔑 Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    // ✅ Success
    setError("");
    setSuccess("Password reset successfully!");
  };

  return (
    <div className="form-card">
      <h2>Reset Password</h2>

      <p className="subtitle">
        Verify your identity to reset your password
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="SSIN (Student ID)"
          value={ssin}
          onChange={(e) => setSsin(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {/* ERROR MESSAGE */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* SUCCESS MESSAGE */}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Reset Password</button>
      </form>

      <p className="back" onClick={goBack}>
        ← Back to Sign In
      </p>
    </div>
  );
}

export default ResetForm;