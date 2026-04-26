import { useNavigate } from "react-router-dom";
import "./../styles/attendanceOverview.css";

function AttendanceOverview({ courses }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard attendance-page">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>
              📘 My Courses
            </li>

            <li className="active">
              📊 Attendance Overview
            </li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">A</div>
            <div>
              <p>Ahmed Hassan</p>
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

      {/* ================= MAIN ================= */}
      <div className="main">
        <h1>Attendance Overview</h1>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <p>Courses</p>
            <h2>{courses.length}</h2>
          </div>

          <div className="card">
            <p>Lectures</p>
            <h2>0</h2>
          </div>

          <div className="card">
            <p>Students</p>
            <h2>0</h2>
          </div>
        </div>

        {/* Table Box */}
        <div className="table-box">
          <h2>Attendance Across All Courses</h2>

          <div className="course-attendance">
            <h3>
              {courses[0]
                ? `${courses[0].name} (${courses[0].code})`
                : "No Courses"}
            </h3>

            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Attended</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="3" className="empty">
                    No students enrolled yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceOverview;