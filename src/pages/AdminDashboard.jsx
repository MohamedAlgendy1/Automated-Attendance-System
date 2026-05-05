// import "./../styles/dashboard.css";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaChalkboardTeacher,
//   FaUserGraduate,
//   FaMapMarkerAlt,
//   FaBook,
//   FaEdit,
//   FaTrash,
//   FaChartBar,
// } from "react-icons/fa";
// import api, { getErrorMessage } from "../services/api";

// function AdminDashboard() {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState("students");

//   // ✅ Lecturers من الـ Backend
//   const [lecturers, setLecturers] = useState([]);
//   const [lecturersLoading, setLecturersLoading] = useState(false);
//   const [lecturersRefresh, setLecturersRefresh] = useState(0);

//   // ✅ Students من الـ Backend (لو فيه endpoint، لو لا من localStorage)
//   const [students, setStudents] = useState(
//     JSON.parse(localStorage.getItem("students")) || []
//   );
// ;
// const [studentSearch, setStudentSearch] = useState("");
//   // ✅ Classrooms من الـ Backend
//   const [classrooms, setClassrooms] = useState([]);
//   const [classroomsLoading, setClassroomsLoading] = useState(false);
//   const [classroomsRefresh, setClassroomsRefresh] = useState(0);

//   useEffect(() => {
//   console.log("STUDENTS:", students); // 👈 هنا
// }, [students])


// const [studentsLoading, setStudentsLoading] = useState(false);
//   // ✅ Stats
//   const [stats, setStats] = useState(null);

//   const [search, setSearch] = useState("");
//   const [searchClass, setSearchClass] = useState("");

//   // ✅ Modal للـ Lecturer
//   const [showLecturerModal, setShowLecturerModal] = useState(false);
//   const [lecturerForm, setLecturerForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     ssin: "",
//   });
//   const [lecturerFormError, setLecturerFormError] = useState("");
//   const [lecturerFormLoading, setLecturerFormLoading] = useState(false);

//   // ✅ Modal للـ Classroom
//   const [showClassroomModal, setShowClassroomModal] = useState(false);
//   const [editClassroom, setEditClassroom] = useState(null);
//   const [classroomForm, setClassroomForm] = useState({
//     name: "",
//     buildingName: "",
//     latitude: "",
//     longitude: "",
//     radiusOfAcceptanceMeter: "",
//   });
//   const [classroomFormError, setClassroomFormError] = useState("");
//   const [classroomFormLoading, setClassroomFormLoading] = useState(false);
//   const [locLoading, setLocLoading] = useState(false);
//   const [locError, setLocError] = useState("");

//   const [toast, setToast] = useState({ show: false, message: "", type: "success" });

//   const showToast = (message, type = "success") => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
//   };

//   // ✅ جيب الإحصائيات
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await api.get("/admin/SystemDashboard");
//         setStats(res.data);
//       } catch (err) {
//         console.error("Stats error:", getErrorMessage(err));
//       }
//     };
//     fetchStats();
//   }, []);

//   // ✅ جيب الـ Lecturers من الـ Backend
//   useEffect(() => {
//     const fetchLecturers = async () => {
//       setLecturersLoading(true);
//       try {
//         const res = await api.get("/admin/GetLecturers", {
//           params: {
//             pagenumber: 1,
//             pagesize: 100,
//             name: search,
//             sortBy: "id",
//             isDescindeng: false,
//           },
//         });
//         const data = res.data;
//         if (Array.isArray(data)) setLecturers(data);
//         else if (Array.isArray(data?.items)) setLecturers(data.items);
//         else if (Array.isArray(data?.data)) setLecturers(data.data);
//         else setLecturers([]);
//       } catch (err) {
//         console.error("Lecturers error:", getErrorMessage(err));
//         setLecturers([]);
//       } finally {
//         setLecturersLoading(false);
//       }
//     };
//     if (activePage === "lecturers") fetchLecturers();
//   }, [activePage, search, lecturersRefresh]);

//   // ✅ جيب الـ Classrooms من الـ Backend
//   useEffect(() => {
//     const fetchClassrooms = async () => {
//       setClassroomsLoading(true);
//       try {
//         const res = await api.get("/classroom/AllClassRoom", {
//           params: {
//             pagenumber: 1,
//             pagesize: 100,
//             Name: searchClass,
//             SortBy: "id",
//             IsDescindeng: false,
//           },
//         });
//         const data = res.data;
//         if (Array.isArray(data)) setClassrooms(data);
//         else if (Array.isArray(data?.items)) setClassrooms(data.items);
//         else if (Array.isArray(data?.data)) setClassrooms(data.data);
//         else setClassrooms([]);
//       } catch (err) {
//         console.error("Classrooms error:", getErrorMessage(err));
//         setClassrooms([]);
//       } finally {
//         setClassroomsLoading(false);
//       }
//     };
//     if (activePage === "classrooms") fetchClassrooms();
//   }, [activePage, searchClass, classroomsRefresh]);


// useEffect(() => {
//   const fetchStudents = async () => {
//     setStudentsLoading(true);
//     try {
//       const res = await api.get("/admin/GetStudents", {
//         params: {
//           pagenumber: 1,
//           pagesize: 100,
//           name: search,
//         },
//       });

//       const data = res.data;

//       if (Array.isArray(data)) setStudents(data);
//       else if (Array.isArray(data?.items)) setStudents(data.items);
//       else if (Array.isArray(data?.data)) setStudents(data.data);
//       else setStudents([]);
//     } catch (err) {
//       console.log("Students error:", getErrorMessage(err));
//       setStudents([]);
//     } finally {
//       setStudentsLoading(false);
//     }
//   };

//   if (activePage === "students") fetchStudents();
// }, [activePage, search]);

//   // ✅ إضافة Lecturer
//   const handleAddLecturer = async (e) => {
//     e.preventDefault();
//     setLecturerFormError("");
//     setLecturerFormLoading(true);
//     try {
//       await api.post("/admin/AddLecturer", {
//         firstName: lecturerForm.firstName,
//         lastName: lecturerForm.lastName,
//         email: lecturerForm.email,
//         password: lecturerForm.password,
//         ssin: lecturerForm.ssin,
//       });
//       showToast("Lecturer added successfully ✅");
//       setShowLecturerModal(false);
//       setLecturerForm({ firstName: "", lastName: "", email: "", password: "", ssin: "" });
//       setLecturersRefresh((r) => r + 1);
//     } catch (err) {
//       setLecturerFormError(getErrorMessage(err));
//     } finally {
//       setLecturerFormLoading(false);
//     }
//   };



// const handleCloseAccount = async (userid) => {
//   if (!userid) {
//     showToast("User ID not found", "error");
//     return;
//   }

//   if (!window.confirm("Are you sure you want to close this account?")) return;

//   try {
//     await api.put(`/admin/CloseAccount/${userid}`);
//     showToast("Account closed successfully ✅");
//     setLecturersRefresh((r) => r + 1);
//   } catch (err) {
//     showToast(getErrorMessage(err), "error");
//   }
// };



//   // ✅ إضافة / تعديل Classroom
//   const handleSaveClassroom = async (e) => {
//     e.preventDefault();
//     setClassroomFormError("");
//     setClassroomFormLoading(true);
//     try {
//       const payload = {
//         name: classroomForm.name,
//         buildingName: classroomForm.buildingName,
//         latitude: parseFloat(classroomForm.latitude) || 0,
//         longitude: parseFloat(classroomForm.longitude) || 0,
//         radiusOfAcceptanceMeter: parseInt(classroomForm.radiusOfAcceptanceMeter) || 0,
//       };

//       if (editClassroom) {
//         await api.put(`/classroom/Edit/${editClassroom.id}`, payload);
//         showToast("Classroom updated ✅");
//       } else {
//         await api.post("/classroom/CreateClassRoom", payload);
//         showToast("Classroom added ✅");
//       }

//       setShowClassroomModal(false);
//       setEditClassroom(null);
//       setClassroomForm({ name: "", buildingName: "", latitude: "", longitude: "", radiusOfAcceptanceMeter: "" });
//       setClassroomsRefresh((r) => r + 1);
//     } catch (err) {
//       setClassroomFormError(getErrorMessage(err));
//     } finally {
//       setClassroomFormLoading(false);
//     }
//   };

//   // ✅ حذف Classroom
//   const handleDeleteClassroom = async (id) => {
//     if (!window.confirm("Delete this classroom?")) return;
//     try {
//       await api.delete(`/classroom/Delete/${id}`);
//       showToast("Classroom deleted");
//       setClassroomsRefresh((r) => r + 1);
//     } catch (err) {
//       showToast(getErrorMessage(err), "error");
//     }
//   };

//   // ✅ جيب الموقع تلقائي
//   const handleGetLocation = () => {
//     if (!navigator.geolocation) {
//       setLocError("Geolocation not supported");
//       return;
//     }
//     setLocLoading(true);
//     setLocError("");
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setClassroomForm((prev) => ({
//           ...prev,
//           latitude: position.coords.latitude.toFixed(6),
//           longitude: position.coords.longitude.toFixed(6),
//         }));
//         setLocLoading(false);
//       },
//       () => {
//         setLocError("Failed to get location. Please allow location access.");
//         setLocLoading(false);
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const deleteStudent = (id) =>
//     setStudents(students.filter((s) => s.id !== id));
// const filteredStudents = students.filter((s) =>
//   `${s.firstName || ""} ${s.lastName || ""}`
//     .toLowerCase()
//     .includes(studentSearch.toLowerCase())
// );


// const filteredLecturers = lecturers.filter((l) =>
//   `${l.firstName || ""} ${l.lastName || ""}`
//     .toLowerCase()
//     .includes(studentSearch.toLowerCase())
// );

// //console.log("Lecturers Data => ", filteredLecturers);

//   const filteredClassrooms = classrooms.filter((c) =>
//     c.name?.toLowerCase().includes(searchClass.toLowerCase())
//   );

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <h2 className="logo">QR Attend</h2>
//         <ul className="menu">
//           <li
//             className={activePage === "lecturers" ? "active" : ""}
//             onClick={() => setActivePage("lecturers")}
//           >
//             <FaChalkboardTeacher /> Lecturers
//           </li>
//           <li
//             className={activePage === "students" ? "active" : ""}
//             onClick={() => setActivePage("students")}
//           >
//             <FaUserGraduate /> Students
//           </li>
//           <li
//             className={activePage === "classrooms" ? "active" : ""}
//             onClick={() => setActivePage("classrooms")}
//           >
//             <FaMapMarkerAlt /> Classrooms
//           </li>
//           <li
//             className={activePage === "reports" ? "active" : ""}
//             onClick={() => setActivePage("reports")}
//           >
//             <FaChartBar /> Reports
//           </li>
//         </ul>
//         <div className="user-box">
//           <div className="user-info">
//             <div className="avatar">A</div>
//             <div>
//               <p>System Administrator</p>
//               <span>Admin</span>
//             </div>
//           </div>
//           <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
//         </div>
//       </div>

//       {/* Main */}
//       <div className="main">
//         <h1>Admin Dashboard</h1>

//         {/* Cards */}
//         <div className="cards">
//           <div className="card">
//             <FaChalkboardTeacher />
//             <h2>{stats?.lecturersCount ?? lecturers.length}</h2>
//             <p>Lecturers</p>
//           </div>
//           <div className="card">
//             <FaUserGraduate />
//             <h2>{stats?.studentsCount ?? students.length}</h2>
//             <p>Students</p>
//           </div>
//           <div className="card">
//             <FaBook />
//             <h2>{stats?.coursesCount ?? 0}</h2>
//             <p>Courses</p>
//           </div>
//           <div className="card">
//             <FaMapMarkerAlt />
//             <h2>{stats?.classroomsCount ?? classrooms.length}</h2>
//             <p>Classrooms</p>
//           </div>
//         </div>

        

//   {/* ================= LECTURERS ================= */}
// {activePage === "lecturers" && (
//   <div className="table-box">
//     <div className="table-header">
//       <h2>Manage Lecturers</h2>

//       <button
//         className="enroll-btn"
//         onClick={() => {
//           setShowLecturerModal(true);
//           setLecturerFormError("");
//           setLecturerForm({
//             firstName: "",
//             lastName: "",
//             email: "",
//             password: "",
//             ssin: "",
//           });
//         }}
//       >
//         + Add Lecturer
//       </button>
//     </div>

//     <input
//       className="search"
//       placeholder="Filter lecturers..."
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//     />

//     {lecturersLoading ? (
//       <p
//         style={{
//           textAlign: "center",
//           padding: 20,
//           color: "#64748b",
//         }}
//       >
//         Loading...
//       </p>
//     ) : (
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>SSIN</th>
//             <th>Courses</th>
//             <th>Actions</th>
//           </tr>
//         </thead>

//         <tbody>
//           {filteredLecturers.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 style={{
//                   textAlign: "center",
//                   padding: 20,
//                   color: "#888",
//                 }}
//               >
//                 No lecturers found
//               </td>
//             </tr>
//           ) : (
//             filteredLecturers.map((l) => (
//               <tr key={l.userId}>
//                 <td>{l.firstName} {l.lastName}</td>
//                 <td>{l.email}</td>
//                 <td>{l.ssin || "-"}</td>
//                 <td>
//   {l.coursesCount ??
//    (Array.isArray(l.courses) ? l.courses.length : 0)}
// </td>

// <td>
//   <FaTrash
//     style={{
//       color: "#ef4444",
//       cursor: "pointer",
//     }}
//     onClick={() => handleCloseAccount(l.userId)}
//   />
// </td>

//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     )}
//   </div>
// )}
//         {/* ================= STUDENTS ================= */}
//         {activePage === "students" && (
//           <div className="table-box">
//             <div className="table-header">
//               <h2>Manage Students</h2>
//             </div>
//             <input
//               className="search"
//               placeholder="Filter students by name, email..."
//               value={studentSearch}
//               onChange={(e) => setStudentSearch(e.target.value)}
//             />
//             {studentsLoading ? (
//   <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>
//     Loading...
//   </p>
// ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>SSIN</th>
//                   <th>Section</th>
//                   <th>Level</th>
//                   <th>Department</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStudents.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                       No students found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredStudents.map((s) => (
//                     <tr key={s.id}>
//                       <td>{s.firstName} {s.lastName}</td>
//                       <td>{s.email}</td>
//                       <td>{s.ssin || "-"}</td>
//                       <td>{s.section || "-"}</td>
//                       <td>{s.level || "-"}</td>
//                       <td>{s.department || "-"}</td>
//                       <td>
//                         <FaEdit />
//                         <FaTrash
//                           style={{ color: "#ef4444", cursor: "pointer", marginLeft: 8 }}
//                           onClick={() => deleteStudent(s.id)}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>)}
//           </div>
//         )}

//         {/* ================= CLASSROOMS ================= */}
//         {activePage === "classrooms" && (
//           <div className="table-box">
//             <div className="table-header">
//               <h2>Manage Classrooms</h2>
//               <button
//                 className="enroll-btn"
//                 onClick={() => {
//                   setShowClassroomModal(true);
//                   setEditClassroom(null);
//                   setClassroomFormError("");
//                   setLocError("");
//                   setClassroomForm({ name: "", buildingName: "", latitude: "", longitude: "", radiusOfAcceptanceMeter: "" });
//                 }}
//               >
//                 + Add Classroom
//               </button>
//             </div>
//             <input
//               className="search"
//               placeholder="Filter classrooms..."
//               value={searchClass}
//               onChange={(e) => setSearchClass(e.target.value)}
//             />
//             {classroomsLoading ? (
//               <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>Loading...</p>
//             ) : (
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Building</th>
//                     <th>Coordinates</th>
//                     <th>Radius</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredClassrooms.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#888" }}>
//                         No classrooms found
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredClassrooms.map((c) => (
//                       <tr key={c.id}>
//                         <td>{c.name}</td>
//                         <td>{c.buildingName || "-"}</td>
//                         <td>{c.latitude}, {c.longitude}</td>
//                         <td>{c.radiusOfAcceptanceMeter}m</td>
//                         <td>
//                           <FaEdit
//                             style={{ cursor: "pointer", marginRight: 8 }}
//                             onClick={() => {
//                               setEditClassroom(c);
//                               setClassroomForm({
//                                 name: c.name || "",
//                                 buildingName: c.buildingName || "",
//                                 latitude: c.latitude?.toString() || "",
//                                 longitude: c.longitude?.toString() || "",
//                                 radiusOfAcceptanceMeter: c.radiusOfAcceptanceMeter?.toString() || "",
//                               });
//                               setClassroomFormError("");
//                               setLocError("");
//                               setShowClassroomModal(true);
//                             }}
//                           />
//                           <FaTrash
//                             style={{ color: "#ef4444", cursor: "pointer" }}
//                             onClick={() => handleDeleteClassroom(c.id)}
//                           />
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         )}

//         {/* ================= REPORTS ================= */}
//         {activePage === "reports" && (
//           <div className="table-box">
//             <h2>📊 System Reports</h2>
//             <p style={{ color: "#64748b", marginTop: 10 }}>
//               Total Lecturers: {stats?.lecturersCount ?? 0} |
//               Total Students: {stats?.studentsCount ?? 0} |
//               Total Courses: {stats?.coursesCount ?? 0} |
//               Total Classrooms: {stats?.classroomsCount ?? 0}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ================= ADD LECTURER MODAL ================= */}
//       {showLecturerModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>Add Lecturer</h3>
//               <span onClick={() => setShowLecturerModal(false)} style={{ cursor: "pointer" }}>✖</span>
//             </div>
//             <form onSubmit={handleAddLecturer}>
//               <div className="form-row">
//                 <input
//                   placeholder="First Name"
//                   value={lecturerForm.firstName}
//                   onChange={(e) => setLecturerForm({ ...lecturerForm, firstName: e.target.value })}
//                   required
//                 />
//                 <input
//                   placeholder="Last Name"
//                   value={lecturerForm.lastName}
//                   onChange={(e) => setLecturerForm({ ...lecturerForm, lastName: e.target.value })}
//                   required
//                 />
//               </div>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={lecturerForm.email}
//                 onChange={(e) => setLecturerForm({ ...lecturerForm, email: e.target.value })}
//                 required
//               />
//               <input
//                 placeholder="SSIN"
//                 value={lecturerForm.ssin}
//                 onChange={(e) => setLecturerForm({ ...lecturerForm, ssin: e.target.value })}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={lecturerForm.password}
//                 onChange={(e) => setLecturerForm({ ...lecturerForm, password: e.target.value })}
//                 required
//               />
//               {lecturerFormError && (
//                 <p style={{ color: "red", marginBottom: 8 }}>{lecturerFormError}</p>
//               )}
//               <button className="save-btn" type="submit" disabled={lecturerFormLoading}>
//                 {lecturerFormLoading ? "Adding..." : "Add Lecturer"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ================= CLASSROOM MODAL ================= */}
//       {showClassroomModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <div className="modal-header">
//               <h3>{editClassroom ? "Edit Classroom" : "Add Classroom"}</h3>
//               <span onClick={() => setShowClassroomModal(false)} style={{ cursor: "pointer" }}>✖</span>
//             </div>
//             <form onSubmit={handleSaveClassroom}>
//               <input
//                 placeholder="Classroom Name"
//                 value={classroomForm.name}
//                 onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })}
//                 required
//               />
//               <input
//                 placeholder="Building Name"
//                 value={classroomForm.buildingName}
//                 onChange={(e) => setClassroomForm({ ...classroomForm, buildingName: e.target.value })}
//               />

//               {/* ✅ زرار الموقع التلقائي */}
//               <button
//                 type="button"
//                 onClick={handleGetLocation}
//                 disabled={locLoading}
//                 style={{
//                   width: "100%", padding: "10px", marginBottom: "10px",
//                   background: locLoading ? "#94a3b8" : "#2563eb",
//                   color: "white", border: "none", borderRadius: "8px",
//                   cursor: locLoading ? "not-allowed" : "pointer",
//                   fontWeight: 600, display: "flex",
//                   alignItems: "center", justifyContent: "center", gap: "8px",
//                 }}
//               >
//                 {locLoading ? "🌀 Getting location..." : "📍 Get Current Location"}
//               </button>

//               {locError && (
//                 <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{locError}</p>
//               )}

//               <input
//                 placeholder="Latitude"
//                 value={classroomForm.latitude}
//                 onChange={(e) => setClassroomForm({ ...classroomForm, latitude: e.target.value })}
//                 style={{ background: classroomForm.latitude ? "#f0fdf4" : "" }}
//               />
//               <input
//                 placeholder="Longitude"
//                 value={classroomForm.longitude}
//                 onChange={(e) => setClassroomForm({ ...classroomForm, longitude: e.target.value })}
//                 style={{ background: classroomForm.longitude ? "#f0fdf4" : "" }}
//               />
//               <input
//                 placeholder="Radius (meters)"
//                 value={classroomForm.radiusOfAcceptanceMeter}
//                 onChange={(e) => setClassroomForm({ ...classroomForm, radiusOfAcceptanceMeter: e.target.value })}
//                 required
//               />

//               {classroomFormError && (
//                 <p style={{ color: "red", marginBottom: 8 }}>{classroomFormError}</p>
//               )}
//               <button className="save-btn" type="submit" disabled={classroomFormLoading}>
//                 {classroomFormLoading ? "Saving..." : editClassroom ? "Update" : "Add Classroom"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast.show && (
//         <div className={`toast ${toast.type}`}>{toast.message}</div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;



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
import api, { getErrorMessage } from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("students");

  const [lecturers, setLecturers] = useState([]);
  const [lecturersLoading, setLecturersLoading] = useState(false);
  const [lecturersRefresh, setLecturersRefresh] = useState(0);

  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [classroomsLoading, setClassroomsLoading] = useState(false);
  const [classroomsRefresh, setClassroomsRefresh] = useState(0);

  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [lecturerForm, setLecturerForm] = useState({
    firstName: "", lastName: "", email: "", password: "", ssin: "",
  });
  const [lecturerFormError, setLecturerFormError] = useState("");
  const [lecturerFormLoading, setLecturerFormLoading] = useState(false);

  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [editClassroom, setEditClassroom] = useState(null);
  const [classroomForm, setClassroomForm] = useState({
    name: "", buildingName: "", latitude: "", longitude: "", radiusOfAcceptanceMeter: "",
  });
  const [classroomFormError, setClassroomFormError] = useState("");
  const [classroomFormLoading, setClassroomFormLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // ✅ Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/SystemDashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Stats error:", getErrorMessage(err));
      }
    };
    fetchStats();
  }, []);

  // ✅ Lecturers
  useEffect(() => {
    const fetchLecturers = async () => {
      setLecturersLoading(true);
      try {
        const res = await api.get("/admin/GetLecturers", {
          params: {
            pagenumber: 1,
            pagesize: 100,
            Name: search,
            SortBy: "",
            IsDescindeng: false,
          },
        });
        const data = res.data;
        // ✅ الـ response بيرجع string/octet-stream — محتاج نشوف الـ shape
        if (Array.isArray(data)) setLecturers(data);
        else if (Array.isArray(data?.items)) setLecturers(data.items);
        else if (Array.isArray(data?.data)) setLecturers(data.data);
        else if (Array.isArray(data?.lecturers)) setLecturers(data.lecturers);
        else setLecturers([]);
      } catch (err) {
        console.error("Lecturers error:", getErrorMessage(err));
        setLecturers([]);
      } finally {
        setLecturersLoading(false);
      }
    };
    if (activePage === "lecturers") fetchLecturers();
  }, [activePage, search, lecturersRefresh]);

  // ✅ Classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      setClassroomsLoading(true);
      try {
        const res = await api.get("/classroom/AllClassRoom", {
          params: {
            pagenumber: 1,
            pagesize: 100,
            Name: searchClass,
            SortBy: "id",
            IsDescindeng: false,
          },
        });
        const data = res.data;
        if (Array.isArray(data)) setClassrooms(data);
        else if (Array.isArray(data?.items)) setClassrooms(data.items);
        else if (Array.isArray(data?.data)) setClassrooms(data.data);
        else setClassrooms([]);
      } catch (err) {
        console.error("Classrooms error:", getErrorMessage(err));
        setClassrooms([]);
      } finally {
        setClassroomsLoading(false);
      }
    };
    if (activePage === "classrooms") fetchClassrooms();
  }, [activePage, searchClass, classroomsRefresh]);

  // ✅ Students — مفيش endpoint في الـ Swagger، هنشيل الـ API call
  useEffect(() => {
    if (activePage === "students") {
      // ✅ Students مش موجود في الـ Backend endpoints — بنعرضهم من localStorage
      const stored = JSON.parse(localStorage.getItem("students")) || [];
      setStudents(stored);
    }
  }, [activePage]);

  // ✅ Add Lecturer
  const handleAddLecturer = async (e) => {
    e.preventDefault();
    setLecturerFormError("");
    setLecturerFormLoading(true);
    try {
      await api.post("/admin/AddLecturer", {
        firstName: lecturerForm.firstName,
        lastName: lecturerForm.lastName,
        email: lecturerForm.email,
        password: lecturerForm.password,
        ssin: lecturerForm.ssin,
      });
      showToast("Lecturer added successfully ✅");
      setShowLecturerModal(false);
      setLecturerForm({ firstName: "", lastName: "", email: "", password: "", ssin: "" });
      setLecturersRefresh((r) => r + 1);
    } catch (err) {
      setLecturerFormError(getErrorMessage(err));
    } finally {
      setLecturerFormLoading(false);
    }
  };

  // ✅ Close Account — userid في الـ path
  const handleCloseAccount = async (userid) => {
    if (!userid) {
      showToast("User ID not found", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to close this account?")) return;
    try {
      await api.put(`/admin/CloseAccount/${userid}`);
      showToast("Account closed successfully ✅");
      setLecturersRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  // ✅ Save Classroom
  const handleSaveClassroom = async (e) => {
    e.preventDefault();
    setClassroomFormError("");
    setClassroomFormLoading(true);
    try {
      const payload = {
        name: classroomForm.name,
        buildingName: classroomForm.buildingName,
        latitude: parseFloat(classroomForm.latitude) || 0,
        longitude: parseFloat(classroomForm.longitude) || 0,
        radiusOfAcceptanceMeter: parseInt(classroomForm.radiusOfAcceptanceMeter) || 0,
      };
      if (editClassroom) {
        await api.put(`/classroom/Edit/${editClassroom.id}`, payload);
        showToast("Classroom updated ✅");
      } else {
        await api.post("/classroom/CreateClassRoom", payload);
        showToast("Classroom added ✅");
      }
      setShowClassroomModal(false);
      setEditClassroom(null);
      setClassroomForm({ name: "", buildingName: "", latitude: "", longitude: "", radiusOfAcceptanceMeter: "" });
      setClassroomsRefresh((r) => r + 1);
    } catch (err) {
      setClassroomFormError(getErrorMessage(err));
    } finally {
      setClassroomFormLoading(false);
    }
  };

  // ✅ Delete Classroom
  const handleDeleteClassroom = async (id) => {
    if (!window.confirm("Delete this classroom?")) return;
    try {
      await api.delete(`/classroom/Delete/${id}`);
      showToast("Classroom deleted");
      setClassroomsRefresh((r) => r + 1);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  // ✅ Get Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported"); return; }
    setLocLoading(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setClassroomForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setLocLoading(false);
      },
      () => { setLocError("Failed to get location."); setLocLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredStudents = students.filter((s) =>
    `${s.firstName || s.name || ""} ${s.lastName || ""}`
      .toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredLecturers = lecturers.filter((l) =>
    `${l.firstName || ""} ${l.lastName || ""}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const filteredClassrooms = classrooms.filter((c) =>
    c.name?.toLowerCase().includes(searchClass.toLowerCase())
  );

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">QR Attend</h2>
        <ul className="menu">
          <li className={activePage === "lecturers" ? "active" : ""} onClick={() => setActivePage("lecturers")}>
            <FaChalkboardTeacher /> Lecturers
          </li>
          <li className={activePage === "students" ? "active" : ""} onClick={() => setActivePage("students")}>
            <FaUserGraduate /> Students
          </li>
          <li className={activePage === "classrooms" ? "active" : ""} onClick={() => setActivePage("classrooms")}>
            <FaMapMarkerAlt /> Classrooms
          </li>
          <li className={activePage === "reports" ? "active" : ""} onClick={() => setActivePage("reports")}>
            <FaChartBar /> Reports
          </li>
        </ul>
        <div className="user-box">
          <div className="user-info">
            <div className="avatar">A</div>
            <div><p>System Administrator</p><span>Admin</span></div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <h1>Admin Dashboard</h1>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <FaChalkboardTeacher />
            <h2>{stats?.lecturersCount ?? lecturers.length}</h2>
            <p>Lecturers</p>
          </div>
          <div className="card">
            <FaUserGraduate />
            <h2>{stats?.studentsCount ?? students.length}</h2>
            <p>Students</p>
          </div>
          <div className="card">
            <FaBook />
            <h2>{stats?.coursesCount ?? 0}</h2>
            <p>Courses</p>
          </div>
          <div className="card">
            <FaMapMarkerAlt />
            <h2>{stats?.classroomsCount ?? classrooms.length}</h2>
            <p>Classrooms</p>
          </div>
        </div>

        {/* ===== LECTURERS ===== */}
        {activePage === "lecturers" && (
          <div className="table-box">
            <div className="table-header">
              <h2>Manage Lecturers</h2>
              <button className="enroll-btn" onClick={() => {
                setShowLecturerModal(true);
                setLecturerFormError("");
                setLecturerForm({ firstName: "", lastName: "", email: "", password: "", ssin: "" });
              }}>
                + Add Lecturer
              </button>
            </div>
            <input
              className="search"
              placeholder="Filter lecturers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {lecturersLoading ? (
              <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>SSIN</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: "center", padding: 20, color: "#888" }}>No lecturers found</td></tr>
                  ) : (
                    filteredLecturers.map((l) => (
                      // ✅ استخدم userId أو id حسب الـ response
                      <tr key={l.userId || l.id}>
                        <td>{l.firstName} {l.lastName}</td>
                        <td>{l.email}</td>
                        <td>{l.ssin || "-"}</td>
                        <td>
                          <FaTrash
                            style={{ color: "#ef4444", cursor: "pointer" }}
                            // ✅ بعت userId لأنه الـ path param
                            onClick={() => handleCloseAccount(l.userId || l.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== STUDENTS ===== */}
        {activePage === "students" && (
          <div className="table-box">
            <div className="table-header"><h2>Manage Students</h2></div>
            <input
              className="search"
              placeholder="Filter students by name, email..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
            {studentsLoading ? (
              <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>Loading...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>SSIN</th>
                    <th>Level</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#888" }}>No students found</td></tr>
                  ) : (
                    filteredStudents.map((s, i) => (
                      <tr key={s.id || s.userId || i}>
                        <td>{s.firstName || s.name} {s.lastName || ""}</td>
                        <td>{s.email}</td>
                        <td>{s.ssin || "-"}</td>
                        <td>{s.level || "-"}</td>
                        <td>{s.department || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== CLASSROOMS ===== */}
        {activePage === "classrooms" && (
          <div className="table-box">
            <div className="table-header">
              <h2>Manage Classrooms</h2>
              <button className="enroll-btn" onClick={() => {
                setShowClassroomModal(true);
                setEditClassroom(null);
                setClassroomFormError("");
                setLocError("");
                setClassroomForm({ name: "", buildingName: "", latitude: "", longitude: "", radiusOfAcceptanceMeter: "" });
              }}>
                + Add Classroom
              </button>
            </div>
            <input
              className="search"
              placeholder="Filter classrooms..."
              value={searchClass}
              onChange={(e) => setSearchClass(e.target.value)}
            />
            {classroomsLoading ? (
              <p style={{ textAlign: "center", padding: 20, color: "#64748b" }}>Loading...</p>
            ) : (
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
                  {filteredClassrooms.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: 20, color: "#888" }}>No classrooms found</td></tr>
                  ) : (
                    filteredClassrooms.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.buildingName || "-"}</td>
                        <td>{c.latitude}, {c.longitude}</td>
                        <td>{c.radiusOfAcceptanceMeter}m</td>
                        <td>
                          <FaEdit
                            style={{ cursor: "pointer", marginRight: 8 }}
                            onClick={() => {
                              setEditClassroom(c);
                              setClassroomForm({
                                name: c.name || "",
                                buildingName: c.buildingName || "",
                                latitude: c.latitude?.toString() || "",
                                longitude: c.longitude?.toString() || "",
                                radiusOfAcceptanceMeter: c.radiusOfAcceptanceMeter?.toString() || "",
                              });
                              setClassroomFormError("");
                              setLocError("");
                              setShowClassroomModal(true);
                            }}
                          />
                          <FaTrash
                            style={{ color: "#ef4444", cursor: "pointer" }}
                            onClick={() => handleDeleteClassroom(c.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== REPORTS ===== */}
        {activePage === "reports" && (
          <div className="table-box">
            <h2>📊 System Reports</h2>
            <p style={{ color: "#64748b", marginTop: 10 }}>
              Total Lecturers: {stats?.lecturersCount ?? 0} |
              Total Students: {stats?.studentsCount ?? 0} |
              Total Courses: {stats?.coursesCount ?? 0} |
              Total Classrooms: {stats?.classroomsCount ?? 0}
            </p>
          </div>
        )}
      </div>

      {/* ===== ADD LECTURER MODAL ===== */}
      {showLecturerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Lecturer</h3>
              <span onClick={() => setShowLecturerModal(false)} style={{ cursor: "pointer" }}>✖</span>
            </div>
            <form onSubmit={handleAddLecturer}>
              <div className="form-row">
                <input placeholder="First Name" value={lecturerForm.firstName}
                  onChange={(e) => setLecturerForm({ ...lecturerForm, firstName: e.target.value })} required />
                <input placeholder="Last Name" value={lecturerForm.lastName}
                  onChange={(e) => setLecturerForm({ ...lecturerForm, lastName: e.target.value })} required />
              </div>
              <input type="email" placeholder="Email" value={lecturerForm.email}
                onChange={(e) => setLecturerForm({ ...lecturerForm, email: e.target.value })} required />
              <input placeholder="SSIN" value={lecturerForm.ssin}
                onChange={(e) => setLecturerForm({ ...lecturerForm, ssin: e.target.value })} />
              <input type="password" placeholder="Password" value={lecturerForm.password}
                onChange={(e) => setLecturerForm({ ...lecturerForm, password: e.target.value })} required />
              {lecturerFormError && <p style={{ color: "red", marginBottom: 8 }}>{lecturerFormError}</p>}
              <button className="save-btn" type="submit" disabled={lecturerFormLoading}>
                {lecturerFormLoading ? "Adding..." : "Add Lecturer"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== CLASSROOM MODAL ===== */}
      {showClassroomModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editClassroom ? "Edit Classroom" : "Add Classroom"}</h3>
              <span onClick={() => setShowClassroomModal(false)} style={{ cursor: "pointer" }}>✖</span>
            </div>
            <form onSubmit={handleSaveClassroom}>
              <input placeholder="Classroom Name" value={classroomForm.name}
                onChange={(e) => setClassroomForm({ ...classroomForm, name: e.target.value })} required />
              <input placeholder="Building Name" value={classroomForm.buildingName}
                onChange={(e) => setClassroomForm({ ...classroomForm, buildingName: e.target.value })} />
              <button type="button" onClick={handleGetLocation} disabled={locLoading}
                style={{
                  width: "100%", padding: "10px", marginBottom: "10px",
                  background: locLoading ? "#94a3b8" : "#2563eb",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: locLoading ? "not-allowed" : "pointer",
                  fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                {locLoading ? "🌀 Getting location..." : "📍 Get Current Location"}
              </button>
              {locError && <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>{locError}</p>}
              <input placeholder="Latitude" value={classroomForm.latitude}
                onChange={(e) => setClassroomForm({ ...classroomForm, latitude: e.target.value })}
                style={{ background: classroomForm.latitude ? "#f0fdf4" : "" }} />
              <input placeholder="Longitude" value={classroomForm.longitude}
                onChange={(e) => setClassroomForm({ ...classroomForm, longitude: e.target.value })}
                style={{ background: classroomForm.longitude ? "#f0fdf4" : "" }} />
              <input placeholder="Radius (meters)" value={classroomForm.radiusOfAcceptanceMeter}
                onChange={(e) => setClassroomForm({ ...classroomForm, radiusOfAcceptanceMeter: e.target.value })} required />
              {classroomFormError && <p style={{ color: "red", marginBottom: 8 }}>{classroomFormError}</p>}
              <button className="save-btn" type="submit" disabled={classroomFormLoading}>
                {classroomFormLoading ? "Saving..." : editClassroom ? "Update" : "Add Classroom"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default AdminDashboard;