import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceRecords.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getAttendanceReport, getLecturesByCourse } from "../services/lectureService";
import { getCourseById } from "../services/courseService";
import { useTheme } from "../context/ThemeContext";
function AttendanceRecords() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [course, setCourse]               = useState(null);
  const [lectures, setLectures]           = useState([]);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [report, setReport]               = useState([]);
  const [totalPresent, setTotalPresent]   = useState(0);
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [loading, setLoading]             = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

  // 1️⃣ جيب الكورس والمحاضرات
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

        if (lects.length > 0) {
          setSelectedLectureId(lects[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(getErrorMessage(err));
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  // 2️⃣ جيب الـ report لما تتغير المحاضرة
  useEffect(() => {
    if (!selectedLectureId) return;

    const loadReport = async () => {
      setLoading(true);
      try {
        const res = await getAttendanceReport(selectedLectureId);
        console.log("🔍 attendance response:", res); // مؤقت عشان نشوف الشكل

        // ✅ بيتعامل مع أي شكل يرجعه الـ API
        const reportData = Array.isArray(res?.report) ? res.report : [];
        setReport(reportData);
        setTotalPresent(res?.totalPresent ?? reportData.length);
        setTotalEnrolled(res?.totalEnrolled ?? 0);
      } catch (err) {
        console.log(getErrorMessage(err));
        setReport([]);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [selectedLectureId]);

  // ✅ من الـ API مباشرة
  const presentCount = totalPresent;

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
            onClick={() => { localStorage.clear(); navigate("/"); }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Attendance Records</h1>

        <p onClick={() => navigate(-1)} style={{ cursor: "pointer", color: "#2563eb" }}>
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
            <h2 style={{ color: "#22c55e" }}>{presentCount}</h2>
          </div>
          <div className="card">
            <p>Enrolled</p>
            <h2>{totalEnrolled}</h2>
          </div>
        </div>

        {/* ✅ Lecture Selector */}
        {lectures.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, marginRight: 8, color: "#374151" }}>
              Lecture:
            </label>
            <select
              value={selectedLectureId || ""}
              onChange={(e) => setSelectedLectureId(Number(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 14,
                color: "#374151",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {lectures.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title || l.name || `Lecture ${l.id}`}
                  {l.startTime
                    ? ` — ${new Date(l.startTime).toLocaleDateString()}`
                    : ""}
                </option>
              ))}
            </select>
          </div>
        )}

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
                </tr>
              </thead>

              <tbody>
                {report.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>
                      No attendance yet
                    </td>
                  </tr>
                ) : (
                  report.map((s, i) => (
                    <tr key={i}>
                      <td>{s.studentName}</td>

                      <td>
                        <span style={{
                          padding: "5px 10px",
                          borderRadius: 20,
                          background: "#dcfce7",
                          color: "#16a34a",
                          fontWeight: 600,
                        }}>
                          {s.status || "Present"}
                        </span>
                      </td>

                      {/* ✅ وقت الحضور */}
                      <td>
                        {s.scanTime || s.attendedAt || s.time
                          ? new Date(s.scanTime || s.attendedAt || s.time).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav */}
  <nav className="mobile-nav">
  <ul>
    <li className="active" >
      📘 Courses
    </li>

    <li onClick={() => navigate("/attendance")}>
      📊 Attendance
    </li>

    {/* Theme Button */}
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