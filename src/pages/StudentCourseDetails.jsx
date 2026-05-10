// import { useRealtime } from "../hooks/useRealtime";
// import { EVENTS } from "../realtime";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { BrowserQRCodeReader } from "@zxing/browser";
// import "./../styles/dashboard.css";
// import "./../styles/studentCourseDetails.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getMyCourses, getMyAttendanceHistory, scanQR } from "../services/studentService";
// import { getLecturesByCourse } from "../services/lectureService";
// import { useTheme } from "../context/ThemeContext";

// function StudentCourseDetails() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [course, setCourse] = useState(null);
//   const [lectures, setLectures] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(0);

//   const [showScanner, setShowScanner] = useState(false);
//   const [scanMode, setScanMode] = useState("camera");
//   const [manualInput, setManualInput] = useState("");
//   const [scanResult, setScanResult] = useState(null);
//   const [scanMessage, setScanMessage] = useState("");
//   const [locationStatus, setLocationStatus] = useState("idle");

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);

//   const token = localStorage.getItem("token");
//   const decoded = token ? parseJwt(token) : {};
//   const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";
//   const firstName = studentName.split(" ")[0] || "Student";

//   // ✅ real-time — لو الدكتور أضاف محاضرة جديدة
//   useRealtime((msg) => {
//     if (
//       msg.event === EVENTS.LECTURE_ADDED &&
//       msg.data.courseCode === (course?.code || course?.courseCode)
//     ) {
//       setRefresh((r) => r + 1);
//     }

//   if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//     setRefresh((r) => r + 1);
//   }

//   });


// // useEffect(() => {
// //   console.log("lectures:", lectures);
// //   console.log("attendance:", attendance);
// // }, [lectures, attendance]);


//   // ✅ جيب بيانات الكورس والمحاضرات والحضور
//   useEffect(() => {
//     const load = async () => {

//       const updated = await getMyAttendanceHistory();

// setAttendance(updated);


//       setLoading(true);
//       try {
//         const [coursesData, historyData] = await Promise.all([
//           getMyCourses(),
//           getMyAttendanceHistory(),
//         ]);

//         // دور على الكورس بالـ id أو الـ code
//   const found = coursesData.find(
//   (c) => c.courseId === Number(courseId)
// );

//         setCourse(found || null);
//         setAttendance(historyData);

//         if (found) {
//           const lecturesData = await getLecturesByCourse(found.courseId);
//           setLectures(lecturesData);
//         }
//       } catch (err) {
//         console.error(getErrorMessage(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [courseId, refresh]);

//   const totalLectures = lectures.length;
//   // const attended = attendance.filter(
//   //   (a) => a.courseId === course?.id
//   // ).length;

// const attended = lectures.filter((lec) =>
//   attendance.some((a) => a.courseLectureId === lec.id)
// ).length;


//   const percent = totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

//  // const isLectureAttended = (lectureId) =>
//   //  attendance.some((a) =>a.courseLectureId === lectureId || a.lectureId === lectureId);

// const isLectureAttended = (lectureId) =>
//   attendance.some((a) => a.courseLectureId === lectureId);

  


//   const showError = (msg) => {
//     setScanResult("error");
//     setScanMessage(msg);
//     setLocationStatus("idle");
//   };

//   const closeScanner = () => {
//     setShowScanner(false);
//     setScanMode("camera");
//     if (readerRef.current) {
//       try { readerRef.current.reset(); } catch { /* ignore */ }
//     }
//   };

//   // ✅ تسجيل الحضور بالـ Backend
//   const recordAttendance = async (qrToken, lat, lng) => {
//     try {
//       await scanQR(qrToken, lat || 0, lng || 0);



//       setScanResult("success");
//       setScanMessage("✅ Attendance recorded successfully!");
//       setLocationStatus("idle");
//       setRefresh((r) => r + 1);
//     } catch (err) {
//       showError(getErrorMessage(err));
//     }
//   };


//   // ✅ معالجة نتيجة الـ QR
//   const handleQRResult = (text) => {
//     closeScanner();

//     if (!navigator.geolocation) {
//       recordAttendance(text, 0, 0);
//       return;
//     }

//     setLocationStatus("checking");
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocationStatus("approved");
//         recordAttendance(text, position.coords.latitude, position.coords.longitude);
//       },
//       () => {
//         // لو رفض الموقع، سجل بدون موقع
//         recordAttendance(text, 0, 0);
//         setLocationStatus("idle");
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   useEffect(() => {
//     if (showScanner && scanMode === "camera" && videoRef.current) {
//       const codeReader = new BrowserQRCodeReader();
//       readerRef.current = codeReader;
//       codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
//         if (result) handleQRResult(result.getText());
//       });
//     }
//     return () => {
//       if (readerRef.current) {
//         try { readerRef.current.reset(); } catch { /* ignore */ }
//       }
//     };
//   }, [showScanner, scanMode]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     handleQRResult(manualInput);
//     setManualInput("");
//   };

//   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
//   if (!course) return <h2 style={{ padding: 20 }}>Course not found</h2>;

//   const courseName = course.name || course.courseName || "";

 

//   return (
//     <div className="dashboard student-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <button className="theme-toggle" onClick={toggleTheme}>
//   {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
// </button>
//           <ul className="menu">
//             <li onClick={() => navigate("/student")}>📘 My Courses</li>
//             <li onClick={() => navigate("/student")}>👤 Profile</li>
//           </ul>
//         </div>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
//             <div><p>{firstName}</p><span>Student</span></div>
//           </div>
//           <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>{courseName}</h1>
//         <p className="back-btn" onClick={() => navigate("/student")}>← Back</p>

//         {/* Toast */}
//         {scanResult && (
//           <div className={`scan-toast ${scanResult}`}>
//             {scanMessage}
//             <span onClick={() => setScanResult(null)}>✖</span>
//           </div>
//         )}

//         {/* Location Checking */}
//         {locationStatus === "checking" && (
//           <div className="location-checking">
//             <span className="spinner">🌀</span>
//             Verifying your location...
//           </div>
//         )}

//         {/* Attendance Rate */}
//         <div className="attendance-rate-card">
//           <div className="rate-header">
//             <h3>Attendance Rate</h3>
//             <span className="rate-percent" style={{
//               color: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444"
//             }}>
//               {percent}%
//             </span>
//           </div>
//           <div className="rate-bar-bg">
//             <div className="rate-bar-fill" style={{
//               width: `${percent}%`,
//               background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
//             }} />
//           </div>
//           <p className="rate-sub">{attended} / {totalLectures} lectures attended</p>
//         </div>

//         {/* Lectures Table */}
//         <div className="table-box" style={{ marginTop: 20 }}>
//           <h2>Lectures</h2>
//           <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
//             <thead>
//               <tr>
//                 <th>Lecture</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lectures.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                     No lectures yet
//                   </td>
//                 </tr>
//               ) : (
//                 lectures.map((lec) => {
//                   const isAttended = isLectureAttended(lec.id);
//                   return (
//                     <tr key={lec.id}>
//                       <td>{lec.title}</td>
//                       <td>{lec.startTime ? new Date(lec.startTime).toLocaleString() : "-"}</td>
//                       <td>
//                         <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
//                           {isAttended ? "✅ Attended" : "Not Recorded"}
//                         </span>
//                       </td>
//                       <td>
//                         {!isAttended && (
//                           <button
//                             className="scan-btn"
//                             onClick={() => { setScanResult(null); setShowScanner(true); }}
//                           >
//                             📷 Scan QR
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       {showScanner && (
//         <div className="modal-overlay">
//           <div className="scanner-modal">
//             <div className="scanner-header">
//               <h3>Scan QR Code</h3>
//               <span onClick={closeScanner}>✖</span>
//             </div>

//             <div className="scan-toggle">
//               <button
//                 className={scanMode === "camera" ? "active" : ""}
//                 onClick={() => setScanMode("camera")}
//               >
//                 📷 Camera
//               </button>
//               <button
//                 className={scanMode === "manual" ? "active" : ""}
//                 onClick={() => setScanMode("manual")}
//               >
//                 ⌨️ Manual
//               </button>
//             </div>

//             {scanMode === "camera" && (
//               <div className="camera-box">
//                 <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />
//                 <div className="scan-frame">
//                   <div className="corner tl" /><div className="corner tr" />
//                   <div className="corner bl" /><div className="corner br" />
//                 </div>
//               </div>
//             )}

//             {scanMode === "manual" && (
//               <form onSubmit={handleManualSubmit} className="manual-form">
//                 <textarea
//                   placeholder="Paste QR token here..."
//                   value={manualInput}
//                   onChange={(e) => setManualInput(e.target.value)}
//                   rows={4}
//                 />
//                 <button type="submit">Submit</button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
// <nav className="mobile-nav">
//   <ul>
//     <li onClick={() => navigate("/student")}>
//       📘 Courses
//     </li>

//     <li onClick={() => navigate("/student")}>
//       👤 Profile
//     </li>

//     {/* Theme */}
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

// export default StudentCourseDetails;


// import { useRealtime } from "../hooks/useRealtime";
// import { EVENTS } from "../realtime";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { BrowserQRCodeReader } from "@zxing/browser";
// import "./../styles/dashboard.css";
// import "./../styles/studentCourseDetails.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getMyCourses, getMyAttendanceHistory, scanQR } from "../services/studentService";
// import { getLecturesByCourse } from "../services/lectureService";
// import { useTheme } from "../context/ThemeContext";

// function StudentCourseDetails() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [course, setCourse] = useState(null);
//   const [lectures, setLectures] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(0);

//   const [showScanner, setShowScanner] = useState(false);
//   const [scanMode, setScanMode] = useState("camera");
//   const [manualInput, setManualInput] = useState("");
//   const [scanResult, setScanResult] = useState(null);
//   const [scanMessage, setScanMessage] = useState("");
//   const [locationStatus, setLocationStatus] = useState("idle");

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);
//   const scannedRef = useRef(false); // ✅ منع تكرار الـ QR read

//   const token = localStorage.getItem("token");
//   const decoded = token ? parseJwt(token) : {};
//   const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";
//   const firstName = studentName.split(" ")[0] || "Student";

//   // ✅ real-time
//   useRealtime((msg) => {
//     if (
//       msg.event === EVENTS.LECTURE_ADDED &&
//       msg.data.courseCode === (course?.code || course?.courseCode)
//     ) {
//       setRefresh((r) => r + 1);
//     }
//     if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//       setRefresh((r) => r + 1);
//     }
//   });

//   // ✅ جيب بيانات الكورس والمحاضرات والحضور
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [coursesData, historyData] = await Promise.all([
//           getMyCourses(),
//           getMyAttendanceHistory(),
//         ]);

//         const found = coursesData.find((c) => c.courseId === Number(courseId));
//         setCourse(found || null);

//         // ✅ deduplication بالـ courseLectureId
//         const uniqueAttendance = Object.values(
//           historyData.reduce((acc, a) => {
//             if (!acc[a.courseLectureId]) acc[a.courseLectureId] = a;
//             return acc;
//           }, {})
//         );
//         setAttendance(uniqueAttendance);

//         if (found) {
//           const lecturesData = await getLecturesByCourse(found.courseId);
//           setLectures(lecturesData);
//         }
//       } catch (err) {
//         console.error(getErrorMessage(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [courseId, refresh]);

//   const totalLectures = lectures.length;

//   const attended = lectures.filter((lec) =>
//     attendance.some((a) => a.courseLectureId === lec.id)
//   ).length;

//   const percent = totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

//   const isLectureAttended = (lectureId) =>
//     attendance.some((a) => a.courseLectureId === lectureId);

//   const showError = (msg) => {
//     setScanResult("error");
//     setScanMessage(msg);
//     setLocationStatus("idle"); // ✅ reset location status عند الخطأ
//   };

//   const closeScanner = () => {
//     setShowScanner(false);
//     setScanMode("camera");
//     setLocationStatus("idle");
//     scannedRef.current = false; // ✅ reset الـ flag عند الإغلاق
//     if (readerRef.current) {
//       try { readerRef.current.reset(); } catch { /* ignore */ }
//     }
//   };

//   // ✅ فتح الـ scanner مع reset كامل للـ state
//   const openScanner = () => {
//     setScanResult(null);
//     setScanMessage("");
//     setLocationStatus("idle");
//     scannedRef.current = false; // ✅ reset الـ flag
//     setShowScanner(true);
//   };

//   const recordAttendance = async (qrToken, lat, lng) => {
//     try {
//       await scanQR(qrToken, lat || 0, lng || 0);
//       setScanResult("success");
//       setScanMessage("✅ Attendance recorded successfully!");
//       setLocationStatus("idle"); // ✅ reset بعد النجاح
//       setRefresh((r) => r + 1);
//     } catch (err) {
//       showError(getErrorMessage(err));
//     }
//   };

//   const handleQRResult = (text) => {
//     closeScanner();

//     if (!navigator.geolocation) {
//       recordAttendance(text, 0, 0);
//       return;
//     }

//     setLocationStatus("checking");
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocationStatus("approved");
//         recordAttendance(text, position.coords.latitude, position.coords.longitude);
//       },
//       () => {
//         recordAttendance(text, 0, 0);
//         setLocationStatus("idle"); // ✅ reset لو رفض الموقع
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   useEffect(() => {
//     if (showScanner && scanMode === "camera" && videoRef.current) {
//       const codeReader = new BrowserQRCodeReader();
//       readerRef.current = codeReader;
//       codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
//         if (result && !scannedRef.current) {
//           scannedRef.current = true; // ✅ منع التكرار
//           handleQRResult(result.getText());
//         }
//       });
//     }
//     return () => {
//       if (readerRef.current) {
//         try { readerRef.current.reset(); } catch { /* ignore */ }
//       }
//     };
//   }, [showScanner, scanMode]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     handleQRResult(manualInput);
//     setManualInput("");
//   };

//   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
//   if (!course) return <h2 style={{ padding: 20 }}>Course not found</h2>;

//   const courseName = course.name || course.courseName || "";

//   return (
//     <div className="dashboard student-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <button className="theme-toggle" onClick={toggleTheme}>
//             {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
//           </button>
//           <ul className="menu">
//             <li onClick={() => navigate("/student")}>📘 My Courses</li>
//             <li onClick={() => navigate("/student")}>👤 Profile</li>
//           </ul>
//         </div>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
//             <div><p>{firstName}</p><span>Student</span></div>
//           </div>
//           <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>{courseName}</h1>
//         <p className="back-btn" onClick={() => navigate("/student")}>← Back</p>

//         {/* Toast */}
//         {scanResult && (
//           <div className={`scan-toast ${scanResult}`}>
//             {scanMessage}
//             <span onClick={() => setScanResult(null)}>✖</span>
//           </div>
//         )}

//         {/* ✅ Location Checking — بيظهر بس لو checking فعلاً */}
//         {locationStatus === "checking" && (
//           <div className="location-checking">
//             <span className="spinner">🌀</span>
//             Verifying your location...
//           </div>
//         )}

//         {/* Attendance Rate */}
//         <div className="attendance-rate-card">
//           <div className="rate-header">
//             <h3>Attendance Rate</h3>
//             <span className="rate-percent" style={{
//               color: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444"
//             }}>
//               {percent}%
//             </span>
//           </div>
//           <div className="rate-bar-bg">
//             <div className="rate-bar-fill" style={{
//               width: `${percent}%`,
//               background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
//             }} />
//           </div>
//           <p className="rate-sub">{attended} / {totalLectures} lectures attended</p>
//         </div>

//         {/* Lectures Table */}
//         <div className="table-box" style={{ marginTop: 20 }}>
//           <h2>Lectures</h2>
//           <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
//             <thead>
//               <tr>
//                 <th>Lecture</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lectures.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                     No lectures yet
//                   </td>
//                 </tr>
//               ) : (
//                 lectures.map((lec) => {
//                   const isAttended = isLectureAttended(lec.id);
//                   return (
//                     <tr key={lec.id}>
//                       <td>{lec.title}</td>
//                       <td>{lec.startTime ? new Date(lec.startTime).toLocaleString() : "-"}</td>
//                       <td>
//                         <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
//                           {isAttended ? "✅ Attended" : "Not Recorded"}
//                         </span>
//                       </td>
//                       <td>
//                         {!isAttended && (
//                           <button
//                             className="scan-btn"
//                             onClick={openScanner} // ✅ بيستخدم openScanner مع reset كامل
//                           >
//                             📷 Scan QR
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       {showScanner && (
//         <div className="modal-overlay">
//           <div className="scanner-modal">
//             <div className="scanner-header">
//               <h3>Scan QR Code</h3>
//               <span onClick={closeScanner}>✖</span>
//             </div>

//             <div className="scan-toggle">
//               <button
//                 className={scanMode === "camera" ? "active" : ""}
//                 onClick={() => setScanMode("camera")}
//               >
//                 📷 Camera
//               </button>
//               <button
//                 className={scanMode === "manual" ? "active" : ""}
//                 onClick={() => setScanMode("manual")}
//               >
//                 ⌨️ Manual
//               </button>
//             </div>

//             {scanMode === "camera" && (
//               <div className="camera-box">
//                 <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />
//                 <div className="scan-frame">
//                   <div className="corner tl" /><div className="corner tr" />
//                   <div className="corner bl" /><div className="corner br" />
//                 </div>
//               </div>
//             )}

//             {scanMode === "manual" && (
//               <form onSubmit={handleManualSubmit} className="manual-form">
//                 <textarea
//                   placeholder="Paste QR token here..."
//                   value={manualInput}
//                   onChange={(e) => setManualInput(e.target.value)}
//                   rows={4}
//                 />
//                 <button type="submit">Submit</button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Mobile Bottom Nav */}
//       <nav className="mobile-nav">
//         <ul>
//           <li onClick={() => navigate("/student")}>📘 Courses</li>
//           <li onClick={() => navigate("/student")}>👤 Profile</li>
//           <li>
//             <button className="theme-toggle mobile-theme" onClick={toggleTheme}>
//               {theme === "dark" ? "☀️" : "🌙"}
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default StudentCourseDetails;


// import { useRealtime } from "../hooks/useRealtime";
// import { EVENTS } from "../realtime";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import { BrowserQRCodeReader } from "@zxing/browser";
// import "./../styles/dashboard.css";
// import "./../styles/studentCourseDetails.css";
// import { parseJwt, getErrorMessage } from "../services/api";
// import { getMyCourses, getMyAttendanceHistory, scanQR } from "../services/studentService";
// import { getLecturesByCourse } from "../services/lectureService";
// import { useTheme } from "../context/ThemeContext";

// function StudentCourseDetails() {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [course, setCourse] = useState(null);
//   const [lectures, setLectures] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refresh, setRefresh] = useState(0);

//   const [showScanner, setShowScanner] = useState(false);
//   const [scanMode, setScanMode] = useState("camera");
//   const [manualInput, setManualInput] = useState("");
//   const [scanResult, setScanResult] = useState(null);
//   const [scanMessage, setScanMessage] = useState("");
//   const [locationStatus, setLocationStatus] = useState("idle");

//   const videoRef = useRef(null);
//   const readerRef = useRef(null);
//   const scannedRef = useRef(false);

//   const token = localStorage.getItem("token");
//   const decoded = token ? parseJwt(token) : {};
//   const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";
//   const firstName = studentName.split(" ")[0] || "Student";

//   useRealtime((msg) => {
//     if (
//       msg.event === EVENTS.LECTURE_ADDED &&
//       msg.data.courseCode === (course?.code || course?.courseCode)
//     ) {
//       setRefresh((r) => r + 1);
//     }
//     if (msg.event === EVENTS.ATTENDANCE_RECORDED) {
//       setRefresh((r) => r + 1);
//     }
//   });

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const [coursesData, historyData] = await Promise.all([
//           getMyCourses(),
//           getMyAttendanceHistory(),
//         ]);

//         const found = coursesData.find((c) => c.courseId === Number(courseId));
//         setCourse(found || null);

//         // ✅ الـ historyData بيرجع تاريخ الطالب نفسه فقط
//         // مش محتاجين deduplication — ده كان بيمسح records صح
//         setAttendance(Array.isArray(historyData) ? historyData : []);

//         if (found) {
//           const lecturesData = await getLecturesByCourse(found.courseId);
//           setLectures(lecturesData || []);
//         }
//       } catch (err) {
//         console.error(getErrorMessage(err));
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [courseId, refresh]);

//   const totalLectures = lectures.length;

//   const attended = lectures.filter((lec) =>
//     attendance.some((a) => a.courseLectureId === lec.id)
//   ).length;

//   const percent = totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

//   const isLectureAttended = (lectureId) =>
//     attendance.some((a) => a.courseLectureId === lectureId);

//   const showError = (msg) => {
//     setScanResult("error");
//     setScanMessage(msg);
//     setLocationStatus("idle");
//   };

//   const closeScanner = () => {
//     setShowScanner(false);
//     setScanMode("camera");
//     setLocationStatus("idle");
//     scannedRef.current = false;
//     if (readerRef.current) {
//       try { readerRef.current.reset(); } catch { /* ignore */ }
//     }
//   };

//   const openScanner = () => {
//     setScanResult(null);
//     setScanMessage("");
//     setLocationStatus("idle");
//     scannedRef.current = false;
//     setShowScanner(true);
//   };

//   const recordAttendance = async (qrToken, lat, lng) => {
//     try {
//       await scanQR(qrToken, lat, lng);
//       setScanResult("success");
//       setScanMessage("✅ Attendance recorded successfully!");
//       setLocationStatus("idle");
//       setRefresh((r) => r + 1);
//     } catch (err) {
//       showError(getErrorMessage(err));
//     }
//   };

//   const handleQRResult = (text) => {
//     closeScanner();

//     if (!navigator.geolocation) {
//       recordAttendance(text, 0, 0);
//       return;
//     }

//     setLocationStatus("checking");
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocationStatus("approved");
//         recordAttendance(text, position.coords.latitude, position.coords.longitude);
//       },
//       (err) => {
//         console.log("Location error:", err.code, err.message);
//         setLocationStatus("idle");
//         if (err.code === 1) {
//           showError("❌ Location access denied. Please allow location to record attendance.");
//         } else if (err.code === 2) {
//           showError("❌ Location unavailable. Please try again outdoors.");
//         } else {
//           showError("❌ Location timeout. Please try again.");
//         }
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     );
//   };

//   useEffect(() => {
//     if (showScanner && scanMode === "camera" && videoRef.current) {
//       const codeReader = new BrowserQRCodeReader();
//       readerRef.current = codeReader;
//       codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
//         if (result && !scannedRef.current) {
//           scannedRef.current = true;
//           handleQRResult(result.getText());
//         }
//       });
//     }
//     return () => {
//       if (readerRef.current) {
//         try { readerRef.current.reset(); } catch { /* ignore */ }
//       }
//     };
//   }, [showScanner, scanMode]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleManualSubmit = (e) => {
//     e.preventDefault();
//     handleQRResult(manualInput);
//     setManualInput("");
//   };

//   if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
//   if (!course) return <h2 style={{ padding: 20 }}>Course not found</h2>;

//   const courseName = course.name || course.courseName || "";

//   return (
//     <div className="dashboard student-page">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div>
//           <h2 className="logo">QR Attend</h2>
//           <button className="theme-toggle" onClick={toggleTheme}>
//             {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
//           </button>
//           <ul className="menu">
//             <li onClick={() => navigate("/student")}>📘 My Courses</li>
//             <li onClick={() => navigate("/student")}>👤 Profile</li>
//           </ul>
//         </div>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
//             <div><p>{firstName}</p><span>Student</span></div>
//           </div>
//           <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
//             Sign Out
//           </button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>{courseName}</h1>
//         <p className="back-btn" onClick={() => navigate("/student")}>← Back</p>

//         {/* Toast */}
//         {scanResult && (
//           <div className={`scan-toast ${scanResult}`}>
//             {scanMessage}
//             <span onClick={() => setScanResult(null)}>✖</span>
//           </div>
//         )}

//         {/* Location Checking */}
//         {locationStatus === "checking" && (
//           <div className="location-checking">
//             <span className="spinner">🌀</span>
//             Getting your location... please wait
//           </div>
//         )}

//         {/* Attendance Rate */}
//         <div className="attendance-rate-card">
//           <div className="rate-header">
//             <h3>Attendance Rate</h3>
//             <span className="rate-percent" style={{
//               color: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444"
//             }}>
//               {percent}%
//             </span>
//           </div>
//           <div className="rate-bar-bg">
//             <div className="rate-bar-fill" style={{
//               width: `${percent}%`,
//               background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
//             }} />
//           </div>
//           <p className="rate-sub">{attended} / {totalLectures} lectures attended</p>
//         </div>

//         {/* Lectures Table */}
//         <div className="table-box" style={{ marginTop: 20 }}>
//           <h2>Lectures</h2>
//           <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
//             <thead>
//               <tr>
//                 <th>Lecture</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {lectures.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                     No lectures yet
//                   </td>
//                 </tr>
//               ) : (
//                 lectures.map((lec) => {
//                   const isAttended = isLectureAttended(lec.id);
//                   return (
//                     <tr key={lec.id}>
//                       <td>{lec.title}</td>
//                       <td>{lec.startTime ? new Date(lec.startTime).toLocaleString() : "-"}</td>
//                       <td>
//                         <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
//                           {isAttended ? "✅ Attended" : "Not Recorded"}
//                         </span>
//                       </td>
//                       <td>
//                         {!isAttended && (
//                           <button className="scan-btn" onClick={openScanner}>
//                             📷 Scan QR
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       {showScanner && (
//         <div className="modal-overlay">
//           <div className="scanner-modal">
//             <div className="scanner-header">
//               <h3>Scan QR Code</h3>
//               <span onClick={closeScanner}>✖</span>
//             </div>

//             <div style={{
//               background: "var(--accent-glow)",
//               border: "1px solid rgba(99,102,241,0.25)",
//               borderRadius: 8,
//               padding: "10px 14px",
//               marginBottom: 16,
//               fontSize: 13,
//               color: "var(--accent)",
//               display: "flex",
//               alignItems: "center",
//               gap: 8,
//             }}>
//               📍 Make sure location is enabled before scanning
//             </div>

//             <div className="scan-toggle">
//               <button
//                 className={scanMode === "camera" ? "active" : ""}
//                 onClick={() => setScanMode("camera")}
//               >
//                 📷 Camera
//               </button>
//               <button
//                 className={scanMode === "manual" ? "active" : ""}
//                 onClick={() => setScanMode("manual")}
//               >
//                 ⌨️ Manual
//               </button>
//             </div>

//             {scanMode === "camera" && (
//               <div className="camera-box">
//                 <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />
//                 <div className="scan-frame">
//                   <div className="corner tl" /><div className="corner tr" />
//                   <div className="corner bl" /><div className="corner br" />
//                 </div>
//               </div>
//             )}

//             {scanMode === "manual" && (
//               <form onSubmit={handleManualSubmit} className="manual-form">
//                 <textarea
//                   placeholder="Paste QR token here..."
//                   value={manualInput}
//                   onChange={(e) => setManualInput(e.target.value)}
//                   rows={4}
//                 />
//                 <button type="submit">Submit</button>
//               </form>
//             )}
//           </div>
//         </div>
//       )}

//       <nav className="mobile-nav">
//         <ul>
//           <li onClick={() => navigate("/student")}>📘 Courses</li>
//           <li onClick={() => navigate("/student")}>👤 Profile</li>
//           <li>
//             <button className="theme-toggle mobile-theme" onClick={toggleTheme}>
//               {theme === "dark" ? "☀️" : "🌙"}
//             </button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// }

// export default StudentCourseDetails;


import { useRealtime } from "../hooks/useRealtime";
import { EVENTS } from "../realtime";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./../styles/dashboard.css";
import "./../styles/studentCourseDetails.css";
import { parseJwt, getErrorMessage } from "../services/api";
import { getMyCourses, getMyAttendanceHistory, scanQR } from "../services/studentService";
import { getLecturesByCourse } from "../services/lectureService";
import { useTheme } from "../context/ThemeContext";

function StudentCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState("camera");
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState("");


  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const scannedRef = useRef(false);
  const toastTimerRef = useRef(null); // ✅ منع تكرار الـ toast
  const [toastKey, setToastKey] = useState(0); // ✅ remount كل مرة

  const token = localStorage.getItem("token");
  const decoded = token ? parseJwt(token) : {};
  const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";
  const firstName = studentName.split(" ")[0] || "Student";

  const courseCode = course?.code || course?.courseCode;
  useRealtime(EVENTS.LECTURE_ADDED, useCallback((msg) => {
    if (msg.data?.courseCode === courseCode) {
      setRefresh((r) => r + 1);
    }
  }, [courseCode]));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [coursesData, historyData] = await Promise.all([
          getMyCourses(),
          getMyAttendanceHistory(),
        ]);

        const found = coursesData.find((c) => c.courseId === Number(courseId));
        setCourse(found || null);

        // ✅ الـ historyData بيرجع تاريخ الطالب نفسه فقط
        // مش محتاجين deduplication — ده كان بيمسح records صح
        setAttendance(Array.isArray(historyData) ? historyData : []);

        if (found) {
          const lecturesData = await getLecturesByCourse(found.courseId);
          setLectures(lecturesData || []);
        }
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId, refresh]);

  const totalLectures = lectures.length;

  const attended = lectures.filter((lec) =>
    attendance.some((a) => a.courseLectureId === lec.id)
  ).length;

  const percent = totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

  const isLectureAttended = (lectureId) =>
    attendance.some((a) => a.courseLectureId === lectureId);

  const showToast = (type, msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastKey((k) => k + 1); // ✅ remount
    setScanResult(type);
    setScanMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setScanResult(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  const showError = (msg) => showToast("error", msg);

  const closeScanner = () => {
    setShowScanner(false);
    setScanMode("camera");
    scannedRef.current = false;
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch { /* ignore */ }
    }
  };

  const openScanner = () => {
    setScanResult(null);
    setScanMessage("");
    scannedRef.current = false;
    setShowScanner(true);
  };

  const recordAttendance = async (qrToken, lat, lng) => {
    try {
      await scanQR(qrToken, lat, lng);
      setRefresh((r) => r + 1);
      showToast("success", "✅ Attendance recorded successfully!");
    } catch (err) {
      // ✅ بنعرض رسالة الـ Backend مباشرة زي ما هي
      showError(getErrorMessage(err));
    }
  };

  const handleQRResult = (text) => {
    // ✅ اقفل الـ scanner بس متعملش reset للـ scannedRef لحد ما الـ attendance يتسجل
    setShowScanner(false);
    setScanMode("camera");
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch { /* ignore */ }
    }

    if (!navigator.geolocation) {
      recordAttendance(text, 0, 0);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        recordAttendance(text, position.coords.latitude, position.coords.longitude);
      },
      () => {
        recordAttendance(text, 0, 0);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (showScanner && scanMode === "camera" && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      readerRef.current = codeReader;
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
        if (result && !scannedRef.current) {
          scannedRef.current = true;
          handleQRResult(result.getText());
        }
      });
    }
    return () => {
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch { /* ignore */ }
      }
    };
  }, [showScanner, scanMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleQRResult(manualInput);
    setManualInput("");
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!course) return <h2 style={{ padding: 20 }}>Course not found</h2>;

  const courseName = course.name || course.courseName || "";

  return (
    <div className="dashboard student-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <ul className="menu">
            <li onClick={() => navigate("/student")}>📘 My Courses</li>
            <li onClick={() => navigate("/student")}>👤 Profile</li>
          </ul>
        </div>
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">{firstName?.[0]?.toUpperCase() || "S"}</div>
            <div><p>{firstName}</p><span>Student</span></div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>{courseName}</h1>
        <p className="back-btn" onClick={() => navigate("/student")}>← Back</p>

        {/* Toast */}
        {scanResult && (
          <div key={toastKey} className={`scan-toast ${scanResult}`}>
            {scanMessage}
            <span onClick={() => setScanResult(null)}>✖</span>
          </div>
        )}



        {/* Attendance Rate */}
        <div className="attendance-rate-card">
          <div className="rate-header">
            <h3>Attendance Rate</h3>
            <span className="rate-percent" style={{
              color: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444"
            }}>
              {percent}%
            </span>
          </div>
          <div className="rate-bar-bg">
            <div className="rate-bar-fill" style={{
              width: `${percent}%`,
              background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444",
            }} />
          </div>
          <p className="rate-sub">{attended} / {totalLectures} lectures attended</p>
        </div>

        {/* Lectures Table */}
        <div className="table-box" style={{ marginTop: 20 }}>
          <h2>Lectures</h2>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr>
                <th>Lecture</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>
                    No lectures yet
                  </td>
                </tr>
              ) : (
                lectures.map((lec) => {
                  const isAttended = isLectureAttended(lec.id);
                  return (
                    <tr key={lec.id}>
                      <td>{lec.title}</td>
                      <td>{lec.startTime ? new Date(lec.startTime).toLocaleString() : "-"}</td>
                      <td>
                        <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
                          {isAttended ? "✅ Attended" : "Not Recorded"}
                        </span>
                      </td>
                      <td>
                        {!isAttended && (
                          <button className="scan-btn" onClick={openScanner}>
                            📷 Scan QR
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="modal-overlay">
          <div className="scanner-modal">
            <div className="scanner-header">
              <h3>Scan QR Code</h3>
              <span onClick={closeScanner}>✖</span>
            </div>

            <div style={{
              background: "var(--accent-glow)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 13,
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              📍 Make sure location is enabled before scanning
            </div>

            <div className="scan-toggle">
              <button
                className={scanMode === "camera" ? "active" : ""}
                onClick={() => setScanMode("camera")}
              >
                📷 Camera
              </button>
              <button
                className={scanMode === "manual" ? "active" : ""}
                onClick={() => setScanMode("manual")}
              >
                ⌨️ Manual
              </button>
            </div>

            {scanMode === "camera" && (
              <div className="camera-box">
                <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />
                <div className="scan-frame">
                  <div className="corner tl" /><div className="corner tr" />
                  <div className="corner bl" /><div className="corner br" />
                </div>
              </div>
            )}

            {scanMode === "manual" && (
              <form onSubmit={handleManualSubmit} className="manual-form">
                <textarea
                  placeholder="Paste QR token here..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  rows={4}
                />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}

      <nav className="mobile-nav">
        <ul>
          <li onClick={() => navigate("/student")}>📘 Courses</li>
          <li onClick={() => navigate("/student")}>👤 Profile</li>
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

export default StudentCourseDetails;