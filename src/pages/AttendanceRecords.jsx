import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceRecords.css";
import api, { getErrorMessage } from "../services/api";

function AttendanceRecords() {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const lecturerName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Lecturer";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/lecturer/AttendanceReport/${lectureId}`);
        setReport(res.data);
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lectureId]);

  return (
    <div className="dashboard records-page">
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
            <div><p>{lecturerName}</p><span>Lecturer</span></div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <h1>Attendance Records</h1>
        <p onClick={() => navigate(-1)} style={{ cursor: "pointer", color: "#2563eb", marginBottom: 20 }}>← Back</p>

        {loading ? (
          <p>Loading...</p>
        ) : !report ? (
          <p style={{ color: "#888" }}>No data found</p>
        ) : (
          <div className="table-box">
            <table className="table">
              <thead>
                <tr><th>Student</th><th>Attended</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(report.students || report || []).map((s, i) => (
                  <tr key={i}>
                    <td>{s.studentName || s.name}</td>
                    <td>{s.attendedLectures}</td>
                    <td>{s.totalLectures}</td>
                    <td>
                      <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: s.attendedLectures > 0 ? "#dcfce7" : "#fee2e2", color: s.attendedLectures > 0 ? "#16a34a" : "#dc2626" }}>
                        {s.attendedLectures > 0 ? "✅ Attended" : "❌ Absent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceRecords;