import { BrowserRouter, Routes, Route } from "react-router-dom";
import LecturerDashboard from "./pages/LecturerDashboard";
import CourseDetails from "./pages/CourseDetails";
import { useState } from "react";

function App() {
  const [courses, setCourses] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/lecturer"
          element={
            <LecturerDashboard
              courses={courses}
              setCourses={setCourses}
            />
          }
        />

        <Route
          path="/course/:id"
          element={<CourseDetails courses={courses} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;