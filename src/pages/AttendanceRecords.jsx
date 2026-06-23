
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceRecords.css";
import { parseJwt, getErrorMessage } from "../services/api";
import {
  getAttendanceReport,
  getLecturesByCourse,
  updateStudentAttendance,
} from "../services/lectureService";
import { getCourseById } from "../services/courseService";
import { useTheme } from "../context/ThemeContext";

function AttendanceRecords() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [report, setReport] = useState([]);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

  // ================= LOAD COURSE + LECTURES =================
  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, lecturesRes] = await Promise.all([
          getCourseById(courseId),
          getLecturesByCourse(courseId),
        ]);

        setCourse(courseRes);

        const lects = lecturesRes || [];
        setLectures(lects);

        if (lects.length > 0) setSelectedLectureId(lects[0].id);
        else setLoading(false);
      } catch (err) {
        console.log(getErrorMessage(err));
        setLoading(false);
      }
    };

    load();
  }, [courseId]);

  // ================= LOAD REPORT =================
  useEffect(() => {
    if (!selectedLectureId) return;

    const loadReport = async () => {
      setLoading(true);

      try {
        const res = await getAttendanceReport(selectedLectureId);

        const reportData = Array.isArray(res?.report)
          ? res.report.map((s) => ({
              ...s,
              status:
                typeof s.status === "number"
                  ? s.status
                  : s.status === "Present"
                  ? 0
                  : 1,
            }))
          : [];

        setReport(reportData);
        setTotalEnrolled(res?.totalEnrolled ?? reportData.length);
      } catch (err) {
        console.log(getErrorMessage(err));
        setReport([]);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedLectureId]);

  // ================= FILTER =================
  const filteredReport = report.filter((s) => {
    const status = Number(s.status);

    if (filter === "present") return status === 0;
    if (filter === "absent") return status === 1;

    return true;
  });

  // ================= COUNTS =================
  const totalPresent = report.filter((s) => Number(s.status) === 0).length;
  const absentCount = report.filter((s) => Number(s.status) === 1).length;

  // ================= TOGGLE =================
  const handleAttendanceToggle = async (student) => {
    try {
      const isPresent = Number(student.status) === 0;
      const newStatus = isPresent ? 1 : 0;

      // optimistic UI update
      setReport((prev) =>
        prev.map((s) =>
          s.studentId === student.studentId
            ? { ...s, status: newStatus }
            : s
        )
      );

      await updateStudentAttendance(
        selectedLectureId,
        student.studentId,
        newStatus
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI =================
  return (
    <div className="dashboard records-page">

      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
            <li onClick={() => navigate("/attendance")}>📊 Attendance Overview</li>
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
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Attendance Records</h1>

        <p onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          ← Back
        </p>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <p>Course</p>
            <h2>{course?.courseCode || course?.code || "-"}</h2>
          </div>

          <div className="card">
            <p>Present</p>
            <h2 style={{ color: "var(--green)" }}>{totalPresent}</h2>
          </div>

          <div className="card">
            <p>Absent</p>
            <h2 style={{ color: "var(--red)" }}>{absentCount}</h2>
          </div>

          <div className="card">
            <p>Enrolled</p>
            <h2>{totalEnrolled}</h2>
          </div>
        </div>

        {/* Lecture Selector */}
        {lectures.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label>Lecture:</label>
            <select
              value={selectedLectureId || ""}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
            >
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title || l.name || `Lecture ${l.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filter */}
        <div className="filter-tabs">
          {[
            { key: "all", label: `All (${report.length})` },
            { key: "present", label: `✅ Present (${totalPresent})` },
            { key: "absent", label: `❌ Absent (${absentCount})` },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-tab${filter === f.key ? " active" : ""} ${f.key}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-box">
          <h2>{course?.courseName || course?.name || "Course"}</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Scan Time</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReport.length === 0 ? (
                  <tr>
                    <td colSpan="4">No records found</td>
                  </tr>
                ) : (
                  filteredReport.map((s, i) => {
                    const isPresent = Number(s.status) === 0;

                    return (
                      <tr key={i}>
                        <td>{s.studentName}</td>

                        <td>
                          <span
                            className={`status-badge ${
                              isPresent ? "present" : "absent"
                            }`}
                          >
                            {isPresent ? "✅ Present" : "❌ Absent"}
                          </span>
                        </td>
<td>
  {formatTime(s.scanTime || s.attendedAt || s.time)}
</td>
                        <td>
                          <button
                            className={
                              isPresent
                                ? "mark-absent-btn"
                                : "mark-present-btn"
                            }
                            onClick={() => handleAttendanceToggle(s)}
                          >
                            {isPresent
                              ? "Mark Absent"
                              : "Mark Present"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        <ul>
          <li onClick={() => navigate("/lecturer")}>📘 Courses</li>
          <li className="active">📊 Attendance</li>
          <li>
            <button className="theme-toggle mobile-theme" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AttendanceRecords;


const formatTime = (timeStr) => {
if (!timeStr) return "—";
const utcStr = timeStr.endsWith("Z") ? timeStr : `${ timeStr}
Z`;
return new Date(utcStr).toLocaleString("en-GB", {
timeZone: "Africa/Cairo",
year: "numeric",
month: "short",
day: "numeric",
hour: "numeric",
minute: "numeric",
hour12: true, 
});
};