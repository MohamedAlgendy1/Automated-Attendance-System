import "./../styles/dashboardLecturer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRealtime } from "../hooks/useRealtime";
import { EVENTS } from "../realtime";
import { parseJwt, getErrorMessage, getUserIdFromToken } from "../services/api";
import { getAllCourses, createCourse, editCourse, deleteCourse } from "../services/courseService";

function LecturerDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [realtimeCount, setRealtimeCount] = useState(0);

  const [form, setForm] = useState({ code: "", name: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const decoded = parseJwt(localStorage.getItem("token")) || {};
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    decoded?.name ||
    "Lecturer";


  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useRealtime((msg) => {
    if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
      setRealtimeCount((prev) => prev + 1);
    }
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (err) {
        showToast(getErrorMessage(err), "error");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.code || !form.name) {
      setFormError("Please fill all fields");
      return;
    }

   

    setFormLoading(true);
    try {
      if (editCourseData) {
        await editCourse(editCourseData.courseId, form.code, form.name);
        showToast("Course updated ✅");
      } else {
        await createCourse(form.name, form.code);
        showToast("Course added 🎉");
      }
      setShowModal(false);
      setEditCourseData(null);
      setForm({ code: "", name: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
 console.log(err);
 setFormError(getErrorMessage(err));
} finally {
      setFormLoading(false);
    }
  };

  // ✅ الحل — id هو اللي بييجي من الـ button
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await deleteCourse(id);
      showToast("Course deleted ❌", "error");
      setRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const handleEdit = (course) => {
    setEditCourseData(course);
    setForm({
      name: course.courseName || course.name || "",
      code: course.courseCode || course.code || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const totalLectures = () => 0;
  const totalStudents = () => 0;

  return (
    <div className="dashboard lecturer-page">
      {/* SIDEBAR */}
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
            <li onClick={() => navigate("/attendance")}>
              📊 Attendance Overview
            </li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">
              {lecturerName?.[0]?.toUpperCase() || "L"}
            </div>
            <div>
              <p>{lecturerName}</p>
              <span>Lecturer</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        {activePage === "courses" && (
          <>
            <h1>Lecturer Dashboard</h1>

            <div className="cards">
              <div className="card">
                <p>Courses</p>
                <h2>{courses.length}</h2>
              </div>
              <div className="card">
                <p>Lectures</p>
                <h2>{totalLectures()}</h2>
              </div>
              <div className="card">
                <p>Students</p>
                <h2>{totalStudents()}</h2>
              </div>
              {realtimeCount > 0 && (
                <div className="card" style={{ borderLeft: "4px solid #22c55e" }}>
                  <p>Live Attendance Today</p>
                  <h2 style={{ color: "#16a34a" }}>+{realtimeCount}</h2>
                </div>
              )}
            </div>

            <div className="top-bar">
              <button
                className="enroll-btn"
                onClick={() => {
                  setShowModal(true);
                  setEditCourseData(null);
                  setForm({ name: "", code: "" });
                  setFormError("");
                }}
              >
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
                  courses.map((c) => (
                    <div
                      key={c.courseId}
                      className="course-card"
                      onClick={() => navigate(`/course/${c.courseId}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="course-header">
                        {/* ✅ courseCode */}
                        <span className="course-code">
                          {c.courseCode || c.code}
                        </span>

                        <div
                          className="actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="edit-btn" onClick={() => handleEdit(c)}>✏️</button>
                          {/* ✅ بنبعت c.courseId */}
                          <button className="delete-btn" onClick={() => handleDelete(c.courseId)}>🗑</button>
                        </div>
                      </div>

                      {/* ✅ courseName */}
                      <h3>{c.courseName || c.name}</h3>
                      <p>0 students enrolled</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editCourseData ? "Edit Course" : "Add Course"}</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Course Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Course Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
              {formError && <p style={{ color: "red" }}>{formError}</p>} 
              <button type="submit" disabled={formLoading}>
                {formLoading ? "Saving..." : editCourseData ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
}

export default LecturerDashboard;