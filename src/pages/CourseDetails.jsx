import { useRealtime } from "../hooks/useRealtime";
import { broadcast, EVENTS } from "../realtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./../styles/courseDetails.css";
import { parseJwt, getErrorMessage } from "../services/api";
import {
  getCourseById,
 // getAllCourses,
} from "../services/courseService";
import {
  getLecturesByCourse,
  createLecture,
  editLecture,
  deleteLecture,
  generateQR,
  //getAttendanceReport,
} from "../services/lectureService";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrToken, setQrToken] = useState(null);

  const [form, setForm] = useState({
    title: "",
    classRoomId: "",
    startTime: "",
    endTime: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const lecturerName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Lecturer";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ real-time notifications
  useRealtime((msg) => {
    if (
      msg.event === EVENTS.ATTENDANCE_RECORDED &&
      msg.data.courseCode === (course?.code || course?.courseCode)
    ) {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: `✅ ${msg.data.studentName} recorded attendance`,
          time: msg.data.timestamp,
        },
        ...prev.slice(0, 4),
      ]);
    }
  });

  // ✅ جيب بيانات الكورس والمحاضرات والكلاسروم
 useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const [courseRes, lecturesData, classroomsRes] = await Promise.all([
        getCourseById(id),
        getLecturesByCourse(id),
        api.get("/classroom/AllClassRoom", {
          params: { pagenumber: 1, pagesize: 100 },
        }),
      ]);

      setCourse(courseRes);
      setLectures(lecturesData);

      // ✅ تعامل مع كل أشكال الـ response
      const classData = classroomsRes.data;
      console.log("CLASSROOM SHAPE:", classData); // 👈 مؤقت
     if (Array.isArray(classData?.data)) setClassrooms(classData.data);
else if (Array.isArray(classData?.items)) setClassrooms(classData.items);
else if (Array.isArray(classData)) setClassrooms(classData);
else setClassrooms([]);

      // ✅ AttendanceReport اختياري — مش بيوقف الصفحة لو فشل
      try {
        const reportRes = await api.get(`/lecturer/AttendanceReport/${id}`);
        const report = reportRes?.data;
        if (Array.isArray(report)) setAttendanceReport(report);
        else if (Array.isArray(report?.students)) setAttendanceReport(report.students);
        else setAttendanceReport([]);
      } catch {
        setAttendanceReport([]);
      }

    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };
  load();
}, [id, refresh]);

  // ✅ إضافة / تعديل محاضرة
  const handleAddLecture = async (e) => {
  e.preventDefault();
  
  // ✅ تحقق من الـ token
  const token = localStorage.getItem("token");
  console.log("TOKEN EXISTS:", !!token);
  console.log("FORM DATA:", form);
  console.log("COURSE ID:", id);
  
  if (!form.title || !form.classRoomId || !form.startTime || !form.endTime) {
    setFormError("Please fill all fields");
    return;
  }
    setFormError("");
    setFormLoading(true);

    try {
      if (editingLecture) {
        await editLecture(
          editingLecture.id,
          form.title,
          form.startTime,
          form.endTime,
          parseInt(id),
          parseInt(form.classRoomId)
        );
        showToast("Lecture updated ✅");
      } else {
        await createLecture(
          form.title,
          form.startTime,
          form.endTime,
          parseInt(id),
          parseInt(form.classRoomId)
        );
        broadcast(EVENTS.LECTURE_ADDED, {
          courseCode: course?.code || course?.courseCode,
          lecture: form,
        });
        showToast("Lecture added 🎉");
      }
      setShowModal(false);
      setEditingLecture(null);
      setForm({ title: "", classRoomId: "", startTime: "", endTime: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ حذف محاضرة
  const handleDelete = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await deleteLecture(lectureId);
      showToast("Lecture deleted", "error");
      setRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  // ✅ توليد QR من الـ Backend
  const handleGenerateQR = async (lecture) => {
    try {
      const res = await generateQR(lecture.id);
      // الـ Backend بيرجع token نصي
      const token = typeof res === "string" ? res : res?.token || res?.qrToken || JSON.stringify(res);
      setQrToken(token);
      setSelectedQR(lecture);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const handleEdit = (lecture) => {
    setEditingLecture(lecture);
    setForm({
      title: lecture.title || "",
      classRoomId: lecture.classRoomId?.toString() || "",
      startTime: lecture.startTime ? lecture.startTime.slice(0, 16) : "",
      endTime: lecture.endTime ? lecture.endTime.slice(0, 16) : "",
    });
    setFormError("");
    setShowModal(true);
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!course) return <h2>Course not found</h2>;

  const courseName = course.name || course.courseName || "";
  const courseCode = course.code || course.courseCode || "";

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
            <div className="avatar">{lecturerName?.[0]?.toUpperCase() || "L"}</div>
            <div>
              <p>{lecturerName}</p>
              <span>Lecturer</span>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => { localStorage.clear(); navigate("/"); }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>{courseName}</h1>

        <p className="back" onClick={() => navigate("/lecturer")}>
          ← Back to Courses
        </p>

        {/* Real-time Notifications */}
        {notifications.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10, color: "#0f172a" }}>🔴 Live Attendance</h3>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: "10px 15px", marginBottom: 8,
                }}
              >
                <span style={{ color: "#16a34a", fontWeight: 600 }}>{n.message}</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="cards">
          <div className="card"><p>Course Code</p><h2>{courseCode}</h2></div>
          <div className="card"><p>Total Lectures</p><h2>{lectures.length}</h2></div>
          <div className="card"><p>Enrolled Students</p><h2>{attendanceReport.length}</h2></div>
        </div>

        {/* Lectures Table */}
        <div className="table-box">
          <div className="table-header">
            <h2>Lectures</h2>
            <button
              className="enroll-btn"
              onClick={() => {
                setEditingLecture(null);
                setForm({ title: "", classRoomId: "", startTime: "", endTime: "" });
                setFormError("");
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
                lectures.map((l) => (
                  <tr key={l.id}>
                    <td>{l.title}</td>
                    <td>{l.classRoomName || l.classroom || "-"}</td>
                    <td>{l.startTime ? new Date(l.startTime).toLocaleString() : "-"}</td>
                    <td>{l.endTime ? new Date(l.endTime).toLocaleString() : "-"}</td>
                    <td className="actions">
                      <span onClick={() => handleGenerateQR(l)}>📷</span>
                      <span onClick={() => navigate(`/attendance-records/${id}/${l.id}`)}>📊</span>
                      <span onClick={() => handleEdit(l)}>✏️</span>
                      <span onClick={() => handleDelete(l.id)}>🗑️</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* QR Box */}
        {selectedQR && qrToken && (
          <div className="qr-box">
            <h2>Scan this QR Code</h2>
            <QRCodeCanvas value={qrToken} size={200} />
            <p style={{ color: "#888", fontSize: 13 }}>Expires in 10 minutes</p>
            <button onClick={() => { setSelectedQR(null); setQrToken(null); }}>Close</button>
          </div>
        )}

        {/* Enrolled Students & Attendance */}
        <div className="table-box">
          <h2>Enrolled Students & Attendance</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Attended</th>
                <th>Total</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceReport.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    No students enrolled yet
                  </td>
                </tr>
              ) : (
                attendanceReport.map((s, i) => {
                  const attended = s.attendedLectures ?? s.attended ?? 0;
                  const total = s.totalLectures ?? s.total ?? lectures.length;
                  const percent = total === 0 ? 0 : Math.round((attended / total) * 100);
                  return (
                    <tr key={i}>
                      <td>{s.studentName || s.name || "-"}</td>
                      <td>{attended}</td>
                      <td>{total}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
                            <div style={{
                              width: `${percent}%`, height: "100%",
                              background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
                              borderRadius: 999,
                            }} />
                          </div>
                          <span style={{
                            fontWeight: 700,
                            color: percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626",
                          }}>
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingLecture ? "Edit Lecture" : "Add Lecture"}</h3>
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
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Classroom</label>
                <select
                  value={form.classRoomId}
                  onChange={(e) => setForm({ ...form, classRoomId: e.target.value })}
                >
                  <option value="">Select classroom</option>
                  {classrooms.length === 0 ? (
                    <option disabled>No classrooms added yet</option>
                  ) : (
                    classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.buildingName || c.building || ""}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {formError && <p style={{ color: "red" }}>{formError}</p>}
              <button type="submit" className="modal-btn" disabled={formLoading}>
                {formLoading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default CourseDetails;