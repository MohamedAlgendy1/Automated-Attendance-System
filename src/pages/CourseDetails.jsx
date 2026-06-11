// import { useRealtime } from "../hooks/useRealtime";
// import { broadcast, EVENTS } from "../realtime";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { QRCodeCanvas } from "qrcode.react";
// import "./../styles/courseDetails.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getCourseById } from "../services/courseService";
// import { useTheme } from "../context/ThemeContext";
// import {
//   getLecturesByCourse,
//   createLecture,
//   editLecture,
//   deleteLecture,
//   generateQR,
// } from "../services/lectureService";
// import api from "../services/api";

// function CourseDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [course, setCourse] = useState(null);
//   const [lectures, setLectures] = useState([]);
//   const [classrooms, setClassrooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(0);
//   const [notifications, setNotifications] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [editingLecture, setEditingLecture] = useState(null);
//   const [selectedQR, setSelectedQR] = useState(null);
//   const [qrToken, setQrToken] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     classRoomId: "",
//     startTime: "",
//     endTime: "",
//   });
//   const [formError, setFormError] = useState("");
//   const [formLoading, setFormLoading] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   const token = localStorage.getItem("token");
//   const decoded = token ? parseJwt(token) : {};
//   const lecturerName =
//     decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
//     "Lecturer";

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
//   };

//   useEffect(() => {
    
//   }, [lectures]);


//   // ✅ real-time notifications
// useRealtime(EVENTS.LECTURE_ADDED, () => {
//   setRefresh((prev) => prev + 1);
// });

// useRealtime(EVENTS.ATTENDANCE_RECORDED, (msg) => {
//   setNotifications((prev) => [
//     {
//       id: Date.now(),
//       message: `✅ ${msg.studentName} recorded attendance`,
//       time: msg.timestamp,
//     },
//     ...prev.slice(0, 4),
//   ]);
// });



// useEffect(() => {
//   const load = async () => {
//     setLoading(true);

//     try {
//       const [courseRes, lecturesRes, classroomsRes] = await Promise.all([
//         getCourseById(id),
//         getLecturesByCourse(id),
//         api.get("/classroom/AllClassRoom", {
//           params: { pagenumber: 1, pagesize: 100 },
//         }),
//       ]);

//       setCourse(courseRes);

//       const lectures = lecturesRes || [];

     

//       setLectures(
//         [...lectures].sort((a, b) => b.id - a.id)
//       );

//       const classData = classroomsRes?.data;

//       setClassrooms(
//         Array.isArray(classData?.data)
//           ? classData.data
//           : Array.isArray(classData?.items)
//           ? classData.items
//           : Array.isArray(classData)
//           ? classData
//           : []
//       );

//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   load();
// }, [id, refresh]);


//   // ✅ إضافة / تعديل محاضرة
//   const handleAddLecture = async (e) => {
//     e.preventDefault();

//     if (!form.title || !form.classRoomId || !form.startTime || !form.endTime) {
//       setFormError("Please fill all fields");
//       return ; 
//     }

//     setFormError("");
//     setFormLoading(true);

//     try {
//      if (editingLecture) {
//   await editLecture(
//     editingLecture.id,
//     form.title,
//     form.startTime,
//     form.endTime,
//     parseInt(id),
//     parseInt(form.classRoomId)
//   );

//   showToast("Lecture updated ✅");
// } else {
//   const created = await createLecture(
//     form.title,
//     form.startTime,
//     form.endTime,
//     parseInt(id),
//     parseInt(form.classRoomId)
//   );

//   broadcast(EVENTS.LECTURE_ADDED, {
//     courseCode: courseCode,
//     lecture: created,
//   });

//   showToast("Lecture added 🎉");
// }

//       setShowModal(false);
//       setEditingLecture(null);
//       setForm({ title: "", classRoomId: "", startTime: "", endTime: "" });
//       setRefresh((r) => r + 1);
//     } catch (err) {
//  console.log(err);
//  setFormError(getErrorMessage(err));
// } finally {
//       setFormLoading(false);
//     }
//   };

//   // ✅ حذف محاضرة
//   const handleDelete = async (lectureId) => {
//     if (!window.confirm("Delete this lecture?")) return;
//     try {
//       await deleteLecture(lectureId);
//       showToast("Lecture deleted", "error");
//       setRefresh((r) => r + 1);
//     } catch (err) {
//       showToast(getErrorMessage(err), "error");
//     }
//   };

//   // ✅ توليد QR
//   const handleGenerateQR = async (lecture) => {
//     try {
//       const res = await generateQR(lecture.id);
//       const qr =
//         typeof res === "string"
//           ? res
//           : res?.token || res?.qrToken || JSON.stringify(res);
//       setQrToken(qr);
//       setSelectedQR(lecture);
//     } catch (err) {
//       showToast(getErrorMessage(err), "error");
//     }
//   };

//   const handleEdit = (lecture) => {
//     setEditingLecture(lecture);
//     setForm({
//       title: lecture.title || "",
//       classRoomId: lecture.classRoomId?.toString() || "",
//       startTime: lecture.startTime ? lecture.startTime.slice(0, 16) : "",
//       endTime: lecture.endTime ? lecture.endTime.slice(0, 16) : "",
//     });
//     setFormError("");
//     setShowModal(true);
//   };

//   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
//   if (!course) return <h2>Course not found</h2>;

//   const courseName = course.name || course.courseName || "";
//   const courseCode = course.code || course.courseCode || "";

//   return (
//     <div className="dashboard course-details-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <button className="theme-toggle" onClick={toggleTheme}>
//   {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
// </button>
//           <ul className="menu">
//             <li className="active">📘 My Courses</li>
//             <li onClick={() => navigate("/attendance")}>📊 Attendance Overview</li>
//           </ul>
//         </div>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">{lecturerName?.[0]?.toUpperCase() || "L"}</div>
//             <div>
//               <p>{lecturerName}</p>
//               <span>Lecturer</span>
//             </div>
//           </div>
//           <button
//             className="logout-btn"
//             onClick={() => { localStorage.clear(); navigate("/"); }}
//           >
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>{courseName}</h1>

//         <p className="back" onClick={() => navigate("/lecturer")}>
//           ← Back to Courses
//         </p>

//         {/* Real-time Notifications */}
//         {notifications.length > 0 && (
//           <div style={{ marginBottom: 20 }}>
//             <h3 style={{ marginBottom: 10, color: "#0f172a" }}>🔴 Live Attendance</h3>
//             {notifications.map((n) => (
//               <div
//                 key={n.id}
//                 style={{
//                   display: "flex", justifyContent: "space-between",
//                   alignItems: "center", background: "#f0fdf4",
//                   border: "1px solid #bbf7d0", borderRadius: 10,
//                   padding: "10px 15px", marginBottom: 8,
//                 }}
//               >
//                 <span style={{ color: "#16a34a", fontWeight: 600 }}>{n.message}</span>
//                 <span style={{ color: "#64748b", fontSize: 12 }}>{n.time}</span>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Cards */}
//         <div className="cards">
//           <div className="card"><p>Course Code</p><h2>{courseCode}</h2></div>
//           <div className="card"><p>Total Lectures</p><h2>{lectures.length}</h2></div>
//         </div>

//         {/* Lectures Table */}
//         <div className="table-box">
//           <div className="table-header">
//             <h2>Lectures</h2>
//             <button
//               className="enroll-btn"
//               onClick={() => {
//                 setEditingLecture(null);
//                 setForm({ title: "", classRoomId: "", startTime: "", endTime: "" });
//                 setFormError("");
//                 setShowModal(true);
//               }}
//             >
//               + Add Lecture
//             </button>
//           </div>

//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Classroom</th>
//                 <th>Start</th>
//                 <th>End</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//  <tbody>


//   {lectures && lectures.length > 0 ? (
//     lectures.map((l) => (
//       <tr key={l.id}>
//         <td>{l.title || "-"}</td>
//         <td>{l.classRoomName || l.classroom || "-"}</td>
//         <td>{l.startTime ? l.startTime.replace("T", " ") : "-"}</td>
//         <td>{l.endTime ? l.endTime.replace("T", " ") : "-"}</td>
//         <td className="actions">
//           <span onClick={() => handleGenerateQR(l)}>📷</span>
//           <span onClick={() => navigate(`/attendance-records/${id}/${l.id}`)}>📊</span>
//           <span onClick={() => handleEdit(l)}>✏️</span>
//           <span onClick={() => handleDelete(l.id)}>🗑️</span>
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
//         No lectures yet
//       </td>
//     </tr>
//   )}
// </tbody>
           
//           </table>
//         </div>

//         {/* QR Box */}
//         {selectedQR && qrToken && (
//           <div className="qr-box">
//             <h2>Scan this QR Code</h2>
//             <QRCodeCanvas value={qrToken} size={200} />
//             <p style={{ color: "#888", fontSize: 13 }}>Expires in 10 minutes</p>
//             <button onClick={() => { setSelectedQR(null); setQrToken(null); }}>
//               Close
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>{editingLecture ? "Edit Lecture" : "Add Lecture"}</h3>
//               <span onClick={() => setShowModal(false)}>✖</span>
//             </div>

//             <form onSubmit={handleAddLecture}>
//               <div className="form-group">
//                 <label>Lecture Title</label>
//                 <input
//                   placeholder="Lecture Title"
//                   value={form.title}
//                   onChange={(e) => setForm({ ...form, title: e.target.value })}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Start Time</label>
//                 <input
//                   type="datetime-local"
//                   value={form.startTime}
//                   onChange={(e) => setForm({ ...form, startTime: e.target.value })}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>End Time</label>
//                 <input
//                   type="datetime-local"
//                   value={form.endTime}
//                   onChange={(e) => setForm({ ...form, endTime: e.target.value })}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Classroom</label>
//                 <select
//                   value={form.classRoomId}
//                   onChange={(e) => setForm({ ...form, classRoomId: e.target.value })}
//                 >
//                   <option value="">Select classroom</option>
//                   {classrooms.length === 0 ? (
//                     <option disabled>No classrooms added yet</option>
//                   ) : (
//                     classrooms.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name} — {c.buildingName || c.building || ""}
//                       </option>
//                     ))
//                   )}
//                 </select>
//               </div>

//               {formError && <p style={{ color: "red" }}>{formError}</p>}
//               <button type="submit" className="modal-btn" disabled={formLoading}>
//                 {formLoading ? "Saving..." : "Save"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}

//       {/* Mobile Bottom Nav */}
//   <nav className="mobile-nav">
//   <ul>
//     <li className="active" >
//       📘 Courses
//     </li>

//     <li onClick={() => navigate("/attendance")}>
//       📊 Attendance
//     </li>

//     {/* Theme Button */}
//     <li>
//       <button className="theme-toggle mobile-theme" onClick={toggleTheme}>
//         {theme === "dark" ? "☀️" : "🌙"}
//       </button>
//     </li>
//   </ul>
// </nav>

//     </div>
//   );
// }

// export default CourseDetails;


import { useRealtime } from "../hooks/useRealtime";
import { broadcast, EVENTS } from "../realtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./../styles/courseDetails.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getCourseById } from "../services/courseService";
import { useTheme } from "../context/ThemeContext";
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
  const { theme, toggleTheme } = useTheme();
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

  // ✅ QR expiry
  const [qrMinutes, setQrMinutes] = useState(10);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

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

  // ✅ العداد التنازلي
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setSelectedQR(null);
          setQrToken(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ✅ cleanup العداد لما الكومبوننت يتشال
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, lecturesRes, classroomsRes] = await Promise.all([
          getCourseById(id),
          getLecturesByCourse(id),
          api.get("/classroom/AllClassRoom", {
            params: { pagenumber: 1, pagesize: 100 },
          }),
        ]);

        setCourse(courseRes);
        setLectures([...(lecturesRes || [])].sort((a, b) => b.id - a.id));

        const classData = classroomsRes?.data;
        setClassrooms(
          Array.isArray(classData?.data) ? classData.data
          : Array.isArray(classData?.items) ? classData.items
          : Array.isArray(classData) ? classData
          : []
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, refresh]);

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!form.title || !form.classRoomId || !form.startTime || !form.endTime) {
      setFormError("Please fill all fields");
      return;
    }
    setFormError("");
    setFormLoading(true);
    try {
      if (editingLecture) {
        await editLecture(
          editingLecture.id, form.title, form.startTime, form.endTime,
          parseInt(id), parseInt(form.classRoomId)
        );
        showToast("Lecture updated ✅");
      } else {
        const created = await createLecture(
          form.title, form.startTime, form.endTime,
          parseInt(id), parseInt(form.classRoomId)
        );
        broadcast(EVENTS.LECTURE_ADDED, { courseCode, lecture: created });
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

  // ✅ توليد QR مع الوقت المحدد يدوياً
  const handleGenerateQR = async (lecture) => {
    try {
      const res = await generateQR(lecture.id, qrMinutes);
      const qr =
        typeof res === "string"
          ? res
          : res?.token || res?.qrToken || JSON.stringify(res);
      setQrToken(qr);
      setSelectedQR(lecture);
      startCountdown(qrMinutes * 60); // ✅ ابدأ العداد
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

  const closeQR = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSelectedQR(null);
    setQrToken(null);
    setCountdown(0);
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
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
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
          <button className="logout-btn" onClick={() => {localStorage.removeItem("token");  navigate("/"); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>{courseName}</h1>
        <p className="back" onClick={() => navigate("/lecturer")}>← Back to Courses</p>

        {notifications.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10, color: "#0f172a" }}>🔴 Live Attendance</h3>
            {notifications.map((n) => (
              <div key={n.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10,
                padding: "10px 15px", marginBottom: 8,
              }}>
                <span style={{ color: "#16a34a", fontWeight: 600 }}>{n.message}</span>
                <span style={{ color: "#64748b", fontSize: 12 }}>{n.time}</span>
              </div>
            ))}
          </div>
        )}

        <div className="cards">
          <div className="card"><p>Course Code</p><h2>{courseCode}</h2></div>
          <div className="card"><p>Total Lectures</p><h2>{lectures.length}</h2></div>
        </div>

        {/* ✅ QR Duration Selector */}
        <div className="qr-duration">
          <span>⏱ QR Duration:</span>
          {[5, 10, 15, 30].map((min) => (
            <button
              key={min}
              className={`qr-duration-btn${qrMinutes === min ? " active" : ""}`}
              onClick={() => setQrMinutes(min)}
            >
              {min}m
            </button>
          ))}
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
          </table>
        </div>

        {/* ✅ QR Box مع عداد تنازلي */}
        {selectedQR && qrToken && (
          <div className="qr-box">
            <h2>Scan this QR Code</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>
              {selectedQR.title}
            </p>
            <QRCodeCanvas value={qrToken} size={200} />

            {/* ✅ العداد التنازلي */}
            <div className={`qr-countdown${countdown <= 60 ? " expiring" : ""}`}>
              <span className="qr-countdown-label">Expires in</span>
              <span className="qr-countdown-time">{formatCountdown(countdown)}</span>
              {countdown <= 60 && (
                <span className="qr-countdown-warn">⚠️ Expiring soon!</span>
              )}
            </div>

            <button onClick={closeQR} style={{ marginTop: 16 }}>Close</button>
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

      <nav className="mobile-nav">
        <ul>
          <li className="active">📘 Courses</li>
          <li onClick={() => navigate("/attendance")}>📊 Attendance</li>
          <li>
            <button className="theme-toggle mobile-theme" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default CourseDetails;