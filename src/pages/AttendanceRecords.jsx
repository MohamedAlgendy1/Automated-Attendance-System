import { useParams, useNavigate } from "react-router-dom";
import "./../styles/attendanceRecords.css";

function AttendanceRecords({ courses }) {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const course = courses[courseId];
  const lectureIndex = parseInt(lectureId);

  // ✅ المحاضرات من localStorage
  const lectures = JSON.parse(
    localStorage.getItem(`lectures_${course?.code}`)
  ) || [];

  const lecture = lectures[lectureIndex];

  // ✅ كل الطلاب المسجلين في النظام
  const allStudents = JSON.parse(localStorage.getItem("students")) || [];

  // ✅ الطلاب المسجلين في الكورس ده بس
  const enrolledStudents = allStudents.filter((student) => {
    const studentCourses = JSON.parse(
      localStorage.getItem(`studentCourses_${student.email}`)
    ) || [];
    return studentCourses.find((c) => c.code === course?.code);
  });

  // ✅ تحقق مين حضر المحاضرة دي
  const getStatus = (studentEmail) => {
    const attendance = JSON.parse(
      localStorage.getItem(`attendance_${course?.code}_${studentEmail}`)
    ) || [];
    return attendance.includes(lectureIndex);
  };

  if (!course) return <h2>Course not found</h2>;

  return (
    <div className="dashboard records-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
            <li onClick={() => navigate("/attendance")}>📊 Attendance Overview</li>
          </ul>
        </div>

        <div className="user-box">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("role");
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

        <p onClick={() => navigate(-1)} style={{ cursor: "pointer", color: "#2563eb", marginBottom: 20 }}>
          ← Back
        </p>

        {/* Info Cards */}
        <div className="cards" style={{ marginBottom: 20 }}>
          <div className="card">
            <p>Course</p>
            <h2>{course.code}</h2>
          </div>
          <div className="card">
            <p>Lecture</p>
            <h2>{lecture?.title || `Lecture ${lectureIndex + 1}`}</h2>
          </div>
          <div className="card">
            <p>Date</p>
            <h2 style={{ fontSize: 16 }}>
              {lecture?.start ? new Date(lecture.start).toLocaleDateString() : "-"}
            </h2>
          </div>
          <div className="card">
            <p>Attended</p>
            <h2 style={{ color: "#22c55e" }}>
              {enrolledStudents.filter((s) => getStatus(s.email)).length} / {enrolledStudents.length}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="table-box">
          <h2>
            {course.name} — {lecture?.title || `Lecture ${lectureIndex + 1}`}
          </h2>

          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Section</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {enrolledStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    No students enrolled yet
                  </td>
                </tr>
              ) : (
                enrolledStudents.map((student) => {
                  const attended = getStatus(student.email);
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.section || "-"}</td>
                      <td>
                        <span style={{
                          padding: "5px 12px",
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          background: attended ? "#dcfce7" : "#fee2e2",
                          color: attended ? "#16a34a" : "#dc2626",
                        }}>
                          {attended ? "✅ Attended" : "❌ Absent"}
                        </span>
                      </td>
                      <td>{attended ? new Date(lecture?.start).toLocaleTimeString() : "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecords;