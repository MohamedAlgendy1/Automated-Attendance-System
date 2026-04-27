import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./../styles/dashboard.css";
import "./../styles/studentCourseDetails.css";

function StudentCourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  // ✅ بيانات الطالب
  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const studentEmail = profile.email || "unknown";

  // ✅ الكورس
  const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = allCourses.find((c) => c.code === courseCode);

  // ✅ المحاضرات
  const [lectures, setLectures] = useState(
    JSON.parse(localStorage.getItem(`lectures_${courseCode}`)) || []
  );

  // ✅ حضور الطالب ده بس في الكورس ده
  const [attendance, setAttendance] = useState(
    JSON.parse(localStorage.getItem(`attendance_${courseCode}_${studentEmail}`)) || []
  );

  // QR Scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState("camera");
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState("");

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  // ✅ حساب النسبة
  const totalLectures = lectures.length;
  const attended = attendance.length;
  const percent =
    totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

  // ✅ تشغيل الكاميرا
  useEffect(() => {
    if (showScanner && scanMode === "camera" && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      readerRef.current = codeReader;

      codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
        if (result) {
          handleQRResult(result.getText());
        }
      });
    }

    return () => {
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch (e) {}
      }
    };
  }, [showScanner, scanMode]);

  // ✅ معالجة نتيجة الـ QR
  const handleQRResult = (text) => {
    try {
      const data = JSON.parse(text);

      if (data.courseCode !== courseCode) {
        setScanResult("error");
        setScanMessage("❌ This QR code is for a different course!");
        closeScanner();
        return;
      }

      const lectureIndex = data.lectureIndex;

      if (attendance.includes(lectureIndex)) {
        setScanResult("error");
        setScanMessage("⚠️ Already recorded for this lecture!");
        closeScanner();
        return;
      }

      // ✅ سجل الحضور بـ key مخصص للطالب
      const newAttendance = [...attendance, lectureIndex];
      setAttendance(newAttendance);
      localStorage.setItem(
        `attendance_${courseCode}_${studentEmail}`,
        JSON.stringify(newAttendance)
      );

      setScanResult("success");
      setScanMessage("✅ Attendance recorded successfully!");
      closeScanner();

    } catch (e) {
      setScanResult("error");
      setScanMessage("❌ Invalid QR code!");
      closeScanner();
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleQRResult(manualInput);
    setManualInput("");
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanMode("camera");
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch (e) {}
    }
  };

  if (!course) return <h2 style={{ padding: 20 }}>Course not found</h2>;

  return (
    <div className="dashboard student-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2 className="logo">QR Attend</h2>
          <ul className="menu">
            <li onClick={() => navigate("/student")}>📘 My Courses</li>
            <li onClick={() => navigate("/student")}>👤 Profile</li>
          </ul>
        </div>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">
              {profile.firstName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p>{profile.firstName || "Student"}</p>
              <span>Student</span>
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

        <p className="back-btn" onClick={() => navigate("/student")}>
          ← Back
        </p>

        {/* Scan Result Toast */}
        {scanResult && (
          <div className={`scan-toast ${scanResult}`}>
            {scanMessage}
            <span onClick={() => setScanResult(null)}>✖</span>
          </div>
        )}

        {/* Attendance Rate Card */}
        <div className="attendance-rate-card">
          <div className="rate-header">
            <h3>Attendance Rate</h3>
            <span
              className="rate-percent"
              style={{
                color:
                  percent >= 75
                    ? "#22c55e"
                    : percent >= 50
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              {percent}%
            </span>
          </div>

          <div className="rate-bar-bg">
            <div
              className="rate-bar-fill"
              style={{
                width: `${percent}%`,
                background:
                  percent >= 75
                    ? "#22c55e"
                    : percent >= 50
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            />
          </div>

          <p className="rate-sub">
            {attended} / {totalLectures} lectures attended
          </p>
        </div>

        {/* Lectures Table */}
        <div className="table-box" style={{ marginTop: 20 }}>
          <h2>Lectures</h2>

          <table
            className="table"
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}
          >
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
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: 20, color: "#888" }}
                  >
                    No lectures yet
                  </td>
                </tr>
              ) : (
                lectures.map((lec, i) => {
                  const isAttended = attendance.includes(i);
                  return (
                    <tr key={i}>
                      <td>{lec.title}</td>
                      <td>{new Date(lec.start).toLocaleString()}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            isAttended ? "attended" : "not-recorded"
                          }`}
                        >
                          {isAttended ? "✅ Attended" : "Not Recorded"}
                        </span>
                      </td>
                      <td>
                        {!isAttended && (
                          <button
                            className="scan-btn"
                            onClick={() => {
                              setScanResult(null);
                              setShowScanner(true);
                            }}
                          >
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
                <video
                  ref={videoRef}
                  style={{ width: "100%", borderRadius: 12 }}
                />
                <div className="scan-frame">
                  <div className="corner tl" />
                  <div className="corner tr" />
                  <div className="corner bl" />
                  <div className="corner br" />
                </div>
              </div>
            )}

            {scanMode === "manual" && (
              <form onSubmit={handleManualSubmit} className="manual-form">
                <textarea
                  placeholder="Paste QR code content here..."
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
    </div>
  );
}

export default StudentCourseDetails;