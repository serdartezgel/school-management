import AttendanceCard from "../cards/AttendanceCard";
import PendingTasksCard from "../cards/PendingTasksCard";
import Timetable from "../timetables/Timetable";
import { Separator } from "../ui/separator";

const tasks = [
  {
    id: "1",
    title: "Math Homework 1",
    type: "assignment",
    dueDate: "2025-09-22",
    className: "10A",
    subject: "Mathematics",
    graded: false,
  },
  {
    id: "2",
    title: "Science Lab Report",
    type: "assignment",
    dueDate: "2025-09-25",
    className: "10A",
    subject: "Science",
    graded: true,
  },
  {
    id: "3",
    title: "History Midterm Exam",
    type: "exam",
    dueDate: "2025-10-05",
    className: "10A",
    subject: "History",
    graded: false,
  },
  {
    id: "4",
    title: "English Essay",
    type: "assignment",
    dueDate: "2025-09-28",
    className: "10A",
    subject: "English",
    graded: false,
  },
];

const dummyAttendance = [
  { id: "1", date: "2025-09-19", status: "PRESENT", subject: "Math" },
  { id: "2", date: "2025-09-20", status: "ABSENT", subject: "Science" },
  { id: "3", date: "2025-09-21", status: "LATE", subject: "English" },
  { id: "4", date: "2025-09-22", status: "EXCUSED", subject: "History" },
];

const StudentDashboard = () => {
  const academicYear = {
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
  };

  return (
    <>
      <section className="bg-sidebar flex flex-wrap justify-start gap-4 rounded-lg border-1 p-4 lg:justify-center">
        <h1 className="flex w-full items-start text-xl font-bold">Schedule</h1>
        <Separator />
        <Timetable
          dailyEntries={[]}
          weeklyEntries={[]}
          academicYear={academicYear}
        />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <PendingTasksCard tasks={tasks} />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <AttendanceCard records={dummyAttendance || []} />
      </section>
    </>
  );
};

export default StudentDashboard;
