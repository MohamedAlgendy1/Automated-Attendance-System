import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaBook,
  FaEdit,
  FaTrash,
  FaChartBar,
} from "react-icons/fa";

import FormModal from "../components/FormModal";

import {
  getLecturers,
  addLecturer,
  closeAccount,
} from "../services/adminService";

import {
  getClassrooms,
  addClassroom,
  deleteClassroomApi,
  editClassroom,
} from "../services/classroomService";

import api, { getUserIdFromToken } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("students");

  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState(
    JSON.parse(localStorage.getItem("students")) || []
  );
  const [classrooms, setClassrooms] = useState([]);

  const [, setDashboard] = useState({});

  const [search, setSearch] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editData, setEditData] = useState(null);

  const [loading, setLoading] = useState(true);

  // ===================== LOAD DATA =====================
  const loadData = async () => {
    try {
      setLoading(true);

      const lecturersRes = await getLecturers({
        pagenumber: 1,
        pagesize: 100,
        name: "",
        sortBy: "id",
        isDescindeng: false,
      });

      const classroomRes = await getClassrooms();

      const dash = await api.get("/admin/SystemDashboard");

      setLecturers(lecturersRes.items || lecturersRes || []);
      setClassrooms(classroomRes.items || classroomRes || []);
      setDashboard(dash.data || {});
    } catch (error) {
  console.log("ERROR FROM SERVER:", error.response?.data);
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(loadData);
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // ===================== FILTER =====================
  const filteredLecturers = lecturers.filter((l) =>
    `${l.firstName} ${l.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter((c) =>
    c.name?.toLowerCase().includes(searchClass.toLowerCase())
  );

  // ===================== SAVE =====================
const handleSave = async (data) => {
  try {
    if (modalType === "lecturer") {
      console.log("FORM DATA:", data);

      if (!data.password || data.password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
      }

      await addLecturer({
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        email: data.email || "test@test.com",
        ssin: data.ssin || "0000",
      });
    }

    if (modalType === "classroom") {
      const payload = {
        name: data.name,
        buildingName: data.building,
        latitude: Number(data.lat),
        longitude: Number(data.lng),
        radiusOfAcceptanceMeter: Number(data.radius),
      };

      if (editData) {
        await editClassroom(editData.id, payload);
      } else {
        await addClassroom(payload);
      }
    }

    setOpenModal(false);
    setEditData(null);
    loadData();
  } catch (error) {
    console.log("ERROR FROM SERVER:", error.response?.data);
  }
};

  // ===================== DELETE =====================
  const deleteLecturer = async (id) => {
    const userId = getUserIdFromToken();
    await closeAccount(id, userId);
    loadData();
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((s) => s.id !== id));
  };

  const deleteClassroom = async (id) => {
    await deleteClassroomApi(id);
    loadData();
  };

  // ===================== REPORT DATA =====================
  const totalCourses = lecturers.reduce((sum, l) => {
    const c =
      JSON.parse(localStorage.getItem(`courses_${l.email}`)) || [];
    return sum + c.length;
  }, 0);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <h2 style={{ padding: 30 }}>Loading...</h2>;

  return (
    <div className="dashboard">
      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2 className="logo">QR Attend</h2>

        <ul className="menu">
          <li
            className={activePage === "lecturers" ? "active" : ""}
            onClick={() => setActivePage("lecturers")}
          >
            <FaChalkboardTeacher /> Lecturers
          </li>

          <li
            className={activePage === "students" ? "active" : ""}
            onClick={() => setActivePage("students")}
          >
            <FaUserGraduate /> Students
          </li>

          <li
            className={activePage === "classrooms" ? "active" : ""}
            onClick={() => setActivePage("classrooms")}
          >
            <FaMapMarkerAlt /> Classrooms
          </li>

          <li
            className={activePage === "reports" ? "active" : ""}
            onClick={() => setActivePage("reports")}
          >
            <FaChartBar /> Reports
          </li>
        </ul>

        <div className="user-box">
          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="main">
        <h1>Admin Dashboard</h1>

        {/* CARDS */}
       

        {/* ================= LECTURERS ================= */}
        {activePage === "lecturers" && (
          <div className="table-box">
            <div className="table-header">
              <h2>Manage Lecturers</h2>

              <button
                className="enroll-btn"
                onClick={() => {
                  setModalType("lecturer");
                  setEditData(null);
                  setOpenModal(true);
                }}
              >
                + Add Lecturer
              </button>
            </div>

            <input
              className="search"
              placeholder="Filter lecturers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLecturers.map((l) => (
                  <tr key={l.id}>
                    <td>{l.firstName} {l.lastName}</td>
                    <td>{l.email}</td>
                    <td>
                      <FaTrash
                        onClick={() => deleteLecturer(l.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= STUDENTS ================= */}
        {activePage === "students" && (
          <div className="table-box">
            <h2>Manage Students</h2>

            <input
              className="search"
              placeholder="Filter students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Section</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.section || "-"}</td>
                    <td>{s.level || "-"}</td>
                    <td>
                      <FaTrash
                        onClick={() => deleteStudent(s.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= CLASSROOMS ================= */}
        {activePage === "classrooms" && (
          <div className="table-box">
            <div className="table-header">
              <h2>Manage Classrooms</h2>

              <button
                className="enroll-btn"
                onClick={() => {
                  setModalType("classroom");
                  setEditData(null);
                  setOpenModal(true);
                }}
              >
                + Add Classroom
              </button>
            </div>

            <input
              className="search"
              placeholder="Filter classrooms..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Building</th>
                  <th>Coordinates</th>
                  <th>Radius</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredClassrooms.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.buildingName}</td>
                    <td>{c.latitude}, {c.longitude}</td>
                    <td>{c.radiusOfAcceptanceMeter}m</td>
                    <td>
                      <FaEdit
                        onClick={() => {
                          setModalType("classroom");
                          setEditData(c);
                          setOpenModal(true);
                        }}
                        style={{ cursor: "pointer", marginRight: 10 }}
                      />

                      <FaTrash
                        onClick={() => deleteClassroom(c.id)}
                        style={{ cursor: "pointer" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= REPORTS ================= */}
        {activePage === "reports" && (
          <div>
            <div className="table-box" style={{ marginBottom: 20 }}>
              <h2>📊 System Reports</h2>
              <p style={{ color: "#64748b" }}>
                Overview of lecturers, students, classrooms & courses
              </p>
            </div>

            <div className="cards">
              <div className="card">
                <FaChalkboardTeacher />
                <h2>{lecturers.length}</h2>
                <p>Total Lecturers</p>
              </div>

              <div className="card">
                <FaUserGraduate />
                <h2>{students.length}</h2>
                <p>Total Students</p>
              </div>

              <div className="card">
                <FaBook />
                <h2>{totalCourses}</h2>
                <p>Total Courses</p>
              </div>

              <div className="card">
                <FaMapMarkerAlt />
                <h2>{classrooms.length}</h2>
                <p>Total Classrooms</p>
              </div>
            </div>

            <div className="table-box">
              <h3>Lecturer Overview</h3>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {lecturers.map((l) => (
                    <tr key={l.id}>
                      <td>{l.firstName} {l.lastName}</td>
                      <td>{l.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      <FormModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        type={modalType}
        initialData={editData}
      />
    </div>
  );
}

export default AdminDashboard;