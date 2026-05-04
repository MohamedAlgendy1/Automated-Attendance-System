// import { useState } from "react";
// import { enrollInCourse } from "../services/studentService";
// import { getErrorMessage } from "../services/api";

// function EnrollForm({ onEnroll }) {
//   const [courseCode, setCourseCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!courseCode) { setError("Please enter a course code"); return; }
//     setError("");
//     setLoading(true);
//     try {
//       const res = await enrollInCourse({ courseCode });
//       onEnroll(res.data);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   console.log("ENROLL PAYLOAD:", {
//     courseCode: courseCode
//   }); // 👈 هنا

//   if (!courseCode) {
//     setError("Please enter a course code");
//     return;
//   }

//   setError("");
//   setLoading(true);

//   try {
//   const res = await enrollInCourse(null, courseCode);
//   onEnroll(res);
//   } catch (err) {
//     setError(getErrorMessage(err));
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input placeholder="Course Code" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <button type="submit" disabled={loading}>{loading ? "Enrolling..." : "Enroll"}</button>
//     </form>
//   );
// }

// export default EnrollForm;

// import { useState } from "react";
// import { enrollInCourse } from "../services/studentService";
// import { getErrorMessage } from "../services/api";

// function EnrollForm({ onEnroll }) {
//   const [courseCode, setCourseCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!courseCode) {
//       setError("Please enter a course code");
//       return;
//     }

//     console.log("ENROLL PAYLOAD:", {
//       courseCode,
//     });

//     setError("");
//     setLoading(true);

//     try {
//       const res = await enrollInCourse(null, courseCode);
//       onEnroll(res);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         placeholder="Course Code"
//         value={courseCode}
//         onChange={(e) => setCourseCode(e.target.value)}
//       />

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <button type="submit" disabled={loading}>
//         {loading ? "Enrolling..." : "Enroll"}
//       </button>
//     </form>
//   );
// }

// export default EnrollForm;