import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./../styles/dashboard.css";
import "./../styles/studentCourseDetails.css";
import api, { getErrorMessage } from "../services/api";

function StudentCourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState("camera");
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle");
  const [refresh, setRefresh] = useState(0);

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const studentName = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Student";

  // ✅ جيب بيانات الكورس والمحاضرات والحضور
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [coursesRes, lecturesRes, historyRes] = await Promise.all([
          api.get("/student/MyCourses"),
          api.get("/courselecture/AllCourseLectures", { params: { pagenumber: 1, pagesize: 100 } }),
          api.get("/student/MyAttendanceHistory"),
        ]);

        const allCourses = coursesRes.data || [];
        const found = allCourses.find(
          (c) => c.id === parseInt(courseCode) || c.code === courseCode || c.courseCode === courseCode
        );
        setCourse(found || null);

        if (found) {
          const allLectures = lecturesRes.data?.items || lecturesRes.data || [];
          setLectures(allLectures.filter((l) => l.courseId === found.id));
        }

        setAttendance(historyRes.data || []);
      } catch (err) {
        console.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseCode, refresh]);

  const totalLectures = lectures.length;
  const attended = attendance.filter((a) => a.courseId === course?.id).length;
  const percent = totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

  const isLectureAttended = (lectureId) => {
    return attendance.some((a) => a.courseLectureId === lectureId || a.lectureId === lectureId);
  };

  const showError = (msg) => {
    setScanResult("error");
    setScanMessage(msg);
    setLocationStatus("idle");
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanMode("camera");
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch { /* ignore */ }
    }
  };

  // ✅ تسجيل الحضور بالـ Backend
  const recordAttendance = async (qrToken, location) => {
    try {
      await api.post("/student/ScanQr", {
        token: qrToken,
        studentLatitude: location?.lat || 0,
        studentLongitude: location?.lng || 0,
      });
      setScanResult("success");
      setScanMessage("✅ Attendance recorded successfully!");
      setLocationStatus("idle");
      setRefresh((r) => r + 1);
    } catch (err) {
      showError(getErrorMessage(err));
    }
  };

  // ✅ معالجة نتيجة الـ QR
  const handleQRResult = (text) => {
    closeScanner();

    if (!navigator.geolocation) {
      recordAttendance(text, null);
      return;
    }

    setLocationStatus("checking");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("approved");
        recordAttendance(text, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // لو رفض الموقع، سجل بدون موقع
        recordAttendance(text, null);
        setLocationStatus("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (showScanner && scanMode === "camera" && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      readerRef.current = codeReader;
      codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
        if (result) handleQRResult(result.getText());
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

  return (
    <div className="dashboard student-page">
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/student")}>📘 My Courses</li>
          </ul>
        </div>
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">{studentName?.[0]?.toUpperCase() || "S"}</div>
            <div><p>{studentName}</p><span>Student</span></div>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/"); }}>Sign Out</button>
        </div>
      </div>

      <div className="main">
        <h1>{course.name || course.courseName}</h1>
        <p className="back-btn" onClick={() => navigate("/student")}>← Back</p>

        {scanResult && (
          <div className={`scan-toast ${scanResult}`}>
            {scanMessage}
            <span onClick={() => setScanResult(null)}>✖</span>
          </div>
        )}

        {locationStatus === "checking" && (
          <div className="location-checking">
            <span className="spinner">🌀</span>
            Verifying your location...
          </div>
        )}

        <div className="attendance-rate-card">
          <div className="rate-header">
            <h3>Attendance Rate</h3>
            <span className="rate-percent" style={{ color: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444" }}>
              {percent}%
            </span>
          </div>
          <div className="rate-bar-bg">
            <div className="rate-bar-fill" style={{ width: `${percent}%`, background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444" }} />
          </div>
          <p className="rate-sub">{attended} / {totalLectures} lectures attended</p>
        </div>

        <div className="table-box" style={{ marginTop: 20 }}>
          <h2>Lectures</h2>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr><th>Lecture</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {lectures.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>No lectures yet</td></tr>
              ) : (
                lectures.map((lec) => {
                  const isAttended = isLectureAttended(lec.id);
                  return (
                    <tr key={lec.id}>
                      <td>{lec.title}</td>
                      <td>{new Date(lec.startTime).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
                          {isAttended ? "✅ Attended" : "Not Recorded"}
                        </span>
                      </td>
                      <td>
                        {!isAttended && (
                          <button className="scan-btn" onClick={() => { setScanResult(null); setShowScanner(true); }}>
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

      {showScanner && (
        <div className="modal-overlay">
          <div className="scanner-modal">
            <div className="scanner-header">
              <h3>Scan QR Code</h3>
              <span onClick={closeScanner}>✖</span>
            </div>
            <div className="scan-toggle">
              <button className={scanMode === "camera" ? "active" : ""} onClick={() => setScanMode("camera")}>📷 Camera</button>
              <button className={scanMode === "manual" ? "active" : ""} onClick={() => setScanMode("manual")}>⌨️ Manual</button>
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
                <textarea placeholder="Paste QR token here..." value={manualInput} onChange={(e) => setManualInput(e.target.value)} rows={4} />
                <button type="submit">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentCourseDetails;