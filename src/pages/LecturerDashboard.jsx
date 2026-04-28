import "./../styles/dashboardLecturer.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LecturerDashboard({ courses, setCourses }) {
  const [activePage, setActivePage] = useState("courses");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // ✅ بيانات الدكتور من localStorage
  const lecturerProfile = JSON.parse(localStorage.getItem("lecturerProfile")) || {};

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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("lecturerProfile");
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

    setForm({ name: "", code: "", password: "" });
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

  // ✅ حساب عدد الطلاب الكلي
  const totalStudents = () => {
    const allStudents = JSON.parse(localStorage.getItem("students")) || [];
    const emails = new Set();
    courses.forEach((course) => {
      allStudents.forEach((student) => {
        const studentCourses =
          JSON.parse(localStorage.getItem(`studentCourses_${student.email}`)) || [];
        if (studentCourses.find((c) => c.code === course.code)) {
          emails.add(student.email);
        }
      });
    });
    return emails.size;
  };

  // ✅ حساب عدد المحاضرات الكلي
  const totalLectures = () => {
    return courses.reduce((sum, course) => {
      const lectures =
        JSON.parse(localStorage.getItem(`lectures_${course.code}`)) || [];
      return sum + lectures.length;
    }, 0);
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
            {/* ✅ أول حرف من اسم الدكتور */}
            <div className="avatar">
              {lecturerProfile.name?.[0]?.toUpperCase() || "L"}
            </div>
            <div>
              {/* ✅ اسم الدكتور الحقيقي */}
              <p>{lecturerProfile.name || "Lecturer"}</p>
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
                {/* ✅ عدد المحاضرات الحقيقي */}
                <h2>{totalLectures()}</h2>
              </div>

              <div className="card">
                <p>Students</p>
                {/* ✅ عدد الطلاب الحقيقي */}
                <h2>{totalStudents()}</h2>
              </div>
            </div>

            <div className="top-bar">
              <button
                className="enroll-btn"
                onClick={() => {
                  setShowModal(true);
                  setEditIndex(null);
                  setForm({ name: "", code: "", password: "" });
                }}
              >
                + Add Course
              </button>
            </div>

            {/* GRID COURSES */}
            <div className="courses-grid">
              {courses.length === 0 ? (
                <p>No courses yet</p>
              ) : (
                courses.map((c, i) => {
                  // ✅ عدد الطلاب في كل كورس
                  const allStudents =
                    JSON.parse(localStorage.getItem("students")) || [];
                  const enrolled = allStudents.filter((student) => {
                    const studentCourses =
                      JSON.parse(
                        localStorage.getItem(`studentCourses_${student.email}`)
                      ) || [];
                    return studentCourses.find((sc) => sc.code === c.code);
                  });

                  return (
                    <div
                      key={i}
                      className="course-card"
                      onClick={() => navigate(`/course/${i}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="course-header">
                        <span className="course-code">{c.code}</span>

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
                      {/* ✅ عدد الطلاب الحقيقي في الكارت */}
                      <p>{enrolled.length} students enrolled</p>
                    </div>
                  );
                })
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
                <h2>{totalLectures()}</h2>
              </div>

              <div className="card">
                <p>Students</p>
                <h2>{totalStudents()}</h2>
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
                placeholder="Course Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                placeholder="Course Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />

              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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