import {
  saveStudent,
  saveLecturer,
  saveClassroom,
  saveCourse,
  saveLecture,
  saveAttendance,
  getStudents,
} from "./db";

// ✅ بيشوف لو في بيانات في localStorage وينقلها لـ IndexedDB
export const migrateFromLocalStorage = async () => {
  const migrated = localStorage.getItem("idb_migrated");
  if (migrated) return; // ✅ اتعملت قبل كده

  console.log("🔄 Migrating data from localStorage to IndexedDB...");

  try {
    // Students
    const students = JSON.parse(localStorage.getItem("students")) || [];
    for (const student of students) {
      await saveStudent(student);
    }

    // Lecturers
    const lecturers = JSON.parse(localStorage.getItem("lecturers")) || [];
    for (const lecturer of lecturers) {
      await saveLecturer(lecturer);

      // Courses بتاعة كل دكتور
      const courses = JSON.parse(localStorage.getItem(`courses_${lecturer.email}`)) || [];
      for (let i = 0; i < courses.length; i++) {
        const course = {
          ...courses[i],
          id: `${lecturer.email}_${courses[i].code}`,
          lecturerEmail: lecturer.email,
          index: i,
        };
        await saveCourse(course);

        // Lectures بتاعة كل كورس
        const lectures = JSON.parse(localStorage.getItem(`lectures_${courses[i].code}`)) || [];
        for (let j = 0; j < lectures.length; j++) {
          await saveLecture({
            ...lectures[j],
            id: `${courses[i].code}_${j}`,
            courseCode: courses[i].code,
            index: j,
          });
        }

        // Attendance بتاعة كل طالب في كل كورس
        for (const student of students) {
          const att = JSON.parse(
            localStorage.getItem(`attendance_${courses[i].code}_${student.email}`)
          ) || [];
          if (att.length > 0) {
            await saveAttendance(courses[i].code, student.email, att);
          }
        }
      }
    }

    // Classrooms
    const classrooms = JSON.parse(localStorage.getItem("classrooms")) || [];
    for (const classroom of classrooms) {
      await saveClassroom(classroom);
    }

    // ✅ علّم إن الترحيل اتعمل
    localStorage.setItem("idb_migrated", "true");
    console.log("✅ Migration complete!");

  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
};