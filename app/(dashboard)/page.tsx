import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AnnouncementsCard from "@/components/cards/AnnouncementsCard";
import EventsCard from "@/components/cards/EventsCard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import ParentDashboard from "@/components/dashboards/ParentDashboard";
import StudentDashboard from "@/components/dashboards/StudentDashboard";
import TeacherDashboard from "@/components/dashboards/TeacherDashboard";

const Home = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  const dashboards = {
    ADMIN: <AdminDashboard />,
    TEACHER: <TeacherDashboard />,
    STUDENT: <StudentDashboard />,
    PARENT: <ParentDashboard />,
  };

  return (
    <div className="mt-16 flex flex-col gap-4 p-4 lg:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-2/3">
        {dashboards[role]}
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
