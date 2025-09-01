import AnnouncementsCard from "@/components/cards/AnnouncementsCard";
import EventsCard from "@/components/cards/EventsCard";
import StatCard from "@/components/cards/StatCard";
import AttendanceChart from "@/components/charts/AttendanceChart";
import CountChart from "@/components/charts/CountChart";
import GradeChart from "@/components/charts/GradeChart";

const Home = () => {
  return (
    <div className="mt-16 flex flex-col gap-4 p-4 lg:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
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
      </div>

      <div className="flex w-full flex-col gap-8 lg:w-1/3">
        <section>
          <EventsCard />
        </section>
        <section>
          <AnnouncementsCard />
        </section>
      </div>
    </div>
  );
};

export default Home;
