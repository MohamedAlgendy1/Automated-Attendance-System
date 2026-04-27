import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import LecturerDashboard from "./pages/LecturerDashboard";
import CourseDetails from "./pages/CourseDetails";
import AttendanceOverview from "./pages/AttendanceOverview";
import AttendanceRecords from "./pages/AttendanceRecords";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentCourseDetails from "./pages/StudentCourseDetails"; // ✅ جديد

function ProtectedRoute({ children, role }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");
  if (!isLoggedIn) return <Navigate to="/" />;
  if (role && role !== userRole) return <Navigate to="/" />;
  return children;
}

function App() {
  const [courses, setCourses] = useState(
    JSON.parse(localStorage.getItem("courses")) || []
  );

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/lecturer"
          element={
            <ProtectedRoute role="lecturer">
              <LecturerDashboard courses={courses} setCourses={setCourses} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <ProtectedRoute role="lecturer">
              <CourseDetails courses={courses} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute role="lecturer">
              <AttendanceOverview courses={courses} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance-records/:courseId/:lectureId"
          element={
            <ProtectedRoute role="lecturer">
              <AttendanceRecords courses={courses} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard courses={courses} />
            </ProtectedRoute>
          }
        />

        {/* ✅ صفحة تفاصيل الكورس للطالب */}
        <Route
          path="/student/course/:courseCode"
          element={
            <ProtectedRoute role="student">
              <StudentCourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;