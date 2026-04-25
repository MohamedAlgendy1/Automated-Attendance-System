import { useState } from "react";

function EnrollForm({ onEnroll }) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!code || !password) {
      onEnroll(null);
      return;
    }

    onEnroll({ code, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Course Code (e.g. CS401)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <input
        type="password"
        placeholder="Course Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Enroll</button>
    </form>
  );
}

export default EnrollForm;