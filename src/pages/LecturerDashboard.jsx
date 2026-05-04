import "./../styles/dashboardLecturer.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourseOverview } from "../services/lectureService";
import { useRealtime } from "../hooks/useRealtime";
import { EVENTS } from "../realtime";

import { parseJwt, getErrorMessage } from "../services/api";

import {
  getAllCourses,
  createCourse,
  editCourse,
  deleteCourse,
} from "../services/courseService";



function LecturerDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseStudents, setCourseStudents] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [realtimeCount, setRealtimeCount] = useState(0);
 

  const [showModal, setShowModal] = useState(false);
  const [editCourseData, setEditCourseData] = useState(null);

  const [form, setForm] = useState({ code: "", name: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const decoded = parseJwt(localStorage.getItem("token")) || {};


const lecturerName = 
  decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
  decoded?.["name"] ||
  decoded?.["Name"] ||
  decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] ||
  "Lecturer";


  /* REALTIME */
  useRealtime((msg) => {
    if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
      setRealtimeCount((p) => p + 1);
    }
  });
useEffect(() => {
  const loadStudents = async () => {
    if (!courses.length) return;

    try {
      const result = {};

      await Promise.all(
        courses.map(async (c) => {
          try {
            const res = await getCourseOverview(c.courseId);
           
            result[c.courseId] =
  res?.totalEnrolledStudents ??
  res?.totalEnrolled ??
  res?.totalStudents ??
  res?.enrolledStudents ??
  0;
          } catch  {
            // مهم: نتخطى أي 403 بدون ما نكسر الصفحة
            result[c.courseId] = 0;
          }
        })
      );

      setCourseStudents(result);
    } catch (err) {
      console.log("Course overview error:", err);
      setCourseStudents({});
    }
  };

  loadStudents();
}, [courses]);

  /* LOAD COURSES */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data || []);
      } catch (err) {
        console.log(getErrorMessage(err));
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refresh]);




  /* FORM */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name || !form.code) {
      setFormError("Please fill all fields");
      return;
    }

    setFormLoading(true);

    try {
      if (editCourseData) {
        await editCourse(editCourseData.courseId, form.code, form.name);
      } else {
        await createCourse(form.name, form.code);
      }

      setShowModal(false);
      setEditCourseData(null);
      setForm({ name: "", code: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await deleteCourse(id);
      setRefresh((r) => r + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (course) => {
    setEditCourseData(course);
    setForm({
      name: course.courseName || course.name || "",
      code: course.courseCode || course.code || "",
    });
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard lecturer-page">

      {/* SIDEBAR (UNCHANGED) */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>

          <ul className="menu">
            <li className="active">📘 My Courses</li>
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

      {/* MAIN (UNCHANGED STRUCTURE) */}
      <div className="main">

        <h1>Lecturer Dashboard</h1>

        <div className="cards">
          <div className="card">
            <p>Courses</p>
            <h2>{courses.length}</h2>
          </div>

          <div className="card">
  <p>Total Enrolled Students</p>
  <h2>
    {Object.values(courseStudents).reduce((a, b) => a + b, 0)}
  </h2>
</div>
          {realtimeCount > 0 && (
            <div className="card" style={{ borderLeft: "4px solid #22c55e" }}>
              <p>Live Attendance</p>
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
            }}
          >
            + Add Course
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="courses-grid">

            {courses.map((c) => (
              <div
                key={c.courseId}
                className="course-card"
                onClick={() => navigate(`/course/${c.courseId}`)}
              ><div className="course-header">
  <span className="course-code">
    {c.courseCode || c.code}
  </span>

  <div
    className="actions"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="edit-btn"
      onClick={() => handleEdit(c)}
      title="Edit"
    >
      ✏️
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(c.courseId)}
      title="Delete"
    >
      🗑
    </button>
  </div>
</div>

                 <h3>{c.courseName || c.name}</h3> 
               
               <p>
  {courseStudents?.[c.courseId] || 0} students enrolled
</p>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* MODAL (UNCHANGED STYLE STRUCTURE) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>{editCourseData ? "Edit Course" : "Add Course"}</h3>

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

              <button disabled={formLoading}>
                {formLoading ? "Saving..." : "Save"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default LecturerDashboard;