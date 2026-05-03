// import api from "./api";

// // ---------------- GET ONE LECTURE ----------------
// export const getLecture = (id) =>
//   api.get(`/courselecture/GetOne/${id}`);

// // ---------------- GET ALL ----------------
// export const getAllLectures = (params = {}) =>
//   api.get("/courselecture/AllCourseLectures", { params });

// // ---------------- CREATE ----------------
// export const createLecture = (data = {}) =>
//   api.post("/courselecture/Create", {
//     title: data.title,
//     startTime: data.startTime,
//     endTime: data.endTime,
//     courseId: data.courseId,
//     classRoomId: data.classRoomId,
//   });

// // ---------------- EDIT ----------------
// export const editLecture = (id, data = {}) =>
//   api.put(`/courselecture/Edit/${id}`, {
//     title: data.title,
//     startTime: data.startTime,
//     endTime: data.endTime,
//     courseId: data.courseId,
//     classRoomId: data.classRoomId,
//   });

// // ---------------- DELETE ----------------
// export const deleteLecture = (id) =>
//   api.delete(`/courselecture/Delete/${id}`);


// import api from "./api";

// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });
//   const data = res.data;
//   const all = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//   return all.filter((l) => l.courseId === parseInt(courseId));
// };

// export const createLecture = async (title, startTime, endTime, courseId, classRoomId) => {
//   const res = await api.post("/courselecture/Create", {
//     title,
//     startTime,
//     endTime,
//     courseId: parseInt(courseId),
//     classRoomId: parseInt(classRoomId),
//   });
//   return res.data;
// };

// export const editLecture = async (id, title, startTime, endTime, courseId, classRoomId) => {
//   const res = await api.put(`/courselecture/Edit/${id}`, {
//     title,
//     startTime,
//     endTime,
//     courseId: parseInt(courseId),
//     classRoomId: parseInt(classRoomId),
//   });
//   return res.data;
// };

// export const deleteLecture = async (id) => {
//   const res = await api.delete(`/courselecture/Delete/${id}`);
//   return res.data;
// };

// export const generateQR = async (courseLectureId) => {
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
//   const res = await api.post("/lecturer/GenerateQR", {
//     expiresAt,
//     courseLectureId: parseInt(courseLectureId),
//   });
//   return res.data;
// };

// export const getAttendanceReport = async (courseId) => {
//   const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
//   return res.data;
// };

// export const getCourseOverview = async (courseId) => {
//   const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
//   return res.data;
// };

// import api from "./api";

// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });
//   const data = res.data;
//   const all = Array.isArray(data) ? data
//     : Array.isArray(data?.items) ? data.items
//     : [];
//   return all.filter((l) => l.courseId === parseInt(courseId));
// };

// // export const createLecture = async (title, startTime, endTime, courseId, classRoomId) => {
// //   const res = await api.post("/courselecture/Create", {
// //     title,
// //     startTime,
// //     endTime,
// //     courseId: parseInt(courseId),
// //     classRoomId: parseInt(classRoomId),
// //   });
// //   return res.data;
// // };


// export const createLecture = async (
//   title,
//   startTime,
//   endTime,
//   courseId,
//   classRoomId
// ) => {
//   const res = await api.post("/courselecture/Create", {
//     title,
//     startTime,
//     endTime,
//     courseId: Number(courseId),
//     classRoomId: Number(classRoomId),
//   });

//   return res;
// };

// export const editLecture = async (id, title, startTime, endTime, courseId, classRoomId) => {
//   const res = await api.put(`/courselecture/Edit/${id}`, {
//     title,
//     startTime,
//     endTime,
//     courseId: parseInt(courseId),
//     classRoomId: parseInt(classRoomId),
//   });
//   return res.data;
// };

// export const deleteLecture = async (id) => {
//   const res = await api.delete(`/courselecture/Delete/${id}`);
//   return res.data;
// };

// export const generateQR = async (courseLectureId) => {
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
//   const res = await api.post("/lecturer/GenerateQR", {
//     expiresAt,
//     courseLectureId: parseInt(courseLectureId),
//   });
//   return res.data;
// };

// export const getAttendanceReport = async (courseId) => {
//   const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
//   return res.data;
// };

// export const getCourseOverview = async (courseId) => {
//   const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
//   return res.data;
// };
//_________________________________________________________
// import api from "./api";

// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: {
//       pagenumber: 1,
//       pagesize: 100,
//       CourseId: Number(courseId),
//     },
//   });

//   console.log("API RESPONSE:", res.data);

//   return res.data;
// };
//___________________________________________________________
// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });

//   // ✅ الـ lectures في courseLectures.data
//   const data = res.data;
//   const all = data?.courseLectures?.data
//     || data?.courseLectures?.items
//     || data?.data
//     || data?.items
//     || (Array.isArray(data) ? data : []);

//   return all.filter((l) => l.courseId === parseInt(courseId));
// };

// export const getLecturesByCourse = async (courseId) => {
//   const res = await api.get("/courselecture/AllCourseLectures", {
//     params: { pagenumber: 1, pagesize: 100 },
//   });

//   let data = res.data;

//   // لو رجع string نحوله JSON
//   if (typeof data === "string") {
//     try {
//       data = JSON.parse(data);
//     } catch {
//       data = [];
//     }
//   }

//   const all =
//     Array.isArray(data) ? data :
//     Array.isArray(data?.items) ? data.items :
//     Array.isArray(data?.data) ? data.data :
//     [];

//   console.log("LECTURES:", all);

//   return all.filter((l) => {
//     const id =
//       l.courseId ||
//       l.CourseId ||
//       l.courseID ||
//       l.course?.id;

//     return Number(id) === Number(courseId);
//   });
// };
//_______________________________________________________________________
// export const createLecture = async (
//   title,
//   startTime,
//   endTime,
//   courseId,
//   classRoomId
// ) => {
//   const res = await api.post("/courselecture/Create", {
//     title,
//     startTime,
//     endTime,
//     courseId: Number(courseId),
//     classRoomId: Number(classRoomId),
//   });

//   return res.data;
// };

// export const editLecture = async (
//   id,
//   title,
//   startTime,
//   endTime,
//   courseId,
//   classRoomId
// ) => {
//   const res = await api.put(`/courselecture/Edit/${id}`, {
//     title,
//     startTime,
//     endTime,
//     courseId: Number(courseId),
//     classRoomId: Number(classRoomId),
//   });

//   return res.data;
// };



// export const generateQR = async (courseLectureId) => {
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

//   const res = await api.post("/lecturer/GenerateQR", {
//     expiresAt,
//     courseLectureId: Number(courseLectureId),
//   });

//   return res.data;
// };

// export const deleteLecture = async (id) => {
//   const res = await api.delete(`/courselecture/Delete/${id}`);
//   return res.data;
// };



// export const getAttendanceReport = async (courseId) => {
//   const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
//   return res.data;
// };

// export const getCourseOverview = async (courseId) => {
//   const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
//   return res.data;
// };

import api from "./api";

export const getLecturesByCourse = async (courseId) => {
  const res = await api.get("/courselecture/AllCourseLectures", {
    params: {
      pagenumber: 1,
      pagesize: 100,
      CourseId: Number(courseId),
    },
  });

  console.log("API RESPONSE:", res.data);

  return res.data?.courseLectures?.data || [];
};
  

  // رجع الأراي مباشرة


export const createLecture = async (
  title,
  startTime,
  endTime,
  courseId,
  classRoomId
) => {
  const res = await api.post("/courselecture/Create", {
    title,
    startTime,
    endTime,
    courseId: Number(courseId),
    classRoomId: Number(classRoomId),
  });

  return res.data;
};

export const editLecture = async (
  id,
  title,
  startTime,
  endTime,
  courseId,
  classRoomId
) => {
  const res = await api.put(`/courselecture/Edit/${id}`, {
    title,
    startTime,
    endTime,
    courseId: Number(courseId),
    classRoomId: Number(classRoomId),
  });

  return res.data;
};

export const generateQR = async (courseLectureId) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const res = await api.post("/lecturer/GenerateQR", {
    expiresAt,
    courseLectureId: Number(courseLectureId),
  });

  return res.data;
};

export const deleteLecture = async (id) => {
  const res = await api.delete(`/courselecture/Delete/${id}`);
  return res.data;
};

export const getAttendanceReport = async (courseId) => {
  const res = await api.get(`/lecturer/AttendanceReport/${courseId}`);
  return res.data;
};

export const getCourseOverview = async (courseId) => {
  const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
  return res.data;
};