import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./../styles/courseDetails.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ جيب courses الدكتور الحالي بس من localStorage
  const lecturerProfile = JSON.parse(localStorage.getItem("lecturerProfile")) || {};
  const lecturerEmail = lecturerProfile.email || "default";
  const courses = JSON.parse(localStorage.getItem(`courses_${lecturerEmail}`)) || [];
  const course = courses[id];

  const [lectures, setLectures] = useState(() => {
    return JSON.parse(localStorage.getItem(`lectures_${course?.code}`)) || [];
  });

  const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrExpiry, setQrExpiry] = useState(null);

  const [form, setForm] = useState({
    title: "",
    classroom: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    if (course?.code) {
      localStorage.setItem(`lectures_${course.code}`, JSON.stringify(lectures));
    }
  }, [lectures, course]);

  if (!course) return <h2>Course not found</h2>;

  const handleAddLecture = (e) => {
    e.preventDefault();
    if (!form.title || !form.classroom || !form.start || !form.end) return;

    if (editingIndex !== null) {
      const updated = [...lectures];
      updated[editingIndex] = form;
      setLectures(updated);
      setEditingIndex(null);
    } else {
      setLectures([...lectures, form]);
    }

    setForm({ title: "", classroom: "", start: "", end: "" });
    setShowModal(false);
  };

  const handleDelete = (index) => {
    setLectures(lectures.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setForm(lectures[index]);
    setEditingIndex(index);
    setShowModal(true);
  };

  return (
    <div className="dashboard course-details-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li className="active">📘 My Courses</li>
            <li onClick={() => navigate("/attendance")}>📊 Attendance Overview</li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            {/* ✅ اسم الدكتور الحقيقي */}
            <div className="avatar">
              {lecturerProfile.name?.[0]?.toUpperCase() || "L"}
            </div>
            <div>
              <p>{lecturerProfile.name || "Lecturer"}</p>
              <span>Lecturer</span>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("role");
              localStorage.removeItem("lecturerProfile");
              navigate("/");
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>{course.name}</h1>

        <p className="back" onClick={() => navigate("/lecturer")}>
          ← Back to Courses
        </p>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <p>Course Code</p>
            <h2>{course.code}</h2>
          </div>
          <div className="card">
            <p>Enrollment Password</p>
            <h2>{course.password}</h2>
          </div>
          <div className="card">
            <p>Total Lectures</p>
            <h2>{lectures.length}</h2>
          </div>
          <div className="card">
            <p>Enrolled Students</p>
            <h2>
              {(() => {
                const allStudents = JSON.parse(localStorage.getItem("students")) || [];
                return allStudents.filter((student) => {
                  const studentCourses = JSON.parse(
                    localStorage.getItem(`studentCourses_${student.email}`)
                  ) || [];
                  return studentCourses.find((c) => c.code === course.code);
                }).length;
              })()}
            </h2>
          </div>
        </div>

        {/* Lectures Table */}
        <div className="table-box">
          <div className="table-header">
            <h2>Lectures</h2>
            <button
              className="enroll-btn"
              onClick={() => {
                setEditingIndex(null);
                setForm({ title: "", classroom: "", start: "", end: "" });
                setShowModal(true);
              }}
            >
              + Add Lecture
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Classroom</th>
                <th>Start</th>
                <th>End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                    No lectures yet
                  </td>
                </tr>
              ) : (
                lectures.map((l, i) => (
                  <tr key={i}>
                    <td>{l.title}</td>
                    <td>{l.classroom}</td>
                    <td>{new Date(l.start).toLocaleString()}</td>
                    <td>{new Date(l.end).toLocaleString()}</td>
                    <td className="actions">
                      <span onClick={() => {
                        setSelectedQR(i);
                        setQrExpiry(Date.now() + 10 * 60 * 1000);
                      }}>📷</span>
                      <span onClick={() => navigate(`/attendance-records/${id}/${i}`)}>📊</span>
                      <span onClick={() => handleEdit(i)}>✏️</span>
                      <span onClick={() => handleDelete(i)}>🗑️</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* QR Box */}
        {selectedQR !== null && lectures[selectedQR] && (
          <div className="qr-box">
            <h2>Scan this QR Code</h2>

            <QRCodeCanvas
              value={JSON.stringify({
                courseCode: course.code,
                lectureIndex: selectedQR,
                lecture: lectures[selectedQR],
                classroom: (() => {
                  const found = classrooms.find(
                    (c) => c.name === lectures[selectedQR]?.classroom
                  );
                  return found
                    ? { lat: found.lat, lng: found.lng, radius: found.radius }
                    : null;
                })(),
                expiresAt: qrExpiry,
              })}
              size={200}
            />

            <p style={{ color: "#888", fontSize: 13 }}>Expires in 10 minutes</p>
            <button onClick={() => {
              setSelectedQR(null);
              setQrExpiry(null);
            }}>Close</button>
          </div>
        )}

        {/* Enrolled Students */}
        <div className="table-box">
          <h2>Enrolled Students & Attendance</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Attended</th>
                <th>Total</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const allStudents = JSON.parse(localStorage.getItem("students")) || [];
                const enrolled = allStudents.filter((student) => {
                  const studentCourses = JSON.parse(
                    localStorage.getItem(`studentCourses_${student.email}`)
                  ) || [];
                  return studentCourses.find((c) => c.code === course.code);
                });

                if (enrolled.length === 0) {
                  return (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#888" }}>
                        No students enrolled yet
                      </td>
                    </tr>
                  );
                }

                return enrolled.map((student) => {
                  const attendance = JSON.parse(
                    localStorage.getItem(`attendance_${course.code}_${student.email}`)
                  ) || [];
                  const attendedCount = attendance.length;
                  const total = lectures.length;
                  const percent = total === 0
                    ? 0
                    : Math.round((attendedCount / total) * 100);

                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{attendedCount}</td>
                      <td>{total}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            flex: 1, height: 8, background: "#e5e7eb",
                            borderRadius: 999, overflow: "hidden"
                          }}>
                            <div style={{
                              width: `${percent}%`, height: "100%",
                              background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
                              borderRadius: 999,
                            }} />
                          </div>
                          <span style={{
                            fontWeight: 700,
                            color: percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626"
                          }}>
                            {percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingIndex !== null ? "Edit Lecture" : "Add Lecture"}</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleAddLecture}>
              <div className="form-group">
                <label>Lecture Title</label>
                <input
                  placeholder="Lecture Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  value={form.start}
                  onChange={(e) => setForm({ ...form, start: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={form.end}
                  onChange={(e) => setForm({ ...form, end: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Classroom</label>
                <select
                  value={form.classroom}
                  onChange={(e) => setForm({ ...form, classroom: e.target.value })}
                >
                  <option value="">Select classroom</option>
                  {classrooms.length === 0 ? (
                    <option disabled>No classrooms added yet</option>
                  ) : (
                    classrooms.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} — {c.building}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button type="submit" className="modal-btn">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;