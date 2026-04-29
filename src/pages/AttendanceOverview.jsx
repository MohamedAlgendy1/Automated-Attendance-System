import { useNavigate } from "react-router-dom";
import "./../styles/attendanceOverview.css";

function AttendanceOverview() {
  const navigate = useNavigate();

  // ✅ جيب courses الدكتور الحالي بس
  const lecturerProfile = JSON.parse(localStorage.getItem("lecturerProfile")) || {};
  const lecturerEmail = lecturerProfile.email || "default";
  const courses = JSON.parse(localStorage.getItem(`courses_${lecturerEmail}`)) || [];
  const allStudents = JSON.parse(localStorage.getItem("students")) || [];

  const totalLectures = courses.reduce((sum, course) => {
    const lectures = JSON.parse(localStorage.getItem(`lectures_${course.code}`)) || [];
    return sum + lectures.length;
  }, 0);

  const enrolledEmails = new Set();
  courses.forEach((course) => {
    allStudents.forEach((student) => {
      const sc = JSON.parse(localStorage.getItem(`studentCourses_${student.email}`)) || [];
      if (sc.find((c) => c.code === course.code)) enrolledEmails.add(student.email);
    });
  });

  return (
    <div className="dashboard attendance-page">
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>📘 My Courses</li>
            <li className="active">📊 Attendance Overview</li>
          </ul>
        </div>
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">{lecturerProfile.name?.[0]?.toUpperCase() || "L"}</div>
            <div>
              <p>{lecturerProfile.name || "Lecturer"}</p>
              <span>Lecturer</span>
            </div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("isLoggedIn"); localStorage.removeItem("role"); localStorage.removeItem("lecturerProfile"); navigate("/"); }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="main">
        <h1>Attendance Overview</h1>

        <div className="cards">
          <div className="card"><p>Courses</p><h2>{courses.length}</h2></div>
          <div className="card"><p>Total Lectures</p><h2>{totalLectures}</h2></div>
          <div className="card"><p>Enrolled Students</p><h2>{enrolledEmails.size}</h2></div>
        </div>

        {courses.map((course, courseIndex) => {
          const lectures = JSON.parse(localStorage.getItem(`lectures_${course.code}`)) || [];
          const enrolledStudents = allStudents.filter((student) => {
            const sc = JSON.parse(localStorage.getItem(`studentCourses_${student.email}`)) || [];
            return sc.find((c) => c.code === course.code);
          });

          return (
            <div className="table-box" key={courseIndex}>
              <h2>{course.name} ({course.code})</h2>
              <p style={{ color: "#64748b", marginBottom: 15 }}>
                {lectures.length} lectures · {enrolledStudents.length} students
              </p>

             <table className="table">
  <thead>
    <tr>
      <th>Student</th>
      <th>Email</th>
      <th>Attended</th>
      <th>Total</th>
      <th>Percentage</th>
    </tr>
  </thead>

  <tbody>
    {enrolledStudents.length === 0 ? (
      <tr>
        <td colSpan="5" className="empty">
          No students enrolled yet
        </td>
      </tr>
    ) : (
      enrolledStudents.map((student) => {
        const att =
          JSON.parse(
            localStorage.getItem(
              `attendance_${course.code}_${student.email}`
            )
          ) || [];

        const attendedCount = att.length;
        const total = lectures.length;

        const percent =
          total === 0
            ? 0
            : Math.round((attendedCount / total) * 100);

        return (
          <tr key={student.id}>
            <td data-label="Student">{student.name}</td>

            <td data-label="Email">{student.email}</td>

            <td data-label="Attended">{attendedCount}</td>

            <td data-label="Total">{total}</td>

            <td data-label="Percentage">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#e5e7eb",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background:
                        percent >= 75
                          ? "#22c55e"
                          : percent >= 50
                          ? "#f59e0b"
                          : "#ef4444",
                      borderRadius: 999,
                      transition: "width 0.3s",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontWeight: 700,
                    color:
                      percent >= 75
                        ? "#16a34a"
                        : percent >= 50
                        ? "#d97706"
                        : "#dc2626",
                  }}
                >
                  {percent}%
                </span>
              </div>
            </td>
          </tr>
        );
      })
    )}
  </tbody>
</table>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttendanceOverview;