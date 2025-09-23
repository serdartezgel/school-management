import { parse } from "date-fns";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import StatCard from "@/components/cards/StatCard";
import DayPicker from "@/components/daypicker/DayPicker";
import SelectFilter from "@/components/filters/SelectFilter";
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

  const userId =
    role === "TEACHER"
      ? session.user.id
      : role === "STUDENT"
        ? session.user.id
        : role === "PARENT"
          ? session.user.id
          : undefined;

  const {
    page,
    pageSize,
    query,
    sort,
    sortBy = "class",
    date: dateStr,
    filterByClass = "all",
    filterBySubject = "all",
  } = await searchParams;

  let date = new Date();
  if (dateStr) {
    date = parse(dateStr, "EEE MMM dd yyyy", new Date());
  }

  const [classes, subjects] = await Promise.all([
    getClasses({ page: 1, pageSize: 100 }),
    getSubjects({ page: 1, pageSize: 100 }),
  ]);

  const [result, attendanceNumbers] = await Promise.all([
    getAttendances({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      date,
      query,
      sort: sort || "asc",
      sortBy,
      filterByClass,
      filterBySubject,
      userId,
      role,
    }),
    getAttendanceNumbers({
      date: date || new Date(),
      userId,
      role,
    }),
  ]);

  return (
    <div className="mt-16 flex flex-col gap-4 p-4">
      <section className="flex flex-col justify-between gap-4 pb-4 sm:flex-row">
        <h1 className="text-2xl font-bold">Attendances</h1>
        <Separator orientation="vertical" />
        <Suspense fallback={<div>Loading...</div>}>
          <DayPicker route="/attendance" />
        </Suspense>
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

      <section className="flex w-full items-center justify-start gap-4 pb-4">
        <Suspense fallback={<div>Loading...</div>}>
          {(role === "ADMIN" || role === "TEACHER") && (
            <SelectFilter
              placeholder="Select Class"
              filterBy="filterByClass"
              route="/attendance"
              data={classes.data?.classes || []}
            />
          )}
          <SelectFilter
            placeholder="Select Subject"
            filterBy="filterBySubject"
            route="/attendance"
            data={subjects.data?.subjects || []}
          />
        </Suspense>
      </section>

      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <AttendanceTable role={role} data={result.data!} />
        </Suspense>
      </section>
    </div>
  );
};

export default AttendancePage;
