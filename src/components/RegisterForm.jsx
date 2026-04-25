import { useState } from "react";

function RegisterForm({ goBack }) {
  const [form, setForm] = useState({
    first: "",
    middle: "",
    last: "",
    username: "",
    ssin: "",
    section: "",
    level: "",
    department: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Invalid email");
      return;
    }

    setError("");
    setSuccess("Account created successfully!");

    setTimeout(() => {
      goBack();
    }, 1500);
  };

  return (
    <div className="form-card">
      <h2>Student Registration</h2>
      <p className="subtitle">Register with your university email</p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <input name="first" placeholder="First Name" onChange={handleChange} required />
          <input name="middle" placeholder="Middle Name" onChange={handleChange} />
          <input name="last" placeholder="Last Name" onChange={handleChange} required />
        </div>

        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="ssin" placeholder="SSIN" onChange={handleChange} required />

        <div className="row">
          <input name="section" placeholder="Section" onChange={handleChange} required />
          <input name="level" placeholder="Level" onChange={handleChange} required />
          <input name="department" placeholder="Department" onChange={handleChange} required />
        </div>

        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Register</button>
      </form>

      <p className="back" onClick={goBack}>
        Already have an account? <span>Sign in</span>
      </p>
    </div>
  );
}

export default RegisterForm;