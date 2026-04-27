import { useParams, useNavigate } from "react-router-dom";
import "./../styles/attendanceRecords.css";

function AttendanceRecords({ courses }) {
  const { courseId,lectureId } = useParams();
  const navigate = useNavigate();

  const course = courses[courseId];

  // ❗ حماية من crash
  if (!course) return <h2>Course not found</h2>;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>
              📘 My Courses
            </li>

            <li onClick={() => navigate("/attendance")}>
              📊 Attendance Overview
            </li>
          </ul>
        </div>

        <div className="user-box">
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

        <p onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          ← Back
        </p>

        <div className="table-box">
          <h2>{course.name}</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No attendance yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecords;