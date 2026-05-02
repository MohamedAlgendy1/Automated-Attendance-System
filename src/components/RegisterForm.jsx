// import { useState } from "react";
// import api, { getErrorMessage } from "../services/api";

// function RegisterForm({ goBack, onSuccess }) {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     ssin: "",
//     department: "",
//     level: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (form.password.length < 8) {
//       setError("Password must be at least 8 characters");
//       return;
//     }

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (!form.email.endsWith(".edu.eg")) {
//       setError("Only university emails ending with .edu.eg are allowed");
//       return;
//     }

//     setLoading(true);

//     try {
//       await api.post("/account/Register", {
//         firstName: form.firstName,
//         lastName: form.lastName,
//         ssin: form.ssin,
//         department: form.department,
//         level: form.level,
//         email: form.email,
//         password: form.password,
//         confirmPassword: form.confirmPassword,
//       });

//       setSuccess("Account created! Please check your email for verification code.");

//       setTimeout(() => {
//         if (onSuccess) onSuccess(form.email);
//         else goBack();
//       }, 1500);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-card">
//       <h2>Student Registration</h2>
//       <p className="subtitle">Register with your university email</p>

//       <form onSubmit={handleSubmit}>
//         <div className="row">
//           <input name="firstName" placeholder="First Name" onChange={handleChange} required />
//           <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
//         </div>

//         <input name="ssin" placeholder="SSIN" onChange={handleChange} required />

//         <div className="row">
//           <input name="department" placeholder="Department" onChange={handleChange} required />
//           <input name="level" placeholder="Level" onChange={handleChange} required />
//         </div>

//         <input name="email" type="email" placeholder="University Email (.edu.eg)" onChange={handleChange} required />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//         <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />

//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && <p style={{ color: "green" }}>{success}</p>}

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating account..." : "Register"}
//         </button>
//       </form>

//       <p className="back" onClick={goBack}>
//         Already have an account? <span>Sign in</span>
//       </p>
//     </div>
//   );
// }

// export default RegisterForm;


import { useState } from "react";
import api, { getErrorMessage } from "../services/api";

function RegisterForm({ goBack, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    ssin: "",
    department: "",
    level: "",
    email: "",
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
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.email.endsWith(".edu.eg")) {
      setError("Only university emails ending with .edu.eg are allowed");
      return;
    }

    setLoading(true);

    try {
      await api.post("/account/Register", {
        firstName: form.firstName,
        lastName: form.lastName,
        ssin: form.ssin,
        department: form.department,
        level: form.level,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccess("Account created! Please check your email for verification.");
      setTimeout(() => {
        if (onSuccess) onSuccess(form.email);
        else goBack();
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Student Registration</h2>
      <p className="subtitle">Register with your university email</p>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <input name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        </div>

        <input name="ssin" placeholder="SSIN" onChange={handleChange} required />

        <div className="row">
          <input name="department" placeholder="Department" onChange={handleChange} />
          <input name="level" placeholder="Level" onChange={handleChange} required />
        </div>

        <input name="email" type="email" placeholder="University Email (.edu.eg)" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password (min 8)" onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="back" onClick={goBack}>
        Already have an account? <span>Sign in</span>
      </p>
    </div>
  );
}

export default RegisterForm;