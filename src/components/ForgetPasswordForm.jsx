import { useState } from "react";
import api, { getErrorMessage } from "../services/api";

function ForgetPasswordForm({ goBack, goToNewPassword }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/account/ForgetPassword", { email });
      setSuccess("📧 Reset code sent! Check your email.");
      // ✅ بعد إرسال الكود روح لصفحة إدخال الكود + الباسورد الجديد
      setTimeout(() => goToNewPassword(email), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Forgot Password?</h2>
      <p className="subtitle">
        Enter your university email and we'll send you a reset code
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      <p className="back" onClick={goBack}>← Back to Sign In</p>
    </div>
  );
}

export default ForgetPasswordForm;