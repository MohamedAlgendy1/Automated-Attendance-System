// // import "./../styles/dashboardLecturer.css";
// // import { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useRealtime } from "../hooks/useRealtime";
// // import { EVENTS } from "../realtime";
// // import { parseJwt, getErrorMessage, getUserIdFromToken } from "../services/api";
// // import { getAllCourses, createCourse, editCourse, deleteCourse } from "../services/courseService";

// import "./../styles/dashboardLecturer.css";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { useRealtime } from "../hooks/useRealtime";
// import { EVENTS } from "../realtime";

// import { parseJwt, getErrorMessage } from "../services/api";

// import {
//   getAllCourses,
//   createCourse,
//   editCourse,
//   deleteCourse,
// } from "../services/courseService";

// import {
//   getLecturesByCourse,
//   getAttendanceReport,
// } from "../services/lectureService";

// function LecturerDashboard() {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState("courses");
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editCourseData, setEditCourseData] = useState(null);
//   const [refresh, setRefresh] = useState(0);
//   const [realtimeCount, setRealtimeCount] = useState(0);

//   const [form, setForm] = useState({ code: "", name: "" });
//   const [formError, setFormError] = useState("");
//   const [formLoading, setFormLoading] = useState(false);

//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   const decoded = parseJwt(localStorage.getItem("token")) || {};
//   const lecturerName =
//     decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
//     decoded?.name ||
//     "Lecturer";


//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
//   };

//   useRealtime((msg) => {
//     if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//       setRealtimeCount((prev) => prev + 1);
//     }
//   });

// useEffect(() => {
//   const calculateStudents = async () => {
//     try {
//       const coursesData = await getAllCourses();

//       let studentSet = new Set();

//       for (const course of coursesData || []) {
//         const lectures = await getLecturesByCourse(course.courseId);

//         for (const lec of lectures || []) {
//           const res = await getAttendanceReport(lec.id);

//           const report = res?.report || [];

//           report.forEach((s) => {
//             studentSet.add(s.studentId);
//           });
//         }
//       }

//       setTotalStudents(studentSet.size);
//     } catch (err) {
//       console.log(err);
//       setTotalStudents(0);
//     }
//   };

//   calculateStudents();
// }, [refresh]);

//   // useEffect(() => {
//   //   const load = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const data = await getAllCourses();
//   //       setCourses(data);
//   //     } catch (err) {
//   //       showToast(getErrorMessage(err), "error");
//   //       setCourses([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   load();
//   // }, [refresh]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setFormError("");

//     if (!form.code || !form.name) {
//       setFormError("Please fill all fields");
//       return;
//     }

   

//     setFormLoading(true);
//     try {
//       if (editCourseData) {
//         await editCourse(editCourseData.courseId, form.code, form.name);
//         showToast("Course updated ✅");
//       } else {
//         await createCourse(form.name, form.code);
//         showToast("Course added 🎉");
//       }
//       setShowModal(false);
//       setEditCourseData(null);
//       setForm({ code: "", name: "" });
//       setRefresh((r) => r + 1);
//     } catch (err) {
//  console.log(err);
//  setFormError(getErrorMessage(err));
// } finally {
//       setFormLoading(false);
//     }
//   };

//   // ✅ الحل — id هو اللي بييجي من الـ button
//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this course?")) return;
//     try {
//       await deleteCourse(id);
//       showToast("Course deleted ❌", "error");
//       setRefresh((r) => r + 1);
//     } catch (err) {
//       showToast(getErrorMessage(err), "error");
//     }
//   };

//   const handleEdit = (course) => {
//     setEditCourseData(course);
//     setForm({
//       name: course.courseName || course.name || "",
//       code: course.courseCode || course.code || "",
//     });
//     setFormError("");
//     setShowModal(true);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   const totalLectures = () => 0;
//   const [totalStudents, setTotalStudents] = useState(0);

//   return (
//     <div className="dashboard lecturer-page">
//       {/* SIDEBAR */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <ul className="menu">
//             <li
//               className={activePage === "courses" ? "active" : ""}
//               onClick={() => setActivePage("courses")}
//             >
//               📘 My Courses
//             </li>
//             <li onClick={() => navigate("/attendance")}>
//               📊 Attendance Overview
//             </li>
//           </ul>
//         </div>

//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">
//               {lecturerName?.[0]?.toUpperCase() || "L"}
//             </div>
//              <div>
//               <p>{lecturerName}</p>
//               <span>Lecturer</span>
//             </div> 
//           </div>
//           <button className="logout-btn" onClick={handleLogout}>
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* MAIN */}
//       <div className="main">
//         {activePage === "courses" && (
//           <>
//             <h1>Lecturer Dashboard</h1>

//             <div className="cards">
//               <div className="card">
//                 <p>Courses</p>
//                 <h2>{courses.length}</h2>
//               </div>
//               <div className="card">
//                 <p>Lectures</p>
//                 <h2>{totalLectures()}</h2>
//               </div>
//               <div className="card">
//                 <p>Students</p>
//                 <h2>{totalStudents}</h2>
//               </div>
//               {realtimeCount > 0 && (
//                 <div className="card" style={{ borderLeft: "4px solid #22c55e" }}>
//                   <p>Live Attendance Today</p>
//                   <h2 style={{ color: "#16a34a" }}>+{realtimeCount}</h2>
//                 </div>
//               )}
//             </div>

//             <div className="top-bar">
//               <button
//                 className="enroll-btn"
//                 onClick={() => {
//                   setShowModal(true);
//                   setEditCourseData(null);
//                   setForm({ name: "", code: "" });
//                   setFormError("");
//                 }}
//               >
//                 + Add Course
//               </button>
//             </div>

//             {loading ? (
//               <p style={{ color: "#64748b", marginTop: 20 }}>Loading courses...</p>
//             ) : (
//               <div className="courses-grid">
//                 {courses.length === 0 ? (
//                   <p>No courses yet</p>
//                 ) : (
//                   courses.map((c) => (
//                     <div
//                       key={c.courseId}
//                       className="course-card"
//                       onClick={() => navigate(`/course/${c.courseId}`)}
//                       style={{ cursor: "pointer" }}
//                     >
//                       <div className="course-header">
//                         {/* ✅ courseCode */}
//                         <span className="course-code">
//                           {c.courseCode || c.code}
//                         </span>

//                         <div
//                           className="actions"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
//                           {/* ✅ بنبعت c.courseId */}
//                           <button className="delete-btn" onClick={() => handleDelete(c.courseId)}>🗑</button>
//                         </div>
//                       </div>

//                       {/* ✅ courseName */}
//                       <h3>{c.courseName || c.name}</h3>
//                       <p>0 students enrolled</p>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>{editCourseData ? "Edit Course" : "Add Course"}</h3>
//               <span onClick={() => setShowModal(false)}>✖</span>
//             </div>

//             <form onSubmit={handleSubmit}>
//               <input
//                 placeholder="Course Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />

//               <input
//                 placeholder="Course Code"
//                 value={form.code}
//                 onChange={(e) => setForm({ ...form, code: e.target.value })}
//               />
//               {formError && <p style={{ color: "red" }}>{formError}</p>} 
//               <button type="submit" disabled={formLoading}>
//                 {formLoading ? "Saving..." : editCourseData ? "Update" : "Save"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* TOAST */}
//       {toast.show && (
//         <div className={`toast ${toast.type}`}>{toast.message}</div>
//       )}
//     </div>
//   );
// }

// export default LecturerDashboard;




import "./../styles/dashboardLecturer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseOverview } from "../services/lectureService";
import { useRealtime } from "../hooks/useRealtime";
import { EVENTS } from "../realtime";

import { parseJwt, getErrorMessage } from "../services/api";

import {
  getAllCourses,
  createCourse,
  editCourse,
  deleteCourse,
} from "../services/courseService";

// import {

// } from "../services/lectureService";

function LecturerDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseStudents, setCourseStudents] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [realtimeCount, setRealtimeCount] = useState(0);
 

  const [showModal, setShowModal] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);

  const [form, setForm] = useState({ code: "", name: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const decoded = parseJwt(localStorage.getItem("token")) || {};
console.log(decoded);

const lecturerName = 
  decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
  decoded?.["name"] ||
  decoded?.["Name"] ||
  decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
  "Lecturer";
  /* REALTIME */
  useRealtime((msg) => {
    if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
      setRealtimeCount((p) => p + 1);
    }
  });
useEffect(() => {
  const loadStudents = async () => {
    if (!courses.length) return;

    try {
      const result = {};

      await Promise.all(
        courses.map(async (c) => {
          try {
            const res = await getCourseOverview(c.courseId);
           
            result[c.courseId] =
  res?.totalEnrolledStudents ??
  res?.totalEnrolled ??
  res?.totalStudents ??
  res?.enrolledStudents ??
  0;
          } catch  {
            // مهم: نتخطى أي 403 بدون ما نكسر الصفحة
            result[c.courseId] = 0;
          }
        })
      );

      setCourseStudents(result);
    } catch (err) {
      console.log("Course overview error:", err);
      setCourseStudents({});
    }
  };

  loadStudents();
}, [courses]);

  /* LOAD COURSES */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data || []);
      } catch (err) {
        console.log(getErrorMessage(err));
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refresh]);




  /* FORM */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.code) {
      setFormError("Please fill all fields");
      return;
    }

    setFormLoading(true);

    try {
      if (editCourseData) {
        await editCourse(editCourseData.courseId, form.code, form.name);
      } else {
        await createCourse(form.name, form.code);
      }

      setShowModal(false);
      setEditCourseData(null);
      setForm({ name: "", code: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await deleteCourse(id);
      setRefresh((r) => r + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (course) => {
    setEditCourseData(course);
    setForm({
      name: course.courseName || course.name || "",
      code: course.courseCode || course.code || "",
    });
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard lecturer-page">

      {/* SIDEBAR (UNCHANGED) */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li className="active">📘 My Courses</li>
            <li onClick={() => navigate("/attendance")}>
              📊 Attendance Overview
            </li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">
              {lecturerName?.[0]?.toUpperCase() || "L"}
            </div>
            <div>
              <p>{lecturerName}</p>
              <span>Lecturer</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN (UNCHANGED STRUCTURE) */}
      <div className="main">

        <h1>Lecturer Dashboard</h1>

        <div className="cards">
          <div className="card">
            <p>Courses</p>
            <h2>{courses.length}</h2>
          </div>

          <div className="card">
  <p>Total Enrolled Students</p>
  <h2>
    {Object.values(courseStudents).reduce((a, b) => a + b, 0)}
  </h2>
</div>
          {realtimeCount > 0 && (
            <div className="card" style={{ borderLeft: "4px solid #22c55e" }}>
              <p>Live Attendance</p>
              <h2 style={{ color: "#16a34a" }}>+{realtimeCount}</h2>
            </div>
          )}
        </div>

        <div className="top-bar">
          <button
            className="enroll-btn"
            onClick={() => {
              setShowModal(true);
              setEditCourseData(null);
              setForm({ name: "", code: "" });
            }}
          >
            + Add Course
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="courses-grid">

            {courses.map((c) => (
              <div
                key={c.courseId}
                className="course-card"
                onClick={() => navigate(`/course/${c.courseId}`)}
              ><div className="course-header">
  <span className="course-code">
    {c.courseCode || c.code}
  </span>

  <div
    className="actions"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="edit-btn"
      onClick={() => handleEdit(c)}
      title="Edit"
    >
      ✏️
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(c.courseId)}
      title="Delete"
    >
      🗑
    </button>
  </div>
</div>

                 <h3>{c.courseName || c.name}</h3> 
               
               <p>
  {courseStudents?.[c.courseId] || 0} students enrolled
</p>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* MODAL (UNCHANGED STYLE STRUCTURE) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>{editCourseData ? "Edit Course" : "Add Course"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Course Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Course Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />

              {formError && <p style={{ color: "red" }}>{formError}</p>}

              <button disabled={formLoading}>
                {formLoading ? "Saving..." : "Save"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default LecturerDashboard;