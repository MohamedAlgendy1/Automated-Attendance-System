import { useRealtime } from "../hooks/useRealtime";
import { broadcast, EVENTS } from "../realtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./../styles/courseDetails.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getCourseById } from "../services/courseService";
import {
  getLecturesByCourse,
  createLecture,
  editLecture,
  deleteLecture,
  generateQR,
} from "../services/lectureService";
import api from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
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
  const lecturerName =
    decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    "Lecturer";

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ real-time notifications
useRealtime(EVENTS.LECTURE_ADDED, () => {
  setRefresh((prev) => prev + 1);
});

useRealtime(EVENTS.ATTENDANCE_RECORDED, (msg) => {
  setNotifications((prev) => [
    {
      id: Date.now(),
      message: `✅ ${msg.studentName} recorded attendance`,
      time: msg.timestamp,
    },
    ...prev.slice(0, 4),
  ]);
});

// useRealtime((msg) => {
//   if (msg.event === EVENTS.LECTURE_ADDED) {
//     setLectures((prev) => [...prev, msg.data.lecture]);
//   }

//   if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//     setNotifications((prev) => [
//       {
//         id: Date.now(),
//         message: `✅ ${msg.data.studentName} recorded attendance`,
//         time: msg.data.timestamp,
//       },
//       ...prev.slice(0, 4),
//     ]);
//   }
// });

useEffect(() => {
  const load = async () => {
    setLoading(true);

    try {
      const [courseRes, lecturesData, classroomsRes] = await Promise.all([
        getCourseById(id),
        getLecturesByCourse(id),
        api.get("/classroom/AllClassRoom", {
          params: {
            pagenumber: 1,
            pagesize: 100,
          },
        }),
      ]);

      // Course
      setCourse(courseRes);

      // Lectures
      console.log("LECTURES RAW:", lecturesData);

      setLectures(
  Array.isArray(lecturesData?.data)
    ? [...lecturesData.data].sort((a, b) => b.id - a.id)
    : []
);

      // Classrooms
      const classData = classroomsRes.data;

      if (Array.isArray(classData?.data)) {
        setClassrooms(classData.data);
      } else if (Array.isArray(classData?.items)) {
        setClassrooms(classData.items);
      } else if (Array.isArray(classData)) {
        setClassrooms(classData);
      } else {
        setClassrooms([]);
      }

    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  load();
}, [id, refresh]);

// useRealtime((msg) => {
//   if (msg.event === EVENTS.LECTURE_ADDED) {
//     const lecture = msg.data?.lecture;
//     if (!lecture) return;

//     setLectures((prev) => {
//       const exists = prev.some(l => l.id === lecture.id);
//       if (exists) return prev;
//       return [...prev, lecture];
//     });
//   }

//   if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//     setNotifications((prev) => [
//       {
//         id: Date.now(),
//         message: `✅ ${msg.data.studentName} recorded attendance`,
//         time: msg.data.timestamp,
//       },
//       ...prev.slice(0, 4),
//     ]);
//   }
// });

  // ✅ جيب بيانات الكورس والمحاضرات والكلاسروم
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [courseRes, lecturesData, classroomsRes] = await Promise.all([
//           getCourseById(id),
//           getLecturesByCourse(id),
//           api.get("/classroom/AllClassRoom", {
//             params: { pagenumber: 1, pagesize: 100 },
//           }),
//         ]);

//         setCourse(courseRes);
//         setCourse(courseRes);

// // ✅ الحل الصح
// console.log("LECTURES RAW:", lecturesData);

// if (Array.isArray(lecturesData?.data)) {
//   setLectures(lecturesData.data);
// } 
// else if (Array.isArray(lecturesData?.items)) {
//   setLectures(lecturesData.items);
// }
// else if (Array.isArray(lecturesData)) {
//   setLectures(lecturesData);
// }
// else {
//   setLectures([]);
// }

// if (Array.isArray(lecturesData)) {
//   console.log("LECTURES RAW:", lecturesData);
//   setLectures(lecturesData);
// } else if (Array.isArray(lecturesData?.data)) {
//   console.log("LECTURES RAW:", lecturesData);
//   setLectures(lecturesData.data);
// } else {
//   console.log("LECTURES RAW:", lecturesData);
//   setLectures([]);
// }

  //       const classData = classroomsRes.data;
  //       if (Array.isArray(classData?.data)) setClassrooms(classData.data);
  //       else if (Array.isArray(classData?.items)) setClassrooms(classData.items);
  //       else if (Array.isArray(classData)) setClassrooms(classData);
  //       else setClassrooms([]);

  //     } catch (err) {
  //       showToast(getErrorMessage(err), "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   load();
  // }, [id, refresh]);

  // ✅ إضافة / تعديل محاضرة
  const handleAddLecture = async (e) => {
    e.preventDefault();

    if (!form.title || !form.classRoomId || !form.startTime || !form.endTime) {
      setFormError("Please fill all fields");
      return console.log("lectures state =", lectures); 
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
  const created = await createLecture(
    form.title,
    form.startTime,
    form.endTime,
    parseInt(id),
    parseInt(form.classRoomId)
  );

  broadcast(EVENTS.LECTURE_ADDED, {
    courseCode: courseCode,
    lecture: created,
  });

  showToast("Lecture added 🎉");
}
        // await createLecture(
        //   form.title,
        //   form.startTime,
        //   form.endTime,
        //   parseInt(id),
        //   parseInt(form.classRoomId)
        // );
        // broadcast(EVENTS.LECTURE_ADDED, {
        //   courseCode: course?.code || course?.courseCode,
        //   lecture: form,
        // });
// try {
//   console.log("Before Broadcast");
  
//   broadcast(EVENTS.LECTURE_ADDED, {
//     courseCode: course?.code || course?.courseCode,
//     lecture: form,
//   });

//   console.log("Broadcast Success");
// }catch (err) {
 // console.error("Broadcast Error:", err);
//}

      //  showToast("Lecture added 🎉");
    //  }
      setShowModal(false);
      setEditingLecture(null);
      setForm({ title: "", classRoomId: "", startTime: "", endTime: "" });
      setRefresh((r) => r + 1);
    } catch (err) {
 console.log(err);
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

  // ✅ توليد QR
  const handleGenerateQR = async (lecture) => {
    try {
      const res = await generateQR(lecture.id);
      const qr =
        typeof res === "string"
          ? res
          : res?.token || res?.qrToken || JSON.stringify(res);
      setQrToken(qr);
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
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", background: "#f0fdf4",
                  border: "1px solid #bbf7d0", borderRadius: 10,
                  padding: "10px 15px", marginBottom: 8,
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
  {console.log("LECTURES STATE =", lectures)}

  {lectures && lectures.length > 0 ? (
    lectures.map((l) => (
      <tr key={l.id}>
        <td>{l.title || "-"}</td>
        <td>{l.classRoomName || l.classroom || "-"}</td>
        <td>{l.startTime ? l.startTime.replace("T", " ") : "-"}</td>
        <td>{l.endTime ? l.endTime.replace("T", " ") : "-"}</td>
        <td className="actions">
          <span onClick={() => handleGenerateQR(l)}>📷</span>
          <span onClick={() => navigate(`/attendance-records/${id}/${l.id}`)}>📊</span>
          <span onClick={() => handleEdit(l)}>✏️</span>
          <span onClick={() => handleDelete(l.id)}>🗑️</span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
        No lectures yet
      </td>
    </tr>
  )}
</tbody>
             {/* <tbody>
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
            </tbody>  */}
          </table>
        </div>

        {/* QR Box */}
        {selectedQR && qrToken && (
          <div className="qr-box">
            <h2>Scan this QR Code</h2>
            <QRCodeCanvas value={qrToken} size={200} />
            <p style={{ color: "#888", fontSize: 13 }}>Expires in 10 minutes</p>
            <button onClick={() => { setSelectedQR(null); setQrToken(null); }}>
              Close
            </button>
          </div>
        )}
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
