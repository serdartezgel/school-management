import StatCard from "@/components/cards/StatCard";

const Home = () => {
  return (
    <div className="mt-16 flex flex-col gap-4 p-4 lg:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        <section className="flex flex-wrap justify-center gap-4 p-4">
          <div className="flex w-sm gap-4">
            <StatCard type="admin" />
            <StatCard type="teacher" />
          </div>
          <div className="flex w-sm gap-4">
            <StatCard type="student" />
            <StatCard type="parent" />
          </div>
        </section>

        <section className="flex flex-col gap-4 lg:flex-row">
          <div className="h-[450px] w-full lg:w-1/3">CountChart</div>

          <div className="h-[450px] w-full lg:w-2/3">AttendanceChart</div>
        </section>
        <section className="h-[500px] w-full">GradeChart</section>
      </div>

      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <section>EventCalendar</section>
        <section>Announcement</section>
      </div>
    </div>
  );
};

export default Home;
