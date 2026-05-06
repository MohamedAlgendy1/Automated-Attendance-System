import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles/attendanceOverview.css";
import { useTheme } from "../context/ThemeContext";
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
const { theme, toggleTheme } = useTheme();
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
          <button className="theme-toggle" onClick={toggleTheme}>
  {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
</button>

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