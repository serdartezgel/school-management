import { parse } from "date-fns";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import StatCard from "@/components/cards/StatCard";
import DayPickerWrapper from "@/components/daypicker/DayPickerWrapper";
import SelectFilter from "@/components/filters/SelectFilter";
import LocalSearch from "@/components/search/LocalSearch";
import AttendanceTable from "@/components/tables/AttendanceTable";
import { Separator } from "@/components/ui/separator";
import {
  getAttendanceNumbers,
  getAttendances,
} from "@/lib/actions/attendance.action";
import { getClasses } from "@/lib/actions/class.action";
import { getSubjects } from "@/lib/actions/subject.action";

const AttendancePage = async ({ searchParams }: RouteParams) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const role = session.user.role;

  const {
    page,
    pageSize,
    query,
    sort,
    date: dateStr,
    filterByClass = "all",
    filterBySubject = "all",
  } = await searchParams;

  let date = new Date();
  if (dateStr) {
    date = parse(dateStr, "dd.MM.yyyy", new Date());
  }
  console.log(date);

  const [classes, subjects] = await Promise.all([
    getClasses({ page: 1, pageSize: 100 }),
    getSubjects({ page: 1, pageSize: 100 }),
  ]);

  const [result, attendanceNumbers] = await Promise.all([
    getAttendances({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      query,
      sort: sort || "desc",
      sortBy: dateStr,
      filterByClass,
      filterBySubject,
    }),
    getAttendanceNumbers({
      date: date || new Date(),
    }),
  ]);

  return (
    <div className="mt-16 flex flex-col gap-4 p-4">
      <section className="flex flex-col justify-between gap-4 pb-4 sm:flex-row">
        <h1 className="text-2xl font-bold">Attendances</h1>
        <Separator orientation="vertical" />
        <DayPickerWrapper route="/attendance" />
      </section>

      <section className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Present"
          value={attendanceNumbers.data?.present || 0}
          description="Marked present"
          color="green"
        />
        <StatCard
          title="Late"
          value={attendanceNumbers.data?.late || 0}
          description="Arrived late"
          color="yellow"
        />
        <StatCard
          title="Absent"
          value={attendanceNumbers.data?.absent || 0}
          description="Unexcused absences"
          color="red"
        />
        <StatCard
          title="Excused"
          value={attendanceNumbers.data?.excused || 0}
          description="Excused absences"
          color="blue"
        />
      </section>

      <section className="flex w-full flex-col items-center justify-between gap-4 pb-4 lg:flex-row">
        <LocalSearch route={"/attendance"} />
        <div className="flex gap-2">
          <SelectFilter
            placeholder="Select Class"
            filterBy="filterByClass"
            route="/attendance"
            data={classes.data?.classes || []}
          />
          <SelectFilter
            placeholder="Select Subject"
            filterBy="filterBySubject"
            route="/attendance"
            data={subjects.data?.subjects || []}
          />
        </div>
      </section>

      <section>
        <AttendanceTable role={role} data={result.data!} />
      </section>
    </div>
  );
};

export default AttendancePage;
