import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../styles/dashboard.css";

function CourseDetails({ courses }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses[id];

  const [lectures, setLectures] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    classroom: "",
    start: "",
    end: "",
  });

  if (!course) return <h2>Course not found</h2>;

  const handleAddLecture = (e) => {
    e.preventDefault();

    if (!form.title || !form.classroom || !form.start || !form.end) return;

    setLectures([...lectures, form]);

    setForm({
      title: "",
      classroom: "",
      start: "",
      end: "",
    });

    setShowModal(false);
  };

  return (
    <div className="dashboard">
      {/* ✅ Sidebar FIXED */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li onClick={() => navigate("/lecturer")}>
              📘 My Courses
            </li>

            <li className="active">
              📊 Attendance Overview
            </li>
          </ul>
        </div>

        {/* 👇 ده اللي تحت لوحده */}
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">A</div>
            <div>
              <p>user</p>
              <span>Lecturer</span>
            </div>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
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
            <p>Enrolled Students</p>
            <h2>0</h2>
          </div>
        </div>

        {/* Lectures */}
        <div className="table-box">
          <div className="table-header">
            <h2>Lectures</h2>

            <button
              className="enroll-btn"
              onClick={() => setShowModal(true)}
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
              </tr>
            </thead>

            <tbody>
              {lectures.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No lectures yet
                  </td>
                </tr>
              ) : (
                lectures.map((l, i) => (
                  <tr key={i}>
                    <td>{l.title}</td>
                    <td>{l.classroom}</td>
                    <td>{l.start}</td>
                    <td>{l.end}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Students */}
        <div className="table-box">
          <h2>Enrolled Students & Attendance</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Attendance</th>
                <th>Enrolled On</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No students enrolled yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Lecture</h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleAddLecture}>
              <input
                placeholder="Lecture Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <input
                placeholder="Classroom"
                value={form.classroom}
                onChange={(e) =>
                  setForm({ ...form, classroom: e.target.value })
                }
              />

              <input
                type="datetime-local"
                value={form.start}
                onChange={(e) =>
                  setForm({ ...form, start: e.target.value })
                }
              />

              <input
                type="datetime-local"
                value={form.end}
                onChange={(e) =>
                  setForm({ ...form, end: e.target.value })
                }
              />

              <button type="submit">Save Lecture</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;