import { useState } from "react";
import api, { getErrorMessage } from "../services/api";

function VerificationForm({ email, goBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/account/Confirmation", { email, code });
      setSuccess("✅ Email confirmed! You can now sign in.");
      setTimeout(() => goBack(), 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await api.post("/account/ResendConfirmationEmail", { email });
      setSuccess("📧 New code sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Check Your Email</h2>
      <p className="subtitle">
        We sent a verification code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ letterSpacing: "4px", textAlign: "center", fontSize: "20px" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 15, color: "#64748b", fontSize: 14 }}>
        Didn't receive a code?{" "}
        <span
          onClick={handleResend}
          style={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}
        >
          {resending ? "Sending..." : "Resend"}
        </span>
      </p>

      <p className="back" onClick={goBack}>← Back to Sign In</p>
    </div>
  );
}

export default VerificationForm;