import StatCard from "../cards/StatCard";
import AttendanceChart from "../charts/AttendanceChart";
import CountChart from "../charts/CountChart";
import GradeChart from "../charts/GradeChart";

const AdminDashboard = () => {
  return (
    <>
      <section className="flex flex-wrap justify-start gap-4 p-4 lg:justify-center">
        <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard
            title="Total"
            value={1}
            color="primary"
            description="Admin(s)"
          />
          <StatCard
            title="Total"
            value={50}
            color="secondary"
            description="Teacher(s)"
          />
          <StatCard
            title="Total"
            value={400}
            color="primary"
            description="Student(s)"
          />
          <StatCard
            title="Total"
            value={300}
            color="secondary"
            description="Parent(s)"
          />
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
