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
} from "react-icons/fa";

import FormModal from "../components/FormModal";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState("students");

  const [lecturers, setLecturers] = useState(
    JSON.parse(localStorage.getItem("lecturers")) || []
  );

  const [students, setStudents] = useState(
    JSON.parse(localStorage.getItem("students")) || []
  );

  const [classrooms, setClassrooms] = useState(
    JSON.parse(localStorage.getItem("classrooms")) || []
  );

  const [search, setSearch] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editData, setEditData] = useState(null);

  // 💾 حفظ
  useEffect(() => {
    localStorage.setItem("lecturers", JSON.stringify(lecturers));
  }, [lecturers]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("classrooms", JSON.stringify(classrooms));
  }, [classrooms]);

  // ================= FILTER =================
  const filteredLecturers = lecturers.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStudents = students.filter((s) =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter((c) =>
    c.name?.toLowerCase().includes(searchClass.toLowerCase())
  );

  // ================= SAVE =================
  const handleSave = (data) => {
    if (modalType === "lecturer") {
      const fullName = `${data.firstName} ${data.middleName} ${data.lastName}`;

      if (editData) {
        setLecturers(
          lecturers.map((l) =>
            l.id === editData.id ? { ...data, name: fullName, id: l.id } : l
          )
        );
      } else {
        setLecturers([
          ...lecturers,
          { ...data, name: fullName, id: Date.now() },
        ]);
      }
    }

    if (modalType === "classroom") {
      const newData = {
        ...data,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        radius: parseFloat(data.radius),
      };

      if (editData) {
        setClassrooms(
          classrooms.map((c) =>
            c.id === editData.id ? { ...newData, id: c.id } : c
          )
        );
      } else {
        setClassrooms([...classrooms, { ...newData, id: Date.now() }]);
      }
    }
  };

  // ================= DELETE =================
  const deleteLecturer = (id) =>
    setLecturers(lecturers.filter((l) => l.id !== id));

  const deleteStudent = (id) =>
    setStudents(students.filter((s) => s.id !== id));

  const deleteClassroom = (id) =>
    setClassrooms(classrooms.filter((c) => c.id !== id));

  return (
    <div className="dashboard">
      {/* Sidebar */}
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
        </ul>

        <div className="user-box">
          <div className="user-info">
            <div className="avatar">S</div>
            <div>
              <p>System Administrator</p>
              <span>Admin</span>
            </div>
          </div>

          <button className="logout-btn" onClick={() => navigate("/")}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Admin Dashboard</h1>

        {/* 🔥 Cards رجعناها */}
        <div className="cards">
          <div className="card">
            <FaChalkboardTeacher />
            <h2>{lecturers.length}</h2>
            <p>Lecturers</p>
          </div>

          <div className="card">
            <FaUserGraduate />
            <h2>{students.length}</h2>
            <p>Students</p>
          </div>

          <div className="card">
  <FaBook />
  <h2>
    {(() => {
      const lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];
      return lecturers.reduce((sum, l) => {
        const c = JSON.parse(localStorage.getItem(`courses_${l.email}`)) || [];
        return sum + c.length;
      }, 0);
    })()}
  </h2>
  <p>Courses</p>
</div>

          <div className="card">
            <FaMapMarkerAlt />
            <h2>{classrooms.length}</h2>
            <p>Classrooms</p>
          </div>
        </div>

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
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLecturers.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name}</td>
                    <td>{l.email}</td>
                    <td>{l.username}</td>
                    <td>
                      <FaEdit
                        onClick={() => {
                          setModalType("lecturer");
                          setEditData(l);
                          setOpenModal(true);
                        }}
                      />
                      <FaTrash onClick={() => deleteLecturer(l.id)} />
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
            <div className="table-header">
              <h2>Manage Students</h2>
            </div>

            <input
              className="search"
              placeholder="Filter students by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>SSIN</th>
                  <th>Section</th>
                  <th>Level</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.ssin || "-"}</td>
                    <td>{s.section || "-"}</td>
                    <td>{s.level || "-"}</td>
                    <td>{s.department || "-"}</td>
                    <td>
                      <FaEdit />
                      <FaTrash onClick={() => deleteStudent(s.id)} />
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
                    <td>{c.building}</td>
                    <td>{c.lat}, {c.lng}</td>
                    <td>{c.radius}</td>
                    <td>
                      <FaEdit
                        onClick={() => {
                          setModalType("classroom");
                          setEditData(c);
                          setOpenModal(true);
                        }}
                      />
                      <FaTrash onClick={() => deleteClassroom(c.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
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