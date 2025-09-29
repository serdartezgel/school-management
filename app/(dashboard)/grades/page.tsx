import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import SelectFilter from "@/components/filters/SelectFilter";
import LocalSearch from "@/components/search/LocalSearch";
import GradesTable from "@/components/tables/GradesTable";
import { getClasses } from "@/lib/actions/class.action";
import { getGrades } from "@/lib/actions/grade.action";
import { getSubjects } from "@/lib/actions/subject.action";
import { GradeType } from "@/prisma/client";

const GradesPage = async ({ searchParams }: RouteParams) => {
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
    sortBy = "date",
    filterByClass = "all",
    filterBySubject = "all",
    type = "exam",
  } = await searchParams;

  const [classes, subjects] = await Promise.all([
    getClasses({ page: 1, pageSize: 100 }),
    getSubjects({ page: 1, pageSize: 100 }),
  ]);

  const gradeTypes: GradeType[] =
    type === "exam" ? ["QUIZ", "MIDTERM", "FINAL"] : ["ASSIGNMENT", "PROJECT"];

  const result = await getGrades({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    sort: sort || "desc",
    sortBy,
    filterByClass,
    filterBySubject,
    userId,
    role,
    type: gradeTypes,
  });

  return (
    <div className="container mx-auto mt-16 flex flex-col gap-4 p-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <h1 className="text-2xl font-bold">Grades</h1>
          <h2 className="pl-4 text-xl font-semibold text-gray-500">2025/26</h2>
        </div>
      </div>

      <section className="mb-4 flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
        <LocalSearch route="/grades" />
        <div className="flex items-center gap-2">
          <Suspense fallback={<div>Loading...</div>}>
            <SelectFilter
              placeholder="Select Type"
              filterBy="type"
              route="/grades"
              data={[
                { id: "exam", name: "exam" },
                { id: "assignment", name: "assignment" },
              ]}
            />
            {(role === "ADMIN" || role === "TEACHER") && (
              <SelectFilter
                placeholder="Select Class"
                filterBy="filterByClass"
                route="/grades"
                data={classes.data?.classes || []}
              />
            )}
            <SelectFilter
              placeholder="Select Subject"
              filterBy="filterBySubject"
              route="/grades"
              data={subjects.data?.subjects || []}
            />
          </Suspense>
        </div>
      </section>
      <GradesTable role={session.user.role} data={result.data!} />
    </div>
  );
};

export default GradesPage;
