import "./../styles/dashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("courses");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li
              className={activePage === "courses" ? "active" : ""}
              onClick={() => setActivePage("courses")}
            >
              📘 My Courses
            </li>

            <li
              className={activePage === "profile" ? "active" : ""}
              onClick={() => setActivePage("profile")}
            >
              👤 Profile
            </li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">U</div>
            <div>
              <p>User Name</p>
              <span>Student</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {activePage === "courses" && (
          <>
            <h1>Student Dashboard</h1>

            <div className="cards">
              <div className="card">
                <p>Courses</p>
                <h2>0</h2>
              </div>

              <div className="card">
                <p>Attended Lectures</p>
                <h2>0</h2>
              </div>

              <div className="card">
                <p>Overall Attendance</p>
                <h2>0%</h2>
              </div>
            </div>

            <div className="top-bar">
              <button className="enroll-btn">📘 Enroll in Course</button>
            </div>

            <div className="empty-box">
              <div className="icon">📖</div>
              <p>You're not enrolled in any courses yet.</p>
              <span>Use the "Enroll in Course" button to join a course.</span>
            </div>
          </>
        )}

        {activePage === "profile" && (
          <>
            <h1>My Profile</h1>

            <div className="profile-card">
              <div className="profile-header">
                <div className="big-avatar">U</div>
                <div>
                  <h2>User Name</h2>
                  <p>Student</p>
                </div>
              </div>

              <div className="form-grid">
                <input placeholder="First Name" />
                <input placeholder="Middle Name" />
                <input placeholder="Last Name" />

                <input placeholder="Email" className="full" />
                <input placeholder="SSN" className="full" />
                <input placeholder="Username" className="full" />

                <input placeholder="Section" />
                <input placeholder="Level" />
                <input placeholder="Department" />
              </div>

              <button className="save-btn">Save Changes</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;