import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./../styles/courseDetails.css";
import api, { getErrorMessage, getUserIdFromToken } from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrToken, setQrToken] = useState(null);
  const [refresh, setRefresh] = useState(0);

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
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const lecturerName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Lecturer";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ جيب الكورس والمحاضرات والكلاسروم
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [courseRes, lecturesRes, classroomsRes] = await Promise.all([
          api.get(`/course/GetOne/${id}`),
          api.get("/courselecture/AllCourseLectures", { params: { pagenumber: 1, pagesize: 100 } }),
          api.get("/classroom/AllClassRoom", { params: { pagenumber: 1, pagesize: 100 } }),
        ]);

        setCourse(courseRes.data);
        // فلتر المحاضرات بتاعة الكورس ده بس
        const allLectures = lecturesRes.data?.items || lecturesRes.data || [];
        setLectures(allLectures.filter((l) => l.courseId === parseInt(id)));
        setClassrooms(classroomsRes.data?.items || classroomsRes.data || []);
      } catch (err) {
        showToast(getErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, refresh]);

  // ✅ إضافة / تعديل محاضرة
  const handleAddLecture = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      if (editingLecture) {
        await api.put(`/courselecture/Edit/${editingLecture.id}`, {
          title: form.title,
          startTime: form.startTime,
          endTime: form.endTime,
          courseId: parseInt(id),
          classRoomId: parseInt(form.classRoomId),
        });
        showToast("Lecture updated ✅");
      } else {
        await api.post("/courselecture/Create", {
          title: form.title,
          startTime: form.startTime,
          endTime: form.endTime,
          courseId: parseInt(id),
          classRoomId: parseInt(form.classRoomId),
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
  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await api.delete(`/courselecture/Delete/${lectureId}`);
      showToast("Lecture deleted", "error");
      setRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  // ✅ توليد QR
  const handleGenerateQR = async (lecture) => {
    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const res = await api.post("/lecturer/GenerateQR", {
        expiresAt,
        courseLectureId: lecture.id,
      });
      setQrToken(res.data?.token || res.data);
      setSelectedQR(lecture);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!course) return <h2>Course not found</h2>;

  return (
    <div className="dashboard course-details-page">
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
            <div><p>{lecturerName}</p><span>Lecturer</span></div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <h1>{course.name || course.courseName}</h1>
        <p className="back" onClick={() => navigate("/lecturer")}>← Back to Courses</p>

        <div className="cards">
          <div className="card"><p>Course Code</p><h2>{course.code || course.courseCode}</h2></div>
          <div className="card"><p>Total Lectures</p><h2>{lectures.length}</h2></div>
        </div>

        {/* Lectures Table */}
        <div className="table-box">
          <div className="table-header">
            <h2>Lectures</h2>
            <button className="enroll-btn" onClick={() => { setEditingLecture(null); setForm({ title: "", classRoomId: "", startTime: "", endTime: "" }); setShowModal(true); }}>
              + Add Lecture
            </button>
          </div>

          <table className="table">
            <thead>
              <tr><th>Title</th><th>Classroom</th><th>Start</th><th>End</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: 20 }}>No lectures yet</td></tr>
              ) : (
                lectures.map((l) => (
                  <tr key={l.id}>
                    <td>{l.title}</td>
                    <td>{l.classRoomName || l.classroom || "-"}</td>
                    <td>{new Date(l.startTime).toLocaleString()}</td>
                    <td>{new Date(l.endTime).toLocaleString()}</td>
                    <td className="actions">
                      <span onClick={() => handleGenerateQR(l)}>📷</span>
                      <span onClick={() => navigate(`/attendance-records/${id}/${l.id}`)}>📊</span>
                      <span onClick={() => { setEditingLecture(l); setForm({ title: l.title, classRoomId: l.classRoomId, startTime: l.startTime, endTime: l.endTime }); setShowModal(true); }}>✏️</span>
                      <span onClick={() => handleDeleteLecture(l.id)}>🗑️</span>
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

        {/* Attendance Report */}
        <div className="table-box">
          <h2>Attendance Report</h2>
          <AttendanceReport courseId={id} />
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
                <input placeholder="Lecture Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Classroom</label>
                <select value={form.classRoomId} onChange={(e) => setForm({ ...form, classRoomId: e.target.value })} required>
                  <option value="">Select classroom</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.buildingName}</option>
                  ))}
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

// ✅ Component صغير للـ Attendance Report
function AttendanceReport({ courseId }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
        setReport(res.data);
      } catch {
        setReport(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  if (loading) return <p>Loading report...</p>;
  if (!report) return <p style={{ color: "#888" }}>No attendance data yet</p>;

  return (
    <table className="table">
      <thead>
        <tr><th>Student</th><th>Attended</th><th>Total</th><th>Percentage</th></tr>
      </thead>
      <tbody>
        {(report.students || report || []).map((s, i) => {
          const percent = s.totalLectures === 0 ? 0 : Math.round((s.attendedLectures / s.totalLectures) * 100);
          return (
            <tr key={i}>
              <td>{s.studentName || s.name}</td>
              <td>{s.attendedLectures}</td>
              <td>{s.totalLectures}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 8, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 999 }} />
                  </div>
                  <span style={{ fontWeight: 700, color: percent >= 75 ? "#16a34a" : percent >= 50 ? "#d97706" : "#dc2626" }}>{percent}%</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CourseDetails;