import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import "./../styles/dashboard.css";
import "./../styles/studentCourseDetails.css";

function StudentCourseDetails() {
  const { courseCode } = useParams();
  const navigate = useNavigate();

  const profile = JSON.parse(localStorage.getItem("profile")) || {};
  const studentEmail = profile.email || "unknown";

  const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = allCourses.find((c) => c.code === courseCode);

  const lectures = JSON.parse(localStorage.getItem(`lectures_${courseCode}`)) || [];

  const [attendance, setAttendance] = useState(
    JSON.parse(localStorage.getItem(`attendance_${courseCode}_${studentEmail}`)) || []
  );

  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState("camera");
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanMessage, setScanMessage] = useState("");
  const [locationStatus, setLocationStatus] = useState("idle");

  const videoRef = useRef(null);
  const readerRef = useRef(null);

  const totalLectures = lectures.length;
  const attended = attendance.length;
  const percent =
    totalLectures === 0 ? 0 : Math.round((attended / totalLectures) * 100);

  // ✅ حساب المسافة
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const toRad = (val) => (val * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

  const recordAttendance = (lectureIndex) => {
    setAttendance((prev) => {
      const newAttendance = [...prev, lectureIndex];
      localStorage.setItem(
        `attendance_${courseCode}_${studentEmail}`,
        JSON.stringify(newAttendance)
      );
      return newAttendance;
    });
    setScanResult("success");
    setScanMessage("✅ Attendance recorded successfully!");
    setLocationStatus("idle");
  };

  const checkLocation = (data) => {
    if (!navigator.geolocation) {
      showError("❌ Geolocation not supported on this device!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const distance = getDistance(
          latitude, longitude,
          data.classroom.lat, data.classroom.lng
        );
        const radius = data.classroom.radius || 100;

        if (distance <= radius) {
          setLocationStatus("approved");
          recordAttendance(data.lectureIndex);
        } else {
          showError(`📍 You are ${Math.round(distance)}m away. Must be within ${radius}m!`);
        }
      },
      () => {
        showError("❌ Location access denied. Please allow location access.");
        setLocationStatus("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleQRResult = (text) => {
    const now = Date.now();

    try {
      const data = JSON.parse(text);

      if (data.courseCode !== courseCode) {
        showError("❌ This QR code is for a different course!");
        closeScanner();
        return;
      }

      if (data.expiresAt && now > data.expiresAt) {
        showError("⏱️ This QR code has expired!");
        closeScanner();
        return;
      }

      if (attendance.includes(data.lectureIndex)) {
        showError("⚠️ Already recorded for this lecture!");
        closeScanner();
        return;
      }

      if (data.classroom?.lat && data.classroom?.lng) {
        setLocationStatus("checking");
        closeScanner();
        checkLocation(data);
      } else {
        recordAttendance(data.lectureIndex);
        closeScanner();
      }

    } catch {
      showError("❌ Invalid QR code!");
      closeScanner();
    }
  };

  // ✅ useEffect بدون handleQRResult في الـ dependencies
  useEffect(() => {
    if (showScanner && scanMode === "camera" && videoRef.current) {
      const codeReader = new BrowserQRCodeReader();
      readerRef.current = codeReader;

      codeReader.decodeFromVideoDevice(null, videoRef.current, (result) => {
        if (result) {
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

        {/* Toast */}
        {scanResult && (
          <div className={`scan-toast ${scanResult}`}>
            {scanMessage}
            <span onClick={() => setScanResult(null)}>✖</span>
          </div>
        )}

        {/* Location Checking */}
        {locationStatus === "checking" && (
          <div className="location-checking">
            <span className="spinner">🌀</span>
            Verifying your location...
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
              background: percent >= 75 ? "#22c55e" : percent >= 50 ? "#f59e0b" : "#ef4444"
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
                lectures.map((lec, i) => {
                  const isAttended = attendance.includes(i);
                  return (
                    <tr key={i}>
                      <td>{lec.title}</td>
                      <td>{new Date(lec.start).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${isAttended ? "attended" : "not-recorded"}`}>
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
                <video ref={videoRef} style={{ width: "100%", borderRadius: 12 }} />
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