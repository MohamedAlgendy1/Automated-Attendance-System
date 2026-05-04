// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./../styles/attendanceOverview.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getAllCourses } from "../services/courseService";
// import { getLecturesByCourse, getAttendanceReport } from "../services/lectureService";



// function CourseBlock({ course }) {
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const courseId = course.courseId;
//   const courseName = course.courseName || course.name || "";
//   const courseCode = course.courseCode || course.code || "";

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const lectures = await getLecturesByCourse(courseId);

//         if (!lectures || lectures.length === 0) {
//           setReport([]);
//           return;
//         }

//         const lectureId = lectures[0].id;

//         const res = await getAttendanceReport(lectureId);

//         setReport(res?.report || []);

//       } catch (err) {
//         setReport([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [courseId]);

//   return (
//     <div className="dashboard attendance-page">
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <ul className="menu">
//             <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
//             <li className="active">📊 Attendance Overview</li>
//           </ul>
//         </div>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">{lecturerName?.[0]?.toUpperCase() || "L"}</div>
//             <div><p>{lecturerName}</p><span>Lecturer</span></div>
//           </div>
//           <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
//             Sign Out
//           </button>
//         </div>
//       </div>

//       <div className="main">
//         <h1>Attendance Overview</h1>

//         <div className="cards">
//           <div className="card"><p>Courses</p><h2>{courses.length}</h2></div>
//         </div>

//         {loading ? (
//           <p style={{ marginTop: 20, color: "#64748b" }}>Loading...</p>
//         ) : courses.length === 0 ? (
//           <div className="table-box">
//             <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//               No courses yet
//             </p>
//           </div>
//         ) : (
//           courses.map((course) => (
//             // ✅ استخدم courseId كـ key
//             <CourseBlock key={course.courseId} course={course} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// function CourseBlock({ course }) {
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ استخدم courseId مش id
//   const courseId = course.courseId;
//   const courseName = course.courseName || course.name || "";
//   const courseCode = course.courseCode || course.code || "";

//  useEffect(() => {

// getAttendanceReport(courseId)
//   .then((res) => {
//     setReport(res?.report || []);
//   })
//   .catch(() => setReport([]))
//   .finally(() => setLoading(false));


//   return (
//     <div className="table-box">
//       <h2>{courseName} ({courseCode})</h2>
//       <p style={{ color: "#64748b", marginBottom: 15 }}>
//         {report.length} students
//       </p>

//       <table className="table">
//         <thead>
//           <tr>
//             <th>Student</th>
//             <th>Attended</th>
//             <th>Total</th>
//             <th>Percentage</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loading ? (
//             <tr><td colSpan="4" className="empty">Loading...</td></tr>
//           ) : report.length === 0 ? (
//             <tr><td colSpan="4" className="empty">No students enrolled yet</td></tr>
//           ) : (
//             report.map((s, i) => {
//               const attended = s.attendedLectures ?? s.attended ?? 0;
//               const total = s.totalLectures ?? s.total ?? 0;
//               const percent = total === 0 ? 0 : Math.round((attended / total) * 100);
//               return (
//                 <tr key={i}>
//                   <td>{s.studentName || s.name || "-"}</td>
//                   <td>{attended}</td>
//                   <td>{total}</td>
//                   <td>
//                     <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                       <div style={{
//                         flex: 1, height: 8, background: "#e5e7eb",
//                         borderRadius: 999, overflow: "hidden",
//                       }}>
//                         <div style={{
//                           width: `${percent}%`, height: "100%",
//                           background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
//                           borderRadius: 999, transition: "width 0.3s",
//                         }} />
//                       </div>
//                       <span style={{
//                         fontWeight: 700,
//                         color: percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626",
//                       }}>
//                         {percent}%
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AttendanceOverview;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceOverview.css";

import { parseJwt, getErrorMessage } from "../services/api";
import { getAllCourses } from "../services/courseService";
import {
  getLecturesByCourse,
  getAttendanceReport,
} from "../services/lectureService";

export default function AttendanceOverview() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data || []);
      } catch (err) {
        console.log(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="dashboard attendance-page">

      {/* Sidebar (NO CHANGE → CSS SAFE) */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
            <li className="active">📊 Attendance Overview</li>
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

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main (NO CHANGE → CSS SAFE) */}
      <div className="main">
        <h1>Attendance Overview</h1>

        <div className="cards">
          <div className="card">
            <p>Total Courses</p>
            <h2>{courses.length}</h2>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          courses.map((course) => (
            <CourseBlock key={course.courseId} course={course} />
          ))
        )}
      </div>

    </div>
  );
}

/* ================= COURSE BLOCK ================= */

function CourseBlock({ course }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const courseId = course.courseId;
  const courseName = course.courseName || course.name || "";
  const courseCode = course.courseCode || course.code || "";

  useEffect(() => {
    const load = async () => {
      try {
        const lectures = await getLecturesByCourse(courseId);

        if (!lectures?.length) {
          setStudents([]);
          return;
        }

        const total = lectures.length;
        const map = new Map();

        for (const lec of lectures) {
          const res = await getAttendanceReport(lec.id);

          (res?.report || []).forEach((s) => {
            if (!map.has(s.studentId)) {
              map.set(s.studentId, {
                studentName: s.studentName,
                attendedSet: new Set(),
              });
            }

if (s.status?.toLowerCase() === "present") {
  map.get(s.studentId).attendedSet.add(lec.id);
}
          });
        }

        const result = Array.from(map.values()).map((s) => {
          const attended = s.attendedSet.size;

          return {
            studentName: s.studentName,
            attended,
            total,
            percent:
              total === 0 ? 0 : Math.round((attended / total) * 100),
          };
        });

        setStudents(result);
      } catch  {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  return (
    <div className="table-box">

      {/* IMPORTANT: same structure as your original CSS */}
      <h2>{courseName} ({courseCode})</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Attended</th>
            <th>Total</th>
            <th>Percentage</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : students.length === 0 ? (
            <tr>
              <td colSpan="4">No attendance data</td>
            </tr>
          ) : (
            students.map((s, i) => (
              <tr key={i}>
                <td>{s.studentName}</td>
                <td>{s.attended}</td>
                <td>{s.total}</td>
                <td>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        s.percent >= 75
                          ? "#16a34a"
                          : s.percent >= 50
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {s.percent}%
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}