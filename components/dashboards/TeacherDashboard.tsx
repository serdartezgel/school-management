import PendingTasksCard from "../cards/PendingTasksCard";
import Timetable from "../timetables/Timetable";
import { Separator } from "../ui/separator";

const tasks = [
  {
    id: "1",
    title: "Math Homework 5",
    type: "assignment",
    dueDate: "2025-09-21",
    className: "Grade 5A",
    subject: "Math",
    graded: false,
  },
  {
    id: "2",
    title: "Science Exam",
    type: "exam",
    dueDate: "2025-09-22",
    className: "Grade 5A",
    subject: "Science",
    graded: false,
  },
];

const TeacherDashboard = () => {
  const academicYear = {
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
  };

  const filteredTasks = tasks.filter((task) => !task.graded);

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
        <PendingTasksCard tasks={filteredTasks} />
      </section>
    </>
  );
};

export default TeacherDashboard;
