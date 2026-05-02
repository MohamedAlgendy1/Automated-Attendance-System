import { openDB } from "idb";

const DB_NAME = "qr-attend-db";
const DB_VERSION = 1;

// ✅ فتح أو إنشاء قاعدة البيانات
export const getDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // ✅ الجداول
      if (!db.objectStoreNames.contains("students")) {
        db.createObjectStore("students", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("lecturers")) {
        db.createObjectStore("lecturers", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("classrooms")) {
        db.createObjectStore("classrooms", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("courses")) {
        db.createObjectStore("courses", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("lectures")) {
        db.createObjectStore("lectures", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("attendance")) {
        db.createObjectStore("attendance", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    },
  });
};

// ================= HELPERS =================

// ✅ جيب كل العناصر من جدول
export const getAll = async (storeName) => {
  const db = await getDB();
  return db.getAll(storeName);
};

// ✅ جيب عنصر واحد بالـ id
export const getById = async (storeName, id) => {
  const db = await getDB();
  return db.get(storeName, id);
};

// ✅ حفظ أو تحديث عنصر
export const saveItem = async (storeName, item) => {
  const db = await getDB();
  return db.put(storeName, item);
};

// ✅ حذف عنصر
export const deleteItem = async (storeName, id) => {
  const db = await getDB();
  return db.delete(storeName, id);
};

// ✅ جيب عناصر بـ filter
export const getByFilter = async (storeName, filterFn) => {
  const all = await getAll(storeName);
  return all.filter(filterFn);
};

// ✅ مسح كل عناصر جدول
export const clearStore = async (storeName) => {
  const db = await getDB();
  return db.clear(storeName);
};

// ================= SPECIFIC HELPERS =================

// Students
export const getStudents = () => getAll("students");
export const saveStudent = (student) => saveItem("students", student);
export const deleteStudent = (id) => deleteItem("students", id);
export const getStudentByEmail = async (email) => {
  const students = await getStudents();
  return students.find((s) => s.email === email) || null;
};

// Lecturers
export const getLecturers = () => getAll("lecturers");
export const saveLecturer = (lecturer) => saveItem("lecturers", lecturer);
export const deleteLecturer = (id) => deleteItem("lecturers", id);
export const getLecturerByEmail = async (email) => {
  const lecturers = await getLecturers();
  return lecturers.find((l) => l.email === email) || null;
};

// Classrooms
export const getClassrooms = () => getAll("classrooms");
export const saveClassroom = (classroom) => saveItem("classrooms", classroom);
export const deleteClassroom = (id) => deleteItem("classrooms", id);

// Courses — بـ key الدكتور
export const getCoursesByLecturer = async (lecturerEmail) => {
  const all = await getAll("courses");
  return all.filter((c) => c.lecturerEmail === lecturerEmail);
};
export const getAllCourses = () => getAll("courses");
export const saveCourse = (course) => saveItem("courses", course);
export const deleteCourse = (id) => deleteItem("courses", id);

// Lectures — بـ course code
export const getLecturesByCourse = async (courseCode) => {
  const all = await getAll("lectures");
  return all.filter((l) => l.courseCode === courseCode);
};
export const saveLecture = (lecture) => saveItem("lectures", lecture);
export const deleteLecture = (id) => deleteItem("lectures", id);

// Attendance — بـ course و student
export const getAttendance = async (courseCode, studentEmail) => {
  const id = `${courseCode}_${studentEmail}`;
  const db = await getDB();
  return db.get("attendance", id);
};
export const saveAttendance = async (courseCode, studentEmail, lectureIndexes) => {
  const db = await getDB();
  return db.put("attendance", {
    id: `${courseCode}_${studentEmail}`,
    courseCode,
    studentEmail,
    lectureIndexes,
  });
};

// Settings — session data
export const getSetting = async (key) => {
  const db = await getDB();
  const result = await db.get("settings", key);
  return result?.value || null;
};
export const saveSetting = async (key, value) => {
  const db = await getDB();
  return db.put("settings", { key, value });
};
export const deleteSetting = async (key) => {
  const db = await getDB();
  return db.delete("settings", key);
};