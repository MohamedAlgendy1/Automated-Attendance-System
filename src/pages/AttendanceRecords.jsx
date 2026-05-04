import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceRecords.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getAttendanceReport } from "../services/lectureService";
import { getCourseById } from "../services/courseService";

function AttendanceRecords() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

 useEffect(() => {
  const load = async () => {
    try {
      const [courseRes] = await Promise.all([
        getCourseById(courseId),
      ]);

      setCourse(courseRes);

      // ⚠️ هنا لازم lectureId (مش courseId)
      const lectureId = courseRes.latestLectureId; // مثال

      if (lectureId) {
        const reportRes = await getAttendanceReport(lectureId);
        setReport(reportRes.report || []);
      }

    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  load();
}, [courseId]);

  return (
    <div className="dashboard records-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
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

      {/* Main */}
      <div className="main">
        <h1>Attendance Records</h1>

        <p
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer", color: "#2563eb", marginBottom: 20 }}
        >
          ← Back
        </p>

        {/* Cards */}
        <div className="cards" style={{ marginBottom: 20 }}>
          <div className="card">
            <p>Course</p>
            <h2>{course?.code || course?.courseCode || "-"}</h2>
          </div>

          <div className="card">
            <p>Attended</p>
            <h2 style={{ color: "#22c55e" }}>
              {report.filter((s) => (s.attendedLectures ?? 0) > 0).length} /{" "}
              {report.length}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="table-box">
          <h2>{course?.name || course?.courseName || "Course"}</h2>

          {loading ? (
            <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>
              Loading...
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Attended</th>
                  <th>Total</th>
                  <th>Percentage</th> {/* ✔️ إضافة العمود */}
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {report.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "#888",
                      }}
                    >
                      No students enrolled yet
                    </td>
                  </tr>
                ) : (
                  report.map((s, i) => {
                    const attended = s.attendedLectures ?? s.attended ?? 0;
                    const total = s.totalLectures ?? s.total ?? 0;
                    const percent =
                      total === 0
                        ? 0
                        : Math.round((attended / total) * 100);

                    return (
                      <tr key={i}>
                        <td>{s.studentName || s.name || "-"}</td>
                        <td>{attended}</td>
                        <td>{total}</td>

                        {/* ✔️ Percentage column */}
                        <td>
                          <span
                            style={{
                              fontWeight: 700,
                              color:
                                percent >= 75
                                  ? "#16a34a"
                                  : percent >= 50
                                  ? "#d97706"
                                  : "#dc2626",
                            }}
                          >
                            {percent}%
                          </span>
                        </td>

                        <td>
                          <span
                            style={{
                              padding: "5px 12px",
                              borderRadius: 20,
                              fontSize: 13,
                              fontWeight: 600,
                              background:
                                attended > 0 ? "#dcfce7" : "#fee2e2",
                              color: attended > 0 ? "#16a34a" : "#dc2626",
                            }}
                          >
                            {attended > 0 ? "✅ Attended" : "❌ Absent"}
                          </span>
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
    </div>
  );
}

export default AttendanceRecords;