import api from "./api";

export const getLecturesByCourse = async (courseId) => {
  const res = await api.get("/courselecture/AllCourseLectures", {
    params: {
      pagenumber: 1,
      pagesize: 100,
      CourseId: Number(courseId),
    },
  });


 // console.log("API RESPONSE:", res.data);

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

export const getAttendanceReport = async (lectureId) => {
  const res = await api.get(`/lecturer/AttendanceReport/${lectureId}`);
  return res.data;
};

export const getCourseOverview = async (courseId) => {
  const res = await api.get(`/lecturer/CourseOverview/${courseId}`);
  return res.data;
};