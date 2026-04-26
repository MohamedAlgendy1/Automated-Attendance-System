import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import Login from "./pages/Login";
import LecturerDashboard from "./pages/LecturerDashboard";
import CourseDetails from "./pages/CourseDetails";
import AttendanceOverview from "./pages/AttendanceOverview";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ✅ Protected Route
function ProtectedRoute({ children, role }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/" />;

  if (role && role !== userRole) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses")) || []
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Lecturer */}
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute role="lecturer">
              <LecturerDashboard
                courses={courses}
                setCourses={setCourses}
              />
            </ProtectedRoute>
          }
        />

        {/* ✅ Course Details */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute role="lecturer">
              <CourseDetails courses={courses} />
            </ProtectedRoute>
          }
        />

        {/* ✅ Attendance (🔥 التعديل هنا بس) */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute role="lecturer">
              <AttendanceOverview courses={courses} />
            </ProtectedRoute>
          }
        />

        {/* ✅ Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;