import "./../styles/dashboardLecturer.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LecturerDashboard({ courses, setCourses }) {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    password: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.code || !form.name || !form.password) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (editIndex !== null) {
      const updated = [...courses];
      updated[editIndex] = form;
      setCourses(updated);
      showToast("Course updated ✅");
    } else {
      const exists = courses.find((c) => c.code === form.code);
      if (exists) {
        showToast("Course already exists", "error");
        return;
      }

      setCourses([...courses, form]);
      showToast("Course added 🎉");
    }

    setForm({ code: "", name: "", password: "" });
    setEditIndex(null);
    setShowModal(false);
  };

  const handleDelete = (index) => {
    const updated = courses.filter((_, i) => i !== index);
    setCourses(updated);
    showToast("Course deleted ❌", "error");
  };

  const handleEdit = (index) => {
    setForm(courses[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  return (
    <div className="dashboard lecturer-page">
      {/* ================= SIDEBAR ================= */}
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
            <div className="avatar">A</div>
            <div>
              <p>Ahmed Hassan</p>
              <span>Lecturer</span>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="main">
        {/* ========= COURSES ========= */}
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
                <h2>0</h2>
              </div>

              <div className="card">
                <p>Students</p>
                <h2>0</h2>
              </div>
            </div>

            <div className="top-bar">
              <button
                className="enroll-btn"
                onClick={() => {
                  setShowModal(true);
                  setEditIndex(null);
                  setForm({ code: "", name: "", password: "" });
                }}
              >
                + Add Course
              </button>
            </div>

            {/* 🔥 GRID COURSES */}
            <div className="courses-grid">
              {courses.length === 0 ? (
                <p>No courses yet</p>
              ) : (
                courses.map((c, i) => (
                  <div
                    key={i}
                    className="course-card"
                    onClick={() => navigate(`/course/${i}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="course-header">
                      <span className="course-code">{c.code}</span>

                      {/* ❗️ مهم: نوقف propagation علشان الضغط على الأزرار مايفتحش الصفحة */}
                      <div
                        className="actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(i)}
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(i)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    <h3>{c.name}</h3>
                    <p>0 students enrolled</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* ========= ATTENDANCE ========= */}
        {activePage === "attendance" && (
          <>
            <h1>Attendance Overview</h1>

            <div className="cards">
              <div className="card">
                <p>Courses</p>
                <h2>{courses.length}</h2>
              </div>

              <div className="card">
                <p>Lectures</p>
                <h2>0</h2>
              </div>

              <div className="card">
                <p>Students</p>
                <h2>0</h2>
              </div>
            </div>

            <div className="table-box">
              <h2>Attendance Across All Courses</h2>
              <div className="empty-box">
                <p>No students enrolled yet</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editIndex !== null ? "Edit Course" : "Add Course"}</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                placeholder="Course Code"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />

              <input
                placeholder="Course Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button type="submit">
                {editIndex !== null ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TOAST ================= */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default LecturerDashboard;