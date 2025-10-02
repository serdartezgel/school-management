import { auth } from "@/auth";
import { getCurrentAcademicYear } from "@/lib/actions/academicYear.action";
import { getStudentAttendances } from "@/lib/actions/attendance.action";
import { getStudentPendingTasks } from "@/lib/actions/student.action";

import AttendanceCard from "../cards/AttendanceCard";
import PendingTasksCard from "../cards/PendingTasksCard";
import Timetable from "../timetables/Timetable";
import { Separator } from "../ui/separator";

const StudentDashboard = async () => {
  const session = await auth();
  const userId = session?.user.id || "";

  const academicYear = await getCurrentAcademicYear();
  const academicYearId = academicYear.data?.id || "";

  const [tasksData, attendanceData] = await Promise.all([
    getStudentPendingTasks({ userId }),
    getStudentAttendances({ userId, academicYearId }),
  ]);

  const pendingTasks = tasksData.data || [];
  const attendances = attendanceData.data || [];

  return (
    <>
      <section className="bg-sidebar flex flex-wrap justify-start gap-4 rounded-lg border-1 p-4 lg:justify-center">
        <h1 className="flex w-full items-start text-xl font-bold">Schedule</h1>
        <Separator />
        <Timetable
          dailyEntries={[]}
          weeklyEntries={[]}
          academicYear={academicYear.data!}
        />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <PendingTasksCard tasks={pendingTasks} />
      </section>

      <section className="flex flex-col gap-4 xl:flex-row">
        <AttendanceCard records={attendances || []} />
      </section>
    </>
  );
};

export default StudentDashboard;
