import { useState } from "react";
import api from "../services/api";

function ResetPasswordForm({ email, goBack, goToLogin }) {
  const [form, setForm] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/account/ResetPassword", {
        email,
        token: form.token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccess("✅ Password reset successfully!");
      setTimeout(() => goToLogin(), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Reset failed. Code may be expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Set New Password</h2>
      <p className="subtitle">
        Enter the code from your email and your new password
      </p>

      <form onSubmit={handleSubmit}>
        {/* ✅ الكود والباسورد في صفحة واحدة */}
        <input
          name="token"
          type="text"
          placeholder="Reset Code (from email)"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="New Password"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          onChange={handleChange}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="back" onClick={goBack}>← Back</p>
    </div>
  );
}

export default ResetPasswordForm;