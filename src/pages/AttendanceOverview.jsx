import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceOverview.css";
import api, { getErrorMessage, getUserIdFromToken } from "../services/api";

function AttendanceOverview() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const lecturerName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Lecturer";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/course/AllCourses", {
          params: { pagenumber: 1, pagesize: 100 }
        });
        setCourses(res.data?.items || res.data || []);
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="dashboard attendance-page">
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
            <div className="avatar">{lecturerName?.[0]?.toUpperCase() || "L"}</div>
            <div><p>{lecturerName}</p><span>Lecturer</span></div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <h1>Attendance Overview</h1>
        <div className="cards">
          <div className="card"><p>Courses</p><h2>{courses.length}</h2></div>
        </div>

        {loading ? <p>Loading...</p> : (
          courses.map((course) => (
            <CourseAttendanceBlock key={course.id} course={course} navigate={navigate} />
          ))
        )}
      </div>
    </div>
  );
}

function CourseAttendanceBlock({ course, navigate }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/lecturer/AttendanceReport/${course.id}`)
      .then((res) => setReport(res.data))
      .catch(() => setReport(null));
  }, [course.id]);

  const students = report?.students || report || [];

  return (
    <div className="table-box">
      <h2>{course.name || course.courseName} ({course.code || course.courseCode})</h2>
      <p style={{ color: "#64748b", marginBottom: 15 }}>{students.length} students</p>

      <table className="table">
        <thead>
          <tr><th>Student</th><th>Attended</th><th>Total</th><th>Percentage</th></tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4" className="empty">No students enrolled yet</td></tr>
          ) : (
            students.map((s, i) => {
              const percent = s.totalLectures === 0 ? 0 : Math.round((s.attendedLectures / s.totalLectures) * 100);
              return (
                <tr key={i}>
                  <td>{s.studentName || s.name}</td>
                  <td>{s.attendedLectures}</td>
                  <td>{s.totalLectures}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 999 }} />
                      </div>
                      <span style={{ fontWeight: 700, color: percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626" }}>{percent}%</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceOverview;