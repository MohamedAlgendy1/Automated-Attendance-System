import "./../styles/dashboardLecturer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { getErrorMessage, getUserIdFromToken } from "../services/api";

function LecturerDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [stats, setStats] = useState({ lectures: 0, students: 0 });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [refresh, setRefresh] = useState(0);

  const [form, setForm] = useState({ name: "", code: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const lecturerId = getUserIdFromToken();

  // ✅ جيب profile من الـ token
  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const lecturerName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Lecturer";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ جيب الكورسات
  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get("/course/AllCourses", {
          params: { pagenumber: 1, pagesize: 100 }
        });
        setCourses(res.data?.items || res.data || []);
      } catch (err) {
        showToast(getErrorMessage(err), "error");
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [refresh]);

  // ✅ إضافة / تعديل كورس
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      if (editCourse) {
        // تعديل
        await api.put(`/course/Edit/${editCourse.id}`, {
          courseCode: form.code,
          courseName: form.name,
        });
        showToast("Course updated ✅");
      } else {
        // إضافة
        await api.post("/course/Create", {
          name: form.name,
          code: form.code,
          lecturerId: parseInt(lecturerId),
        });
        showToast("Course added 🎉");
      }

      setShowModal(false);
      setEditCourse(null);
      setForm({ name: "", code: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ حذف كورس
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/course/Delete/${id}`);
      showToast("Course deleted", "error");
      setRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setForm({ name: course.name || course.courseName, code: course.code || course.courseCode });
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard lecturer-page">
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li className={activePage === "courses" ? "active" : ""} onClick={() => setActivePage("courses")}>
              📘 My Courses
            </li>
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
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        {activePage === "courses" && (
          <>
            <h1>Lecturer Dashboard</h1>

            <div className="cards">
              <div className="card"><p>Courses</p><h2>{courses.length}</h2></div>
              <div className="card"><p>Lectures</p><h2>{stats.lectures}</h2></div>
              <div className="card"><p>Students</p><h2>{stats.students}</h2></div>
            </div>

            <div className="top-bar">
              <button className="enroll-btn" onClick={() => { setShowModal(true); setEditCourse(null); setForm({ name: "", code: "" }); setFormError(""); }}>
                + Add Course
              </button>
            </div>

            {loading ? (
              <p style={{ color: "#64748b", marginTop: 20 }}>Loading courses...</p>
            ) : (
              <div className="courses-grid">
                {courses.length === 0 ? (
                  <p>No courses yet</p>
                ) : (
                  courses.map((c, i) => (
                    <div
                      key={c.id || i}
                      className="course-card"
                      onClick={() => navigate(`/course/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="course-header">
                        <span className="course-code">{c.code || c.courseCode}</span>
                        <div className="actions" onClick={(e) => e.stopPropagation()}>
                          <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
                          <button className="delete-btn" onClick={() => handleDelete(c.id)}>🗑</button>
                        </div>
                      </div>
                      <h3>{c.name || c.courseName}</h3>
                      <p>0 students enrolled</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editCourse ? "Edit Course" : "Add Course"}</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>
            <form onSubmit={handleSubmit}>
              <input placeholder="Course Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input placeholder="Course Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              {formError && <p style={{ color: "red" }}>{formError}</p>}
              <button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : editCourse ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default LecturerDashboard;