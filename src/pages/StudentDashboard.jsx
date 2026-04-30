import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("courses");
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    courseId: "",
    courseCode: "",
  });
  const [enrollError, setEnrollError] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [refresh, setRefresh] = useState(0);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};

  const studentName =
    decoded?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ] || "Student";

  const studentEmail =
    decoded?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    ] || "";

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  // ==========================
  // Load My Courses
  // ==========================
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);

      try {
        const res = await api.get("/student/MyCourses");

        setMyCourses(res.data.courses || []);
      } catch (err) {
        console.error(getErrorMessage(err));
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [refresh]);

  // ==========================
  // Enroll Course
  // ==========================
  const handleEnroll = async (e) => {
    e.preventDefault();

    setEnrollError("");
    setEnrollLoading(true);

    try {
      await api.post("/student/Enrollment", {
        courseId: parseInt(enrollForm.courseId),
        courseCode: enrollForm.courseCode,
      });

      showToast("Enrolled successfully 🎉");

      setShowModal(false);

      setEnrollForm({
        courseId: "",
        courseCode: "",
      });

      setRefresh((prev) => prev + 1);
    } catch (err) {
      setEnrollError(getErrorMessage(err));
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
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
              className={activePage === "history" ? "active" : ""}
              onClick={() => setActivePage("history")}
            >
              📊 Attendance History
            </li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">
              {studentName?.[0]?.toUpperCase() || "S"}
            </div>

            <div>
              <p>{studentName}</p>
              <span>{studentEmail}</span>
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
                <p>My Courses</p>
                <h2>{myCourses.length}</h2>
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

            {loading ? (
              <p style={{ color: "#64748b", marginTop: 20 }}>
                Loading...
              </p>
            ) : myCourses.length === 0 ? (
              <div className="empty-box">
                <div className="icon">📖</div>

                <p>You're not enrolled in any courses yet.</p>

                <span>
                  Use the "Enroll in Course" button to join a course.
                </span>
              </div>
            ) : (
              <div className="courses-grid">
                {Array.isArray(myCourses) &&
                  myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="course-card"
                      onClick={() =>
                        navigate(`/student/course/${course.id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <h3>{course.name || course.courseName}</h3>

                      <span className="course-code">
                        {course.code || course.courseCode}
                      </span>

                      <div className="attendance-box">
                        <div
                          className="progress-circle"
                          style={{
                            background:
                              "conic-gradient(#22c55e 0% 0%, #e5e7eb 0% 100%)",
                          }}
                        >
                          <span>0%</span>
                        </div>

                        <p>My Attendance</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {activePage === "history" && <AttendanceHistory />}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Enroll in a Course</h3>

              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleEnroll}>
              <input
                type="number"
                placeholder="Course ID"
                value={enrollForm.courseId}
                onChange={(e) =>
                  setEnrollForm({
                    ...enrollForm,
                    courseId: e.target.value,
                  })
                }
                required
              />

              <input
                placeholder="Course Code"
                value={enrollForm.courseCode}
                onChange={(e) =>
                  setEnrollForm({
                    ...enrollForm,
                    courseCode: e.target.value,
                  })
                }
                required
              />

              {enrollError && (
                <p style={{ color: "red" }}>{enrollError}</p>
              )}

              <button type="submit" disabled={enrollLoading}>
                {enrollLoading ? "Enrolling..." : "Enroll"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ===================================
// Attendance History Component
// ===================================
function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student/MyAttendanceHistory")
      .then((res) => {
        setHistory(res.data.history || []);
      })
      .catch(() => {
        setHistory([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Attendance History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-box">
          <table className="table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Lecture</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#888",
                    }}
                  >
                    No attendance records yet
                  </td>
                </tr>
              ) : (
                Array.isArray(history) &&
                history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.courseName}</td>
                    <td>{item.lectureTitle}</td>
                    <td>
                      {new Date(
                        item.date || item.recordedAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          background: "#dcfce7",
                          color: "#16a34a",
                        }}
                      >
                        ✅ Attended
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default StudentDashboard;