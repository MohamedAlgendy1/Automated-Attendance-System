import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EnrollForm from "../components/EnrollForm";

function StudentDashboard({ courses }) {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✅ البروفايل أولاً
  const [profile, setProfile] = useState(() => {
    const data = localStorage.getItem("profile");
    return data
      ? JSON.parse(data)
      : {
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          ssn: "",
          username: "",
          section: "",
          level: "",
          department: "",
        };
  });

  // ✅ الإيميل من البروفايل
  const studentEmail = profile.email || "unknown";

  // ✅ كورسات الطالب بـ key مخصص بالإيميل
  const [myCourses, setMyCourses] = useState(() => {
    return JSON.parse(localStorage.getItem(`studentCourses_${studentEmail}`)) || [];
  });

  // ✅ حفظ كورسات الطالب
  useEffect(() => {
    localStorage.setItem(`studentCourses_${studentEmail}`, JSON.stringify(myCourses));
  }, [myCourses]);

  // ✅ Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    showToast("Profile updated successfully ✅", "success");
  };

  return (
    <div className="dashboard student-page">
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
            <div className="avatar">
              {profile.firstName?.[0]?.toUpperCase() || "U"}
            </div>
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

        {/* ========= COURSES ========= */}
        {activePage === "courses" && (
          <>
            <h1>Student Dashboard</h1>

            <div className="cards">
              <div className="card">
                <p>My Courses</p>
                <h2>{myCourses.length}</h2>
              </div>

              <div className="card">
                <p>Available Courses</p>
                <h2>{courses.length}</h2>
              </div>

              <div className="card">
                <p>Overall Attendance</p>
                <h2>
                  {(() => {
                    let totalLectures = 0;
                    let totalAttended = 0;

                    myCourses.forEach((course) => {
                      const lectures =
                        JSON.parse(localStorage.getItem(`lectures_${course.code}`)) || [];
                      const attendance =
                        JSON.parse(localStorage.getItem(`attendance_${course.code}_${studentEmail}`)) || [];

                      totalLectures += lectures.length;
                      totalAttended += attendance.length;
                    });

                    const percent =
                      totalLectures === 0
                        ? 0
                        : Math.round((totalAttended / totalLectures) * 100);

                    return percent + "%";
                  })()}
                </h2>
              </div>
            </div>

            <div className="top-bar">
              <button className="enroll-btn" onClick={() => setShowModal(true)}>
                📘 Enroll in Course
              </button>
            </div>

            {myCourses.length === 0 ? (
              <div className="empty-box">
                <div className="icon">📖</div>
                <p>You're not enrolled in any courses yet.</p>
                <span>Use the "Enroll in Course" button to join a course.</span>
              </div>
            ) : (
              <div className="courses-grid">
                {myCourses.map((course, index) => {
                  const lectures =
                    JSON.parse(localStorage.getItem(`lectures_${course.code}`)) || [];
                  const records =
                    JSON.parse(localStorage.getItem(`attendance_${course.code}_${studentEmail}`)) || [];

                  const totalLectures = lectures.length;
                  const attended = records.length;
                  const percent =
                    totalLectures === 0
                      ? 0
                      : Math.round((attended / totalLectures) * 100);

                  return (
                    <div
                      key={index}
                      className="course-card"
                      onClick={() => navigate(`/student/course/${course.code}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <h3>{course.name}</h3>
                      <span className="course-code">{course.code}</span>

                      <div className="attendance-box">
                        <div
                          className="progress-circle"
                          style={{
                            background: `conic-gradient(
                              #22c55e 0% ${percent}%,
                              #e5e7eb ${percent}% 100%
                            )`,
                          }}
                        >
                          <span>{percent}%</span>
                        </div>
                        <p>My Attendance</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ========= PROFILE ========= */}
        {activePage === "profile" && (
          <>
            <h1>My Profile</h1>

            <div className="profile-card">
              <div className="profile-header">
                <div className="big-avatar">
                  {profile.firstName?.[0]?.toUpperCase() || "U"}
                </div>
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
                  showToast("Invalid course", "error");
                  return;
                }

                const exists = myCourses.find((c) => c.code === course.code);
                if (exists) {
                  showToast("Already enrolled!", "error");
                  return;
                }

                setMyCourses([...myCourses, course]);
                setShowModal(false);
                showToast("Enrolled successfully 🎉", "success");
              }}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default StudentDashboard;