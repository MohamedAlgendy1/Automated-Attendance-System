// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./../styles/attendanceRecords.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getAttendanceReport } from "../services/lectureService";
// import { getCourseById } from "../services/courseService";

// function AttendanceRecords() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();

//   const [course, setCourse] = useState(null);
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");
//   const decoded = token ? parseJwt(token) : {};
//   const lecturerName =
//     decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
//     "Lecturer";

//  useEffect(() => {
//   const load = async () => {
//     try {
//       const [courseRes] = await Promise.all([
//         getCourseById(courseId),
//       ]);

//       setCourse(courseRes);

//       // ⚠️ هنا لازم lectureId (مش courseId)
//       const lectureId = courseRes.latestLectureId; // مثال

//       if (lectureId) {
//         const reportRes = await getAttendanceReport(lectureId);
//         setReport(reportRes.report || []);
//       }

//     } catch (err) {
//       console.error(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, [courseId]);

//   return (
//     <div className="dashboard records-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <ul className="menu">
//             <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
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
//             <div>
//               <p>{lecturerName}</p>
//               <span>Lecturer</span>
//             </div>
//           </div>

//           <button
//             className="logout-btn"
//             onClick={() => {
//               localStorage.clear();
//               navigate("/");
//             }}
//           >
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>Attendance Records</h1>

//         <p
//           onClick={() => navigate(-1)}
//           style={{ cursor: "pointer", color: "#2563eb", marginBottom: 20 }}
//         >
//           ← Back
//         </p>

//         {/* Cards */}
//         <div className="cards" style={{ marginBottom: 20 }}>
//           <div className="card">
//             <p>Course</p>
//             <h2>{course?.code || course?.courseCode || "-"}</h2>
//           </div>

//           <div className="card">
//             <p>Attended</p>
//             <h2 style={{ color: "#22c55e" }}>
//               {report.filter((s) => (s.attendedLectures ?? 0) > 0).length} /{" "}
//               {report.length}
//             </h2>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="table-box">
//           <h2>{course?.name || course?.courseName || "Course"}</h2>

//           {loading ? (
//             <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>
//               Loading...
//             </p>
//           ) : (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Student Name</th>
//                   <th>Attended</th>
//                   <th>Total</th>
//                   <th>Percentage</th> {/* ✔️ إضافة العمود */}
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//   {report.length === 0 ? (
//     <tr>
//       <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
//         No students yet
//       </td>
//     </tr>
//   ) : (
//     report.map((s, i) => (
//       <tr key={i}>
//         <td>{s.studentName}</td>

//         <td style={{ color: isPresent ? "#16a34a" : "#dc2626" }}>
//           {isPresent ? 1 : 0}
//         </td>

//         <td>1</td>

//         <td>{isPresent ? "100%" : "0%"}</td>

//         <td>
//           <span style={{
//             padding: "5px 10px",
//             borderRadius: 20,
//             background: isPresent ? "#dcfce7" : "#fee2e2",
//             color: isPresent ? "#16a34a" : "#dc2626",
//           }}>
//             {isPresent ? "✅ Present" : "❌ Absent"}
//           </span>
//         </td>
//       </tr>
//     ))
//   )}
// </tbody>

//               {/* <tbody>
//                 {report.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="5"
//                       style={{
//                         textAlign: "center",
//                         padding: 20,
//                         color: "#888",
//                       }}
//                     >
//                       No students enrolled yet
//                     </td>
//                   </tr>
//                 ) : (
//                   report.map((s, i) => {
//                     // const attended = s.attendedLectures ?? s.attended ?? 0;
//                     // const total = s.totalLectures ?? s.total ?? 0;

//                     const isPresent = s.status === "Present";
//                     const percent =
//                       total === 0
//                         ? 0
//                         : Math.round((attended / total) * 100);

//                     return (
//                       <tr key={i}>
//                         <td>{s.studentName || s.name || "-"}</td>
//                         <td>{attended}</td>
//                         <td>{total}</td>

//                         {/* ✔️ Percentage column */}
//                         <td>
//                           <span
//                             style={{
//                               fontWeight: 700,
//                               color:
//                                 percent >= 75
//                                   ? "#16a34a"
//                                   : percent >= 50
//                                   ? "#d97706"
//                                   : "#dc2626",
//                             }}
//                           >
//                             {percent}%
//                           </span>
//                         </td>

//                         <td>
//                           <span
//                             style={{
//                               padding: "5px 12px",
//                               borderRadius: 20,
//                               fontSize: 13,
//                               fontWeight: 600,
//                               background:
//                                 attended > 0 ? "#dcfce7" : "#fee2e2",
//                               color: attended > 0 ? "#16a34a" : "#dc2626",
//                             }}
//                           >
//                             {attended > 0 ? "✅ Attended" : "❌ Absent"}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody> */}
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AttendanceRecords;




import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceRecords.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getAttendanceReport, getLecturesByCourse, getCourseOverview } from "../services/lectureService";
import { getCourseById } from "../services/courseService";

function AttendanceRecords() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [report, setReport] = useState([]);       // اللي حضروا فعلاً
  const [allStudents, setAllStudents] = useState([]); // كل الطلاب المسجلين
  const [mergedData, setMergedData] = useState([]); // النتيجة النهائية
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

  // ✅ Load course + lectures
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [courseRes, lecturesRes] = await Promise.all([
          getCourseById(courseId),
          getLecturesByCourse(courseId),
        ]);
        setCourse(courseRes);

        const lects = lecturesRes || [];
        setLectures(lects);

        if (lects.length > 0) {
          setSelectedLectureId(lects[0].id);
        }
      } catch (err) {
        console.log(getErrorMessage(err));
      }
    };
    loadInitial();
  }, [courseId]);

  // ✅ Load attendance report whenever lecture changes
  useEffect(() => {
    if (!selectedLectureId) {
      setLoading(false);
      return;
    }

    const loadReport = async () => {
      setLoading(true);
      try {
        // 1️⃣ جيب الـ report (اللي حضروا)
        const reportRes = await getAttendanceReport(selectedLectureId);
        const presentStudents = reportRes?.report || [];
        setReport(presentStudents);

        // 2️⃣ جيب overview الكورس (فيه عدد الطلاب وبياناتهم لو موجودة)
        let overview = null;
        try {
          overview = await getCourseOverview(courseId);
        } catch {
          overview = null;
        }

        // 3️⃣ حاول تجيب قائمة الطلاب من الـ overview
        // الـ overview ممكن يرجع: { students: [...], enrolledStudents: [...], totalEnrolledStudents: N }
        const enrolledList =
          overview?.students ||
          overview?.enrolledStudents ||
          overview?.studentList ||
          [];

        setAllStudents(enrolledList);

        // 4️⃣ Merge: لو عندنا قائمة الطلاب نعمل merge، لو لأ نعرض اللي حضروا بس
        if (enrolledList.length > 0) {
          // عندنا كل الطلاب — نعمل merge
          const presentIds = new Set(
            presentStudents.map(
              (s) => s.studentId || s.userId || s.id || s.studentName
            )
          );

          const merged = enrolledList.map((student) => {
            const studentKey =
              student.studentId || student.userId || student.id || student.studentName || student.name;

            const presentRecord = presentStudents.find(
              (p) =>
                (p.studentId && p.studentId === student.studentId) ||
                (p.userId && p.userId === student.userId) ||
                (p.studentName && p.studentName === (student.studentName || student.name))
            );

            return {
              studentName: student.studentName || student.name || student.fullName || "Unknown",
              studentId: studentKey,
              status: presentRecord ? "Present" : "Absent",
              scanTime: presentRecord?.scanTime || null,
            };
          });

          setMergedData(merged);
        } else {
          // مفيش قائمة طلاب — نعرض اللي حضروا بس كـ Present
          const merged = presentStudents.map((s) => ({
            studentName: s.studentName || "Unknown",
            studentId: s.studentId || s.userId || s.id,
            status: "Present",
            scanTime: s.scanTime || null,
          }));
          setMergedData(merged);
        }
      } catch (err) {
        console.log(getErrorMessage(err));
        setMergedData([]);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedLectureId, courseId]);

  // ✅ Filter + Search
  const filtered = mergedData.filter((s) => {
    const matchSearch = s.studentName?.toLowerCase().includes(search.toLowerCase());
    const isPresent = s.status === "Present";
    const matchFilter =
      filter === "all"     ? true :
      filter === "present" ? isPresent :
      !isPresent;
    return matchSearch && matchFilter;
  });

  const presentCount = mergedData.filter((s) => s.status === "Present").length;
  const absentCount  = mergedData.length - presentCount;

  const formatTime = (t) => {
    if (!t) return null;
    try { return new Date(t).toLocaleString(); } catch { return null; }
  };

  const getLectureLabel = (l) => {
    return l.title || l.name || `Lecture ${l.id}`;
  };

  return (
    <div className="dashboard records-page">

      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
            <li onClick={() => navigate("/attendance")}>📊 Attendance Overview</li>
          </ul>
        </div>
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">{lecturerName?.[0]?.toUpperCase() || "L"}</div>
            <div>
              <p>{lecturerName}</p>
              <span>Lecturer</span>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => { localStorage.clear(); navigate("/"); }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Attendance Records</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

        {/* Stat Cards */}
        <div className="cards">
          <div className="card">
            <p>Course</p>
            <h2>{course?.courseCode || course?.code || "-"}</h2>
          </div>
          <div className="card">
            <p>Total</p>
            <h2>{mergedData.length}</h2>
          </div>
          <div className="card">
            <p>Present</p>
            <h2 style={{ color: "#16a34a" }}>{presentCount}</h2>
          </div>
          <div className="card">
            <p>Absent</p>
            <h2 style={{ color: "#dc2626" }}>{absentCount}</h2>
          </div>
        </div>

        {/* Lecture Selector */}
        {lectures.length > 1 && (
          <div className="lecture-selector">
            <label>Select Lecture:</label>
            <select
              value={selectedLectureId || ""}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
            >
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>
                  {getLectureLabel(l)}
                  {l.startTime ? ` — ${new Date(l.startTime).toLocaleDateString()}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <input
            className="filter-search"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={`filter-btn ${filter === "all" ? "active-all" : ""}`}
            onClick={() => setFilter("all")}
          >All ({mergedData.length})</button>
          <button
            className={`filter-btn ${filter === "present" ? "active-present" : ""}`}
            onClick={() => setFilter("present")}
          >Present ({presentCount})</button>
          <button
            className={`filter-btn ${filter === "absent" ? "active-absent" : ""}`}
            onClick={() => setFilter("absent")}
          >Absent ({absentCount})</button>
        </div>

        {/* Table */}
        <div className="table-box">
          <div className="table-box-header">
            <h2>{course?.courseName || course?.name || "Course"}</h2>
            <span className="table-count">{filtered.length} students</span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Scan Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="skeleton-row">
                      <td><div className="skeleton-bar short" /></td>
                      <td><div className="skeleton-bar long" /></td>
                      <td><div className="skeleton-bar medium" /></td>
                      <td><div className="skeleton-bar medium" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        <p>No students found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, i) => {
                    const isPresent = s.status === "Present";
                    const time = formatTime(s.scanTime);
                    return (
                      <tr key={i}>
                        <td style={{ color: "#94a3b8", fontSize: 13 }}>{i + 1}</td>
                        <td>
                          <div className="student-name">
                            <div className="student-avatar">
                              {s.studentName?.[0]?.toUpperCase() || "S"}
                            </div>
                            {s.studentName}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${isPresent ? "badge-present" : "badge-absent"}`}>
                            <span className="badge-dot" />
                            {isPresent ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td>
                          <span className={`scan-time ${!time ? "no-time" : ""}`}>
                            {time || "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <ul>
          <li onClick={() => navigate("/lecturer")}>📘 Courses</li>
          <li onClick={() => navigate("/attendance")}>📊 Attendance</li>
        </ul>
      </nav>

    </div>
  );
}

export default AttendanceRecords;