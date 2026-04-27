import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ الصحيح
import "./../styles/courseDetails.css";

function CourseDetails({ courses }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = courses[id];

  const [lectures, setLectures] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);

  const [form, setForm] = useState({
    title: "",
    classroom: "",
    start: "",
    end: "",
  });

  if (!course) return <h2>Course not found</h2>;

  // ✅ ADD / EDIT
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

    setForm({
      title: "",
      classroom: "",
      start: "",
      end: "",
    });

    setShowModal(false);
  };

  // ✅ DELETE
  const handleDelete = (index) => {
    const updated = lectures.filter((_, i) => i !== index);
    setLectures(updated);
  };

  // ✅ EDIT
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

            <li >
              📊 Attendance Overview
            </li>
          </ul>
        </div>

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
              onClick={() => {
                setEditingIndex(null);
                setForm({
                  title: "",
                  classroom: "",
                  start: "",
                  end: "",
                });
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
                  <td colSpan="5" style={{ textAlign: "center" }}>
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
<td className="actions">
  <span onClick={() => setSelectedQR(i)}>📷</span>

  {/* 🔥 الزر الجديد */}
                   <span onClick={() => navigate(`/attendance-records/${id}/${i}`)}>
                          📊
                  </span>
 
                  <span onClick={() => handleEdit(i)}>✏️</span>
                  <span onClick={() => handleDelete(i)}>🗑️</span>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ QR يظهر هنا في نفس الصفحة */}
        {selectedQR !== null && lectures[selectedQR] && (
          <div className="qr-box">
            <h2>Scan this QR Code</h2>

            <QRCodeCanvas
              value={JSON.stringify({
                courseId: id,
                lecture: lectures[selectedQR],
              })}
              size={200}
            />

            <p>Expires in 10 minutes</p>

            <button onClick={() => setSelectedQR(null)}>Close</button>
          </div>
        )}

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
              <h3>
                {editingIndex !== null ? "Edit Lecture" : "Add Lecture"}
              </h3>
              <span onClick={() => setShowModal(false)}>✖</span>
            </div>

            <form onSubmit={handleAddLecture}>
  <div className="form-group">
    <label>Lecture Title</label>
    <input
      placeholder="Lecture Title"
      value={form.title}
      onChange={(e) =>
        setForm({ ...form, title: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label>Start Time</label>
    <input
      type="datetime-local"
      value={form.start}
      onChange={(e) =>
        setForm({ ...form, start: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label>End Time</label>
    <input
      type="datetime-local"
      value={form.end}
      onChange={(e) =>
        setForm({ ...form, end: e.target.value })
      }
    />
  </div>

  <div className="form-group">
    <label>Classroom</label>
    <select
      value={form.classroom}
      onChange={(e) =>
        setForm({ ...form, classroom: e.target.value })
      }
    >
      <option value="">Select classroom</option>
      <option value="Lab A1">Lab A1</option>
      <option value="Lab B1">Lab B1</option>
      <option value="Hall 1">Hall 1</option>
    </select>
  </div>

  <button type="submit" className="modal-btn">
    Save
  </button>
</form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;