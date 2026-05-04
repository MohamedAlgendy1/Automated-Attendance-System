import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseJwt, getErrorMessage } from "../services/api";
import { enrollInCourse, getMyCourses, getMyAttendanceHistory } from "../services/studentService";
import { getLecturesByCourse } from "../services/lectureService";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [enrollForm, setEnrollForm] = useState({ courseCode: "" });
  const [enrollError, setEnrollError] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);

  const navigate = useNavigate();

  // ================= TOKEN =================
  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const studentName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Student";

  const firstName = studentName.split(" ")[0] || "Student";

  // ================= LOAD DATA =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const courses = await getMyCourses();
        setMyCourses(courses);

        const attendanceData = await getMyAttendanceHistory();
        setAttendance(attendanceData);
      } catch (err) {
        console.error(getErrorMessage(err));
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refresh]);

  // ================= ENROLL =================
 const handleEnroll = async (e) => {
  e.preventDefault();
  setEnrollError("");
  setEnrollLoading(true); // 👈 مهم

  if (!enrollForm.courseCode) {
    setEnrollError("Please enter course code");
    setEnrollLoading(false);
    return;
  }

  try {
    await enrollInCourse(enrollForm.courseCode);

    setShowModal(false);
    setEnrollForm({ courseCode: "" });
    setRefresh((r) => r + 1);
  } catch (err) {
    setEnrollError(getErrorMessage(err));
  } finally {
    setEnrollLoading(false); // 👈 مهم
  }
};

  // ================= STATS =================
  const attendedLectures = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const totalLectures = myCourses.reduce(
    (sum, c) => sum + (c.lecturesCount || 0),
    0
  );

  const overallPercent =
    totalLectures === 0
      ? 0
      : Math.round((attendedLectures / totalLectures) * 100);

  // ================= COURSE PERCENT =================
  const getCourseAttendancePercent = (courseId) => {
    const courseAttended = attendance.filter(
      (a) => a.status === "Present" && a.courseId === courseId
    ).length;

    const course = myCourses.find((c) => c.courseId === courseId);
    const total = course?.lecturesCount || 0;

    return total === 0
      ? 0
      : Math.round((courseAttended / total) * 100);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ================= UI =================
  return (
    <div className="dashboard student-page">

      {/* Sidebar */}
      <div className="sidebar">
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

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">{firstName[0]}</div>
            <div>
              <p>{firstName}</p>
              <span>Student</span>
            </div>
          </div>

          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div className="main">

        {activePage === "courses" && (
          <>
            <h1>Student Dashboard</h1>

            {/* Cards */}
            <div className="cards">
              <div className="card">
                <p>My Courses</p>
                <h2>{myCourses.length}</h2>
              </div>

              <div className="card">
                <p>Attended Lectures</p>
                <h2>{attendedLectures}</h2>
              </div>

              <div className="card">
                <p>Overall Attendance</p>
                <h2>{overallPercent}%</h2>
              </div>
            </div>

            {/* Courses */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="courses-grid">
                {myCourses.map((course) => {
                  const name = course.name || course.courseName;
                  const code = course.code || course.courseCode;

                  const percent = getCourseAttendancePercent(course.courseId);

                  return (
                    <div
                      key={course.id}
                      className="course-card"
                      onClick={() =>
                        navigate(`/student/course/${course.courseId}`)
                      }
                    >
                      <h3>{name}</h3>
                      <span>{code}</span>

                      <div className="attendance-box">
                        <div
                          className="progress-circle"
                          style={{
                            background: `conic-gradient(#22c55e ${percent}%, #e5e7eb 0%)`,
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

        {/* Profile */}
        {activePage === "profile" && (
          <>
            <h1>My Profile</h1>
            <div className="profile-card">
              <h2>{studentName}</h2>
              <p>Student</p>
            </div>
          </>
        )}
      </div>

      {/* Enroll Modal */}
      {showModal && (
        <div className="modal">
          <form onSubmit={handleEnroll}>
            <input
              placeholder="Course Code"
              value={enrollForm.courseCode}
              onChange={(e) =>
                setEnrollForm({ courseCode: e.target.value })
              }
            />

            {enrollError && <p style={{ color: "red" }}>{enrollError}</p>}

            <button type="submit">
              {enrollLoading ? "Loading..." : "Enroll"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;