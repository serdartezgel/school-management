import Timetable from "../timetables/Timetable";
import { Separator } from "../ui/separator";

const TeacherDashboard = () => {
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

      <section className="flex flex-col gap-4 p-4 xl:flex-row"></section>
    </>
  );
};

export default TeacherDashboard;
