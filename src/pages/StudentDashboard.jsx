import "./../styles/dashboard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnrollForm from "../components/EnrollForm";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);

  const [profile, setProfile] = useState(() => {
    const data = localStorage.getItem("profile");
    return data
      ? JSON.parse(data)
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "student@university.edu",
          ssn: "123456789",
          username: "",
          section: "",
          level: "",
          department: "",
        };
  });

  // 🔥 Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    showToast("Profile updated successfully ✅", "success");
  };

  // 🔥 Toast Function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
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
              <p>{profile.firstName || "User Name"}</p>
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
                <h2>{courses.length}</h2>
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
              <button
                className="enroll-btn"
                onClick={() => setShowModal(true)}
              >
                📘 Enroll in Course
              </button>
            </div>

            {courses.length === 0 ? (
              <div className="empty-box">
                <div className="icon">📖</div>
                <p>You're not enrolled in any courses yet.</p>
                <span>
                  Use the "Enroll in Course" button to join a course.
                </span>
              </div>
            ) : (
              <div className="empty-box">
                <div className="icon">📚</div>
                <p>Enrolled Courses:</p>
                {courses.map((c, i) => (
                  <span key={i}>{c.code}</span>
                ))}
              </div>
            )}
          </>
        )}

        {activePage === "profile" && (
          <>
            <h1>My Profile</h1>

            <div className="profile-card">
              <div className="profile-header">
                <div className="big-avatar">U</div>
                <div>
                  <h2>{profile.firstName || "User Name"}</h2>
                  <p>Student</p>
                </div>
              </div>

              <div className="form-grid">
                <input
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />

                <input
                  name="middleName"
                  value={profile.middleName}
                  onChange={handleChange}
                  placeholder="Middle Name"
                />

                <input
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />

                <input
                  name="email"
                  value={profile.email}
                  className="full"
                  disabled
                />

                <input
                  name="ssn"
                  value={profile.ssn}
                  className="full"
                  disabled
                />

                <input
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="full"
                />

                <input
                  name="section"
                  value={profile.section}
                  onChange={handleChange}
                  placeholder="Section"
                />

                <input
                  name="level"
                  value={profile.level}
                  onChange={handleChange}
                  placeholder="Level"
                />

                <input
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  placeholder="Department"
                />
              </div>

              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Enroll in a Course</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <EnrollForm
              onEnroll={(course) => {
                if (!course) {
                  showToast("Please fill all fields", "error");
                  return;
                }

                const exists = courses.find(
                  (c) => c.code === course.code
                );

                if (exists) {
                  showToast("Already enrolled!", "error");
                  return;
                }

                setCourses([...courses, course]);
                setShowModal(false);

                showToast("Enrolled successfully 🎉", "success");
              }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;