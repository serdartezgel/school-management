import { getWeeklyAttendance } from "@/lib/actions/attendance.action";
import { getStudentCounts } from "@/lib/actions/student.action";
import { getUserRoleCounts } from "@/lib/actions/user.action";

import StatCard from "../cards/StatCard";
import AttendanceChart from "../charts/AttendanceChart";
import CountChart from "../charts/CountChart";
import GradeChart from "../charts/GradeChart";

const AdminDashboard = async () => {
  const result = await getUserRoleCounts();
  const studentData = await getStudentCounts();
  const attendanceData = await getWeeklyAttendance();

  console.log(attendanceData);

  return (
    <>
      <section className="flex flex-wrap justify-start gap-4 p-4 lg:justify-center">
        <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            title="Total"
            value={result.data?.admin || 0}
            color="primary"
            description="Admin(s)"
          />
          <StatCard
            title="Total"
            value={result.data?.teacher || 0}
            color="secondary"
            description="Teacher(s)"
          />
          <StatCard
            title="Total"
            value={result.data?.student || 0}
            color="primary"
            description="Student(s)"
          />
          <StatCard
            title="Total"
            value={result.data?.parent || 0}
            color="secondary"
            description="Parent(s)"
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 p-4 xl:flex-row">
        <div className="h-[450px] xl:w-1/3">
          <CountChart chartData={studentData.data!} />
        </div>

        <div className="h-auto xl:h-[450px] xl:w-2/3">
          <AttendanceChart chartData={attendanceData.data!} />
        </div>
      </section>
      <section className="h-auto w-full">
        <GradeChart />
      </section>
    </>
  );
};

export default AdminDashboard;
