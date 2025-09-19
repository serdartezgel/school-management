import StatCard from "../cards/StatCard";
import AttendanceChart from "../charts/AttendanceChart";
import CountChart from "../charts/CountChart";
import GradeChart from "../charts/GradeChart";

const AdminDashboard = () => {
  return (
    <>
      <section className="flex flex-wrap justify-start gap-4 p-4 lg:justify-center">
        <div className="flex w-sm gap-4">
          <StatCard type="admin" />
          <StatCard type="teacher" />
        </div>
        <div className="flex w-sm gap-4">
          <StatCard type="student" />
          <StatCard type="parent" />
        </div>
      </section>

      <section className="flex flex-col gap-4 p-4 xl:flex-row">
        <div className="h-[450px] xl:w-1/3">
          <CountChart />
        </div>

        <div className="h-auto xl:h-[450px] xl:w-2/3">
          <AttendanceChart />
        </div>
      </section>
      <section className="h-auto w-full">
        <GradeChart />
      </section>
    </>
  );
};

export default AdminDashboard;
