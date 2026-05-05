import "./../styles/dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaMapMarkerAlt,
  FaBook,
  FaTrash,
} from "react-icons/fa";
import api, { getErrorMessage } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("lecturers");

  const [lecturers, setLecturers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [lecturersLoading, setLecturersLoading] = useState(false);
  const [classroomsLoading, setClassroomsLoading] = useState(false);

  const [lecturersRefresh, setLecturersRefresh] = useState(0);
  const [classroomsRefresh, setClassroomsRefresh] = useState(0);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  // ================= STATS =================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/SystemDashboard");
        setStats(res.data?.data || res.data);
      } catch (err) {
        console.log(getErrorMessage(err));
      }
    };
    fetchStats();
  }, []);

  // ================= LECTURERS =================
  useEffect(() => {
    if (activePage !== "lecturers") return;

    const fetchLecturers = async () => {
      setLecturersLoading(true);
      try {
        const res = await api.get("/admin/GetLecturers", {
          params: { Name: search },
        });
        setLecturers(res.data?.data || res.data || []);
      } catch {
        setLecturers([]);
      } finally {
        setLecturersLoading(false);
      }
    };

    fetchLecturers();
  }, [activePage, search, lecturersRefresh]);

  // ================= CLASSROOMS =================
  useEffect(() => {
    if (activePage !== "classrooms") return;

    const fetchClassrooms = async () => {
      setClassroomsLoading(true);
      try {
        const res = await api.get("/classroom/AllClassRoom", {
          params: { Name: searchClass },
        });
        setClassrooms(res.data?.data || res.data || []);
      } catch {
        setClassrooms([]);
      } finally {
        setClassroomsLoading(false);
      }
    };

    fetchClassrooms();
  }, [activePage, searchClass, classroomsRefresh]);

  // ================= ACTIONS =================
  const handleCloseAccount = async (id) => {
    if (!window.confirm("Close account?")) return;
    try {
      await api.put(`/admin/CloseAccount/${id}`);
      showToast("Account closed ✅");
      setLecturersRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err));
    }
  };

  const handleDeleteClassroom = async (id) => {
    if (!window.confirm("Delete classroom?")) return;
    try {
      await api.delete(`/classroom/Delete/${id}`);
      showToast("Deleted ✅");
      setClassroomsRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ================= FILTER =================
  const filteredLecturers = lecturers.filter((l) =>
    `${l.firstName || ""} ${l.lastName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter((c) =>
    c.name?.toLowerCase().includes(searchClass.toLowerCase())
  );

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
            className={activePage === "classrooms" ? "active" : ""}
            onClick={() => setActivePage("classrooms")}
          >
            <FaMapMarkerAlt /> Classrooms
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Admin Dashboard</h1>

        {/* ===== CARDS ===== */}
        <div className="cards">
          <div className="card">
            <FaChalkboardTeacher />
            <h2>{stats?.totalLecturers ?? lecturers.length}</h2>
            <p>Lecturers</p>
          </div>

          <div className="card">
            <FaBook />
            <h2>{stats?.totalCourses ?? 0}</h2>
            <p>Courses</p>
          </div>

          <div className="card">
            <FaMapMarkerAlt />
            <h2>{stats?.totalClassrooms ?? classrooms.length}</h2>
            <p>Classrooms</p>
          </div>
        </div>

        {/* ===== LECTURERS ===== */}
        {activePage === "lecturers" && (
          <div className="table-box">
            <h2>Manage Lecturers</h2>

            <input
              className="search"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {lecturersLoading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <tbody>
                  {filteredLecturers.map((l) => (
                    <tr key={l.userId}>
                      <td>{l.firstName} {l.lastName}</td>
                      <td>{l.email}</td>
                      <td>
                        <FaTrash
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleCloseAccount(l.userId)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== CLASSROOMS ===== */}
        {activePage === "classrooms" && (
          <div className="table-box">
            <h2>Manage Classrooms</h2>

            <input
              className="search"
              placeholder="Search..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
            />

            {classroomsLoading ? (
              <p>Loading...</p>
            ) : (
              <table>
                <tbody>
                  {filteredClassrooms.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td>{c.buildingName}</td>
                      <td>
                        <FaTrash
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteClassroom(c.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast.show && <div className="toast">{toast.message}</div>}
    </div>
  );
}

export default AdminDashboard;