import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { parseJwt, getErrorMessage } from "../services/api";
import { enrollInCourse, getMyCourses } from "../services/studentService";
import { getMyAttendanceHistory } from "../services/studentService";
import { getLecturesByCourse } from "../services/lectureService";

function StudentDashboard() {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
const [myCourses, setMyCourses] = useState([]);
const [loading, setLoading] = useState(true);
const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
  const [enrollForm, setEnrollForm] = useState({ courseCode: "" });
 // const [enrollForm, setEnrollForm] = useState({ courseId: "", courseCode: "" });
  const [enrollError, setEnrollError] = useState("");
  const [enrollLoading, setEnrollLoading] = useState(false);
const [lecturesMap, setLecturesMap] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
const [attendance, setAttendance] = useState([]);
const [totalLectures, setTotalLectures] = useState(0);
  // ✅ بيانات الطالب من الـ token
  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";
  const studentEmail = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ جيب كورسات الطالب من الـ Backend
const handleEnroll = async (e) => {
  e.preventDefault();
  setEnrollError("");

  if (!enrollForm.courseCode) {
    setEnrollError("Please enter course code");
    return;
  }

  console.log("ENROLL PAYLOAD:", {
    courseCode: enrollForm.courseCode,
  });

  setEnrollLoading(true);

  try {
    //await enrollInCourse(null, enrollForm.courseCode);
    await enrollInCourse(enrollForm.courseCode);

    showToast("Enrolled successfully 🎉");
    setShowModal(false);
    setEnrollForm({ courseCode: "" });
    setRefresh((r) => r + 1);
  } catch (err) {
console.log("FULL ERROR:", err.response);
  console.log("DATA:", err.response?.data);

    setEnrollError(getErrorMessage(err));
  } finally {
    setEnrollLoading(false);
  }
};


useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const courses = await getMyCourses();
      setMyCourses(courses);

      const attendanceData = await getMyAttendanceHistory();
      setAttendance(attendanceData);

      const lecturesArrays = await Promise.all(
  courses.map((c) => getLecturesByCourse(c.courseId))
);

// ✅ اعمل map تربط كل كورس بالمحاضرات بتاعته
const map = {};
courses.forEach((c, i) => {
  map[c.courseId] = lecturesArrays[i];
});

setLecturesMap(map);

// (اختياري لو لسه محتاج الإجمالي)
const lecturesCount = lecturesArrays.reduce(
  (sum, arr) => sum + arr.length,
  0
);

setTotalLectures(lecturesCount);
      

    } catch (err) {
      console.error(getErrorMessage(err));
      setMyCourses([]);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [refresh]);



  const attendedLectures = attendance.filter(
  (a) => a.status === "Present"
).length;

const overallPercent =
  totalLectures === 0
    ? 0
    : Math.round((attendedLectures / totalLectures) * 100);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const nameParts = studentName.split(" ");
  const firstName = nameParts[0] || "Student";

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
            <div className="avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
            <div>
              <p>{firstName}</p>
              <span>Student</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {activePage === "courses" && (
          <>
            <h1>Student Dashboard</h1>

            <div className="cards">
              <div className="card"><p>My Courses</p><h2>{myCourses.length}</h2></div>
              <div className="card"><p>Attended Lectures</p><h2>{attendedLectures}</h2></div>
              <div className="card"><p>Overall Attendance</p><h2>{overallPercent}%</h2></div>
            </div>

            <div className="top-bar">
              <button className="enroll-btn" onClick={() => setShowModal(true)}>
                📘 Enroll in Course
              </button>
            </div>

            {loading ? (
              <p style={{ color: "#64748b", marginTop: 20 }}>Loading...</p>
            ) : myCourses.length === 0 ? (
              <div className="empty-box">
                <div className="icon">📖</div>
                <p>You're not enrolled in any courses yet.</p>
                <span>Use the "Enroll in Course" button to join a course.</span>
              </div>
            ) : (
             <div className="courses-grid">
  {myCourses.map((course) => {
    const name = course.name || course.courseName || "";
    const code = course.code || course.courseCode || "";
console.log("LECTURE:", lectures[0]);
    // ✅ هات المحاضرات الخاصة بالكورس
    const lectures = lecturesMap[course.courseId] || [];

    // ✅ احسب عدد المحاضرات اللي حضرتها
    const attended = lectures.filter((lec) =>
      attendance.some(
        (a) =>
          a.courseLectureId === lec.courseLectureId &&
          a.status === "Present"
      )
    ).length;

    const total = lectures.length;

    const percent =
      total === 0 ? 0 : Math.round((attended / total) * 100);

    return (
      <div
        key={course.courseId}
        className="course-card"
        onClick={() => navigate(`/student/course/${course.courseId}`)}
        style={{ cursor: "pointer" }}
      >
        <h3>{name}</h3>
        <span className="course-code">{code}</span>

        <div className="attendance-box">
          <div
            className="progress-circle"
            style={{
              background: `conic-gradient(#22c55e ${percent}%, #e5e7eb ${percent}% 100%)`,
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

        {activePage === "profile" && (
          <>
            <h1>My Profile</h1>
            <div className="profile-card">
              <div className="profile-header">
                <div className="big-avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
                <div>
                  <h2>{studentName}</h2>
                  <p>Student</p>
                </div>
              </div>
              <div className="form-grid">
                <input value={studentName} disabled className="full" placeholder="Full Name" />
                <input value={studentEmail} disabled className="full" placeholder="Email" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enroll Modal */}
       {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Enroll in a Course</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>
            <form onSubmit={handleEnroll}>
              <input
                placeholder="Course Code (required)"
                value={enrollForm.courseCode}
                onChange={(e) => setEnrollForm({ ...enrollForm, courseCode: e.target.value })}
                required
              />
              {/* <input
                placeholder="Course ID (optional)"
                type="number"
                value={enrollForm.courseId}
                onChange={(e) => setEnrollForm({ ...enrollForm, courseId: e.target.value })}
              /> */}
              {enrollError && <p style={{ color: "red" }}>{enrollError}</p>}
              <button type="submit" disabled={enrollLoading}>
                {enrollLoading ? "Enrolling..." : "Enroll"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div> 
  );
}

export default StudentDashboard;